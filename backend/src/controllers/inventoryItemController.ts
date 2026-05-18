import { NextFunction, Request, Response } from "express";
import InventoryItem from "../models/InventoryItem";

export const createInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const isExisting = await InventoryItem.findOne({ name: req.body.name });

        if(isExisting) return res.status(409).json({ success: false, message: `${req.body.name} already exists`});

        const inventoryItem = await InventoryItem.create(req.body);

        res.status(201).json({ success: true, inventoryItem, message: "Item successfully created" });

    }catch(err) {
        next(err);
    }
}

export const getInventoryItems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;

        const search = req.query.search ? String(req.query.search) : "";
        const sort = req.query.sort ? String(req.query.sort) : "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;
        const category =req.query.category || "";

        const filter: any = {};

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

        const isExisting = await InventoryItem.findOne({ name: req.body.name, _id: { $ne: id }});

        if(isExisting) return res.status(409).json({ success: false, message: `${req.body.name} already exists`});

        const inventoryItem = await InventoryItem.findById(id);

        if(!inventoryItem) return res.status(404).json({ success: false, message: 'Item not found' });

        const oldValues = inventoryItem;

        const newValues = inventoryItem.set(req.body);

        await newValues.save();

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

        res.status(200).json({ success: true, message: 'Item successfully removed' });
    }catch(err) {
        next(err);
    }
}