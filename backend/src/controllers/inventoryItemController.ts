import { NextFunction, Request, Response } from "express";
import InventoryItem from "../models/InventoryItem";
import MenuIngredient from "../models/MenuIngredient";
import Menu from "../models/Menu";
import { kgToGram, lToMl } from "../utils/conversion";

export const createInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const existingItem = await InventoryItem.findOne({
            status: "active",
            $or: [ { name: req.body.name }, { code: req.body.code }]
        });

        if (existingItem) {
            if (existingItem.name === req.body.name) {
                return res.status(409).json({ success: false, message: `${req.body.name} already exists` });
            }

            if (existingItem.code === req.body.code) {
                return res.status(409).json({ success: false, message: `${req.body.code} already exists` });
            }
        }
        const inventoryItem = await InventoryItem.create(req.body);

        res.status(201).json({ success: true, inventoryItem, message: "Item successfully created" });

    }catch(err) {
        next(err);
    }
}

export const getInventoryItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;

        const search = req.query.search ? String(req.query.search) : "";
        const sort = req.query.sort ? String(req.query.sort) : "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;
        const category =req.query.category || "";

        const filter: any = { status: 'active' };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" }},
                { code: { $regex: search, $options: "i" }}
            ];
        }

        if(category) {
            filter.category = category;
        }

        const [inventoryItems, total] = await Promise.all([
            InventoryItem.find(filter)
                .sort({ [sort]: order })
                .skip(skip)
                .limit(limit),

            InventoryItem.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            inventoryItems
        });

    } catch (err) {
        next(err);
    }
};

import mongoose from "mongoose";

export const updateInventoryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const id = req.params.id;

        // 1. Check duplicates (name or code)
        const existingItem = await InventoryItem.findOne({
            status: "active",
            _id: { $ne: id },
            $or: [
                { name: req.body.name },
                { code: req.body.code }
            ],
        }).session(session);

        if (existingItem) {
            if (existingItem.name === req.body.name) {
                throw {
                    status: 409,
                    message: `${req.body.name} already exists`,
                };
            }

            if (existingItem.code === req.body.code) {
                throw {
                    status: 409,
                    message: `${req.body.code} already exists`,
                };
            }
        }

        // 2. Get current inventory item (for old values)
        const oldValues = await InventoryItem.findById(id).session(session);

        if (!oldValues) {
            throw {
                status: 404,
                message: "Item not found",
            };
        }

        // 3. Update inventory item
        const inventoryItem = await InventoryItem.findByIdAndUpdate(
            id,
            req.body,
            { new: true, session }
        );

        if (!inventoryItem) {
            throw {
                status: 404,
                message: "Item not found",
            };
        }

        // 4. Find affected menus
        const affectedMenus = await Menu.aggregate([
            {
                $lookup: {
                    from: "menuingredients",
                    localField: "_id",
                    foreignField: "menu_id",
                    as: "ingredients",
                },
            },
            { $unwind: "$ingredients" },
            {
                $match: {
                    "ingredients.inventory_item_id": inventoryItem._id,
                    status: { $in: ["available", "unavailable"] },
                },
            },
            {
                $group: {
                    _id: "$_id",
                },
            },
        ]).session(session);

        const menuIds = affectedMenus.map((m) => m._id);

        // 5. Recalculate menu availability
        const menus = await Menu.find({
            _id: { $in: menuIds },
        })
            .populate("menuIngredients")
            .session(session);

        const bulkOps = [];

        for (const menu of menus) {
            const ingredients = await MenuIngredient.find({
                menu_id: menu._id,
            }).session(session);

            let isAvailable = true;

            for (const ing of ingredients) {
                const inv = await InventoryItem.findById(
                    ing.inventory_item_id
                ).session(session);

                if (!inv) {
                    isAvailable = false;
                    break;
                }

                if (ing.unit === inv.unit) {
                    if (ing.amount > inv.quantity) {
                        isAvailable = false;
                        break;
                    }
                }

                if (
                    ing.unit === "g" &&
                    inv.unit === "kg" &&
                    ing.amount > kgToGram(inv.quantity)
                ) {
                    isAvailable = false;
                    break;
                }

                if (
                    ing.unit === "ml" &&
                    inv.unit === "l" &&
                    ing.amount > lToMl(inv.quantity)
                ) {
                    isAvailable = false;
                    break;
                }
            }

            const status = (isAvailable ? "available" : "unavailable") as
                | "available"
                | "unavailable";

            bulkOps.push({
                updateOne: {
                    filter: { _id: menu._id },
                    update: {
                        $set: {
                            status,
                        },
                    },
                },
            });
        }

        // 6. Apply bulk update
        if (bulkOps.length > 0) {
            await Menu.bulkWrite(bulkOps, { session });
        }

        // 7. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: `${inventoryItem.name} successfully updated`,
            oldValues,
            newValues: inventoryItem,
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

export const deleteInventoryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const id = req.params.id;

        // 1. Find inventory item
        const inventoryItem = await InventoryItem.findById(id).session(session);

        if (!inventoryItem) {
            throw {
                status: 404,
                message: "Item not found",
            };
        }

        // 2. Soft delete inventory item
        inventoryItem.status = "deleted";
        await inventoryItem.save({ session });

        // 3. Delete related menu ingredients
        await MenuIngredient.deleteMany(
            { inventory_item_id: inventoryItem._id },
            { session }
        );

        // 4. Find menus that became empty
        const result = await Menu.aggregate([
            {
                $lookup: {
                    from: "menuingredients",
                    localField: "_id",
                    foreignField: "menu_id",
                    as: "ingredients",
                },
            },
            {
                $match: {
                    ingredients: { $eq: [] },
                },
            },
            {
                $project: { _id: 1 },
            },
        ]).session(session);

        const unavailableMenuIds = result.map((m) => m._id);

        // 5. Update menu status
        if (unavailableMenuIds.length > 0) {
            await Menu.updateMany(
                {
                    _id: { $in: unavailableMenuIds },
                    status: "available",
                },
                {
                    $set: { status: "unavailable" },
                },
                { session }
            );
        }

        // 6. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Item successfully removed",
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

export const getInventoryItemById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const inventoryItem = await InventoryItem.findById(req.params.id);

        if(!inventoryItem){
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            })
        }

        res.status(200).json({ success: true, inventoryItem})
    }catch(err){
        next(err);
    }
}