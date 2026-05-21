import { useGetInventoryById } from "../../hooks/inventory/use-get-inventory-by-id.hook";
import type { MenuIngredientDTO } from "../../types/menu.type";

export default function Ingredient ({ ingredient, remove } : { ingredient: MenuIngredientDTO, remove: (id: string) => void }) {
    const { data } = useGetInventoryById(ingredient.inventory_item_id);

    const handleRemove = () => {
        remove(ingredient.inventory_item_id)
    }

    if(!data?.inventoryItem) return null;

    return (
        <div className="flex justify-between items-center">
            <p className="text-sm">{data.inventoryItem.name} {ingredient.amount}{ingredient.unit.toUpperCase()}</p>
            <button className="text-xs cursor-pointer" onClick={handleRemove}>Remove</button>
        </div>
    )
}