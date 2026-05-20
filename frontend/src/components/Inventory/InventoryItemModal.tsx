import { X } from "lucide-react";
import type { InventoryItem } from "../../types/inventory.type";
import { WhiteCard } from "../ui/Card";
import Modal from "../ui/Modal";
import TextField from "../ui/Textfield";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema, type InventoryFormData } from "../../schemas/inventorySchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import { useCreateInventory } from "../../hooks/inventory/use-create-inventory.hook";
import { promiseToast } from "../../utils/sileo";
import { useUpdateInventory } from "../../hooks/inventory/use-update-inventory.hook";
import { categoryOptions } from "../../lib/contants/inventory";
import { useEffect } from "react";

interface InventoryModalProps {
    show: boolean;
    close: () => void;
    inventoryItem: InventoryItem | null;
}

export default function InventoryItemModal ({ close, inventoryItem, show } : InventoryModalProps) {
    const createInventoryMutation = useCreateInventory();
    const updateInventoryMutation = useUpdateInventory();
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<InventoryFormData>({
        resolver: zodResolver(inventorySchema),
        defaultValues: {
            quantity: 0,
            threshold: 0,
        }
    });

    const onSubmit: SubmitHandler<InventoryFormData> = (data) => {
        const isConfirmed = confirm(
            inventoryItem
                ? "Are you sure you want to update this item?"
                : "Are you sure you want to create this item?"
        );

        if (!isConfirmed) return;


        inventoryItem ?  
            promiseToast(updateInventoryMutation.mutateAsync({ data, id: inventoryItem._id })) : 
            promiseToast(createInventoryMutation.mutateAsync(data))
    }

    const handleClose = () => {
        close();
        reset({
            name: undefined,
            brand: undefined,
            category: undefined,
            code: undefined,
            quantity: 0,
            threshold: 0,
            unit: undefined
        })
    }

    useEffect(() => {
        if(inventoryItem) reset({ ...inventoryItem, quantity: Number(inventoryItem.quantity.toFixed(2)) })
    }, [inventoryItem])
    
    return (
        <Modal
            onClose={handleClose}
            open={show}
        >
            <WhiteCard>
                <form className="space-y-3 relative" onSubmit={handleSubmit(onSubmit)}> 
                    <h1 className="font-bold text-xl">{inventoryItem ? 'Update Item' : 'Add Item' }</h1>
                    <button className="absolute top-0 right-0 cursor-pointer" onClick={handleClose}>
                        <X size={20} />
                    </button>
                    <TextField 
                        label="Code"
                        placeholder="Enter code"
                        registration={register('code')}
                        error={errors.code?.message}
                    />
                    <TextField 
                        label="Item Name"
                        placeholder="Enter item name"
                        registration={register('name')}
                        error={errors.name?.message}
                    />
                    <div className="flex gap-3 items-center">
                        <TextField 
                            label="Brand"
                            className="w-full lg:w-1/2"
                            placeholder="Enter brand"
                            registration={register('brand')}
                            error={errors.brand?.message}
                        />
                        <Dropdown 
                            label="Category"
                            className="w-full lg:w-1/2"
                            options={categoryOptions}
                            onChange={(value) => setValue('category', value)}
                            value={watch('category')}
                            error={errors.category?.message}
                        />
                    </div>
                    <div className="flex gap-5 items-center">
                        <TextField 
                            label="Quantity"
                            placeholder="Enter quantity"
                            registration={register('quantity', { valueAsNumber: true })}
                            type="number"
                            error={errors.quantity?.message}
                        />
                        <Dropdown 
                            label="Unit"
                            className="min-w-30"
                            options={[
                                { label: 'kg', value: 'kg' },
                                { label: 'g', value: 'g' },
                                { label: 'l', value: 'l' },
                                { label: 'ml', value: 'ml' },
                                { label: 'pcs', value: 'pcs' }
                            ]}
                            onChange={(value) => setValue('unit', value)}
                            value={watch('unit')}
                            error={errors.unit?.message}
                            disabled={inventoryItem !== null}
                        />
                    </div>
                    <TextField 
                        label="Threshold"
                        placeholder="Enter threshold"
                        registration={register('threshold', { valueAsNumber: true })}
                        type="number"
                        error={errors.threshold?.message}
                    />
                    <div className="flex justify-end">
                        <Button className="text-sm px-5" type="submit" disabled={createInventoryMutation.isPending || updateInventoryMutation.isPending}>
                            {inventoryItem ? 'Update' : 'Create' }
                        </Button>
                    </div>
                </form>
            </WhiteCard>
        </Modal>
    )
}