import type { InventoryItem } from "./inventory.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Supplier } from "./supplier.type";

export interface StockIn {
    _id: string;
    stock_in_id: string;
    supplier_id: string;
    inventory_item_id: string;
    supplier: Supplier;
    inventoryItem: InventoryItem;
    quantity: number;
    unit_cost: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs"; 
    total_cost: number;
    createdAt: string;
}

export interface GetStockInHistoryParams extends PaginationParams {
    search: string;
    startDate: string;
    endDate: string;
    category: string;
}

export interface GetStockInHistoryResponse extends PaginationResponse {
    stockIns: StockIn[];
}