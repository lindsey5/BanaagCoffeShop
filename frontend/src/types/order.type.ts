import type { Menu } from "./menu.type";

export interface Order {
    _id: string;
    order_id: string;
    payment_method: 'cash' | 'e-wallet' | 'card';
    tax: number;
    discount: number;
    change: number;
    subtotal: number;
    grandTotal: number;
    orderItems: OrderItem[];
    
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    _id: string;
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