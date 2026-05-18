import { useGetInventoryById } from "../../hooks/inventory/use-get-inventory-by-id.hook";
import type { MenuIngredientDTO } from "../../types/menu.type";

export default function Ingredient ({ ingredient, remove } : { ingredient: MenuIngredientDTO, remove: (id: string) => void }) {
    const { data } = useGetInventoryById(ingredient.inventory_item_id);

    if(!data?.inventoryItem) return null;

    return (
        <div className="flex justify-between items-center text-xs">
            <p>{data.inventoryItem.name} {ingredient.amount}{ingredient.unit.toUpperCase()}</p>
            <button className="cursor-pointer" onClick={() => remove(ingredient.inventory_item_id)}>Remove</button>
        </div>
    )
}