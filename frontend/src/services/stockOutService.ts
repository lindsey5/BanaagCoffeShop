import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateStockOutDTO, CreateStockOutResponse, GetStockOutHistoryParams, GetStockOutHistoryResponse } from "../types/stockOut.type";

const baseUrl = 'stock-outs'

export const stockOutService = {
    getStockOutHistory: (params : GetStockOutHistoryParams) =>
        apiAxios<GetStockOutHistoryResponse>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        }),
    createStockOut: (data : CreateStockOutDTO) =>
        apiAxios<CreateStockOutResponse>(`${baseUrl}`, {
            method: HttpMethod.POST,
            data
        }),
};