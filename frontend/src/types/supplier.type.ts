import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { ApiResponse } from "./types";

export interface Supplier {
    _id: string;
    code: string;
    name: string;
    phone?: string;
    email?: string;
    status: "active" | "deleted";
    category: string;
    createdAt: string;
    updatedAt: string;
}

export interface SupplierDTO {
    code: string;
    name: string;
    category: string;
    phone?: string;
    email?: string;
}

export interface SupplierResponse extends ApiResponse {
    supplier: Supplier;
}

export interface GetSuppliersParams extends PaginationParams {
    search: string;
    category: string;
}

export interface GetSuppliersResponse extends PaginationResponse {
    suppliers: Supplier[];
}