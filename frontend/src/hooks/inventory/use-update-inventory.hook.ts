import { useMutation } from "@tanstack/react-query";
import type { InventoryDTO } from "../../types/inventory.type";
import { inventoryService } from "../../services/inventoryService";

export const useUpdateInventory = () => {
    return useMutation({
        mutationFn: ({ data, id } : {data: InventoryDTO, id: string }) =>
            inventoryService.updateInventoryItem(data, id),
    });
};