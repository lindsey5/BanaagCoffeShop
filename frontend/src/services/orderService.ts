import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import { type GetTotalOrdersResponse, type CreateOrderPayload, type CreateOrderResponse, type GetOrdersResponse, type GetOrdersParams } from "../types/order.type";

const baseUrl = 'orders'

export const orderService = {
    createOrder: (data: CreateOrderPayload) => 
        apiAxios<CreateOrderResponse>(`${baseUrl}`, {
            method: HttpMethod.POST,
            data
        }),

    getTotalOrders: () => 
        apiAxios<GetTotalOrdersResponse>(`${baseUrl}/total`, {
            method: HttpMethod.GET
        }),

    getOrders: (params : GetOrdersParams) =>
        apiAxios<GetOrdersResponse>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        })
    
};