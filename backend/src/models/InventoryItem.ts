import mongoose, { Schema, Document, Model } from "mongoose";

export interface InventoryItemAttributes extends Document {
    name: string;
    quantity: number;
    unit: "g" | "ml" | "pcs";
    threshold: number;
    status: 'active' | 'deleted'
}

const InventoryItemSchema: Schema<InventoryItemAttributes> = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required."],
            unique: true,
            minlength: [3, "name must be at least 3 characters."],
            maxlength: [100, "name must be at most 100 characters."],
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
            enum: ["g", "ml", "pcs"],
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