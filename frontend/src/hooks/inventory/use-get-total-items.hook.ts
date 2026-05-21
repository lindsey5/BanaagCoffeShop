import { useQuery } from "@tanstack/react-query";
import type { GetTotalInventoryItemsResponse } from "../../types/inventory.type";
import { inventoryService } from "../../services/inventoryService";

export const useGetTotalItems = () => (
    useQuery<GetTotalInventoryItemsResponse, Error>({
        queryKey: [`inventory/total`],
        queryFn:() => inventoryService.getTotalInventoryItems(),
        refetchOnWindowFocus: false,
    })
)
