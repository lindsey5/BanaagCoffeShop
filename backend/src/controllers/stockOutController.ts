import { NextFunction, Request, Response } from "express";
import { setEndDate, setStartDate } from "../utils/dateUtils";
import StockOut from "../models/StockOut";
import InventoryItem from "../models/InventoryItem";

export const createStockOut = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const inventoryItem = await InventoryItem.findById(req.body.inventory_item_id);

        if(!inventoryItem) return res.status(404).json({ success: false, message: 'Inventory item id not exist'});

        const stockOut = await StockOut.create(req.body);

        inventoryItem.quantity -= stockOut.quantity;
        await inventoryItem.save();

        res.status(201).json({
            success: true,
            message: "Stock out successfully recorded",
            stockOut
        })

    }catch(err){
        next(err);
    }
}

export const getStockOutHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search as string;
        const transactionType = req.query.transactionType as string;
        const category = req.query.category as string;

        const startDate = req.query.startDate
            ? setStartDate(req.query.startDate as string)
            : null;

        const endDate = req.query.endDate
            ? setEndDate(req.query.endDate as string)
            : null;

        // AGGREGATION PIPELINE
        const pipeline: any[] = [
            // Join inventory items
            {
                $lookup: {
                    from: "inventoryitems",
                    localField: "inventory_item_id",
                    foreignField: "_id",
                    as: "inventoryItem",
                },
            },
            {
                $unwind: "$inventoryItem",
            },
        ];

        // FILTER STAGE
        const match: any = {};

        if (transactionType) {
            match.transaction_type = transactionType;
        }

        if (category) {
            match["inventoryItem.category"] = category;
        }

        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = startDate;
            if (endDate) match.createdAt.$lte = endDate;
        }

        if (search) {
            match.$or = [
                { stock_out_id: { $regex: search, $options: "i" } },
                { "inventoryItem.name": { $regex: search, $options: "i" } },
                { "inventoryItem.code": { $regex: search, $options: "i" } },
            ];
        }

        pipeline.push({ $match: match });

        // SORT + PAGINATION
        pipeline.push({ $sort: { createdAt: -1 } });

        const totalResult = await StockOut.aggregate([
            ...pipeline,
            { $count: "total" },
        ]);

        const total = totalResult[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        const stockOuts = await StockOut.aggregate(pipeline);

        res.status(200).json({
            success: true,
            stockOuts,
            pagination: {
                page,
                limit,
                totalPages,
                total,
            },
        });
    } catch (err) {
        next(err);
    }
};