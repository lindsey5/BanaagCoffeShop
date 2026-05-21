import type { InventoryItem } from "./inventory.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";

export interface StockOut {
    _id: string;
    stock_out_id: string;
    inventory_item_id: string;
    inventoryItem: InventoryItem;
    quantity: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs";
    transaction_type: "sale" | "damage" | "expired" | "adjustment";
    createdAt: string;
}

export interface GetStockOutHistoryParams extends PaginationParams {
    search: string;
    transactionType: string;
    category: string;
    startDate: string;
    endDate: string;
}

export interface GetStockOutHistoryResponse extends PaginationResponse {
    stockOuts: StockOut[];
}