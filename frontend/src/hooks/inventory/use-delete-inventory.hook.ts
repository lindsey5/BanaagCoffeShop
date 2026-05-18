import { useMutation } from "@tanstack/react-query";
import { inventoryService } from "../../services/inventoryService";

export const useDeleteInventory = () => {
    return useMutation({
        mutationFn: (id: string) =>
            inventoryService.deleteInventoryItem(id),
    });
};