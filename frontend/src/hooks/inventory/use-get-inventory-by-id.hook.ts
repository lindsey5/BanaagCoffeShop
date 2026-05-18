import { useQuery } from "@tanstack/react-query";
import type { GetInventoryByIdResponse } from "../../types/inventory.type";
import { inventoryService } from "../../services/inventoryService";

export const useGetInventoryById = (id: string) => (
    useQuery<GetInventoryByIdResponse, Error>({
        queryKey: [`inventory/${id}`],
        queryFn:() => inventoryService.getInventoryItemById(id),
        refetchOnWindowFocus: false,
    })
)
