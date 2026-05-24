import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetMonthlyExpensesResponse, GetStockInHistoryParams, GetStockInHistoryResponse } from "../types/stockIn.type";
const baseUrl = 'stock-ins'

export const stockInService = {
    getStockInHistory: (params : GetStockInHistoryParams) =>
        apiAxios<GetStockInHistoryResponse>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        }),

    getMonthlyExpenses: (year: number) => (
        apiAxios<GetMonthlyExpensesResponse>(`${baseUrl}/monthly-expenses?year=${year}`, {
            method: HttpMethod.GET
        })
    ),
};

