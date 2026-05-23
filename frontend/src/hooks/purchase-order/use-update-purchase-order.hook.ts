import { useMutation } from "@tanstack/react-query";
import { purchaseOrderService } from "../../services/purchaseOrderService";

export const useUpdatePurchaseOrderStatus = () => {
    return useMutation({
        mutationFn: ({ id, status } : { id: string, status: string }) =>
           purchaseOrderService.updatePurchaseOrderStatus(id, status),
    });
};