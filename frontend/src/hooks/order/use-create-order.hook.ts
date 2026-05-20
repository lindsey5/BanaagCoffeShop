import { useMutation } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import type { CreateOrderPayload } from "../../types/order.type";

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: (data: CreateOrderPayload) =>
           orderService.createOrder(data),
    });
};