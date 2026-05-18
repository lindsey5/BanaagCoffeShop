import { useQuery } from "@tanstack/react-query";
import type { GetMenusParams, GetMenusResponse } from "../../types/menu.type";
import { menuService } from "../../services/menuService";

export const useGetMenus = (params: GetMenusParams) => (
    useQuery<GetMenusResponse, Error>({
        queryKey: ['menus', params],
        queryFn:() => menuService.getMenus(params),
        refetchOnWindowFocus: false,
    })
)