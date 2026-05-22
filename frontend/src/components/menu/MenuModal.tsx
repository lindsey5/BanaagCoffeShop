import { zodResolver } from "@hookform/resolvers/zod";
import type { Menu, MenuIngredientDTO } from "../../types/menu.type";
import { WhiteCard } from "../ui/Card";
import Modal from "../ui/Modal";
import { createMenuSchema, updateMenuSchema, type CreateMenuFormData, type UpdateMenuFormData } from "../../schemas/menuSchema";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import TextField from "../ui/Textfield";
import { Plus, Upload, X, Image } from "lucide-react";
import Dropdown from "../ui/Dropdown";
import { menuCategoryOptions } from "../../lib/contants/menu";
import AddMenuIngredient from "./AddMenuIngredient";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import { errorToast, promiseToast } from "../../utils/sileo";
import Ingredient from "./Ingredient";
import { useCreateMenu } from "../../hooks/menu/use-create-menu.hook";
import { useUpdateMenu } from "../../hooks/menu/use-update-menu.hook";
import { fileToBase64 } from "../../utils/utils";

interface MenuModalProps {
    close: () => void;
    show: boolean;
    selectedMenu: Menu | null;
}

export default function MenuModal ({ close, show, selectedMenu } : MenuModalProps) {
    const [imageSrc, setImageSrc] = useState<string>();
    const [showAdd, setShowAdd] = useState(false);
    const createMenuMutation = useCreateMenu();
    const updateMenuMutation = useUpdateMenu();
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<CreateMenuFormData | UpdateMenuFormData>({
        resolver: zodResolver(selectedMenu ? updateMenuSchema : createMenuSchema) as Resolver<CreateMenuFormData | UpdateMenuFormData>,
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
        setImageSrc(undefined)
    }

    const handleAddIngredient = (ingredient : MenuIngredientDTO) => {
        if(watch('menuIngredients').find(i => ingredient.inventory_item_id === i.inventory_item_id)){
            errorToast('Duplicate Error', 'Ingredient already added');
            return;
        }
        setValue('menuIngredients', [...watch('menuIngredients'), ingredient ])
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setValue("image", file);
        try {
            const base64 = await fileToBase64(file);
            setImageSrc(base64);
        } catch (error) {
            console.error("Failed to convert file to Base64:", error);
        }
    };

    const onSubmit : SubmitHandler<CreateMenuFormData | UpdateMenuFormData> = (data) => {
        const isConfirmed = confirm(selectedMenu 
            ? "Are you sure you want to update this menu?"
            : "Are you sure you want to create this menu?"
        )

        if(!isConfirmed) return;

        const { menuIngredients, image, ...menu } = data;

        const formData = new FormData();
        formData.append('menu', JSON.stringify(menu));
        formData.append('menuIngredients', JSON.stringify(menuIngredients));
        if (image) formData.append('image', image);

        promiseToast(selectedMenu ? updateMenuMutation.mutateAsync({ data: formData, id: selectedMenu._id }) : createMenuMutation.mutateAsync(formData))
    }

    useEffect(() => {
        if(selectedMenu) {
            reset(selectedMenu);
            setImageSrc(selectedMenu.image_url);
        }
    }, [selectedMenu])

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
                        <div className="flex flex-col gap-3 items-center">
                            {imageSrc ? 
                                <img
                                    src={imageSrc}
                                    alt="Thumbnail"
                                    className="object-cover rounded-md w-30 h-30"
                                /> : 
                                <Image className="w-30 h-30" strokeWidth={0.7}/>
                            }
                            <input
                                type="file"
                                accept="image/*"
                                id="thumbnail"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <label htmlFor="thumbnail" className="cursor-pointer">
                                <span className="border text-sm inline-flex items-center gap-2 px-4 py-2 rounded">
                                    <Upload size={16} />
                                    Upload Image
                                </span>
                            </label>
                            <p className="text-red-500 text-xs">{errors.image?.message}</p>
                        </div>
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
                            <div className="mt-3 p-3 rounded-md bg-panel border border-hover space-y-3">
                                {watch('menuIngredients').map(ingredient => (
                                    <Ingredient 
                                        key={ingredient.inventory_item_id} 
                                        ingredient={ingredient} 
                                        setValue={setValue}
                                        watch={watch}
                                    />
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
                                disabled={updateMenuMutation.isPending || createMenuMutation.isPending}
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