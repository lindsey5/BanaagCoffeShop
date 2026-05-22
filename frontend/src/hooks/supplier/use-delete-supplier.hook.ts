import { useMutation } from "@tanstack/react-query";
import { supplierService } from "../../services/supplierService";

export const useDeleteSupplier = () => {
    return useMutation({
        mutationFn: (id: string) =>
            supplierService.deleteSupplier(id),
    });
};