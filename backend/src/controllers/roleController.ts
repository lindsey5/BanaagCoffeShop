import { NextFunction, Request, Response } from "express";
import PERMISSIONS from "../utils/permissions";
import { AuthRequest } from "../types/auth";
import Role from "../models/Role";
import Permission from "../models/Permission";
import User from "../models/User";

export const createRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { permissions, ...rest } = req.body;

        if (!Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Role must have at least one permission.",
            });
        }

        const invalidPermissions = permissions.filter(
            (permission: string) => !Object.values(PERMISSIONS).includes(permission)
        );

        if (invalidPermissions.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Some permissions are invalid",
                invalid: invalidPermissions,
                allowed: Object.values(PERMISSIONS),
            });
        }

        const existingRole = await Role.findOne({ name: rest.name });
        if (existingRole) {
            return res.status(409).json({ success: false, message: "Role already exists" });
        }

        const newRole = await Role.create(rest);

        const newPermissions = await Permission.insertMany(
            permissions.map((action) => ({
                action,
                role_id: newRole._id,
            }))
        );
        
        res.status(201).json({
            success: true,
            message: "Role successfully created",
            role: newRole,
            permissions: newPermissions,
        });
    } catch (err) {
        next(err);
    }
};

export const updateRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { permissions, ...rest } = req.body;

        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: "Role not found" });

        if (!Array.isArray(permissions) || permissions.length === 0) {
         return res.status(400).json({ success: false, message: "Role must have at least one permission." });
        }

        const invalidPermissions = permissions.filter((permission: string) => !Object.values(PERMISSIONS).includes(permission));
        
        if (invalidPermissions.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Some permissions are invalid",
                invalid: invalidPermissions,
                allowed: Object.values(PERMISSIONS),
            });
        }

        // Update role
        Object.assign(role, rest);
        await role.save();

        // Replace permissions
       await Permission.deleteMany({ role_id: role._id }); 
        
        const updatedPermissions = await Permission.insertMany(
            permissions.map((action) => ({ action, role_id: role._id }))
        );

        const newValues = {
            ...role.toObject(),
            permissions: updatedPermissions
        };

        res.status(200).json({
            success: true,
            message: "Role successfully updated",
            role: newValues,
        });
    } catch (err) {
        next(err);
    }
};

export const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await Role.findById(req.params.id).populate("permissions");
        if (!role) return res.status(404).json({ success: false, message: "Role not found" });

        const { permissions, ...roleData } = role.toObject();
            res.status(200).json({
            success: true,
            role: roleData,
            permissions: permissions?.map((p: any) => p.action) || [],
        });
    } catch (err) {
        next(err);
    }
    };

export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await Role.find()
        .populate("permissions")
        .populate({
            path: "users",
            match: { status: "active" },
            select: "_id"
        });
        const rolesWithUserCount = roles.map((role: any) => ({
            ...role.toObject(),
            usersCount: role.users?.length || 0,
        }));

        res.status(200).json({ success: true, roles: rolesWithUserCount });
    } catch (err) {
        next(err);
    }
};

export const deleteRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const role = await Role.findById(req.params.id).populate("permissions");
        if (!role) return res.status(404).json({ success: false, message: "Role not found." });

        if(role._id.toString() === req.user.role_id.toString()){
            return res.status(403).json({ 
                success: false, 
                message: "Deletion not allowed. You cannot delete the role assigned to your account."
            })
        }

        await role.deleteOne();

        res.status(200).json({ success: true, message: "Role successfully deleted." });
    } catch (err) {
        next(err);
    }
};

export const getOwnRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });


        const role = await Role.findById(user.role_id).populate("permissions");
        if (!role) return res.status(404).json({ success: false, message: "No role found." });

        const { permissions, ...roleData } = role.toObject();

        const responseData = {
            role: roleData,
            permissions: permissions?.map((p: any) => p.action) || [],
        };

        res.status(200).json({
            success: true,
            ...responseData
        });
    } catch (err) {
        next(err);
    }
};