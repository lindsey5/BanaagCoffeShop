import mongoose, { Schema, Document, Model } from "mongoose";

export interface SupplierAttributes extends Document {
    code: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    status: "active" | "deleted";
}

const SupplierSchema: Schema<SupplierAttributes> = new Schema(
    {
        code: {
            type: String,
            required: [true, "code is required."],
            unique: true,
            minlength: [3, "code must be at least 3 characters."],
            maxlength: [50, "code must be at most 50 characters."],
            trim: true,
        },

        name: {
            type: String,
            required: [true, "supplier name is required."],
            unique: true,
            minlength: [3, "supplier name must be at least 3 characters."],
            maxlength: [100, "supplier name must be at most 100 characters."],
            trim: true,
        },

        phone: {
            type: String,
            maxlength: [20, "phone number must be at most 20 characters."],
            trim: true,
        },

        email: {
            type: String,
            maxlength: [100, "email must be at most 100 characters."],
            trim: true,
            lowercase: true,
        },

        address: {
            type: String,
            maxlength: [200, "address must be at most 200 characters."],
            trim: true,
        },

        status: {
            type: String,
            default: "active",
            enum: ["active", "deleted"],
        },
    },
    { timestamps: true }
);

// indexes
SupplierSchema.index({ code: 1 });
SupplierSchema.index({ name: 1 });

const Supplier: Model<SupplierAttributes> = mongoose.model(
    "Supplier",
    SupplierSchema
);

export default Supplier;