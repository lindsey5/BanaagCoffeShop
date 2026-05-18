import mongoose, { Schema, Document, Model } from "mongoose";

export interface MenuAttributes extends Document {
    code: string;
    name: string;
    category: string;
    price: number;
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

        price: {
            type: Number,
            required: [true, "price is required."],
            min: [0, "price cannot be negative."],
        },

        status: {
            type: String,
            default: "available",
            enum: ["available", "unavailable", "deleted"],
        },
    },
    { timestamps: true }
);

MenuSchema.index({ name: 1, code: 1 });
MenuSchema.index({ category: 1 });
MenuSchema.index({ status: 1 });

MenuSchema.virtual("menuIngredients", {
    ref: "MenuIngredient",
    localField: "_id",
    foreignField: "menu_id",
});

MenuSchema.set("toObject", { virtuals: true });
MenuSchema.set("toJSON", { virtuals: true });

const Menu: Model<MenuAttributes> = mongoose.model("Menu", MenuSchema);

export default Menu;