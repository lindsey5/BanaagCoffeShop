import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetStockInHistoryParams, GetStockInHistoryResponse } from "../types/stockIn.type";
const baseUrl = 'stock-ins'

export const stockInService = {
    getStockInHistory: (params : GetStockInHistoryParams) =>
        apiAxios<GetStockInHistoryResponse>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        }),
};