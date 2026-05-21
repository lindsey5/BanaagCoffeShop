export const categories = [
    "Coffee Ingredients",
    "Baking Ingredients",
    "Sweeteners Ingredients",
    "Dairy Ingredients",
    "Flavor Toppings Ingredients",
    "Operational Supplies"
]

export const categoryOptions = categories.map(cat => ({ label: cat, value: cat }));

export const inventoryStatusOptions = [
    { label: 'All', value: '' },
    { label: 'In Stock', value: 'in-stock' },
    { label: 'Low Stock', value: 'low-stock' },
    { label: 'Out of Stock', value: 'out-of-stock'}
]

export const transactionTypeOptions = [
    { label: 'All', value: '' },
    { label: 'Sale', value: 'sale' },
    { label: 'Damage', value: 'damage' },
    { label: 'Expired', value: 'expired' },
    { label: 'Adjustment', value: 'adjustment' }
]