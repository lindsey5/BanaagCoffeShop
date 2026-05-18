import mongoose, { Schema, Document, Model } from "mongoose";

export interface InventoryItemAttributes extends Document {
    code: string;
    name: string;
    category: string;
    brand: string;
    quantity: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs";
    threshold: number;
    status: 'active' | 'deleted'
}

const InventoryItemSchema: Schema<InventoryItemAttributes> = new Schema(
    {
        code: {
            type: String,
            required: true,
            minlength: [5, "code must be at least 5 characters."],
            maxlength: [50, "code must be at most 50 characters."],
        },
        category: {
            type: String,
            required: true,
            minlength: [5, "category must be at least 5 characters."],
            maxlength: [100, "category must be at most 100 characters."],
        },
        name: {
            type: String,
            required: [true, "name is required."],
            unique: true,
            minlength: [3, "name must be at least 3 characters."],
            maxlength: [100, "name must be at most 100 characters."],
            trim: true,
        },

        brand: {
            type: String,
            required: [true, "brand is required."],
            minlength: [2, "brand must be at least 2 characters."],
            maxlength: [100, "brand must be at most 100 characters."],
            trim: true,
        },
        quantity: {
            type: Number,
            required: [true, "quantity is required."],
            min: [0, "quantity cannot be negative"],
            default: 0,
        },

        unit: {
            type: String,
            required: [true, "unit is required."],
            enum: ["kg", "g", "l", "ml", "pcs"],
        },

        threshold: {
            type: Number,
            required: [true, "threshold (reorder level) is required."],
            min: [0, "threshold cannot be negative"],
        },
        status: {
            type: String,
            default: 'active',
            enum: ['active', 'deleted']
        }
    },
    { timestamps: true }
);

InventoryItemSchema.index({ quantity: 1 });

InventoryItemSchema.virtual("isLowStock").get(function () {
    return this.quantity <= this.threshold;
});

InventoryItemSchema.set("toJSON", { virtuals: true });
InventoryItemSchema.set("toObject", { virtuals: true });

const InventoryItem: Model<InventoryItemAttributes> = mongoose.model(
    "InventoryItem",
    InventoryItemSchema
);

export default InventoryItem;