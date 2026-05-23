import { useMutation } from "@tanstack/react-query";
import type { CreatePurchaseOrderDTO } from "../../types/purchaseOrder.type";
import { purchaseOrderService } from "../../services/purchaseOrderService";

export const useCreatePurchaseOrder = () => {
    return useMutation({
        mutationFn: (data : CreatePurchaseOrderDTO) =>
           purchaseOrderService.createPurchaseOrder(data),
    });
};