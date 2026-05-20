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
    specialRequest: string;
    user_id: mongoose.Types.ObjectId;
}

const OrderSchema: Schema<OrderAttributes> = new Schema(
    {
        order_id: {
            type: String,
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

    return;
});

OrderSchema.virtual("orderItems", {
    ref: "OrderItem",
    localField: "_id",
    foreignField: "order_id",
});

OrderSchema.virtual("user", {
    ref: "User",
    localField: "_id",
    foreignField: "user_id",
})

OrderSchema.set("toObject", { virtuals: true });
OrderSchema.set("toJSON", { virtuals: true });

const Order: Model<OrderAttributes> = mongoose.model(
    "Order",
    OrderSchema
);

export default Order;