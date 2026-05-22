import { useQuery } from "@tanstack/react-query";
import type { GetSuppliersParams, GetSuppliersResponse } from "../../types/supplier.type";
import { supplierService } from "../../services/supplierService";

export const useGetSuppliers = (params: GetSuppliersParams) => (
    useQuery<GetSuppliersResponse, Error>({
        queryKey: ['suppliers', params],
        queryFn:() => supplierService.getSuppliers(params),
        refetchOnWindowFocus: false,
    })
)
