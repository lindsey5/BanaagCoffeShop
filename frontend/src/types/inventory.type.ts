import type { PaginationParams, PaginationResponse } from "./pagination.type";

export interface InventoryItem {
    _id: string;
    name: string;
    quantity: number;
    unit: "g" | "ml" | "pcs";
    threshold: number;
    status: 'active' | 'deleted';
    createdAt: string;
    updatedAt: string;
}

export interface CreateInventoryDTO {
    name: string;
    quantity: number;
    unit: "g" | "ml" | "pcs";
    threshold: number;
}

export interface GetInventoryParams extends PaginationParams {
    search: string;
    sort: string;
    order: 'asc' | 'desc'
}

export interface GetInventoryResponse extends PaginationResponse {
    inventoryItems: InventoryItem[];
}