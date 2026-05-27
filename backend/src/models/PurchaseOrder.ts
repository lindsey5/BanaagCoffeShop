import mongoose, { Schema, Document, Model } from "mongoose";


export interface PurchaseOrderItem {
    inventory_item_id: mongoose.Types.ObjectId;
    quantity: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs"; 
    total_cost: number;
    unit_cost: number;
    base_quantity: number;
}

export interface PurchaseOrderAttributes extends Document {
    poNumber: string;
    supplier_id: mongoose.Types.ObjectId;
    items: PurchaseOrderItem[];
    status: "pending" | "received" | "cancelled";
    grandTotal: number;
    notes?: string;
    dateReceived: Date;
}

const PurchaseOrderSchema: Schema<PurchaseOrderAttributes> = new Schema(
    {
        poNumber: {
            type: String,
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

                unit: {
                    type: String,
                    required: true,
                    enum: ["kg", "g", "ml", "l", "pcs"],
                },

                unit_cost: {
                    type: Number,
                    required: true,
                    min: [0, "Unit cost cannot be negative."],
                },

                base_quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Base quantity must be at least 1."],
                },

                total_cost: {
                    type: Number,
                    required: true,
                    min: [0, "Total cannot be negative."],
                    default: 0,
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
        dateReceived: {
            type: Date
        }
    },
    { timestamps: true }
);

PurchaseOrderSchema.pre("save", async function (this: PurchaseOrderAttributes) {
    if (!this.poNumber) {
        let unique = false;
        let generatedId = "";

        while (!unique) {
            const random = Math.random().toString(36).substring(2, 7).toUpperCase();

            generatedId = `PO-${random}`;

            const existing = await mongoose.models.PurchaseOrder.findOne({ poNumber: generatedId });

            if (!existing) unique = true;
        }

        this.poNumber = generatedId;
    }

    return;
});

// indexes
PurchaseOrderSchema.index({ status: 1 });

PurchaseOrderSchema.virtual("supplier", {
    ref: "Supplier",
    localField: "supplier_id",
    foreignField: "_id",
    justOne: true
})

PurchaseOrderSchema.set("toObject", { virtuals: true });
PurchaseOrderSchema.set("toJSON", { virtuals: true });


const PurchaseOrder: Model<PurchaseOrderAttributes> = mongoose.model(
    "PurchaseOrder",
    PurchaseOrderSchema
);

export default PurchaseOrder;