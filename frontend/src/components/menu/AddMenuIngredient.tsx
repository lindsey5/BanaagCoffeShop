import {useEffect, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import SearchField from "../ui/SearchField";
import { useDebounce } from "../../hooks/useDebounce";
import { useGetInventory } from "../../hooks/inventory/use-get-inventory.hook";
import type { InventoryItem } from "../../types/inventory.type";
import { WhiteCard } from "../ui/Card";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { MenuIngredientDTO } from "../../types/menu.type";
import TextField from "../ui/Textfield";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuIngredientSchema, type MenuIngredientFormData } from "../../schemas/menuSchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import {units } from "../../lib/contants/menu";
import Dropdown from "../ui/Dropdown";

interface AddIngredientModalProps { 
    show: boolean;
    close: () => void; 
    handleAdd: (item: MenuIngredientDTO) => void;
}

interface UnitDropdownProps {
    onChange: (value : string) => void; 
    value: string;
    item: InventoryItem;
    error?: string;
}

function UnitDropdown ({ item, onChange, value, error } : UnitDropdownProps) {
    const [options, setOptions] = useState<{ label: string, value: string}[]>([]);

    useEffect(() => {
        if(item){
            let options : string[] = [];
            if(item.unit === 'kg') {
                options = units.filter(unit => ['kg', 'g'].includes(unit))
            }else if(item.unit === 'g') {
                options = units.filter(unit => unit === 'g')
            }else if(item.unit === 'l') {
                options = units.filter(unit => ['l', 'ml'].includes(unit))
            }else if(item.unit === 'ml') {
                options = units.filter(unit => unit === 'ml')
            }else {
                options = units.filter(unit => unit === 'pcs')
            }

            setOptions(options.map(opt => ({ label: opt, value: opt })))
        }

    }, [item])

    return (
        <Dropdown 
            options={options}
            onChange={(value) => onChange(value)}
            value={value}
            label="Unit"
            className="min-w-20"
            error={error}
        />
    )
}

export default function AddMenuIngredient({ show, close, handleAdd } : AddIngredientModalProps) {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<MenuIngredientFormData>({
        resolver: zodResolver(menuIngredientSchema),
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
    });

    const handleSelectItem = (item: InventoryItem) => {
        setSearch("");
        setItem(item);
        setOnFocus(false);
    };

    const onSubmit : SubmitHandler<MenuIngredientFormData> = (data) => {
        handleAdd(data);
        close();
        setItem(null)
        reset({
            amount: undefined,
            inventory_item_id: undefined,
            unit: undefined
        })
    }

    useEffect(() => {
        if(item) {
            reset({
                amount: undefined,
                inventory_item_id: item._id,
                unit: undefined
            })
        }
    }, [item])

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
                <h1 className="font-bold">Add Ingredient</h1>
                <div className="relative">
                    <SearchField
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search ingredients..."
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
                                    No ingredients found
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
                                Selected Ingredient
                            </h1>

                            <div className="text-sm space-y-1">
                                <p className="font-medium">{item.name}</p>

                                <p>Code: {item.code}</p>

                                <p>Stock: {item.quantity}{item.unit.toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <TextField 
                                label="Amount"
                                placeholder="Enter amount"
                                registration={register('amount', { valueAsNumber: true })}
                                onKeyDown={(e) => {
                                    if ((e.key === "." || e.key === "," || e.key === "e" || e.key === "-") && item.unit === 'pcs') {
                                        e.preventDefault();
                                    }
                                }}
                                type="number"
                                error={errors.amount?.message}
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
                    </>
                )}

                <div className="flex justify-end">
                    <Button
                        disabled={!item}
                        type="submit"
                        className="px-6 text-sm py-2 rounded-md"
                    >Add</Button>
                </div>
                </form>
            </WhiteCard>
        </Modal>
    )
}