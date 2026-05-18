import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getKeyByValue(
    obj: Record<string, any>,
    target: any
) {
    return Object.keys(obj).find(key => {
        const value = obj[key]
        return (
            value.sortBy === target.sortBy &&
            value.order === target.order
        )
    })
}
