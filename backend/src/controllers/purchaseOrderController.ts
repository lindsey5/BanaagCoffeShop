import { Request, Response, NextFunction } from "express";
import { setEndDate, setStartDate } from "../utils/dateUtils";
import PurchaseOrder from "../models/PurchaseOrder";
import mongoose from "mongoose";
import InventoryItem from "../models/InventoryItem";
import { gramToKg, kgToGram, lToMl, mlToL } from "../utils/conversion";
import StockIn from "../models/StockIn";

export const createPurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
    try{
        if (req.body.items.length < 1) {
            return res.status(400).json({
                success: false,
                message: "Purchase order must contain at least one item.",
            });
        }

        const purchaseOrder = await PurchaseOrder.create(req.body);

        res.status(201).json({
            success: true,
            message: "Purchase order successfully created",
            purchaseOrder
        })

    }catch(err){
        next(err);
    }
}

export const getPurchaseOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;
        const skip = (page - 1) * limit;

        const search = req.query.search ? String(req.query.search) : "";
        const status = req.query.status ? String(req.query.status) : undefined;

        const startDate = req.query.startDate
        ? setStartDate(String(req.query.startDate))
        : undefined;

        const endDate = req.query.endDate
        ? setEndDate(String(req.query.endDate))
        : undefined;

        // Build match object
        const match: any = {};

        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = startDate;
            if (endDate) match.createdAt.$lte = endDate;
        }

        if (search) {
            match.$or = [
                { poNumber: { $regex: search, $options: "i" } },
                { "supplier.name": { $regex: search, $options: "i" } },
                { "supplier.code": { $regex: search, $options: "i" } },
                { "supplier.email": { $regex: search, $options: "i" } },
            ];
        }

        if (status) {
            match.status = status;
        }

        const result = await PurchaseOrder.aggregate([
            {
                $lookup: {
                    from: "suppliers",
                    localField: "supplier_id",
                    foreignField: "_id",
                    as: "supplier",
                },
            },
            { $unwind: "$supplier" },

            // populate inventory items inside items array
            {
                $lookup: {
                    from: "inventoryitems",
                    localField: "items.inventory_item_id",
                    foreignField: "_id",
                    as: "inventoryItems",
                },
            },

            {
                $addFields: {
                    items: {
                        $map: {
                            input: "$items",
                            as: "item",
                            in: {
                                $mergeObjects: [
                                    "$$item",
                                    {
                                        inventoryItem: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$inventoryItems",
                                                        as: "inv",
                                                        cond: {
                                                            $eq: [
                                                                "$$inv._id",
                                                                "$$item.inventory_item_id",
                                                            ],
                                                        },
                                                    },
                                                },
                                                0,
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },

            { $project: { inventoryItems: 0 } }, // remove temp array

            { $match: match },
            { $sort: { createdAt: -1 } },

            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ]);
        const purchaseOrders = result[0]?.data || [];
        const total = result[0]?.totalCount?.[0]?.count || 0;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                totalPages,
                total,
            },
            purchaseOrders,
        });
    } catch (err) {
        next(err);
    }
};

export const updatePurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    
    try{
        session.startTransaction();

        const purchaseOrder = await PurchaseOrder.findById(req.params.id);

        if(!purchaseOrder) {
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success: false,
                message: "Purchase order not found",
            });
        }

        const allowedTransitions: Record<string, string[]> = {
            pending: ["received", "cancelled"],
            received: [],
            cancelled: [],
        };

        const currentStatus = purchaseOrder.status;
        const newStatus = req.body.status;

        const allowedNextStatuses = allowedTransitions[currentStatus] || [];

        if (!allowedNextStatuses.includes(newStatus)) {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success: false,
                message: `Cannot update status from ${currentStatus} to ${newStatus}. Please reload the page`,
            });
        }

        purchaseOrder.status = newStatus;

        if (purchaseOrder.status === "received") {
            for(const item of purchaseOrder.items){
                const inv = await InventoryItem.findById(item.inventory_item_id);

                if(!inv) continue;

                if(inv.unit === item.unit){
                    inv.quantity += item.quantity;
                }

                if(inv.unit === 'kg' && item.unit === 'g'){
                    inv.quantity += gramToKg(item.quantity);
                }

                if(inv.unit === 'l' && item.unit === 'ml') {
                    inv.quantity += mlToL(item.quantity);
                }

                inv.save({ session });
                await StockIn.create({
                    inventory_item_id: item.inventory_item_id,
                    quantity: item.quantity,
                    unit_cost: item.unit_cost,
                    unit: item.unit,
                    total_cost: item.total_cost,
                    supplier_id: purchaseOrder.supplier_id
                })
            }
            purchaseOrder.dateReceived = new Date();
        }

        await purchaseOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: `${purchaseOrder.poNumber} successfully ${newStatus}`,
            purchaseOrder
        })

    } catch(err) {
        next(err);
    }
}