import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetStockOutHistoryParams, GetStockOutHistoryResponse } from "../types/stockOut.type";

const baseUrl = 'stock-outs'

export const stockOutService = {
    getStockOutHistory: (params : GetStockOutHistoryParams) =>
        apiAxios<GetStockOutHistoryResponse>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        }),
};