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
import {
    createPurchaseOrderSchema,
    type CreatePurchaseOrderFormData,
} from "../../schemas/purchaseOrderSchema";
import TextField from "../../components/ui/Textfield";
import { formatToPeso } from "../../utils/utils";
import Button from "../../components/ui/Button";
import { useCreatePurchaseOrder } from "../../hooks/purchase-order/use-create-purchase-orders.hook";
import { promiseToast } from "../../utils/sileo";

export default function CreatePurchaseOrder() {
    const createPurchaseOrderMutation = useCreatePurchaseOrder();

    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [items, setItems] = useState<InventoryItem[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CreatePurchaseOrderFormData>({
        resolver: zodResolver(createPurchaseOrderSchema),
        defaultValues: {
            items: [],
        },
    });

    // compute total cost per item
    const computeTotalCost = (item: any) => {
        if (
            !item.unit_cost ||
            !item.base_quantity ||
            !item.quantity
        )
            return 0;

        const multiplier = item.quantity / item.base_quantity;
        return item.unit_cost * multiplier;
    };

    const poItems = watch("items");

    // update one item total_cost
    const updateItemTotal = (index: number) => {
        const item = poItems[index];

        const total = computeTotalCost(item);

        setValue(`items.${index}.total_cost`, total);
    };

    const handleAdd = (item: InventoryItem) => {
        const poItems = watch("items");

        const isExisting = poItems.find(
            (i) => i.inventory_item_id === item._id
        );

        if (isExisting) {
            const updated = poItems.map((i) =>
                i.inventory_item_id === item._id
                    ? {
                          ...i,
                          quantity: i.quantity + 1,
                      }
                    : i
            );

            // recalc all totals
            const recalculated = updated.map((i) => ({
                ...i,
                total_cost: computeTotalCost(i),
            }));

            setValue("items", recalculated);
        } else {
            const newItem = {
                inventory_item_id: item._id,
                unit: item.unit,
                quantity: 1,
                unit_cost: 0,
                base_quantity: 1,
                total_cost: 0,
            };

            setValue("items", [...poItems, newItem]);
            setItems((prev) => [...prev, item]);
        }
    };

    const handleRemove = (id: string) => {
        setItems((prev) => prev.filter((item) => item._id !== id));

        setValue(
            "items",
            watch("items").filter(
                (item) => item.inventory_item_id !== id
            )
        );
    };

    // grand total uses total_cost
    const grandTotal = poItems.reduce(
        (total, item) => total + (item.total_cost || 0),
        0
    );

    const onSubmit: SubmitHandler<CreatePurchaseOrderFormData> = (
        data
    ) => {
        const isConfirmed = confirm(
            "Are you sure you want to create this purchase order?"
        );

        if (!isConfirmed) return;

        promiseToast(
            createPurchaseOrderMutation.mutateAsync({
                ...data,
                grandTotal,
            }),
            "top-center",
            () =>
                (window.location.href =
                    "/dashboard/inventory/purchase-orders")
        );
    };

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
                                {items.length} item
                                {items.length !== 1 && "s"}
                            </p>
                        </div>

                        {poItems.length < 1 ? (
                            <div className="border border-dashed border-hover rounded-lg p-6 text-center">
                                <p className="text-xs text-gray-500">
                                    No items added yet
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {poItems.map((item, i) => (
                                    <div
                                        key={
                                            item.inventory_item_id
                                        }
                                        className="rounded-xl border border-hover bg-panel p-4 space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h2 className="font-semibold text-sm text-brown">
                                                    {
                                                        items.find(
                                                            (x) =>
                                                                x._id ===
                                                                item.inventory_item_id
                                                        )?.name
                                                    }
                                                </h2>
                                            </div>

                                            <Chip
                                                label={
                                                    items.find(
                                                        (x) =>
                                                            x._id ===
                                                            item.inventory_item_id
                                                    )?.category || ""
                                                }
                                            />
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-3">
                                            <TextField
                                                label="Unit Cost"
                                                type="number"
                                                error={errors.items ? errors.items[i]?.unit_cost?.message : ""}
                                                registration={register(
                                                    `items.${i}.unit_cost`,
                                                    {
                                                        setValueAs:
                                                            (v) =>
                                                                Number(
                                                                    v
                                                                ),
                                                        onChange: () =>
                                                            updateItemTotal(
                                                                i
                                                            ),
                                                    }
                                                )}
                                            />

                                            <TextField
                                                label="Base Quantity"
                                                type="number"
                                                error={errors.items ? errors.items[i]?.base_quantity?.message : ""}
                                                onKeyDown={(e) => {
                                                    if ((e.key === "." || e.key === "," || e.key === "e" || e.key === "-") && item.unit === 'pcs') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                registration={register(
                                                    `items.${i}.base_quantity`,
                                                    {
                                                        setValueAs:
                                                            (v) =>
                                                                Number(
                                                                    v
                                                                ),
                                                        onChange: () =>
                                                            updateItemTotal(
                                                                i
                                                            ),
                                                    }
                                                )}
                                            />

                                            <TextField
                                                label="Quantity"
                                                type="number"
                                                error={errors.items ? errors.items[i]?.quantity?.message : ""}
                                                onKeyDown={(e) => {
                                                    if ((e.key === "." || e.key === "," || e.key === "e" || e.key === "-") && item.unit === 'pcs') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                registration={register(
                                                    `items.${i}.quantity`,
                                                    {
                                                        setValueAs:
                                                            (v) =>
                                                                Number(
                                                                    v
                                                                ),
                                                        onChange: () =>
                                                            updateItemTotal(
                                                                i
                                                            ),
                                                    }
                                                )}
                                            />
                                        </div>
                                        <p className="capitalize text-sm text-brown">
                                            Unit: {item.unit}
                                        </p>

                                        <p className="text-sm text-brown">{formatToPeso(item.unit_cost)} per {item.base_quantity}{item.unit.toUpperCase()}</p>

                                        {/* ITEM TOTAL */}
                                        <p className="text-sm text-brown">
                                            Item Total:{" "}
                                            {formatToPeso(
                                                item.total_cost || 0
                                            )}
                                        </p>

                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(
                                                        item.inventory_item_id
                                                    )
                                                }
                                                className="text-sm text-red-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-red-500">
                        {errors.items?.message}
                    </p>

                    {/* ✅ GRAND TOTAL */}
                    <p className="font-bold">
                        Total Cost:{" "}
                        {formatToPeso(grandTotal)}
                    </p>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={
                                createPurchaseOrderMutation.isPending
                            }
                        >
                            Create Purchase Order
                        </Button>
                    </div>
                </form>
            </WhiteCard>
        </PageContainer>
    );
}