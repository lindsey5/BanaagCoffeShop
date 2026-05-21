import {useEffect, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import SearchField from "../ui/SearchField";
import { useDebounce } from "../../hooks/useDebounce";
import { useGetInventory } from "../../hooks/inventory/use-get-inventory.hook";
import type { InventoryItem } from "../../types/inventory.type";
import { WhiteCard } from "../ui/Card";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import TextField from "../ui/Textfield";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { X } from "lucide-react";
import UnitDropdown from "../shared/UnitDropdown";
import { stockOutSchema, type StockOutFormData } from "../../schemas/stockOutSchema";
import { useCreateStockOut } from "../../hooks/stock-out/use-create-stock-out.hook";
import { promiseToast } from "../../utils/sileo";
import Dropdown from "../ui/Dropdown";
import { transactionTypeOptions } from "../../lib/contants/inventory";
import { kgToGram, lToMl } from "../../utils/utils";

export default function CreateStockOut({ show, close } : { show: boolean, close: () => void }) {
    const createStockOutMutation = useCreateStockOut();
    
    const { register, handleSubmit, formState: { errors }, setValue, watch, setError } = useForm<StockOutFormData>({
        resolver: zodResolver(stockOutSchema),
    });
   
    const [item, setItem] = useState<InventoryItem | null>();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [search, setSearch] = useState("");
    const [onFocus, setOnFocus] = useState(false);
    const debouncedSearch = useDebounce(search, 0.8);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 50,
    });

    const { data, isFetching } = useGetInventory({
        category: "",
        limit: pagination.pageSize,
        order: "asc",
        sort: "name",
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        status: ''
    });

    const handleSelectItem = (item: InventoryItem) => {
        setSearch("");
        setItem(item);
        setValue('inventory_item_id', item._id);
        setOnFocus(false);
    };

    const onSubmit : SubmitHandler<StockOutFormData> = (data) => {
        if(item) {
            if(item.unit === data.unit && item.quantity < data.quantity) {
                setError('quantity', { message: `Quantity should not greater than ${item.quantity}`});
                return;
            }

            if(item.unit === 'kg' && data.unit === 'g' && kgToGram(item.quantity) < data.quantity) {
                setError('quantity', { message: `Quantity should not greater than ${kgToGram(item.quantity)}`});
                return;
            }

            if(item.unit === 'l' && data.unit === 'ml' && lToMl(item.quantity) < data.quantity) {
                setError('quantity', { message: `Quantity should not greater than ${kgToGram(item.quantity)}`});
                return;
            }

            return;
        }

        const isConfirmed = confirm('Are you sure you want to create this stock out? You cannot undo this action.');

        if(!isConfirmed) return;

        promiseToast(createStockOutMutation.mutateAsync({
            ...data,
            unit: data.unit as "kg" | "g" | "ml" | "l" | "pcs",
            transaction_type: data.transaction_type as "sale" | "damage" | "expired" | "adjustment"
        }))
    }

    useEffect(() => {
        if(data?.inventoryItems) {
            if(data.pagination.page === 1) setItems(data.inventoryItems);
            else setItems(prev => [...prev, ...data.inventoryItems])
        }
    }, [data])

    return (
        <Modal
            open={show}
            onClose={close}
            containerClassName="z-40"
        >
            <WhiteCard>
                <form className="relative space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="font-bold">Create Stock out</h1>
                <button type="button" className="absolute top-0 right-0 cursor-pointer" onClick={close}>
                    <X size={20} />
                </button>
                <div className="relative">
                    <SearchField
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search item..."
                        onFocus={() => setOnFocus(true)}
                        onBlur={() => {
                            setTimeout(() => {
                                setOnFocus(false);
                            }, 200);
                        }}
                    />

                    {/* DROPDOWN */}
                    {onFocus && (
                        <div className="absolute inset-x-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-400 rounded-md z-20">
                            {isFetching ? (
                                <div className="p-2 text-sm">
                                    Loading...
                                </div>
                            ) : items.length ? (
                                items.map((item) => (
                                    <button
                                        key={item._id}
                                        type="button"
                                        onClick={() => handleSelectItem(item)}
                                        className="cursor-pointer w-full text-left px-3 py-2 text-sm hover:bg-hover transition"
                                    >
                                        {item.name}
                                    </button>
                                ))
                            ) : (
                                <div className="p-2 text-sm">
                                    No items found
                                </div>
                            )}
                            {!isFetching && (data?.pagination.page || 0) < (data?.pagination.totalPages || 0) && (
                            <button
                                type="button"
                                onClick={() =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex: prev.pageIndex + 1,
                                    }))
                                }
                                className="w-full text-center text-sm py-2 cursor-pointer transition font-medium"
                            >
                                See more
                            </button>
                        )}
                        </div>
                    )}
                </div>
                {item && (
                    <>
                        <div className="mt-3 p-3 rounded-md bg-panel border border-hover space-y-2">
                            <h1 className="text-sm font-semibold text-brown">
                                Selected Item
                            </h1>

                            <div className="text-sm space-y-1">
                                <p className="font-medium">{item.name} | {item.brand}</p>

                                <p>Code: {item.code}</p>

                                <p>Stock: {item.unit !== 'pcs' ? item.quantity.toFixed(2) : item.quantity}{item.unit.toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <TextField 
                                label="Quantity"
                                placeholder="Enter quantity"
                                registration={register('quantity', { valueAsNumber: true })}
                                onKeyDown={(e) => {
                                    if ((e.key === "." || e.key === "," || e.key === "e" || e.key === "-") && item.unit === 'pcs') {
                                        e.preventDefault();
                                    }
                                }}
                                type="number"
                                error={errors.quantity?.message}
                            />
                            <UnitDropdown 
                                item={item}
                                onChange={(value) => {
                                    setValue('unit', value)
                                }}
                                value={watch('unit')}
                                error={errors.unit?.message}
                            />
                        </div>
                        <Dropdown 
                            onChange={(value) => setValue('transaction_type', value)}
                            options={transactionTypeOptions.filter(opt => opt.label !== 'All' )}
                            value={watch('transaction_type')}
                            label="Transaction Type"
                        />
                    </>
                )}

                <div className="flex justify-end">
                    <Button
                        disabled={!item || createStockOutMutation.isPending}
                        type="submit"
                        className="px-6 text-sm py-2 rounded-md"
                    >Create</Button>
                </div>
                </form>
            </WhiteCard>
        </Modal>
    )
}