import mongoose from "mongoose";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import InventoryItem from "../models/InventoryItem";
import Menu from "../models/Menu";
import { gramToKg, mlToL } from "../utils/conversion";

export const createOrder = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Create Order
        const order = await Order.create([{...req.body.order, user_id: req.user._id }], { session });

        // 2. Create Order Items
        const orderItems = await OrderItem.insertMany(
            req.body.orderItems.map((item: any) => ({
                ...item,
                order_id: order[0]._id,
            })),
            { session }
        );

        const newOrder = await order[0].populate("user");

        // 3. Deduct inventory
        for (const item of orderItems) {
            const menu = await Menu.findById(item.menu_id)
                .populate("menuIngredients")
                .session(session);

            if (!menu) continue;

            for (const ing of menu.menuIngredients) {
                const inv = await InventoryItem.findById(
                    ing.inventory_item_id
                ).session(session);

                if (!inv) continue;

                // same unit
                if (ing.unit === inv.unit) {
                    inv.quantity -= ing.amount;
                    await inv.save({ session });
                }

                // grams → kg
                if (ing.unit === "g" && inv.unit === "kg") {
                    inv.quantity -= gramToKg(ing.amount);
                    await inv.save({ session });
                }

                // ml → l
                if (ing.unit === "ml" && inv.unit === "l") {
                    inv.quantity -= mlToL(ing.amount);
                    await inv.save({ session });
                }
            }
        }

        // 4. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "Order successfully created.",
            order: {
                ...newOrder.toObject(),
                orderItems,
            },
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};