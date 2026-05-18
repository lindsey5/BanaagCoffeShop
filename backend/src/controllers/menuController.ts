import { NextFunction, Request, Response } from "express";
import Menu from "../models/Menu";

export const createMenu = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const existingItem = await Menu.findOne({
            status: "available",
            $or: [ { name: req.body.name }, { code: req.body.code }]
        });

        if (existingItem) {
            if (existingItem.name === req.body.name) {
                return res.status(409).json({ success: false, message: `${req.body.name} already exists`,});
            }

            if (existingItem.code === req.body.code) {
                return res.status(409).json({ success: false, message: `${req.body.code} already exists`,});
            }
        }

        const menu = await Menu.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Menu successfully created',
            menu
        });

    }catch(err){
        next(err);
    }
}

export const getMenus = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const sort = req.query.sort ? String(req.query.sort) : 'name';
        const order = req.query.order === 'asc' ? 1 : -1;

        const filter : any = { status: 'available' }

        if(category) {
            filter.category = category;
        }

        const [menus, total] = await Promise.all([
            Menu.find(filter)
            .sort({ [sort] : order })
            .skip(skip)
            .limit(limit),
            Menu.countDocuments(filter)
        ])

        res.status(200).json({
            success: true,
            menus,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        })
    }catch(err){
        next(err);
    }
}