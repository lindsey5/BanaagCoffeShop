import mongoose, { Schema, Document, Model } from "mongoose";
import { InventoryItemAttributes } from "./InventoryItem";

export interface MenuIngredientAttributes extends Document {
    menu_id: mongoose.Types.ObjectId;
    inventory_item_id: mongoose.Types.ObjectId;
    amount: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs";
    inventoryItem: InventoryItemAttributes;
}

const MenuIngredientSchema: Schema<MenuIngredientAttributes> = new Schema(
    {
        menu_id: {
            type: Schema.Types.ObjectId,
            ref: "Menu",
            required: true,
        },

        inventory_item_id: {
            type: Schema.Types.ObjectId,
            ref: "InventoryItem",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: [0.01, "Amount must be greater than 0"],
        },

        unit: {
            type: String,
            required: [true, "unit is required."],
            enum: ["kg", "g", "l", "ml", "pcs"],
        },
    },
    { timestamps: true }
);

MenuIngredientSchema.index({ menu_id: 1 });
MenuIngredientSchema.index({ inventory_item_id: 1 });
MenuIngredientSchema.index({ status: 1 });

MenuIngredientSchema.virtual("inventoryItem", {
    ref: "InventoryItem",
    localField: "inventory_item_id",
    foreignField: "_id",
    justOne: true,
});

MenuIngredientSchema.set("toJSON", { virtuals: true });
MenuIngredientSchema.set("toObject", { virtuals: true });

const MenuIngredient: Model<MenuIngredientAttributes> = mongoose.model(
    "MenuIngredient",
    MenuIngredientSchema
);

export default MenuIngredient;