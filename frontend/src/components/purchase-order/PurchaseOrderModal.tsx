import { X } from "lucide-react";
import { useUpdatePurchaseOrderStatus } from "../../hooks/purchase-order/use-update-purchase-order.hook";
import type { PurchaseOrder } from "../../types/purchaseOrder.type";
import { promiseToast } from "../../utils/sileo";
import { formatToPeso } from "../../utils/utils";
import { WhiteCard } from "../ui/Card";
import Modal from "../ui/Modal";

interface PurchaseOrderModalProps {
    show: boolean;
    close: () => void;
    purchaseOrder: PurchaseOrder | null;
}


export default function PurchaseOrderModal ({ close, show, purchaseOrder } : PurchaseOrderModalProps) {
    const updatePurchaseOrderMutation = useUpdatePurchaseOrderStatus();

    const handleUpdate = (status: string) => {
        const isConfirmed = confirm(`Are you sure you want to update the status to ${status}`);

        if(!isConfirmed) return;

        promiseToast(updatePurchaseOrderMutation.mutateAsync({ id: purchaseOrder?._id || "", status }));
    }
    
    return (
        <Modal
            open={show}
            onClose={close}
        >
            <WhiteCard className="space-y-3 max-h-[90vh] overflow-y-auto relative">
                <h1 className="font-bold text-xl">{purchaseOrder?.poNumber}</h1>
                <button className="absolute top-5 right-5 cursor-pointer" onClick={close}>
                    <X size={20} />
                </button>
                <div className="p-3 border border-hover rounded-md space-y-2">
                    <h2 className="font-semibold text-sm">Supplier:</h2>
                    <div>
                        <p className="text-xs">Code: {purchaseOrder?.supplier.code}</p>
                        <p className="text-xs">{purchaseOrder?.supplier.name}</p>
                        <p className="text-xs">{purchaseOrder?.supplier.email || 'N/A'}</p>
                        <p className="text-xs">{purchaseOrder?.supplier.phone || 'N/A'}</p>
                    </div>
                </div>
                <h2 className="font-semibold text-sm">Items</h2>
                {purchaseOrder?.items.map(item => (
                    <div className="space-y-2 text-sm border border-hover p-2 rounded-md">
                        <h1 className="font-semibold">{item.inventoryItem.name}</h1>
                        <div className="text-xs">
                            <p>Quantity: {item.quantity}{item.unit.toUpperCase()}</p>
                            <p>Unit Cost: {formatToPeso(item.unit_cost)}</p>
                            <p>Cost: {formatToPeso(item.total_cost)}</p>
                        </div>
                    </div>
                ))}
                <h1 className="text-sm font-bold">Total Cost: {formatToPeso(purchaseOrder?.grandTotal || 0)}</h1>
                <div className="flex items-center justify-end gap-3">
                    <PurchaseOrderStatusButton 
                        status={purchaseOrder?.status || ""}
                        handleUpdate={handleUpdate}
                        disabled={updatePurchaseOrderMutation.isPending}
                        close={close}
                    />
                </div>
            
            </WhiteCard>

        </Modal>
    )
}

type Props = {
    status: string;
    handleUpdate: (status: "pending" | "received" | "cancelled") => void;
    disabled: boolean;
    close: () => void;
};

function PurchaseOrderStatusButton({
    status,
    handleUpdate,
    disabled,
    close
}: Props) {
    if (status !== "pending") return (
        <button 
            className="bg-gray-200 px-4 py-[3px] rounded-md font-medium cursor-pointer border border-gray-400"
            onClick={close}
        >
            Close
        </button>
    );

    const baseStyle =
        "px-3 py-2 text-sm font-medium rounded-md transition cursor-pointer";

    const cancelStyle =
        "text-red-100 bg-red-600 hover:bg-red-400";

    const receiveStyle =
        "text-green-100 bg-green-700 hover:bg-green-400";

    return (
        <div className="flex gap-2">
            <button
                onClick={() => handleUpdate("cancelled")}
                className={`${baseStyle} ${cancelStyle}`}
                disabled={disabled}
            >
                Cancel Purchase Order
            </button>

            <button
                onClick={() => handleUpdate("received")}
                className={`${baseStyle} ${receiveStyle}`}
                disabled={disabled}
            >
                Mark as Received
            </button>
        </div>
    );
}