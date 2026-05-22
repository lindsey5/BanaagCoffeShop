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
    'Name (A-Z)' : { sort: 'name', order: 'asc' },
    'Name (Z-A)' : { sort: 'name', order: 'desc' },
    'Code (A-Z)' : { sort: 'code', order: 'asc' },
    'Code (Z-A)' : { sort: 'code', order: 'desc' },
}

export const menuStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Available', value: 'available' },
    { label: 'Unavailable', value: 'unavailable' },
]