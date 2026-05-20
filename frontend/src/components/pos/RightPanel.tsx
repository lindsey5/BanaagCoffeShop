import {
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction
} from "react";

import type { Order, CreateOrderItemDTO } from "../../types/order.type";
import Card, { WhiteCard } from "../ui/Card";
import { cn, formatToPeso, kgToGram, lToMl } from "../../utils/utils";
import OrderItem from "./OrderItem";
import Button from "../ui/Button";
import TextField from "../ui/Textfield";
import { useCreateOrder } from "../../hooks/order/use-create-order.hook";
import { promiseToast } from "../../utils/sileo";
import Receipt from "../shared/Receipt";

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
    const createOrderMutation = useCreateOrder();
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "e-wallet">("cash");
    const [payment, setPayment] = useState(0);
    const [specialRequest, setSpecialRequest] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
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

        setPayment(paymentMethod === 'cash' ? 0 : grandTotal);

        return {
            subtotal,
            tax,
            grandTotal
        };
    }, [orderItems, discount, paymentMethod]);

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

    const change = useMemo(() => {
        if(!orderItems.length) return 0;

        return payment - grandTotal;
    }, [payment, orderItems, grandTotal]);

    const canPlaceOrder = useMemo(() => {
        if(!orderItems.length) return false;

        if(paymentMethod === 'cash' && (payment < grandTotal)) return false;

        return true;

    }, [orderItems, paymentMethod, payment, grandTotal])

    const placeOrder = async () => {
        const isConfirmed = confirm('Place this order?');

        if(!isConfirmed) return;

        const response = await promiseToast(createOrderMutation.mutateAsync({
            order: {
                change,
                discount,
                grandTotal,
                payment_method: paymentMethod,
                subtotal,
                tax,
                payment,
                specialRequest
            },
            orderItems
        }), "top-center", () => {});

        if(response.success){
            setOrder(response.order)
        }
    }

    return (
        <>
        <Receipt 
            close={() => window.location.reload()}
            order={order}
            show={order !== null}
        />
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
                                onClick={() => setPaymentMethod(p.value as "cash" | "card" | "e-wallet")}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    {paymentMethod === 'cash' && (
                        <TextField 
                            label="Payment"
                            placeholder="Enter payment"
                            type="number"
                            onChange={(e) => setPayment(Number(e.target.value))}
                            disabled={orderItems.length < 1}
                            value={payment || ""}
                        />
                    )}
                </div>
                <div className="space-y-2">
                    <h1 className="text-sm font-bold">
                        Special Request
                    </h1>

                    <textarea
                        className="text-black w-full min-h-20 p-2 text-xs bg-white border border-gray-400 rounded-md outline-none resize-none"
                        placeholder="Add special request..."
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                    />
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

                    <p className="flex justify-between text-md font-bold">
                        Total
                        <span>
                            {formatToPeso(grandTotal)}
                        </span>
                    </p>

                    {payment >= grandTotal && (
                        <p className="flex justify-between text-xs">
                            Change
                            <span>
                                {formatToPeso(change)}
                            </span>
                        </p>
                    )}
                </div>

                <div className="h-[1px] bg-brown" />

                <div className="grid grid-cols-2 gap-2 text-sm mt-5">
                    <Button
                        className="rounded-md"
                        disabled={!canPlaceOrder}
                        onClick={placeOrder}
                    >Print</Button>
                    <button
                        className="bg-red-600 rounded-md text-white cursor-pointer"
                        onClick={handleRemoveAll}
                    >Cancel</button>
                </div>

            </WhiteCard>
        </Card>
        </>
    );
}