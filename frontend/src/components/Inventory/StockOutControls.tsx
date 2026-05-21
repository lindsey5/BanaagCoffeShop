import type { Dispatch, SetStateAction } from "react";
import SearchField from "../ui/SearchField";
import { categoryOptions } from "../../lib/contants/inventory";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import FiltersMenu from "../ui/FiltersMenu";
import usePermissions from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../config/permissions";
import DateInput from "../ui/DateInput";
import type { PaginationState } from "@tanstack/react-table";

const transactionTypeOptions = [
    { label: 'All', value: '' },
    { label: 'Sale', value: 'sale' },
    { label: 'Damage', value: 'damage' },
    { label: 'Expired', value: 'expired' },
    { label: 'Adjustment', value: 'adjustment' }
]

interface StockOutControlsProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
    startDate: string;
    setStartDate: Dispatch<SetStateAction<string>>;
    endDate: string;
    setEndDate:  Dispatch<SetStateAction<string>>;
    transactionType: string;
    setTransactionType: Dispatch<SetStateAction<string>>;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export default function StockOutControls ({ 
    search, 
    setSearch, 
    category, 
    setCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    transactionType,
    setTransactionType,
    setPagination
} : StockOutControlsProps) {
    const { hasPermissions } = usePermissions();

    return (
        <div className="flex-1 flex gap-3 items-end justify-between">
            <div className="flex gap-5 items-center">
                <SearchField
                    className="w-50 lg:w-100"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    placeholder="Search inventory items..."
                />
                <FiltersMenu 
                    containerStyle="space-y-3 grid grid-cols-2 gap-3 w-100 z-50 left-0 -translate-x-50"
                >
                    <Dropdown 
                        onChange={(value) => {
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                            setCategory(value);
                        }}
                        options={[{ label: 'All', value: '' }, ...categoryOptions]}
                        value={category}
                        label="Category"
                    />

                    <Dropdown 
                        onChange={(value) => {
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                            setTransactionType(value);
                        }}
                        options={transactionTypeOptions}
                        value={transactionType}
                        label="Transaction Type"
                    />

                    <DateInput 
                        label="From"
                        onChange={(value) => {
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                            setStartDate(value);
                        }}
                        value={startDate}
                    />

                    <DateInput 
                        label="To"
                        onChange={(value) => {
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                            setEndDate(value);
                        }}
                        value={endDate}
                    />
                </FiltersMenu>
            </div>
            {hasPermissions([PERMISSIONS.STOCK_OUT_CREATE]) && (
                <Button className="w-40 text-xs rounded-md">
                    <Plus size={18}/>
                    Create Stock Out
                </Button>
            )}
        </div>
    )
}