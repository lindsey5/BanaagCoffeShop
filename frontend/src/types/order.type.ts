import type { Menu } from "./menu.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { ApiResponse } from "./types";
import type { User } from "./user.type";

export interface Order {
    _id: string;
    order_id: string;
    order_no: number;
    orderType: "Dine in" | "Take out" | "Delivery";
    customer_name: string;
    payment_method: 'cash' | 'e-wallet' | 'card';
    tax: number;
    discount: number;
    payment: number;
    change: number;
    subtotal: number;
    grandTotal: number;
    orderItems: OrderItem[];
    specialRequest: string;
    user_id: string;
    user: User;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    _id: string;
    order_id: string;
    menu_id: string;
    menu: Menu;
    price: number;
    quantity: number;
    total: number;
    createdAt: string;
}

export interface CreateOrderItemDTO {
    menu_id: string;
    menu: Menu;
    price: number;
    quantity: number;
    total: number;
}

export interface CreateOrderDTO {
    customer_name: string;
    orderType: "Dine in" | "Take out" | "Delivery";
    payment_method: 'cash' | 'e-wallet' | 'card';
    tax: number;
    discount: number;
    payment: number;
    change: number;
    subtotal: number;
    grandTotal: number;
    specialRequest: string;
}

export interface CreateOrderPayload {
    order: CreateOrderDTO;
    orderItems: CreateOrderItemDTO[];
}

export interface CreateOrderResponse extends ApiResponse{
    order: Order;
}

export interface GetTotalOrdersResponse extends ApiResponse {
    total: number;
}

export interface GetOrdersParams extends PaginationParams {
    search: string;
    startDate: string;
    endDate: string;
    paymentMethod: string;
}

export interface GetOrdersResponse extends PaginationResponse {
    orders: Order[];
}

export interface GetOrderMonthlySalesResponse {
    success: boolean;
    monthlySales: { month: string, totalSales: number }[];
    year: number;
}

export interface GetOrderSalesByPeriodResponse {
    success: boolean;
    sales: number;
}

export type Period = "today" | "this-week" | "this-month" | "this-year";