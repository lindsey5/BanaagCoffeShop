import type { Order } from "../../types/order.type";
import { formatReceiptDate } from "../../utils/dateUtils";
import { formatToPeso } from "../../utils/utils";
import Modal from "../ui/Modal";
import { useRef } from "react";

interface ReceiptProps {
    show: boolean;
    close: () => void;
    order: Order | null;
}

export default function Receipt({ show, close, order }: ReceiptProps) {
    const printRef = useRef<HTMLDivElement>(null);

    if (!order) return null;

    const handlePrint = () => {
        if (!printRef.current) return;

        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = `
            <div style="font-family: monospace; padding: 20px; color: black;">
                ${printContent}
            </div>
        `;

        window.print();

        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    return (
        <Modal onClose={close} open={show}>
            <div className="w-full max-w-md bg-white rounded-lg p-6 text-sm font-mono text-black">

                {/* RECEIPT CONTENT ONLY */}
                <div ref={printRef} className="text-black bg-white">

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-lg font-bold">BANAAG KAPEHAN</h1>
                        <p className="text-xs">Brewed with passion, made for you.</p>
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

                    <div className="border-t border-gray-400 my-4" />

                    {/* Order Info */}
                    <div className="text-xs">
                        <p className="font-bold">
                            Walk In - Order: {order.order_id}
                        </p>
                        <p>
                            Server: {order.user.firstname} {order.user.lastname}
                        </p>
                        <p>{formatReceiptDate(order.createdAt)}</p>
                    </div>

                    <div className="border-t border-gray-400 my-4" />

                    {/* Items */}
                    <div className="text-xs space-y-1">
                        {order.orderItems.map(item => (
                            <div key={item._id} className="flex justify-between">
                                <p>
                                    {item.quantity} {item.menu?.name || "Item"}
                                </p>
                                <p>{formatToPeso(item.total)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-400 my-4" />

                    {/* Totals */}
                    <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                            <p>Subtotal</p>
                            <p>{formatToPeso(order.subtotal)}</p>
                        </div>

                        {order.discount > 0 && (
                            <div className="flex justify-between">
                                <p>Discount ({order.discount}%)</p>
                                <p>
                                    -{formatToPeso(order.subtotal * (order.discount / 100))}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <p>Tax (12%)</p>
                            <p>{formatToPeso(order.tax)}</p>
                        </div>

                        <div className="flex justify-between font-bold">
                            <p>Total</p>
                            <p>{formatToPeso(order.grandTotal)}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-400 my-4" />

                    {/* Payment */}
                    <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                            <p>Payment Method</p>
                            <p className="capitalize">{order.payment_method}</p>
                        </div>

                        <div className="flex justify-between">
                            <p>Payment</p>
                            <p>{formatToPeso(order.payment)}</p>
                        </div>

                        <div className="flex justify-between">
                            <p>Change</p>
                            <p>{formatToPeso(order.change)}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-400 my-4" />

                    {/* Footer */}
                    <div className="text-center text-xs">
                        Thank you for visiting Banaag Kapehan!<br />
                        Have a great day and stay caffeinated!
                    </div>
                </div>

                {/* BUTTONS (NOT PRINTED CONTENT) */}
                <div className="mt-6 flex gap-2 justify-center">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer"
                    >
                        Print
                    </button>

                    <button
                        onClick={close}
                        className="px-4 py-2 bg-black text-white rounded-md cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}