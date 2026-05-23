import mongoose, { Schema, Document, Model } from "mongoose";

export interface OrderAttributes extends Document {
    order_id: string;
    order_no: number;
    customer_name: string;
    payment_method: "cash" | "e-wallet" | "card";
    orderType: "Dine in" | "Take out" | "Delivery";
    tax: number;
    discount: number;
    subtotal: number;
    grandTotal: number;
    payment: number;
    change: number;
    specialRequest: string;
    user_id: mongoose.Types.ObjectId;
}

const OrderSchema: Schema<OrderAttributes> = new Schema(
    {
        order_id: {
            type: String,
            unique: true
        },

        order_no: {
            type: Number,
        },

        orderType: {
            type: String,
            enum: ["Dine in", "Take out", "Delivery"],
            required: true,
            default: "Dine in",
        },

        customer_name: {
            type: String,
            required: true,
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
        specialRequest: {
            type: String
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "user_id is required."]
        },
    },
    { timestamps: true }
);

OrderSchema.pre("save", async function (this: OrderAttributes) {
    if (!this.order_id) {
        let unique = false;
        let generatedId = "";

        while (!unique) {
            const random = Math.random().toString(36).substring(2, 7).toUpperCase();

            generatedId = `ORD-${random}`;

            const existing = await mongoose.models.Order.findOne({ order_id: generatedId });

            if (!existing) unique = true;
        }

        this.order_id = generatedId;
    }

    if(!this.order_no) {
        const total = await mongoose.models.Order.countDocuments();
        this.order_no = total + 1;
    }

    return;
});

OrderSchema.virtual("orderItems", {
    ref: "OrderItem",
    localField: "_id",
    foreignField: "order_id",
});

OrderSchema.virtual("user", {
    ref: "User",
    localField: "user_id",
    foreignField: "_id",
    justOne: true
})

OrderSchema.set("toObject", { virtuals: true });
OrderSchema.set("toJSON", { virtuals: true });

const Order: Model<OrderAttributes> = mongoose.model(
    "Order",
    OrderSchema
);

export default Order;