import type { Order } from "../../types/order.type";
import { formatDate } from "../../utils/dateUtils";
import { formatToPeso } from "../../utils/utils";
import Modal from "../ui/Modal";

interface ReceiptProps {
    show: boolean;
    close: () => void;
    order: Order | null;
}

export default function Receipt({ show, close, order }: ReceiptProps) {
    if (!order) return null;

    return (
        <Modal onClose={close} open={show}>
            <div className="max-h-[95vh] overflow-y-auto w-full max-w-md bg-white rounded-lg p-6 text-gray-800 font-mono text-sm leading-relaxed">

                {/* Header */}
                <div className="text-center whitespace-pre-line">
                    <h1 className="text-lg font-bold">BANAAG KAPEHAN</h1>
                    <p className="text-xs">
                        Brewed with passion, made for you.
                    </p>
                    <p className="text-xs">
                        Kilometer 4, National Highway, Brgy. San Vicente,{"\n"}
                        Butuan City, Agusan del Norte, 8600
                    </p>
                    <p className="text-xs">
                        Contact: (085) 815-3421 | +63 917-445-8123
                    </p>
                    <p className="text-xs">TIN: 321-654-987-0000</p>
                    <p className="text-xs">MIN: 260516-123456789</p>
                </div>

                <div className="w-full h-[1px] bg-gray-500 my-4" />

                {/* Order Info */}
                <div className="whitespace-pre-line text-xs">
                    <p className="font-semibold">DINE IN - #17</p>
                    <p>Walk In - Order: {order.order_id}</p>
                    <p>Server: Cabalo</p>
                    <p>{formatDate(order.createdAt)}</p>
                </div>

                <div className="w-full h-[1px] bg-gray-500 my-4" />
                
                {/* Items */}
                <div className="space-y-2 text-xs">
                    {order.orderItems.map((item) => (
                        <div key={item._id} className="flex justify-between">
                            <p>
                                {item.quantity} {item.menu?.name || "Menu Item"}
                            </p>
                            <p>{formatToPeso(item.total)}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full h-[1px] bg-gray-500 my-4" />
                {/* Totals */}
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>{formatToPeso(order.subtotal)}</p>
                    </div>

                    <div className="flex justify-between">
                        <p>Tax</p>
                        <p>{formatToPeso(order.tax)}</p>
                    </div>

                    <div className="flex justify-between font-semibold">
                        <p>Bill Total</p>
                        <p>{formatToPeso(order.grandTotal)}</p>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-gray-500 my-4" />

                {/* Payment */}
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <p>Payment</p>
                        <p>{formatToPeso(order.payment)}</p>
                    </div>

                    <div className="flex justify-between">
                        <p>Change</p>
                        <p>{formatToPeso(order.change)}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-xs">
                    <p>
                        Thank you for visiting Banaag Kapehan! Have a great day
                        and stay caffeinated!
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        onClick={close}
                        className="px-4 py-2 cursor-pointer bg-black text-white rounded-md hover:bg-gray-800 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}