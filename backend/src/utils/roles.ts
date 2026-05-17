import PERMISSIONS from "./permissions";

const ROLES = {
    ADMIN: {
        name: "Admin",
        description: "Full access to the system",
        permissions: Object.values(PERMISSIONS),
    },

    MANAGER: {
        name: "Manager",
        description: "Manages sales, menu, inventory, and staff operations",
        permissions: [
            PERMISSIONS.DASHBOARD_VIEW,

            // Menu
            PERMISSIONS.MENU_READ_ALL,
            PERMISSIONS.MENU_CREATE,
            PERMISSIONS.MENU_UPDATE,
            PERMISSIONS.MENU_DELETE,

            // Inventory
            PERMISSIONS.INVENTORY_READ_ALL,
            PERMISSIONS.INVENTORY_CREATE,
            PERMISSIONS.INVENTORY_UPDATE,
            PERMISSIONS.INVENTORY_DELETE,

            // Users
            PERMISSIONS.USER_READ_ALL,
            PERMISSIONS.USER_UPDATE,

            // Roles
            PERMISSIONS.ROLE_READ_ALL,

            // Orders
            PERMISSIONS.ORDER_READ_ALL,
            PERMISSIONS.ORDER_CREATE,
        ],
    },

    CASHIER: {
        name: "Cashier",
        description: "Handles POS transactions and customer orders",
        permissions: [
            PERMISSIONS.DASHBOARD_VIEW,

            // Orders
            PERMISSIONS.ORDER_CREATE,
            PERMISSIONS.ORDER_READ_ALL,

            // Menu (view only)
            PERMISSIONS.MENU_READ_ALL,
        ],
    },

    INVENTORY_CLERK: {
        name: "Inventory Clerk",
        description: "Manages inventory stocks and updates inventory records",
        permissions: [
            PERMISSIONS.DASHBOARD_VIEW,

            // Inventory
            PERMISSIONS.INVENTORY_READ_ALL,
            PERMISSIONS.INVENTORY_CREATE,
            PERMISSIONS.INVENTORY_UPDATE,

            // Menu (view only)
            PERMISSIONS.MENU_READ_ALL,
        ],
    },
};

export default ROLES;