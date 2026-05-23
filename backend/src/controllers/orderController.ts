import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/auth";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import InventoryItem from "../models/InventoryItem";
import Menu from "../models/Menu";
import { gramToKg, mlToL } from "../utils/conversion";
import OrderService from "../services/OrderService";
import { setEndDate, setStartDate } from "../utils/dateUtils";
import StockOut from "../models/StockOut";

export const createOrder = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { order, orderItems } = req.body;

        // 1. Create Order
        const createdOrder = await Order.create(
            [{ ...order, user_id: req.user._id }],
            { session }
        );

        const orderId = createdOrder[0]._id;

        // 2. Create Order Items
        const items = await OrderItem.insertMany(
            orderItems.map((item: any) => ({
                ...item,
                order_id: orderId,
            })),
            { session }
        );

        // 3. Preload menus (FAST - removes N+1 query)
        const menus = await Menu.find({
            _id: { $in: orderItems.map((i: any) => i.menu_id) },
        })
            .populate("menuIngredients")
            .session(session);

        const menuMap = new Map(
            menus.map((m: any) => [m._id.toString(), m])
        );

        // 4. Prepare bulk operations
        const stockOutBulk: any[] = [];
        const inventoryUpdates: any[] = [];

        // 5. Process all items in parallel
        await Promise.all(
            orderItems.map(async (item: any) => {
                const menu = menuMap.get(item.menu_id.toString());
                if (!menu) return;

                await Promise.all(
                    menu.menuIngredients.map(async (ing: any) => {
                        const inv = await InventoryItem.findById(
                            ing.inventory_item_id
                        ).session(session);

                        if (!inv) return;

                        let deduction = ing.amount;

                        // unit conversion
                        if (ing.unit === "g" && inv.unit === "kg") {
                            deduction = gramToKg(ing.amount);
                        }

                        if (ing.unit === "ml" && inv.unit === "l") {
                            deduction = mlToL(ing.amount);
                        }

                        // OPTIMIZED: use atomic update instead of save()
                        inventoryUpdates.push({
                            updateOne: {
                                filter: { _id: inv._id },
                                update: { $inc: { quantity: -deduction } },
                            },
                        });

                        stockOutBulk.push({
                            stock_out_id: `SO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
                            inventory_item_id: inv._id,
                            quantity: ing.amount,
                            unit: ing.unit,
                            transaction_type: "sale",
                        });
                    })
                );
            })
        );

        // 6. Bulk update inventory (FASTEST WAY)
        if (inventoryUpdates.length > 0) {
            await InventoryItem.bulkWrite(inventoryUpdates, { session });
        }

        // 7. Bulk insert stock out logs
        if (stockOutBulk.length > 0) {
            await StockOut.insertMany(stockOutBulk, { session });
        }

        // 8. Populate user
        const newOrder = await createdOrder[0].populate("user");

        // 9. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "Order successfully created.",
            order: {
                ...newOrder.toObject(),
                orderItems: items,
            },
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;
        const skip = (page - 1) * limit;
        const search = req.query.search ? String(req.query.search) : "";
        const paymentMethod = req.query.paymentMethod ? String(req.query.paymentMethod) : "";
        const startDate = req.query.startDate ? setStartDate(req.query.startDate as string) : null;
        const endDate = req.query.endDate ? setEndDate(req.query.endDate as string) : null;

        const filter: any = {};

        if (search) {
            filter.$or = [
                { customer_name: { $regex: search, $options: "i" } },
                { order_id: { $regex: search, $options: "i" } },
                { order_no: search }
            ];
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
        }

        if (paymentMethod) filter.payment_method = paymentMethod;

        const total = await Order.countDocuments(filter);

        const orders = await Order.find(filter)
            .populate([
                { path: "orderItems" },
                { path: 'user' }
            ]) 
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                totalPages,
                total,
            },
            orders,
        });
    } catch (err) {
        next(err);
    }
};
export const getTotalOrders = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const total = await Order.countDocuments();

        res.status(200).json({
            success: true,
            total
        })
    }catch(err){
        next(err);
    }
}

export const getOrderMonthlySales = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const year = Number(req.query.year) || new Date().getFullYear();
        
        const monthlySales = await OrderService.getMonthlyOrderSalesByYear(year);

        res.status(200).json({
            success: true,
            monthlySales
        })

    }catch(err){
        next(err);
    }
}

export const getOrderSalesToday = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const sales = await OrderService.getOrderSales({
            period: "today"
        })

        res.status(200).json({ success: true, sales })

    }catch(err){
        next(err);
    }
}

export const getOrderSalesThisWeek = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const sales = await OrderService.getOrderSales({
            period: "thisWeek"
        })

        res.status(200).json({ success: true, sales })

    }catch(err){
        next(err);
    }
}

export const getOrderSalesThisMonth = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const sales = await OrderService.getOrderSales({
            period: "thisMonth"
        })

        res.status(200).json({ success: true, sales })

    }catch(err){
        next(err);
    }
}

export const getOrderSalesThisYear = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const sales = await OrderService.getOrderSales({
            period: "thisYear"
        })

        res.status(200).json({ success: true, sales })

    }catch(err){
        next(err);
    }
}