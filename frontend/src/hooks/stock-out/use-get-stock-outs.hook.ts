import { useQuery } from "@tanstack/react-query";
import type { GetStockOutHistoryParams, GetStockOutHistoryResponse } from "../../types/stockOut.type";
import { stockOutService } from "../../services/stockOutService";

export const useGetStockOutHistory = (params: GetStockOutHistoryParams) => (
    useQuery<GetStockOutHistoryResponse, Error>({
        queryKey: ['stock-outs', params],
        queryFn:() => stockOutService.getStockOutHistory(params),
        refetchOnWindowFocus: false,
    })
)
