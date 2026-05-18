import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { InventoryDTO, InventoryResponse, GetInventoryParams, GetInventoryResponse } from "../types/inventory.type";
import type { ApiResponse } from "../types/types";

const baseUrl = 'inventory-items'

export const inventoryService = {
    getInventoryItems: (params : GetInventoryParams) =>
        apiAxios<GetInventoryResponse>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        }),

    createInventoryItem: (data: InventoryDTO) => 
        apiAxios<InventoryResponse>(`${baseUrl}`, {
            method: HttpMethod.POST,
            data
        }),
    updateInventoryItem: (data: InventoryDTO, id: string) => 
        apiAxios<InventoryResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.PUT,
            data
        }),

    deleteInventoryItem: (id: string) => 
        apiAxios<ApiResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.DELETE
        })
};