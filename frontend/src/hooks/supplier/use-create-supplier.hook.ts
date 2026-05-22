import { useMutation } from "@tanstack/react-query";
import type { SupplierDTO } from "../../types/supplier.type";
import { supplierService } from "../../services/supplierService";

export const useCreateSupplier = () => {
    return useMutation({
        mutationFn: (data: SupplierDTO) =>
            supplierService.createSupplier(data),
    });
};