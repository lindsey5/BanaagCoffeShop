import PERMISSIONS from "./permissions";

const ROLES = {
    ADMIN: {
        name: "Admin",
        description: "Full access to the system",
        permissions: Object.values(PERMISSIONS),
    },

    MANAGER: {
        name: "Manager",
        description: "Manages operations, inventory, suppliers, and staff",
        permissions: [
            PERMISSIONS.DASHBOARD_VIEW,

            // Users
            PERMISSIONS.USER_READ_ALL,
            PERMISSIONS.USER_CREATE,
            PERMISSIONS.USER_UPDATE,
            PERMISSIONS.USER_DELETE,

            // Menu
            PERMISSIONS.MENU_READ_ALL,
            PERMISSIONS.MENU_CREATE,
            PERMISSIONS.MENU_UPDATE,
            PERMISSIONS.MENU_DELETE,

            // Inventory
            PERMISSIONS.INVENTORY_READ_ALL,
            PERMISSIONS.INVENTORY_CREATE,
            PERMISSIONS.INVENTORY_UPDATE,

            // Stock In
            PERMISSIONS.STOCK_IN_READ_ALL,

            // Stock Out
            PERMISSIONS.STOCK_OUT_REAL_ALL,
            PERMISSIONS.STOCK_OUT_CREATE,

            // Suppliers
            PERMISSIONS.SUPPLIER_READ_ALL,
            PERMISSIONS.SUPPLIER_CREATE,
            PERMISSIONS.SUPPLIER_UPDATE,
            PERMISSIONS.SUPPLIER_DELETE,

            // Purchase Orders
            PERMISSIONS.PURCHASE_ORDER_READ_ALL,
            PERMISSIONS.PURCHASE_ORDER_CREATE,
            PERMISSIONS.PURCHASE_ORDER_UPDATE,

            // Orders
            PERMISSIONS.ORDER_READ_ALL,
        ],
    },

    CASHIER: {
        name: "Cashier",
        description: "Handles customer orders and POS transactions",
        permissions: [
            PERMISSIONS.DASHBOARD_VIEW,

            // Orders
            PERMISSIONS.ORDER_CREATE,
            PERMISSIONS.ORDER_READ_ALL,

            // Menu
            PERMISSIONS.MENU_READ_ALL,
        ],
    },

    INVENTORY_CLERK: {
        name: "Inventory Clerk",
        description: "Handles inventory, stock movement, and suppliers",
        permissions: [
            PERMISSIONS.DASHBOARD_VIEW,

            // Inventory
            PERMISSIONS.INVENTORY_READ_ALL,
            PERMISSIONS.INVENTORY_CREATE,
            PERMISSIONS.INVENTORY_UPDATE,

            // Stock In
            PERMISSIONS.STOCK_IN_READ_ALL,

            // Stock Out
            PERMISSIONS.STOCK_OUT_REAL_ALL,
            PERMISSIONS.STOCK_OUT_CREATE,

            // Suppliers
            PERMISSIONS.SUPPLIER_READ_ALL,

            // Purchase Orders
            PERMISSIONS.PURCHASE_ORDER_READ_ALL,
            PERMISSIONS.PURCHASE_ORDER_CREATE,

            // Menu
            PERMISSIONS.MENU_READ_ALL,
        ],
    },
};

export default ROLES;