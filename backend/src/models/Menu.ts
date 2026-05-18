import mongoose, { Schema, Document, Model } from "mongoose";

export interface MenuIngredient {
    inventory_item_id: mongoose.Types.ObjectId;
    name: string;
    amount: number;
}

export interface MenuAttributes extends Document {
    code: string;
    name: string;
    category: string;
    description?: string;
    price: number;
    ingredients: MenuIngredient[];
    status: "available" | "unavailable" | "deleted";
}

const MenuSchema: Schema<MenuAttributes> = new Schema(
    {
        code: {
            type: String,
            required: [true, "menu code is required."],
            minlength: [3, "menu code must be at least 3 characters."],
            maxlength: [50, "menu code must be at most 50 characters."],
            trim: true,
        },

        name: {
            type: String,
            required: [true, "menu name is required."],
            minlength: [3, "menu name must be at least 3 characters."],
            maxlength: [100, "menu name must be at most 100 characters."],
            trim: true,
        },

        category: {
            type: String,
            required: [true, "menu category is required."],
            minlength: [3, "menu category must be at least 3 characters."],
            maxlength: [100, "menu category must be at most 100 characters."],
            trim: true,
        },

        description: {
            type: String,
            maxlength: [300, "description must be at most 300 characters."],
            trim: true,
        },

        price: {
            type: Number,
            required: [true, "price is required."],
            min: [0, "price cannot be negative."],
        },

        ingredients: [
            {
                inventory_item_id: {
                    type: Schema.Types.ObjectId,
                    ref: "InventoryItem",
                    required: true,
                },

                amount: {
                    type: Number,
                    required: true,
                    min: [0.01, "ingredient amount must be greater than 0"],
                },
            },
        ],

        status: {
            type: String,
            default: "available",
            enum: ["available", "unavailable", "deleted"],
        },
    },
    { timestamps: true }
);

MenuSchema.index({ name: 1 });
MenuSchema.index({ category: 1 });
MenuSchema.index({ status: 1 });

const Menu: Model<MenuAttributes> = mongoose.model("Menu", MenuSchema);

export default Menu;