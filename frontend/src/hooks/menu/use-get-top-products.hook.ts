import { useQuery } from "@tanstack/react-query";
import { menuService } from "../../services/menuService";
import type { GetTopProductsResponse } from "../../types/menu.type";

export const useGetTopProducts = () => (
    useQuery<GetTopProductsResponse, Error>({
        queryKey: ['menus/top-products'],
        queryFn:() => menuService.getGetTopProducts(),
        refetchOnWindowFocus: false,
    })
)
