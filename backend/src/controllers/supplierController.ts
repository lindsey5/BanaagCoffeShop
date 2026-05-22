import { NextFunction, Request, Response } from "express";
import Supplier from "../models/Supplier";

export const createSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const existingItem = await Supplier.findOne({
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

        const supplier = await Supplier.create(req.body);

        res.status(201).json({
            success: true,
            message: "Supplier successfully created",
            supplier
        })

    }catch(err){
        next(err);
    }
}

export const getSuppliers = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const search = req.query.search;

        const filter : any = { status: 'active' };

        if(search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" }},
                { code: { $regex: search, $options: "i" }},
                { email: { $regex: search, $options: "i" }},
            ]
        }

        const suppliers = await Supplier.find(filter).skip(skip).limit(limit);
        const total = await Supplier.countDocuments(filter);

        res.status(200).json({
            success: true,
            suppliers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })

    }catch(err){
        next(err);
    }
}

export const updateSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.params.id;

        const existingItem = await Supplier.findOne({
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

        const supplier = await Supplier.findById(id);

        if(!supplier) return res.status(404).json({ success: false, message: "Supplier not exist" });

        supplier.set(req.body);
        await supplier.save();

        res.status(200).json({
            success: true,
            message: "Supplier successfully updated",
            supplier
        })

    }catch(err){
        next(err);
    }
}

export const deleteSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const supplier = await Supplier.findById(req.params.id);

        if(!supplier) return res.status(404).json({ success: false, message: "Supplier not exist"});

        supplier.status = 'deleted';
        await supplier.save();

        res.status(200).json({
            success: true,
            message: "Supplier successfully deleted"
        })

    }catch(err){
        next(err);
    }
}