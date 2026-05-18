import mongoose, { Schema, Document, Model } from "mongoose";

export interface MenuIngredientAttributes extends Document {
    menu_id: mongoose.Types.ObjectId;
    inventory_item_id: mongoose.Types.ObjectId;
    amount: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs";
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

const MenuIngredient: Model<MenuIngredientAttributes> = mongoose.model(
    "MenuIngredient",
    MenuIngredientSchema
);

export default MenuIngredient;