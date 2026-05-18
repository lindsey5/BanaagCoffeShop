import { useQuery } from "@tanstack/react-query";
import type { GetInventoryParams, GetInventoryResponse } from "../../types/inventory.type";
import { inventoryService } from "../../services/inventoryService";

export const useGetInventory = (params: GetInventoryParams) => (
    useQuery<GetInventoryResponse, Error>({
        queryKey: ['inventory', params],
        queryFn:() => inventoryService.getInventoryItems(params),
        refetchOnWindowFocus: false,
    })
)
