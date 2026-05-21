import { useQuery } from "@tanstack/react-query";
import type { GetTotalInventoryItemsResponse } from "../../types/inventory.type";
import { inventoryService } from "../../services/inventoryService";

export const useGetTotalOutOfStocks = () => (
    useQuery<GetTotalInventoryItemsResponse, Error>({
        queryKey: [`inventory/out-of-stocks`],
        queryFn:() => inventoryService.getTotalOutOfStocks(),
        refetchOnWindowFocus: false,
    })
)
