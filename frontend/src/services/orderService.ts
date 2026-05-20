import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import { type GetTotalOrdersResponse, type CreateOrderPayload, type CreateOrderResponse, type GetOrdersResponse, type GetOrdersParams, type GetOrderMonthlySalesResponse, type GetOrderSalesByPeriodResponse, type Period } from "../types/order.type";

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
        }),

    getOrderMonthlySales: (year: number) => (
        apiAxios<GetOrderMonthlySalesResponse>(`orders/sales/monthly?year=${year}`, {
            method: HttpMethod.GET
        })
    ),

    getOrderSalesByPeriod: (period: Period) => (
        apiAxios<GetOrderSalesByPeriodResponse>(`orders/sales/${period}`, {
            method: HttpMethod.GET
        })
    ),
    
};