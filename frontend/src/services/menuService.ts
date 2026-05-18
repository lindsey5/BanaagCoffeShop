import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { MenuDTO, CreateMenuResponse, GetMenusParams, GetMenusResponse } from "../types/menu.type";

const baseUrl = 'menus'

export const menuService = {
    getMenus: (params : GetMenusParams) =>
        apiAxios<GetMenusResponse>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        }),

    createMenu: (data: MenuDTO) => {
        const { menuIngredients, ...menu } = data;

        return apiAxios<CreateMenuResponse>(`${baseUrl}`, {
            method: HttpMethod.POST,
            data: {
                menu,
                menuIngredients,
            },
        });
    },
};