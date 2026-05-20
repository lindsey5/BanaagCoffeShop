import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { MenuAttributes } from "./Menu";

export interface OrderItemAttributes extends Document {
    order_id: Types.ObjectId;
    menu_id: Types.ObjectId;
    menu: MenuAttributes;
    price: number;
    quantity: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema: Schema<OrderItemAttributes> = new Schema(
    {
        order_id: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: [true, "order_id is required."]
        },

        menu_id: {
            type: Schema.Types.ObjectId,
            ref: "Menu",
            required: [true, "menu_id is required."]
        },

        menu: {
            type: Object,
            required: [true, "menu snapshot is required."]
        },

        price: {
            type: Number,
            required: [true, "price is required."]
        },

        quantity: {
            type: Number,
            required: [true, "quantity is required."]
        },

        total: {
            type: Number,
            required: [true, "total is required."]
        }
    },
    { timestamps: true }
);

OrderItemSchema.index({ order_id: 1 });
OrderItemSchema.index({ menu_id: 1 });

const OrderItem: Model<OrderItemAttributes> = mongoose.model(
    "OrderItem",
    OrderItemSchema
);

export default OrderItem;