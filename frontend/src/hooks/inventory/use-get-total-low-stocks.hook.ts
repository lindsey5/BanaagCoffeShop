import { useQuery } from "@tanstack/react-query";
import type { GetTotalInventoryItemsResponse } from "../../types/inventory.type";
import { inventoryService } from "../../services/inventoryService";

export const useGetLowStockItems = () => (
    useQuery<GetTotalInventoryItemsResponse, Error>({
        queryKey: [`inventory/low-stocks`],
        queryFn:() => inventoryService.getTotalLowStockItems(),
        refetchOnWindowFocus: false,
    })
)
