import { useQuery } from "@tanstack/react-query";
import type { GetOrderMonthlySalesResponse } from "../../types/order.type";
import { orderService } from "../../services/orderService";

export const useGetOrderMonthlySales = (year: number = 2026) => (
    useQuery<GetOrderMonthlySalesResponse, Error>({
        queryKey: [`orders/monthly`, year],
        queryFn: () => orderService.getOrderMonthlySales(year),
        refetchOnWindowFocus: false,
    })
)