import { useMutation } from "@tanstack/react-query";
import type { InventoryDTO } from "../../types/inventory.type";
import { inventoryService } from "../../services/inventoryService";

export const useCreateInventory = () => {
    return useMutation({
        mutationFn: (data: InventoryDTO) =>
            inventoryService.createInventoryItem(data),
    });
};