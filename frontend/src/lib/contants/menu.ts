export const menuCategories = [
    "Hot Coffee",
    "Iced Coffee",
    "Bread & Pastries",
]

export const menuCategoryOptions = menuCategories.map(cat => ({ label: cat, value: cat }));

export const units = ["g", "kg", "ml", "l", "pcs"];

export const unitOptions = units.map(u => ({ label: u, value: u }));