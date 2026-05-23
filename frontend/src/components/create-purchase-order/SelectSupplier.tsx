import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { WhiteCard } from "../ui/Card";
import { useDebounce } from "../../hooks/useDebounce";
import type { PaginationState } from "@tanstack/react-table";
import SearchField from "../ui/SearchField";
import { useGetSuppliers } from "../../hooks/supplier/use-get-supplier.hook";
import type { Supplier } from "../../types/supplier.type";
import Button from "../ui/Button";
import type { InventoryItem } from "../../types/inventory.type";
import type { CreatePurchaseOrderFormData } from "../../schemas/purchaseOrderSchema";
import type { UseFormSetValue } from "react-hook-form";

interface SelectSupplierProps {
    supplier: Supplier | null;
    setSupplier: Dispatch<SetStateAction<Supplier | null>>;
    setItems: Dispatch<React.SetStateAction<InventoryItem[]>>;
    setValue: UseFormSetValue<CreatePurchaseOrderFormData>;
    error: string;
}

export default function SelectSupplier ({ supplier, setSupplier, setItems, setValue, error } : SelectSupplierProps) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [search, setSearch] = useState("");
    const [onFocus, setOnFocus] = useState(false);
    const debouncedSearch = useDebounce(search, 0.8);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 50,
    });

    const { data, isFetching } = useGetSuppliers({
        category: "",
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
    });

    const handleChangeSupplier = () => {
        setSupplier(null);
        setItems([]);
    }

    const handleSelect = (supplier : Supplier) => {
        setValue('supplier_id', supplier._id);
        setSupplier(supplier)
    }

    useEffect(() => {
        if(data?.suppliers) {
            if(data.pagination.page === 1) setSuppliers(data.suppliers);
            else setSuppliers(prev => [...prev, ...data.suppliers])
        }
    }, [data])

    return (
        <WhiteCard>
            {supplier ? (   
            <div className="mt-3 rounded-xl bg-panel border border-hover p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-bold text-brown">
                            Selected Supplier
                        </h1>

                        <p className="text-sm text-gray-500">
                            Supplier information and contact details
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-hover p-3">
                        <p className="text-xs text-gray-500 mb-1">
                            Supplier Name
                        </p>

                        <p className="font-semibold text-sm">
                            {supplier.name}
                        </p>
                    </div>

                    <div className="rounded-lg border border-hover p-3">
                        <p className="text-xs text-gray-500 mb-1">
                            Supplier Code
                        </p>

                        <p className="font-semibold text-sm">
                            {supplier.code}
                        </p>
                    </div>

                    <div className="rounded-lg border border-hover p-3">
                        <p className="text-xs text-gray-500 mb-1">
                            Email Address
                        </p>

                        <p className="font-semibold text-sm break-all">
                            {supplier.email || "N/A"}
                        </p>
                    </div>

                    <div className="rounded-lg border border-hover p-3">
                        <p className="text-xs text-gray-500 mb-1">
                            Phone Number
                        </p>

                        <p className="font-semibold text-sm">
                            {supplier.phone || "N/A"}
                        </p>
                    </div>
                </div>
                <Button
                    className="rounded-md mt-3 text-sm"
                    onClick={handleChangeSupplier}
                >Change Supplier</Button>
            </div>
            ) : (
                <div className="space-y-3">
                    <h1 className="text-lg font-bold text-brown">
                        Select Supplier
                    </h1>
                    <div className="relative">
                        <SearchField
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder="Search supplier..."
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
                                ) : suppliers.length ? (
                                    suppliers.map((supplier) => (
                                        <button
                                            key={supplier._id}
                                            type="button"
                                            onClick={() => handleSelect(supplier)}
                                            className="cursor-pointer w-full text-left px-3 py-2 text-sm hover:bg-hover transition"
                                        >
                                            {supplier.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm">
                                        No suppliers found
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
                </div>
            )}
            <p className="text-red-500 text-xs mt-2">{error}</p>
        </WhiteCard>
    )
}