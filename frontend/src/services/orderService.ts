import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateOrderPayload, CreateOrderResponse } from "../types/order.type";

const baseUrl = 'orders'

export const orderService = {
    createOrder: (data: CreateOrderPayload) => 
        apiAxios<CreateOrderResponse>(`${baseUrl}`, {
            method: HttpMethod.POST,
            data
        }),
};