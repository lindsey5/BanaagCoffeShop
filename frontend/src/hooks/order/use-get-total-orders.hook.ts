import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import type { GetTotalOrdersResponse } from "../../types/order.type";

export const useGetTotalOrders = () => (
    useQuery<GetTotalOrdersResponse, Error>({
        queryKey: ['orders/total'],
        queryFn:() => orderService.getTotalOrders(),
        refetchOnWindowFocus: false,
    })
)
