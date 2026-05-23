import { useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import type { Supplier } from "../../types/supplier.type";
import SelectSupplier from "../../components/create-purchase-order/SelectSupplier";
import AddItem from "../../components/create-purchase-order/AddItem";
import type { InventoryItem } from "../../types/inventory.type";
import { WhiteCard } from "../../components/ui/Card";
import Chip from "../../components/ui/Chip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createPurchaseOrderSchema, type CreatePurchaseOrderFormData } from "../../schemas/purchaseOrderSchema";
import TextField from "../../components/ui/Textfield";
import { formatToPeso } from "../../utils/utils";
import Button from "../../components/ui/Button";
import { useCreatePurchaseOrder } from "../../hooks/purchase-order/use-create-purchase-orders.hook";
import { promiseToast } from "../../utils/sileo";

export default function CreatePurchaseOrder () {
    const createPurchaseOrderMutation = useCreatePurchaseOrder();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [items, setItems] = useState<InventoryItem[]>([]);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreatePurchaseOrderFormData>({
        resolver: zodResolver(createPurchaseOrderSchema),
        defaultValues: {
            items: []
        }
    });

    const handleAdd = (item : InventoryItem) => {
        const isExisting = items.find(i => i._id === item._id);

        if(isExisting){
            setValue('items', watch('items').map(i => i.inventory_item_id === item._id ? ({
                ...i, 
                quantity: i.quantity + 1,
                total_cost: i.unit_cost * (i.quantity + 1)
                }) : i)
            )
        }else {
            setValue('items', [
                ...watch('items'), {
                    inventory_item_id: item._id,
                    unit: item.unit,
                    quantity: 0,
                    unit_cost: 0,
                    total_cost: 0,
                }
            ])
            setItems(prev => [...prev, item])
        }
    }

    const handleRemove = (id : string) => {
        setItems(prev => prev.filter(item => item._id !== id));
        setValue('items', watch('items').filter(item => item.inventory_item_id !== id));
    }

    const poItems = watch("items");

    const grandTotal = poItems.reduce((total, item) => total + (item.total_cost || 0), 0);

    const onSubmit : SubmitHandler<CreatePurchaseOrderFormData> = (data) => {
        const isConfirmed = confirm('Are you sure you want to create this purchase order?');

        if(!isConfirmed) return;

        promiseToast(createPurchaseOrderMutation.mutateAsync({
            ...data,
            grandTotal
        }), "top-center", () => window.location.href = '/dashboard/inventory/purchase-orders')
    }

    return (
        <PageContainer
            title="Create Purchase Order"
            description="Create a purchase order by selecting a supplier and adding items."
        >
            <SelectSupplier 
                supplier={supplier}
                setSupplier={setSupplier}
                setItems={setItems}
                setValue={setValue}
                error={errors.supplier_id?.message || ""}
            />
            <WhiteCard>
                <form 
                    className="space-y-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
                {supplier && (
                    <AddItem 
                        supplier={supplier}
                        handleAdd={handleAdd}
                    />
                )}
                <div className="space-y-3 pt-3 border-t border-hover">
                    <div className="flex items-center justify-between">
                        <h1 className="font-bold text-brown">
                            Items
                        </h1>

                        <p className="text-xs text-gray-500">
                            {items.length} item{items.length !== 1 && "s"}
                        </p>
                    </div>

                    {items.length < 1 ? (
                        <div className="border border-dashed border-hover rounded-lg p-6 text-center">
                            <p className="text-xs text-gray-500">
                                No items added yet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item, i)=> (
                                <div
                                    key={item._id}
                                    className="rounded-xl border border-hover bg-panel p-4 space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="font-semibold text-sm text-brown">
                                                {item.name}
                                            </h2>

                                            <p className="text-xs text-gray-500">
                                                {item.code}
                                            </p>
                                        </div>

                                        <Chip label={item.category}/>
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-3">
                                        <TextField 
                                            label="Unit Cost"
                                            placeholder="Enter unit cost"
                                            type="number"
                                            registration={register(`items.${i}.unit_cost`, {
                                                setValueAs: v => Number(v),
                                                onChange: (e) => {
                                                    const unit_cost = Number(e.target.value);
                                                    const quantity = watch(`items.${i}.quantity`) ?? 0;

                                                    setValue(`items.${i}.total_cost`, unit_cost * quantity);
                                                }
                                            })}
                                            error={errors.items ? errors.items[i]?.unit_cost?.message : ""}
                                        />
                                        <TextField 
                                            label="Quantity"
                                            placeholder="Enter quantity"
                                            type="number"
                                            registration={register(`items.${i}.quantity`, {
                                            setValueAs: v => Number(v),
                                            onChange: (e) => {
                                                const quantity = Number(e.target.value);
                                                const unit_cost = watch(`items.${i}.unit_cost`) ?? 0;

                                                setValue(`items.${i}.total_cost`, quantity * unit_cost);
                                            }
                                            })}
                                            onKeyDown={(e) => {
                                                if ((e.key === "." || e.key === "," || e.key === "e" || e.key === "-") && item.unit === 'pcs') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            error={errors.items ? errors.items[i]?.quantity?.message : ""}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-brown text-sm">
                                            Unit: {item.unit.toUpperCase()}
                                        </p>
                                        <h2 className="font-semibold text-sm text-brown">
                                            Cost: {formatToPeso(watch(`items.${i}.total_cost`))}
                                        </h2>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(item._id)}
                                            className="text-sm text-red-500 cursor-pointer"
                                        >Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <p className="text-xs text-red-500">{errors.items?.message}</p>
                <p className="font-bold">Total Cost: {formatToPeso(grandTotal)}</p>
                <div className="flex justify-end">
                    <Button
                        className="rounded-md text-sm"
                        type="submit"
                        disabled={createPurchaseOrderMutation.isPending}
                    >
                        Create Purchase Order
                    </Button>
                </div>
                </form>
            </WhiteCard>
        </PageContainer>
    )
}