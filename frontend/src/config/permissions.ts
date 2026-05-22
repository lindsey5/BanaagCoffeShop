export const PERMISSIONS = {
    DASHBOARD_VIEW: 'dashboard:view',

    // Menu management
    MENU_READ_ALL: 'menu:read:all',
    MENU_CREATE: 'menu:create',
    MENU_UPDATE: 'menu:update',
    MENU_DELETE: 'menu:delete',

    // Inventory management
    INVENTORY_READ_ALL: 'inventory:read:all',
    INVENTORY_CREATE: 'inventory:create',
    INVENTORY_UPDATE: 'inventory:update',
    INVENTORY_DELETE: 'inventory:delete',

    // Stock Out management
    STOCK_OUT_READ_ALL: 'stock-out:read:all',
    STOCK_OUT_CREATE: 'stock-out:create',

    // Stock In management
    STOCK_IN_READ_ALL: 'stock-in:read:all',

    // Supplier management
    SUPPLIER_READ_ALL: 'supplier:read:all',
    SUPPLIER_CREATE: 'supplier:create',
    SUPPLIER_UPDATE: 'supplier:update',
    SUPPLIER_DELETE: 'supplier:delete',

    // Purchase Order management
    PURCHASE_ORDER_READ_ALL: 'purchase-order:read:all',
    PURCHASE_ORDER_CREATE: 'purchase-order:create',
    PURCHASE_ORDER_UPDATE: 'purchase-order:update',

    // Order management
    ORDER_READ_ALL: 'order:read:all',
    ORDER_CREATE: 'order:create',

    // Role management
    ROLE_CREATE: 'role:create',
    ROLE_READ_ALL: 'role:read:all',
    ROLE_UPDATE: 'role:update',
    ROLE_DELETE: 'role:delete',

    // User management
    USER_CREATE: 'user:create',
    USER_READ_ALL: 'user:read:all',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',
};

type PermissionGroup = {
    description: string;
    [permissionKey: string]: string;
};

export const PERMISSION_DESCRIPTIONS: Record<string, PermissionGroup> = {
    Dashboard: {
        description: "Control access to dashboard features and reports.",
        DASHBOARD_VIEW: "View dashboard",
    },

    "Menu Management": {
        description: "Manage menu products and categories.",
        MENU_READ_ALL: "View all menu",
        MENU_CREATE: "Create menu",
        MENU_UPDATE: "Update menu",
        MENU_DELETE: "Delete menu",
    },

    "Inventory Management": {
        description: "Manage inventory stocks and inventory records.",
        INVENTORY_READ_ALL: "View inventory items",
        INVENTORY_CREATE: "Create inventory item",
        INVENTORY_UPDATE: "Update inventory item",
        INVENTORY_DELETE: "Delete inventory item",

        STOCK_OUT_CREATE: "Create stock out",
        STOCK_OUT_READ_ALL: "View stock out history",

        STOCK_IN_READ_ALL: "View stock in history",
    },

    "Supplier Management": {
        description: "Manage suppliers and supplier records.",
        SUPPLIER_READ_ALL: "View suppliers",
        SUPPLIER_CREATE: "Create supplier",
        SUPPLIER_UPDATE: "Update supplier",
        SUPPLIER_DELETE: "Delete supplier",
    },

    "Purchase Order Management": {
        description: "Manage purchase orders and procurement records.",
        PURCHASE_ORDER_READ_ALL: "View purchase orders",
        PURCHASE_ORDER_CREATE: "Create purchase order",
        PURCHASE_ORDER_UPDATE: "Update purchase order",
    },

    "Order Management": {
        description: "Manage POS transactions and order history.",
        ORDER_READ_ALL: "View order history",
        ORDER_CREATE: "Create order transaction",
    },

    "User Management": {
        description: "Manage system users and staff accounts.",
        USER_CREATE: "Create users",
        USER_READ_ALL: "View all users",
        USER_UPDATE: "Update users",
        USER_DELETE: "Delete users",
    },

    "Role Management": {
        description: "Manage roles and access permissions.",
        ROLE_CREATE: "Create roles",
        ROLE_READ_ALL: "View all roles",
        ROLE_UPDATE: "Update roles",
        ROLE_DELETE: "Delete roles",
    },
};

export const getPermissionKey = (value: string) => {
    return Object.keys(PERMISSIONS).find(
        key => PERMISSIONS[key as keyof typeof PERMISSIONS] === value
    );
};