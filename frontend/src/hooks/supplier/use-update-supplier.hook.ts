import { useMutation } from "@tanstack/react-query";
import type { SupplierDTO } from "../../types/supplier.type";
import { supplierService } from "../../services/supplierService";

export const useUpdateSupplier = () => {
    return useMutation({
        mutationFn: ({ data, id } : { data: SupplierDTO, id: string }) =>
            supplierService.updateSupplier(data, id),
    });
};