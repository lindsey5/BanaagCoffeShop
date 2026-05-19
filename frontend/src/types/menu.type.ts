import type { InventoryItem } from "./inventory.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { ApiResponse } from "./types";

export interface MenuIngredient {
    _id: string;
    inventory_item_id: string;
    inventoryItem: InventoryItem;
    amount: number;
    unit: "g" | "kg" | "ml" | "l" | "pcs";
}

export interface Menu {
    _id: string;
    code: string;
    name: string;
    category: string;
    price: number;
    image_url: string;
    image_public_id: string;
    menuIngredients: MenuIngredient[];
    status: "available" | "unavailable" | "deleted";
    createdAt: string;
    updatedAt: string;
}

export interface GetMenusParams extends PaginationParams {
    category: string;
    sort: string;
    order: 'asc' | 'desc';
    search: string;
}

export interface GetMenusResponse extends PaginationResponse {
    menus: Menu[];
}

export interface MenuIngredientDTO  {
    inventory_item_id: string;
    unit: string;
    amount: number;
}

export interface MenuDTO {
    code: string;
    name: string;
    category: string;
    price: number;
    menuIngredients: MenuIngredientDTO[];
}

export interface CreateMenuResponse extends ApiResponse {
    menu: Menu;
}