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

    // User management
    USER_CREATE: 'user:create',
    USER_READ: 'user:read',
    USER_READ_ALL: 'user:read:all',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',

    // Role management
    ROLE_CREATE: 'role:create',
    ROLE_READ_ALL: 'role:read:all',
    ROLE_UPDATE: 'role:update',
    ROLE_DELETE: 'role:delete',

    // Order management
    ORDER_READ_ALL: 'order:read:all',
    ORDER_CREATE: 'order:create',
};

type PermissionGroup = {
    description: string;
    [permissionKey: string]: string;
};

export const PERMISSION_DESCRIPTIONS: Record<string, PermissionGroup> = {
    Dashboard: {
        description: "Control access to dashboard features and summary reports.",
        DASHBOARD_VIEW: "View the dashboard",
    },

    "Menu Management": {
        description: "Manage menu items including viewing, adding, editing, and removing menu products.",
        MENU_READ_ALL: "View all menu items",
        MENU_CREATE: "Add new menu item",
        MENU_UPDATE: "Update menu item details",
        MENU_DELETE: "Delete menu item",
    },

    "Inventory Management": {
        description: "Manage inventory items including stock monitoring and inventory updates.",
        INVENTORY_READ_ALL: "View all inventory items",
        INVENTORY_CREATE: "Add new inventory items",
        INVENTORY_UPDATE: "Update inventory item details",
        INVENTORY_DELETE: "Delete inventory item",
    },

    "User Management": {
        description: "Manage system users including creating, updating, and deleting accounts.",
        USER_CREATE: "Create new users",
        USER_READ: "View user details",
        USER_READ_ALL: "View all users",
        USER_UPDATE: "Update user details",
        USER_DELETE: "Delete users",
    },

    "Role Management": {
        description: "Manage roles and configure permission-based access control.",
        ROLE_CREATE: "Create new roles",
        ROLE_READ_ALL: "View all roles",
        ROLE_UPDATE: "Update role details",
        ROLE_DELETE: "Delete roles",
    },

    "Order Management": {
        description: "Manage orders by creating transactions and viewing sales records.",
        ORDER_READ_ALL: "View all orders",
        ORDER_CREATE: "Access the POS and create an order",
    },
};

export const getPermissionKey = (value: string) => {
    return Object.keys(PERMISSIONS).find(
        key => PERMISSIONS[key as keyof typeof PERMISSIONS] === value
    );
};