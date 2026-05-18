import type { Dispatch, SetStateAction } from "react";
import SearchField from "../ui/SearchField";
import { categoryOptions } from "../../lib/contants/category";
import type { SortOption } from "../../types/types";
import Dropdown from "../ui/Dropdown";
import { getKeyByValue } from "../../utils/utils";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import FiltersMenu from "../ui/FiltersMenu";

interface InventoryControlsProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
    filter: SortOption;
    setFilter:  Dispatch<SetStateAction<SortOption>>;
    setShowModal:  Dispatch<SetStateAction<boolean>>;
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
    setShowModal
} : InventoryControlsProps) {
    return (
        <div className="flex-1 flex gap-3 items-center justify-between">
            <SearchField
                className="max-w-50 lg:max-w-100"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search inventory items..."
            />
            <div className="flex items-center gap-3">
                <div className="lg:flex gap-3 items-center hidden">
                    <Dropdown 
                        className="w-40"
                        onChange={(value) => setCategory(value)}
                        options={[{ label: 'All', value: '' }, ...categoryOptions]}
                        value={category}
                    />
                    <Dropdown 
                        onChange={(value) => setFilter(filterOptions[value])}
                        options={Object.keys(filterOptions).map(opt => ({ label: opt, value: opt }))}
                        value={getKeyByValue(filterOptions, filter) || ""}
                    />
                </div>
                <Button className="w-30 text-sm rounded-md" onClick={() => setShowModal(true)}>
                    <Plus size={18}/>
                    Add Item
                </Button>
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