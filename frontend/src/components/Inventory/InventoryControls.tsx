import type { Dispatch, SetStateAction } from "react";
import SearchField from "../ui/SearchField";
import { categoryOptions, inventoryStatusOptions } from "../../lib/contants/inventory";
import type { SortOption } from "../../types/types";
import Dropdown from "../ui/Dropdown";
import { getKeyByValue } from "../../utils/utils";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import FiltersMenu from "../ui/FiltersMenu";
import usePermissions from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../config/permissions";

interface InventoryControlsProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
    filter: SortOption;
    setFilter:  Dispatch<SetStateAction<SortOption>>;
    setShowModal:  Dispatch<SetStateAction<boolean>>;
    status: string;
    setStatus: Dispatch<SetStateAction<string>>;
}

const filterOptions :  Record<string, SortOption> = {
    'Newest': { sort: 'createdAt', order: 'desc' },
    'Oldest': { sort: 'createdAt', order: 'asc' },
}

export default function InventoryControls ({ 
    search, 
    setSearch, 
    category, 
    setCategory,
    filter,
    setFilter,
    setShowModal,
    status,
    setStatus
} : InventoryControlsProps) {
    const { hasPermissions } = usePermissions();

    return (
        <div className="flex-1 flex gap-3 items-end justify-between">
            <SearchField
                className="max-w-50 lg:max-w-100"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search inventory items..."
            />
            <div className="flex items-end gap-3">
                <div className="lg:flex gap-3 items-center hidden">
                    <Dropdown 
                        className="w-40"
                        onChange={(value) => setCategory(value)}
                        options={[{ label: 'All', value: '' }, ...categoryOptions]}
                        value={category}
                        label="Category"
                    />
                    <Dropdown 
                        className="w-30"
                        onChange={(value) => setStatus(value)}
                        options={inventoryStatusOptions}
                        value={status}
                        label="Status"
                    />
                    <Dropdown 
                        onChange={(value) => setFilter(filterOptions[value])}
                        options={Object.keys(filterOptions).map(opt => ({ label: opt, value: opt }))}
                        value={getKeyByValue(filterOptions, filter) || ""}
                        label="Sort"
                    />
                </div>
                {hasPermissions([PERMISSIONS.INVENTORY_CREATE]) && (
                    <Button className="w-30 text-sm rounded-md" onClick={() => setShowModal(true)}>
                        <Plus size={18}/>
                        Add Item
                    </Button>
                )}
                <FiltersMenu 
                    className="lg:hidden"
                    containerStyle="space-y-3"
                >
                    <Dropdown 
                        onChange={(value) => setCategory(value)}
                        options={[{ label: 'All', value: '' }, ...categoryOptions]}
                        value={category}
                        label="Category"
                    />
                    <Dropdown 
                        onChange={(value) => setStatus(value)}
                        options={inventoryStatusOptions}
                        value={status}
                        label="Status"
                    />
                    <Dropdown 
                        onChange={(value) => setFilter(filterOptions[value])}
                        options={Object.keys(filterOptions).map(opt => ({ label: opt, value: opt }))}
                        value={getKeyByValue(filterOptions, filter) || ""}
                        label="Sort"
                    />
                </FiltersMenu>
            </div>
        </div>
    )
}