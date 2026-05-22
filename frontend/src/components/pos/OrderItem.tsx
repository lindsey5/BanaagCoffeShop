import { Minus, Plus } from "lucide-react";
import type { CreateOrderItemDTO } from "../../types/order.type";
import { formatToPeso } from "../../utils/utils";

interface OrderItemProps {
    item: CreateOrderItemDTO;
    handleQuantity: (menu_id: string, quantity: number) => void;
    handleRemove: (menu_id: string) => void;
}

export default function OrderItem ({ item, handleQuantity, handleRemove } : OrderItemProps) {
    return (
        <div className="flex gap-3">
            <img
                className="w-20 h-20 object-cover rounded-md"
                src={item.menu.image_url}
                alt={item.menu.name}
            />

            <div className="min-w-0 space-y-2 flex-1">
                <h1 className="font-bold truncate">{item.menu.name}</h1>
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
    )
}