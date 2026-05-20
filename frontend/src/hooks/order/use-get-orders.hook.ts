import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import type { GetOrdersParams, GetOrdersResponse } from "../../types/order.type";

export const useGetOrders = (params : GetOrdersParams) => (
    useQuery<GetOrdersResponse, Error>({
        queryKey: ['orders', params],
        queryFn:() => orderService.getOrders(params),
        refetchOnWindowFocus: false,
    })
)
