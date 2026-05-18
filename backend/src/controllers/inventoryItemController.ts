import { NextFunction, Request, Response } from "express";
import InventoryItem from "../models/InventoryItem";
import MenuIngredient from "../models/MenuIngredient";
import Menu from "../models/Menu";

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
            filter.or = [
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

export const updateInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.params.id;

        const existingItem = await InventoryItem.findOne({
            status: "active",
            $or: [ { name: req.body.name }, { code: req.body.code }],
            _id: { $ne: id }
        });
        if (existingItem) {
            if (existingItem.name === req.body.name) {
                return res.status(409).json({ success: false, message: `${req.body.name} already exists` });
            }

            if (existingItem.code === req.body.code) {
                return res.status(409).json({ success: false, message: `${req.body.code} already exists` });
            }
        }
        const inventoryItem = await InventoryItem.findById(id);

        if(!inventoryItem) return res.status(404).json({ success: false, message: 'Item not found' });

        const oldValues = inventoryItem;

        const newValues = inventoryItem.set(req.body);

        await newValues.save();

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
                    ingredients: {
                        $elemMatch: {
                            inventory_item_id: inventoryItem._id,
                        },
                    },
                },
            },
            {
                $project: { _id: 1 },
            },
        ]);

        const menuIds = result.map(m => m._id);

        if (newValues.quantity > 0) {
            await Menu.updateMany(
                { _id: { $in: menuIds } },
                { $set: { status: "unavailable" } }
            );
        } else {
            await Menu.updateMany(
                { _id: { $in: menuIds } },
                { $set: { status: "available" } }
            );
        }

        res.status(200).json({
            success: true,
            message: `${inventoryItem.name} successfully updated`,
            oldValues,
            newValues
        })
    }catch(err) {
        next(err);
    }
}

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
            { _id: { $in: unavailableMenuIds } },
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