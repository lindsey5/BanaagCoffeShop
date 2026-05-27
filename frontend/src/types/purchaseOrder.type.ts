import type { InventoryItem } from "./inventory.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Supplier } from "./supplier.type";
import type { ApiResponse } from "./types";

export interface PurchaseOrderItem {
    inventory_item_id: string;
    inventoryItem: InventoryItem;

    quantity: number;
    unit: "kg" | "g" | "ml" | "l" | "pcs";

    // Example:
    // base_quantity = 100
    // base_unit = "ml"
    // unit_cost = 20
    // Means: ₱20 per 100ml
    unit_cost: number;
    base_quantity: number;

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

    // pricing definition (₱20 per 100ml, etc.)
    unit_cost: number;
    base_quantity: number;

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