import { NextFunction, Request, Response } from "express";
import Menu from "../models/Menu";
import MenuIngredient from "../models/MenuIngredient";

export const createMenu = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const existingItem = await Menu.findOne({
            status: "available",
            $or: [ { name: req.body.menu.name }, { code: req.body.menu.code }]
        });

        if (existingItem) {
            if (existingItem.name === req.body.menu.name) {
                return res.status(409).json({ success: false, message: `${req.body.menu.name} already exists`,});
            }

            if (existingItem.code === req.body.menu.code) {
                return res.status(409).json({ success: false, message: `${req.body.menu.code} already exists`,});
            }
        }

        const menu = await Menu.create(req.body.menu);
        const menuIngredients = await MenuIngredient.insertMany(req.body.menuIngredients.map((ingredient : any) => ({ ...ingredient, menu_id: menu._id })))

        res.status(201).json({
            success: true,
            message: 'Menu successfully created',
            menu: {
                ...menu.toObject(),
                menuIngredients
            }
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
        const search = req.query.search;

        const filter : any = { status: { $in: ['unavailable', 'available']} }

        if(search) {
            filter.or = [
                { name: { $regex: search, $options: "i" }},
                { code: { $regex: search, $options: "i" }}
            ]
        }

        if(category) {
            filter.category = category;
        }

        const [menus, total] = await Promise.all([
            Menu.find(filter)
            .populate('menuIngredients')
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