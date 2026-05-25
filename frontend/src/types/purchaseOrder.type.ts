import type { InventoryItem } from "./inventory.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Supplier } from "./supplier.type";
import type { ApiResponse } from "./types";

export interface PurchaseOrderItem {
    inventory_item_id: string;
    inventoryItem: InventoryItem;
    quantity: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs"; 
    total_cost: number;
}

export interface PurchaseOrder {
    _id: string;
    poNumber: string;
    supplier_id: string;
    supplier: Supplier;
    items: PurchaseOrderItem[];
    status: "pending" | "received" | "cancelled";
    grandTotal: number;
    notes?: string;
    dateReceived: string;
    createdAt: string;
}

export interface CreatePurchaseOrderItemDTO {
    inventory_item_id: string;
    quantity: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs"; 
    total_cost: number;
}

export interface CreatePurchaseOrderDTO {
    supplier_id: string;
    items: CreatePurchaseOrderItemDTO[];
    grandTotal: number;
    notes?: string;
}

export interface GetPurchaseOrdersParams extends PaginationParams {
    search: string;
    status: string;
    startDate: string;
    endDate: string;
}

export interface GetPurchaseOrdersRespose extends PaginationResponse {
    purchaseOrders: PurchaseOrder[];
}

export interface PurchaseOrderResponse extends ApiResponse{
    purchaseOrder: PurchaseOrder;
}