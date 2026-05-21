import mongoose, { Schema, Document, Model } from "mongoose";

export interface StockOutAttributes extends Document {
    stock_out_id: string;
    inventory_item_id: mongoose.Types.ObjectId;
    quantity: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs";
    transaction_type: "sale" | "damage" | "expired" | "adjustment";
}

const StockOutSchema: Schema<StockOutAttributes> = new Schema(
    {
        stock_out_id: {
            type: String,
            unique: true,
        },

        inventory_item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InventoryItem",
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

        transaction_type: {
            type: String,
            enum: ["sale", "damage", "expired", "adjustment"],
            required: true,
        },
    },
    { timestamps: true }
);

StockOutSchema.pre<StockOutAttributes>("save", async function (this: StockOutAttributes) {
    if(!this.stock_out_id) {
        const total = await mongoose.models.StockOut.countDocuments();

        const nextNumber = total + 1;

        this.stock_out_id = `SO-${String(nextNumber).padStart(5, "0")}`;
    }
});

StockOutSchema.index({ createdAt: -1 });
StockOutSchema.index({ inventory_item_id: 1 });

StockOutSchema.virtual("inventoryItem", {
    ref: "InventoryItem",
    localField: "inventory_item_id",
    foreignField: "_id",
    justOne: true
})

StockOutSchema.set("toObject", { virtuals: true });
StockOutSchema.set("toJSON", { virtuals: true });

const StockOut: Model<StockOutAttributes> = mongoose.model(
    "StockOut",
    StockOutSchema
);

export default StockOut;