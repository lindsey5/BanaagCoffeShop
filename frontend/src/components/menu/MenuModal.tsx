import { zodResolver } from "@hookform/resolvers/zod";
import type { Menu, MenuIngredientDTO } from "../../types/menu.type";
import { WhiteCard } from "../ui/Card";
import Modal from "../ui/Modal";
import { menuSchema, type MenuFormData } from "../../schemas/menuSchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import TextField from "../ui/Textfield";
import { Plus, X } from "lucide-react";
import Dropdown from "../ui/Dropdown";
import { menuCategoryOptions } from "../../lib/contants/menu";
import AddMenuIngredient from "./AddMenuIngredient";
import Button from "../ui/Button";
import { useState } from "react";
import { errorToast, promiseToast } from "../../utils/sileo";
import Ingredient from "./Ingredient";
import { useCreateMenu } from "../../hooks/menu/use-create-menu.hook";

interface MenuModalProps {
    close: () => void;
    show: boolean;
    selectedMenu: Menu | null;
}

export default function MenuModal ({ close, show, selectedMenu } : MenuModalProps) {
    const [showAdd, setShowAdd] = useState(false);
    const createMenuMutation = useCreateMenu();
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<MenuFormData>({
        resolver: zodResolver(menuSchema),
        defaultValues: {
            menuIngredients: []
        }
    });

    const handleClose = () => {
        close();
        reset({
            name: undefined,
            category: undefined,
            code: undefined,
            menuIngredients: [],
            price: undefined
        })
    }

    const handleAddIngredient = (ingredient : MenuIngredientDTO) => {
        if(watch('menuIngredients').find(i => ingredient.inventory_item_id === i.inventory_item_id)){
            errorToast('Duplicate Error', 'Ingredient already added');
            return;
        }
        setValue('menuIngredients', [...watch('menuIngredients'), ingredient ])
    }

    const onSubmit : SubmitHandler<MenuFormData> = (data) => {
        const isConfirmed = confirm(selectedMenu 
            ? "Are you sure you want to update this menu?"
            : "Are you sure you want to create this menu?"
        )

        if(!isConfirmed) return;

        promiseToast(createMenuMutation.mutateAsync(data))
    }

    const handleRemove = (id: string) => {
        const isConfirmed = confirm('Are you sure you want to remove this ingredient?');

        if(!isConfirmed) return;

        setValue('menuIngredients', watch('menuIngredients').filter(ingredient => ingredient.inventory_item_id !== id))
    }

    return (
        <>
            <AddMenuIngredient show={showAdd} close={() => setShowAdd(false)} handleAdd={handleAddIngredient}/>
            <Modal
                onClose={handleClose}
                open={show}
            >
                <WhiteCard>
                    <form 
                        className="max-h-[90vh] overflow-y-auto space-y-3 relative"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h1 className="font-bold text-xl">{selectedMenu ? 'Update Menu' : 'Create Menu' }</h1>
                        <button type="button" className="absolute top-0 right-0 cursor-pointer" onClick={handleClose}>
                            <X size={20} />
                        </button>
                        <div className="grid md:grid-cols-2 gap-2">
                            <TextField 
                                label="Code"
                                placeholder="Enter code"
                                registration={register('code')}
                                error={errors.code?.message}
                            />
                            <TextField 
                                label="Name"
                                placeholder="Enter name"
                                registration={register('name')}
                                error={errors.name?.message}
                            />
                            <TextField 
                                label="Price"
                                placeholder="Enter price"
                                type="number"
                                registration={register('price', { valueAsNumber: true })}
                                error={errors.price?.message}
                            />
                            <Dropdown 
                                label="Category"
                                options={menuCategoryOptions}
                                onChange={(value) => setValue('category', value)}
                                value={watch('category')}
                                error={errors.category?.message}
                            />
                        </div>
                        <h2>Ingredients</h2>
                        {watch('menuIngredients').length > 0 ? (
                            <div className="mt-3 p-3 rounded-md bg-panel border border-hover space-y-2">
                                {watch('menuIngredients').map(ingredient => (
                                    <Ingredient ingredient={ingredient} remove={handleRemove}/>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs">No ingredients yet.</p>
                        )}
                        <p className="text-red-500 text-xs">{errors.menuIngredients?.message}</p>
                        <button
                            type="button"
                            className="flex-1 cursor-pointer rounded-md p-2 hover:bg-hover flex justify-center items-center gap-2 text-sm"
                            onClick={() => setShowAdd(true)}
                        >
                            <Plus size={18} />
                            Add Ingredient
                        </button>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="px-6 py-2 text-sm"
                            >
                                {selectedMenu ? 'Save' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </WhiteCard>
            </Modal>
        </>
    )
}