import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SortOption } from "../types/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getKeyByValue(
  obj: Record<string, SortOption>,
  target: SortOption
) {
    return Object.entries(obj).find(([_, value]) => {
        return value.sort === target.sort && value.order === target.order;
    })?.[0];
}

export function formatToPeso (num : number) {
    const formatted = num.toLocaleString('en-us', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `₱ ${formatted}`;
}

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
        resolve(reader.result as string);
        };

        reader.onerror = (error) => {
        reject(error);
        };

        reader.readAsDataURL(file); 
    });
};

export const kgToGram = (kg: number) => kg * 1000;

export const lToMl = (l: number) => l * 1000;