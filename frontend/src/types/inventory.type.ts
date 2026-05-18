import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { ApiResponse } from "./types";

export interface InventoryItem {
    _id: string;
    code: string;
    name: string;
    brand: string;
    category: string;
    quantity: number;
    unit: "g" | "kg" | "ml" | "l" | "pcs";
    threshold: number;
    status: 'active' | 'deleted';
    createdAt: string;
    updatedAt: string;
}

export interface InventoryDTO {
    code: string;
    name: string;
    brand: string;
    category: string;
    quantity: number;
    unit: string;
    threshold: number;
}

export interface InventoryResponse extends ApiResponse {
    inventoryItem: InventoryItem;
}

export interface GetInventoryParams extends PaginationParams {
    search: string;
    sort: string;
    order: string;
    category: string;
}

export interface GetInventoryResponse extends PaginationResponse {
    inventoryItems: InventoryItem[];
}