import { NextFunction, Request, Response } from "express";
import { setEndDate, setStartDate } from "../utils/dateUtils";
import StockIn from "../models/StockIn";

export const getStockInHistory = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;
        const skip = (page - 1) * limit;

        const search = req.query.search ? String(req.query.search) : "";

        const category = req.query.category;

        const startDate = req.query.startDate
        ? setStartDate(String(req.query.startDate))
        : undefined;

        const endDate = req.query.endDate
        ? setEndDate(String(req.query.endDate))
        : undefined;

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
                { "inventoryItem.name": { $regex: search, $options: "i" } },
                { "inventoryItem.code": { $regex: search, $options: "i" } }
            ];
        }

        if(category){
            match['inventoryItem.category'] = category;
        }

        const result = await StockIn.aggregate([
            {
                $lookup: {
                    from: "suppliers",
                    localField: "supplier_id",
                    foreignField: "_id",
                    as: "supplier",
                },
            },
            { $unwind: "$supplier" },
            {
                $lookup: {
                    from: "inventoryitems",
                    localField: "inventory_item_id",
                    foreignField: "_id",
                    as: "inventoryItem",
                },
            },
            { $unwind: "$inventoryItem" },

            { $match: match },
            { $sort: { createdAt: -1 } },

            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ]);

        const stockIns = result[0]?.data || [];
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
            stockIns
        });

    }catch(err){
        next(err);
    }
}