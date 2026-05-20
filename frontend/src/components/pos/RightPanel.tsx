import {
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction
} from "react";

import type { CreateOrderItemDTO } from "../../types/order.type";
import Card, { WhiteCard } from "../ui/Card";
import { cn, formatToPeso, kgToGram, lToMl } from "../../utils/utils";
import OrderItem from "./OrderItem";
import Button from "../ui/Button";

interface RightPanelProps {
    orderItems: CreateOrderItemDTO[];
    setOrderItems: Dispatch<SetStateAction<CreateOrderItemDTO[]>>;
}

const discounts = [
    { label: "None", percentage: 0 },
    { label: "Seasonal (10%)", percentage: 10 },
    { label: "PWD (20%)", percentage: 20 }
];

const paymentMethods = [
    { label: "Cash", value: "cash" },
    { label: "Card", value: "card" },
    { label: "E-Wallet", value: "e-wallet" }
];

export default function RightPanel({
    orderItems,
    setOrderItems
}: RightPanelProps) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [discount, setDiscount] = useState(0);

    const { subtotal, tax, grandTotal } = useMemo(() => {
        const taxRate = 0.12;

        const subtotal = orderItems.reduce(
            (t, i) => t + i.total,
            0
        );

        const discountAmount = subtotal * (discount / 100);
        const discountedSubtotal = subtotal - discountAmount;

        const tax = discountedSubtotal * taxRate;
        const grandTotal = discountedSubtotal + tax;

        return {
            subtotal,
            tax,
            grandTotal
        };
    }, [orderItems, discount]);

    const handleQuantity = (menu_id: string, change: number) => {
        setOrderItems(prev =>
            prev.map(item => {
                if (item.menu_id !== menu_id) return item;

                const newQuantity = item.quantity + change;
                if (newQuantity <= 0) return item;

                let allowed = true;

                for (const ing of item.menu.menuIngredients) {
                    const inv = ing.inventoryItem;
                    if (!inv) {
                        allowed = false;
                        break;
                    }

                    const ingAmount = ing.amount * newQuantity;

                    const isSameUnit = inv.unit === ing.unit;
                    const isKgToG = inv.unit === "kg" && ing.unit === "g";
                    const isLToMl = inv.unit === "l" && ing.unit === "ml";

                    const availableQty = isKgToG
                        ? kgToGram(inv.quantity)
                        : isLToMl
                        ? lToMl(inv.quantity)
                        : inv.quantity;

                    if (!isSameUnit && !isKgToG && !isLToMl) {
                        allowed = false;
                        break;
                    }

                    if (availableQty < ingAmount) {
                        allowed = false;
                        break;
                    }
                }

                if (!allowed) return item;

                return {
                    ...item,
                    quantity: newQuantity,
                    total: newQuantity * item.price
                };
            })
        );
    };

    const handleRemove = (menu_id: string) => {
        setOrderItems(prev =>
            prev.filter(item => item.menu_id !== menu_id)
        );
    };

    const handleRemoveAll = () => {
        setOrderItems([]);
    }

    return (
        <Card className="w-90 flex flex-col max-h-full sticky top-0 gap-4 p-3">

            {/* HEADER */}
            <h1 className="font-bold text-lg">
                Order Summary
            </h1>

            {/* ORDER ITEMS LIST */}
            <div className="flex-1 min-h-60 overflow-y-auto space-y-3 pr-1">
                {orderItems.map(item => (
                    <OrderItem
                        key={item.menu_id}
                        item={item}
                        handleQuantity={handleQuantity}
                        handleRemove={handleRemove}
                    />
                ))}
            </div>

            {/* FOOTER */}
            <WhiteCard className="space-y-4">

                {/* DISCOUNTS */}
                <div className="space-y-2">
                    <h1 className="text-sm font-bold">
                        Discount
                    </h1>

                    <div className="flex gap-2 overflow-x-auto">
                        {discounts.map(dis => (
                            <button
                                key={dis.percentage}
                                className={cn(
                                    "cursor-pointer text-xs bg-main/40 p-2 rounded-md min-w-20 text-white hover:bg-main transition",
                                    discount === dis.percentage &&
                                        "bg-accent"
                                )}
                                onClick={() =>
                                    setDiscount(dis.percentage)
                                }
                            >
                                {dis.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PAYMENT METHOD */}
                <div className="space-y-2">
                    <h1 className="text-sm font-bold">
                        Payment Method
                    </h1>

                    <div className="flex gap-2">
                        {paymentMethods.map(p => (
                            <button
                                key={p.value}
                                className={cn(
                                    "text-xs text-white bg-main/40 p-2 rounded-md flex-1 cursor-pointer transition",
                                    paymentMethod === p.value &&
                                        "bg-accent"
                                )}
                                onClick={() =>
                                    setPaymentMethod(p.value)
                                }
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[1px] bg-brown" />
                {/* PAYMENT SUMMARY */}
                <div className="space-y-2">
                    <h1 className="font-bold">
                        Payment Summary
                    </h1>

                    <p className="flex justify-between text-xs">
                        Subtotal
                        <span className="font-bold">
                            {formatToPeso(subtotal)}
                        </span>
                    </p>

                    <p className="flex justify-between text-xs">
                        Tax (12%)
                        <span className="font-bold">
                            {formatToPeso(tax)}
                        </span>
                    </p>

                    <p className="flex justify-between text-sm font-bold">
                        Total
                        <span>
                            {formatToPeso(grandTotal)}
                        </span>
                    </p>
                </div>

                <div className="h-[1px] bg-brown" />

                <div className="grid grid-cols-2 gap-2 text-sm mt-5">
                    <Button
                        className="rounded-md"
                    >Print</Button>
                    <button
                        className="bg-red-600 rounded-md text-white cursor-pointer"
                        onClick={handleRemoveAll}
                    >Cancel</button>
                </div>

            </WhiteCard>
        </Card>
    );
}