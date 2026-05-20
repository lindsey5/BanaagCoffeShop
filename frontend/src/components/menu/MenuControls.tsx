import type { Dispatch, SetStateAction } from "react";
import { menuCategoryOptions, menuFilterOptions, menuStatusOptions } from "../../lib/contants/menu";
import { getKeyByValue } from "../../utils/utils";
import FiltersMenu from "../ui/FiltersMenu";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import SearchField from "../ui/SearchField";
import type { SortOption } from "../../types/types";

interface MenuControlsProps{
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
    filter: SortOption;
    setFilter: Dispatch<SetStateAction<SortOption>>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    status: string;
    setStatus: Dispatch<SetStateAction<string>>;
}

export default function MenuControls ({ 
    search, 
    setSearch, 
    category, 
    setCategory, 
    filter, 
    setFilter,
    setShowModal,
    status,
    setStatus
} : MenuControlsProps) {
    return (
        <div className="flex-1 flex gap-3 items-end justify-between">
            <SearchField
                className="max-w-50 lg:max-w-100"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search menu..."
            />
            <div className="flex items-end gap-3">
                <div className="lg:flex gap-3 items-center hidden">
                    <Dropdown 
                        className="w-40"
                        onChange={(value) => setCategory(value)}
                        options={[{ label: 'All', value: '' }, ...menuCategoryOptions]}
                        value={category}
                        label="Category"
                    />
                    <Dropdown 
                        className="w-30"
                        onChange={(value) => setStatus(value)}
                        options={menuStatusOptions}
                        value={status}
                        label="Status"
                    />
                    <Dropdown 
                        onChange={(value) => setFilter(menuFilterOptions[value])}
                        options={Object.keys(menuFilterOptions).map(opt => ({ label: opt, value: opt }))}
                        value={getKeyByValue(menuFilterOptions, filter) || ""}
                        label="Sort"
                    />
                </div>
                <Button className="w-35 text-sm rounded-md" onClick={() => setShowModal(true)}>
                    <Plus size={18}/>
                    Create Menu
                </Button>
                <FiltersMenu 
                    className="lg:hidden"
                    containerStyle="space-y-3"
                >
                    <Dropdown 
                        onChange={(value) => setCategory(value)}
                        options={[{ label: 'All', value: '' }, ...menuCategoryOptions]}
                        value={category}
                        label="Category"
                    />
                    <Dropdown 
                        onChange={(value) => setStatus(value)}
                        options={menuStatusOptions}
                        value={status}
                        label="Status"
                    />
                    <Dropdown 
                        onChange={(value) => setFilter(menuFilterOptions[value])}
                        options={Object.keys(menuFilterOptions).map(opt => ({ label: opt, value: opt }))}
                        value={getKeyByValue(menuFilterOptions, filter) || ""}
                        label="Sort"
                    />
                </FiltersMenu>
            </div>
        </div>
    )
}