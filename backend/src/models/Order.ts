import mongoose, { Schema, Document, Model } from "mongoose";

export interface OrderAttributes extends Document {
    order_id: string;
    payment_method: "cash" | "e-wallet" | "card";
    tax: number;
    discount: number;
    subtotal: number;
    grandTotal: number;
    payment: number;
    change: number;
}

const OrderSchema: Schema<OrderAttributes> = new Schema(
    {
        order_id: {
            type: String,
            required: true,
            unique: true
        },

        payment_method: {
            type: String,
            enum: ["cash", "e-wallet", "card"],
            required: true
        },
        tax: { 
            type: Number, 
            required: true 
        },
        discount: { 
            type: Number, 
            required: true 
        },
        subtotal: { 
            type: Number, 
            required: true 
        },
        grandTotal: { 
            type: Number, 
            required: true 
        },
        payment: { 
            type: Number, 
            required: true 
        },
        change: { 
            type: Number, 
            required: true 
        },
    },
    { timestamps: true }
);

OrderSchema.virtual("orderItems", {
    ref: "OrderItem",
    localField: "_id",
    foreignField: "order_id",
});

OrderSchema.set("toObject", { virtuals: true });
OrderSchema.set("toJSON", { virtuals: true });

const Order: Model<OrderAttributes> = mongoose.model(
    "Order",
    OrderSchema
);

export default Order;