import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useGetInventoryById } from "../../hooks/inventory/use-get-inventory-by-id.hook";
import type { CreateMenuFormData, UpdateMenuFormData } from "../../schemas/menuSchema";
import type { MenuIngredientDTO } from "../../types/menu.type";

interface IngredientProps { 
    ingredient: MenuIngredientDTO; 
    setValue: UseFormSetValue<CreateMenuFormData | UpdateMenuFormData>;
    watch: UseFormWatch<CreateMenuFormData | UpdateMenuFormData>;
}

export default function Ingredient ({ ingredient, setValue, watch } : IngredientProps) {
    const { data } = useGetInventoryById(ingredient.inventory_item_id);

    if(!data?.inventoryItem) return null;

    const handleRemove = () => {
        const id = ingredient.inventory_item_id;

        const isConfirmed = confirm('Are you sure you want to remove this ingredient?');

        if(!isConfirmed) return;

        setValue('menuIngredients', watch('menuIngredients').filter(ingredient => ingredient.inventory_item_id !== id))
    }

    return (
        <div className="flex justify-between items-center">
            <p className="text-sm">{data.inventoryItem.name} {ingredient.amount}{ingredient.unit.toUpperCase()}</p>
            <button className="text-xs cursor-pointer" onClick={handleRemove}>Remove</button>
        </div>
    )
}