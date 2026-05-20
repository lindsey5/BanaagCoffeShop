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

export const updateInventoryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.id;

        // 1. Check duplicates (name or code)
        const existingItem = await InventoryItem.findOne({
            status: "active",
            _id: { $ne: id },
            $or: [{ name: req.body.name }, { code: req.body.code }],
        });

        if (existingItem) {
            if (existingItem.name === req.body.name) {
                return res.status(409).json({
                    success: false,
                    message: `${req.body.name} already exists`,
                });
            }

            if (existingItem.code === req.body.code) {
                return res.status(409).json({
                    success: false,
                    message: `${req.body.code} already exists`,
                });
            }
        }

        // 2. Update inventory item
        const inventoryItem = await InventoryItem.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!inventoryItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        const oldValues = inventoryItem;

        // 3. Find affected menus
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
                    status: { $in: ['available', 'unavailable']}
                },
            },
            {
                $group: {
                    _id: "$_id",
                },
            },
        ]);

        const menuIds = affectedMenus.map((m) => m._id);

        // 4. Recalculate menu availability properly
        const menus = await Menu.find({
            _id: { $in: menuIds },
        }).populate("menuIngredients");

        const bulkOps = [];

        for (const menu of menus) {
            const ingredients = await MenuIngredient.find({
                menu_id: menu._id,
            });

            let isAvailable = true;

            for (const ing of ingredients) {
                const inv = await InventoryItem.findById(ing.inventory_item_id);

                if (!inv) {
                    isAvailable = false;
                    break;
                }

                if(ing.unit === inv.unit){
                    if(ing.amount > inv.quantity) {
                        isAvailable = false;
                        break;
                    }
                }

                if(ing.unit === 'g' && inv.unit === 'kg' && ing.amount > kgToGram(inv.quantity)){
                    isAvailable = false;
                    break;
                }

                if(ing.unit === 'ml' && inv.unit === 'l' && ing.amount > lToMl(inv.quantity)) {
                    isAvailable = false;
                    break;
                }
            }

            bulkOps.push({
                updateOne: {
                    filter: { _id: menu._id },
                    update: {
                        $set: {
                            status: isAvailable
                                ? ("available" as "available" | "unavailable")
                                : ("unavailable" as "available" | "unavailable"),
                        },
                    },
                },
            });
        }

        // 5. Apply bulk update
        if (bulkOps.length > 0) {
            await Menu.bulkWrite(bulkOps);
        }

        // 6. Response
        return res.status(200).json({
            success: true,
            message: `${inventoryItem.name} successfully updated`,
            oldValues,
            newValues: inventoryItem,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.params.id;

        const inventoryItem = await InventoryItem.findById(id);

        if(!inventoryItem) return res.status(404).json({ success: false, message: 'Item not found' });

        inventoryItem.status = 'deleted';
        await inventoryItem.save();

        await MenuIngredient.deleteMany({ inventory_item_id: inventoryItem._id });

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
        ]);

        const unavailableMenuIds = result.map(m => m._id);
        
        await Menu.updateMany(
            { _id: { $in: unavailableMenuIds }, status: 'available' },
            { $set: { status: "unavailable" } }
        );

        res.status(200).json({ success: true, message: 'Item successfully removed' });
    }catch(err) {
        next(err);
    }
}

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