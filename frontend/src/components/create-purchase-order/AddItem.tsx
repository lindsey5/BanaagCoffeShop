import {useEffect, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import SearchField from "../ui/SearchField";
import { useDebounce } from "../../hooks/useDebounce";
import { useGetInventory } from "../../hooks/inventory/use-get-inventory.hook";
import type { InventoryItem } from "../../types/inventory.type";
import type { Supplier } from "../../types/supplier.type";

interface AddItemModalProps { 
    supplier: Supplier;
    handleAdd: (item: InventoryItem) => void;
}

export default function AddItem({ supplier, handleAdd } : AddItemModalProps) {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [search, setSearch] = useState("");
    const [onFocus, setOnFocus] = useState(false);
    const debouncedSearch = useDebounce(search, 0.8);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 50,
    });

    const { data, isFetching } = useGetInventory({
        category: supplier.category,
        limit: pagination.pageSize,
        order: "asc",
        sort: "name",
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        status: ''
    });

    useEffect(() => {
        if(data?.inventoryItems) {
            if(data.pagination.page === 1) setItems(data.inventoryItems);
            else setItems(prev => [...prev, ...data.inventoryItems])
        }
    }, [data])

    return (
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
                                onClick={() => handleAdd(item)}
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
    )
}