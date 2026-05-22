import { NextFunction, Request, Response } from "express";
import Menu from "../models/Menu";
import MenuIngredient from "../models/MenuIngredient";
import InventoryItem from "../models/InventoryItem";
import { kgToGram, lToMl } from "../utils/conversion";
import { deleteFile, uploadFile } from "../utils/cloudinaryUtils";
import mongoose from "mongoose";
import OrderItem from "../models/OrderItem";

export const createMenu = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();
    let uploadedImage = null;

    try {
        session.startTransaction();

        // 1. Check duplicates
        const existingItem = await Menu.findOne({
            status: "available",
            $or: [
                { name: req.body.menu.name },
                { code: req.body.menu.code },
            ],
        }).session(session);

        if (existingItem) {
            if (existingItem.name === req.body.menu.name) {
                throw {
                    status: 409,
                    message: `${req.body.menu.name} already exists`,
                };
            }

            if (existingItem.code === req.body.menu.code) {
                throw {
                    status: 409,
                    message: `${req.body.menu.code} already exists`,
                };
            }
        }

        // 2. Validate image
        if (!req.file) {
            throw {
                status: 400,
                message: "Image is required",
            };
        }

        // 3. Upload image (external side effect)
        const {
            public_id: image_public_id,
            secure_url: image_url,
        } = await uploadFile(req.file.buffer);

        uploadedImage = image_public_id;

        // 4. Create menu
        const menu = await Menu.create(
            [
                {
                    ...JSON.parse(req.body.menu),
                    image_public_id,
                    image_url,
                },
            ],
            { session }
        );

        // 5. Insert ingredients
        const parsedIngredients = JSON.parse(
            req.body.menuIngredients
        );

        const menuIngredients = await MenuIngredient.insertMany(
            parsedIngredients.map((ingredient: any) => ({
                ...ingredient,
                menu_id: menu[0]._id,
            })),
            { session }
        );

        // 6. Fetch inventory items
        const ingredientIds = menuIngredients.map(
            (i) => i.inventory_item_id
        );

        const items = await InventoryItem.find({
            status: 'active',
            _id: { $in: ingredientIds },
        }).session(session);

        // 7. Compute availability
        let status: "available" | "unavailable" | "deleted" =
            "available";

        for (const item of items) {
            const ingredient = menuIngredients.find(
                (i) =>
                    String(i.inventory_item_id) === String(item._id)
            );

            if (!ingredient) {
                status = "unavailable";
                continue;
            };

            if (item.quantity < 0) status = "unavailable";

            if (item.unit === ingredient.unit) {
                if (ingredient.amount > item.quantity) {
                    status = "unavailable";
                }
            }

            if (
                ingredient.unit === "g" &&
                item.unit === "kg" &&
                ingredient.amount > kgToGram(item.quantity)
            ) {
                status = "unavailable";
            }

            if (
                ingredient.unit === "ml" &&
                item.unit === "l" &&
                ingredient.amount > lToMl(item.quantity)
            ) {
                status = "unavailable";
            }
        }

        // 8. Update menu status
        menu[0].status = status;
        await menu[0].save({ session });

        // 9. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "Menu successfully created",
            menu: {
                ...menu[0].toObject(),
                menuIngredients,
            },
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        // rollback uploaded image
        if (uploadedImage) {
            try {
                await deleteFile(uploadedImage);
            } catch (e) {
                console.error("Image rollback failed:", e);
            }
        }

        next(err);
    }
};
export const getMenus = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const sort = req.query.sort ? String(req.query.sort) : 'name';
        const order = req.query.order === 'asc' ? 1 : -1;
        const search = req.query.search;
        const status = req.query.status;

        const filter : any = { status: { $in: ['unavailable', 'available']} }

        if(search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" }},
                { code: { $regex: search, $options: "i" }}
            ]
        }

        if(status) {
            filter.status = status;
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

export const updateMenu = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();
    let uploadedImage = null;

    try {
        session.startTransaction();

        const id = req.params.id;

        // Check duplicates
        const existingItem = await Menu.findOne({
            status: { $in: ["available", "unavailable"] },
            $or: [
                { name: req.body.menu.name },
                { code: req.body.menu.code },
            ],
            _id: { $ne: id },
        }).session(session);

        if (existingItem) {
            if (existingItem.name === req.body.menu.name) {
                throw {
                    status: 409,
                    message: `${req.body.menu.name} already exists`,
                };
            }

            if (existingItem.code === req.body.menu.code) {
                throw {
                    status: 409,
                    message: `${req.body.menu.code} already exists`,
                };
            }
        }

        // Find menu
        const menu = await Menu.findById(id);

        if (!menu) {
            throw {
                status: 404,
                message: "Menu not found",
            };
        }

        // Handle image update
        let image_public_id = menu.image_public_id;
        let image_url = menu.image_url;

        if (req.file) {
            await deleteFile(image_public_id); // external (not rollback-safe)

            const { public_id, secure_url } = await uploadFile(req.file.buffer);

            uploadedImage = public_id;

            image_public_id = public_id;
            image_url = secure_url;
        }

        // Replace ingredients
        await MenuIngredient.deleteMany(
            { menu_id: menu._id },
            { session }
        );

        const parsedIngredients = JSON.parse(req.body.menuIngredients);

        const menuIngredients = await MenuIngredient.insertMany(
            parsedIngredients.map((ingredient: any) => ({
                ...ingredient,
                menu_id: menu._id,
            })),
            { session }
        );

        // Get inventory items
        const ingredientIds = menuIngredients.map(
            (i) => i.inventory_item_id
        );

        const items = await InventoryItem.find({
            status: 'active',
            _id: { $in: ingredientIds },
        }).session(session);

        // Compute status
        let status: "available" | "unavailable" | "deleted" = "available";

        for (const item of items) {
            const ingredient = menuIngredients.find(
                (i) =>
                    String(i.inventory_item_id) === String(item._id)
            );

            if (!ingredient) {
                status = "unavailable";
                continue;
            };

            if (item.quantity < 0) status = "unavailable";

            if (item.unit === ingredient.unit) {
                if (ingredient.amount > item.quantity) {
                    status = "unavailable";
                }
            }

            if (
                ingredient.unit === "g" &&
                item.unit === "kg" &&
                ingredient.amount > kgToGram(item.quantity)
            ) {
                status = "unavailable";
            }

            if (
                ingredient.unit === "ml" &&
                item.unit === "l" &&
                ingredient.amount > lToMl(item.quantity)
            ) {
                status = "unavailable";
            }
        }

        // Update menu 
        menu.set({
            ...JSON.parse(req.body.menu),
            image_public_id,
            image_url,
            status
        });

        await menu.save({ session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Menu successfully updated",
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        // rollback uploaded image (external side-effect)
        if (uploadedImage) {
            try {
                await deleteFile(uploadedImage);
            } catch (e) {
                console.error("Image rollback failed:", e);
            }
        }

        next(err);
    }
};

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

export const getTopProducts = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const topProducts = await OrderItem.aggregate([
            {
                $group: {
                    _id: "$menu_id",

                    totalSold: {
                        $sum: "$quantity"
                    }
                }
            },

            {
                $sort: {
                    totalSold: -1
                }
            },

            {
                $limit: 10
            },

            {
                $lookup: {
                    from: "menus",
                    localField: "_id",
                    foreignField: "_id",
                    as: "menu"
                }
            },
            {
                $unwind: "$menu"
            }
        ]);

        res.status(200).json({ success: true, topProducts })
    }catch(err){
        next(err);
    }
}