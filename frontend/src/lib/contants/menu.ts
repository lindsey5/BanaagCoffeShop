import type { SortOption } from "../../types/types";

export const menuCategories = [
    "Hot Coffee",
    "Iced Coffee",
    "Bread & Pastries",
]

export const menuCategoryOptions = menuCategories.map(cat => ({ label: cat, value: cat }));

export const units = ["g", "kg", "ml", "l", "pcs"];

export const unitOptions = units.map(u => ({ label: u, value: u }));

export const menuFilterOptions :  Record<string, SortOption> = {
    'Newest': { sort: 'createdAt', order: 'desc' },
    'Oldest': { sort: 'createdAt', order: 'asc' },
    'A-Z' : { sort: 'name', order: 'asc' },
    'Z-A' : { sort: 'name', order: 'desc' }
}