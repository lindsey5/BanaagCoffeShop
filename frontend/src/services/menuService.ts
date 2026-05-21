import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateMenuResponse, GetMenusParams, GetMenusResponse, GetTopProductsResponse } from "../types/menu.type";
import type { ApiResponse } from "../types/types";

const baseUrl = 'menus'

export const menuService = {
    getMenus: (params : GetMenusParams) =>
        apiAxios<GetMenusResponse>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        }),

    getGetTopProducts: () =>
        apiAxios<GetTopProductsResponse>(`${baseUrl}/top-products`, {
            method: HttpMethod.GET,
        }),

    createMenu: (data: FormData) => apiAxios<CreateMenuResponse>(`${baseUrl}`, {
        method: HttpMethod.POST,
        data
    }),

    updateMenu: (data: FormData, id: string) =>  
        apiAxios<ApiResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.PUT,
            data,
        }),

    deleteMenu: (id: string) => 
        apiAxios<ApiResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.DELETE
        })
};