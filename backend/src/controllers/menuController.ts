import { NextFunction, Request, Response } from "express";
import Menu from "../models/Menu";
import MenuIngredient from "../models/MenuIngredient";
import InventoryItem from "../models/InventoryItem";
import { kgToGram, lToMl } from "../utils/conversion";
import { deleteFile, uploadFile } from "../utils/cloudinaryUtils";

export const createMenu = async (req: Request, res: Response, next: NextFunction) => {
    let uploadedImage = null;
    
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

        if(!req.file) return res.status(404).json({ success: false, message: 'Image is required' });

        const { public_id: image_public_id, secure_url: image_url } = await uploadFile(req.file.buffer);

        const menu = await Menu.create({ ...JSON.parse(req.body.menu), image_public_id, image_url });
        const menuIngredients = await MenuIngredient.insertMany(JSON.parse(req.body.menuIngredients).map((ingredient : any) => ({ ...ingredient, menu_id: menu._id })))

        const ingredientIds = menuIngredients.map(i => i.inventory_item_id);

        const items = await InventoryItem.find({ 
            _id: { $in: ingredientIds }
        })

        let status : 'available' | 'unavailable' | 'deleted' = 'available';
        for(const item of items) {
            const ingredient = menuIngredients.find(i => i.inventory_item_id === item._id);
            
            if(!ingredient) continue;

            if(item.quantity < 0) status = 'unavailable';

            if(item.unit === ingredient.unit){
                if(ingredient.amount > item.quantity) {
                    status = 'unavailable';
                }
            }

            if(ingredient.unit === 'g' && item.unit === 'kg' && ingredient.amount > kgToGram(item.quantity)){
                status = 'unavailable';
            }

            if(ingredient.unit === 'ml' && item.unit === 'l' && ingredient.amount > lToMl(item.quantity)){
                status = 'unavailable';
            }
        }

        menu.status = status;
        await menu.save();

        res.status(201).json({
            success: true,
            message: 'Menu successfully created',
            menu: {
                ...menu.toObject(),
                menuIngredients
            }
        });

    }catch(err){
        if(uploadedImage) await deleteFile(uploadedImage);
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
            filter.$or = [
                { name: { $regex: search, $options: "i" }},
                { code: { $regex: search, $options: "i" }}
            ]
        }

        if(category) {
            filter.category = category;
        }

        const [menus, total] = await Promise.all([
            Menu.find(filter)
            .populate({
                path: 'menuIngredients',
                populate: 'inventoryItem'
            })
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

export const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
    let uploadedImage = null;
    try{
        const id = req.params.id;

        const existingItem = await Menu.findOne({
            status: { $in: ['available', 'unavailable']},
            $or: [ { name: req.body.menu.name }, { code: req.body.menu.code }],
            _id: { $ne: id }
        });

        if (existingItem) {
            if (existingItem.name === req.body.menu.name) {
                return res.status(409).json({ success: false, message: `${req.body.menu.name} already exists` });
            }

            if (existingItem.code === req.body.menu.code) {
                return res.status(409).json({ success: false, message: `${req.body.menu.code} already exists` });
            }
        }

        const menu = await Menu.findById(id);

        if(!menu) return res.status(404).json({ success: false, message: "Menu not found" });

        let image_public_id = menu?.image_public_id;
        let image_url = menu?.image_url;

        if(req.file){
            await deleteFile(image_public_id);
            const { public_id, secure_url } = await uploadFile(req.file.buffer);
            image_public_id = public_id;
            image_url = secure_url;
        }

        menu.set({ ...req.body.menu, image_public_id, image_url });
        await menu.save();

        await MenuIngredient.deleteMany({ menu_id: menu._id });

        const menuIngredients = await MenuIngredient.insertMany(JSON.parse(req.body.menuIngredients).map((ingredient : any) => ({ ...ingredient, menu_id: menu._id })))

        const ingredientIds = menuIngredients.map(i => i.inventory_item_id);

        const items = await InventoryItem.find({ 
            _id: { $in: ingredientIds }
        })

        let status : 'available' | 'unavailable' | 'deleted' = 'available';
        for(const item of items) {
            const ingredient = menuIngredients.find(i => i.inventory_item_id === item._id);
            
            if(!ingredient) continue;

            if(item.quantity < 0) status = 'unavailable';

            if(item.unit === ingredient.unit){
                if(ingredient.amount > item.quantity) {
                    status = 'unavailable';
                }
            }

            if(ingredient.unit === 'g' && item.unit === 'kg' && ingredient.amount > kgToGram(item.quantity)){
                status = 'unavailable';
            }

            if(ingredient.unit === 'ml' && item.unit === 'l' && ingredient.amount > lToMl(item.quantity)){
                status = 'unavailable';
            }
        }

        menu.status = status;
        await menu.save();

        res.status(200).json({ success: true, message: 'Menu successfully updated' })

    }catch(err){
        if(uploadedImage) await deleteFile(uploadedImage);
        next(err);
    }
}

export const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const menu = await Menu.findById(req.params.id);

        if(!menu) return res.status(200).json({ success: false, message: 'Menu not found' })

        menu.status = 'deleted';
        await menu.save();

        await deleteFile(menu.image_public_id);

        res.status(200).json({ success: true, message: 'Menu successfully deleted' });
    }catch(err){
        next(err);
    }
}