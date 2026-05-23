import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreatePurchaseOrderDTO, GetPurchaseOrdersParams, GetPurchaseOrdersRespose, PurchaseOrderResponse } from "../types/purchaseOrder.type";

const baseUrl = 'purchase-orders'

export const purchaseOrderService = {
    getPurchaseOrders: (params : GetPurchaseOrdersParams) =>
        apiAxios<GetPurchaseOrdersRespose>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        }),

    createPurchaseOrder: (data : CreatePurchaseOrderDTO) =>
        apiAxios<PurchaseOrderResponse>(`${baseUrl}`, {
            method: HttpMethod.POST,
            data
        }),

    updatePurchaseOrderStatus: (id: string, status: string) =>
        apiAxios<PurchaseOrderResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.PUT,
            data: { status }
        }),
};