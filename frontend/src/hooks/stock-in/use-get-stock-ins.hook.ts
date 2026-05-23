import { useQuery } from "@tanstack/react-query";
import type { GetStockInHistoryParams, GetStockInHistoryResponse } from "../../types/stockIn.type";
import { stockInService } from "../../services/stockInService";

export const useGetStockInHistory = (params: GetStockInHistoryParams) => (
    useQuery<GetStockInHistoryResponse, Error>({
        queryKey: ['stock-ins', params],
        queryFn:() => stockInService.getStockInHistory(params),
        refetchOnWindowFocus: false,
    })
)
