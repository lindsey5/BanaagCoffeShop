
const PERMISSIONS = {
    DASHBOARD_VIEW: 'dashboard:view',

    // User management
    USER_CREATE: 'user:create',
    USER_READ_ALL: 'user:read:all',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',

    // Role management
    ROLE_CREATE: 'role:create',
    ROLE_READ_ALL: 'role:read:all',
    ROLE_UPDATE: 'role:update',
    ROLE_DELETE: 'role:delete',

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

    STOCK_OUT_READ_ALL: 'stock-out:read:all',
    STOCK_OUT_CREATE: 'stock-out:create',

    STOCK_IN_READ_ALL: 'stock-in:read:all',

    SUPPLIER_READ_ALL: 'supplier:read:all',
    SUPPLIER_CREATE: 'supplier:create',
    SUPPLIER_UPDATE: 'supplier:update',
    SUPPLIER_DELETE: 'supplier:delete',

    PURCHASE_ORDER_READ_ALL: 'purchase-order:read:all',
    PURCHASE_ORDER_CREATE: 'purchase-order:create',
    PURCHASE_ORDER_UPDATE: 'purchase-order:update',

    ORDER_CREATE: 'order:create',
    ORDER_READ_ALL: 'order:read:all',
}

export default PERMISSIONS;