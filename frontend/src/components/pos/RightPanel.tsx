import type { Dispatch, SetStateAction } from "react";
import type { CreateOrderItemDTO } from "../../types/order.type";
import Card from "../ui/Card";
import { formatToPeso, kgToGram, lToMl } from "../../utils/utils";
import { Minus, Plus } from "lucide-react";

interface RightPanelProps {
    orderItems: CreateOrderItemDTO[];
    setOrderItems: Dispatch<SetStateAction<CreateOrderItemDTO[]>>;
}

export default function RightPanel({ orderItems, setOrderItems }: RightPanelProps) {

    const handleQuantity = (menu_id: string, change: number) => {
        setOrderItems(prev =>
            prev.map(item => {
                if (item.menu_id !== menu_id) return item;

                const newQuantity = item.quantity + change;

                let allowed = true;

                for (const ing of item.menu.menuIngredients) {
                    const inv = ing.inventoryItem;
                    if (!inv) {
                        allowed = false;
                        break;
                    }

                    const ingAmount = ing.amount * newQuantity;

                    const isSameUnit =
                        inv.unit === ing.unit;

                    const isKgToG =
                        inv.unit === "kg" && ing.unit === "g";

                    const isLToMl =
                        inv.unit === "l" && ing.unit === "ml";

                    const availableQty =
                        isKgToG
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

    return (
        <Card className="w-90 flex flex-col h-full sticky top-0 gap-5">
            <h1 className="font-bold">Order Summary</h1>

            <div className="min-h-0 flex-grow overflow-y-auto space-y-5">
                {orderItems.map(item => (
                    <div key={item.menu_id} className="flex gap-3">

                        <img
                            className="w-20 h-20 object-cover"
                            src={item.menu.image_url}
                            alt={item.menu.name}
                        />

                        <div className="space-y-2 flex-1">
                            <h1 className="font-bold">{item.menu.name}</h1>
                            <p className="text-sm">
                                Price: {formatToPeso(item.price)}
                            </p>

                            <div className="flex gap-2 items-center">

                                <button
                                    onClick={() => handleQuantity(item.menu_id, -1)}
                                    disabled={item.quantity === 1}
                                >
                                    <Minus size={18} />
                                </button>

                                <input
                                    className="w-10 text-center border border-gray-400 text-sm px-2 py-1 text-black bg-white"
                                    value={item.quantity || ""}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "." ||
                                            e.key === "," ||
                                            e.key === "e" ||
                                            e.key === "-"
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const newValue = Number(e.target.value);

                                        handleQuantity(
                                            item.menu_id,
                                            newValue - item.quantity
                                        );
                                    }}
                                />

                                <button
                                    onClick={() => handleQuantity(item.menu_id, 1)}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between items-end">
                            <p className="font-semibold">
                                {formatToPeso(item.total)}
                            </p>

                            <button
                                className="cursor-pointer text-red-500"
                                onClick={() => handleRemove(item.menu_id)}
                            >
                                Remove
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </Card>
    );
}