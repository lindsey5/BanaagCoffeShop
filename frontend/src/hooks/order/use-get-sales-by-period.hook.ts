import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import type { GetOrderSalesByPeriodResponse, Period } from "../../types/order.type";

export const useGetOrderSalesByPeriod = (period: Period) => (
    useQuery<GetOrderSalesByPeriodResponse, Error>({
        queryKey: [`orders/sales/${period}`],
        queryFn: () => orderService.getOrderSalesByPeriod(period),
        refetchOnWindowFocus: false,
    })
)