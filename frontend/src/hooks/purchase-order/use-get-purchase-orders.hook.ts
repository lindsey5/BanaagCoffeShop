import { useQuery } from "@tanstack/react-query";
import type { GetPurchaseOrdersParams, GetPurchaseOrdersRespose } from "../../types/purchaseOrder.type";
import { purchaseOrderService } from "../../services/purchaseOrderService";

export const useGetPurchaseOrders = (params: GetPurchaseOrdersParams) => (
    useQuery<GetPurchaseOrdersRespose, Error>({
        queryKey: ['purchase-orders', params],
        queryFn:() => purchaseOrderService.getPurchaseOrders(params),
        refetchOnWindowFocus: false,
    })
)
