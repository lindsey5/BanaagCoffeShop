import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetSuppliersParams, GetSuppliersResponse, SupplierDTO, SupplierResponse } from "../types/supplier.type";

const baseUrl = 'suppliers'

export const supplierService = {
    getSuppliers: (params : GetSuppliersParams) =>
        apiAxios<GetSuppliersResponse>(`${baseUrl}`, {
            method: HttpMethod.GET,
            params
        }),

    createSupplier: (data : SupplierDTO) =>
        apiAxios<SupplierResponse>(`${baseUrl}`, {
            method: HttpMethod.POST,
            data
        }),

    updateSupplier: (data : SupplierDTO, id: string) =>
        apiAxios<SupplierResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.PUT,
            data
        }),

    deleteSupplier: (id: string) =>
        apiAxios<SupplierResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.DELETE,
        }),
};