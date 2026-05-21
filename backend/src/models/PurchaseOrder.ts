import mongoose, { Schema, Document, Model } from "mongoose";

export interface PurchaseOrderItem {
    inventory_item_id: mongoose.Types.ObjectId;
    quantity: number;
    unit_cost: number;
    total_cost: number;
}

export interface PurchaseOrderAttributes extends Document {
    poNumber: string;
    supplier_id: mongoose.Types.ObjectId;
    items: PurchaseOrderItem[];
    status: "pending" | "approved" | "received" | "cancelled";
    grandTotal: number;
    notes?: string;
}

const PurchaseOrderSchema: Schema<PurchaseOrderAttributes> = new Schema(
    {
        poNumber: {
            type: String,
            required: [true, "PO number is required."],
            minlength: [5, "PO number must be at least 5 characters."],
            maxlength: [50, "PO number must be at most 50 characters."],
            unique: true,
            trim: true,
        },

        supplier_id: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },

        items: [
            {
                inventory_item_id: {
                    type: Schema.Types.ObjectId,
                    ref: "InventoryItem",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1."],
                },
                unit_cost: {
                    type: Number,
                    required: true,
                    min: [0, "Cost cannot be negative."],
                },
                cost_total: {
                    type: Number,
                    required: true,
                    min: [0, "Total cannot be negative."],
                },
            },
        ],

        status: {
            type: String,
            default: "pending",
            enum: ["pending", "received", "cancelled"],
        },

        grandTotal: {
            type: Number,
            required: true,
            min: [0, "Grand total cannot be negative."],
            default: 0,
        },

        notes: {
            type: String,
            maxlength: [300, "Notes must be at most 300 characters."],
            trim: true,
        },
    },
    { timestamps: true }
);

// indexes
PurchaseOrderSchema.index({ poNumber: 1 });
PurchaseOrderSchema.index({ status: 1 });
PurchaseOrderSchema.index({ supplierName: 1 });

const PurchaseOrder: Model<PurchaseOrderAttributes> = mongoose.model(
    "PurchaseOrder",
    PurchaseOrderSchema
);

export default PurchaseOrder;