import mongoose, { Schema, Document, Model } from "mongoose";

export interface StockInAttributes extends Document {
    stock_in_id: string;
    supplier_id: mongoose.Types.ObjectId;
    inventory_item_id: mongoose.Types.ObjectId;
    quantity: number;
    unit_cost: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs"; 
    total_cost: number;
}

const StockInSchema: Schema<StockInAttributes> = new Schema(
    {
        stock_in_id: {
            type: String,
            unique: true,
        },

        inventory_item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InventoryItem",
            required: true,
        },

        supplier_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
        },

        unit: {
            type: String,
            enum: ["kg", "g", "ml", "l", "pcs"],
            required: true,
        },

        unit_cost: {
            type: Number,
            required: true,
            min: [0, "Cost cannot be negative."],
        },
        total_cost: {
            type: Number,
            required: true,
            min: [0, "Total cannot be negative."],
        },
    },
    { timestamps: true }
);

StockInSchema.pre<StockInAttributes>("save", async function (this: StockInAttributes) {
    if (!this.stock_in_id) {
        let unique = false;
        let generatedId = "";

        while (!unique) {
            const random = Math.random().toString(36).substring(2, 7).toUpperCase();

            generatedId = `SI-${random}`;

            const existing = await mongoose.models.StockOut.findOne({ stock_in_id: generatedId });

            if (!existing) unique = true;
        }

        this.stock_in_id = generatedId;
    }
});

StockInSchema.index({ createdAt: -1 });
StockInSchema.index({ inventory_item_id: 1 });

StockInSchema.virtual("inventoryItem", {
    ref: "InventoryItem",
    localField: "inventory_item_id",
    foreignField: "_id",
    justOne: true
})

StockInSchema.set("toObject", { virtuals: true });
StockInSchema.set("toJSON", { virtuals: true });

const StockIn: Model<StockInAttributes> = mongoose.model(
    "StockIn",
    StockInSchema
);

export default StockIn;