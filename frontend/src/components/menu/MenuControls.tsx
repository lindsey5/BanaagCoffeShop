import type { Dispatch, SetStateAction } from "react";
import { menuCategoryOptions, menuFilterOptions, menuStatusOptions } from "../../lib/contants/menu";
import { getKeyByValue } from "../../utils/utils";
import FiltersMenu from "../ui/FiltersMenu";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import SearchField from "../ui/SearchField";
import type { SortOption } from "../../types/types";
import usePermissions from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../config/permissions";
import type { PaginationState } from "@tanstack/react-table";

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
    setPagination: Dispatch<SetStateAction<PaginationState>>;
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
    setStatus,
    setPagination
} : MenuControlsProps) {
    const { hasPermissions } = usePermissions();

    return (
        <div className="flex-1 flex gap-3 items-end justify-between">
            <SearchField
                className="max-w-60 lg:max-w-100"
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination(prev => ({ ...prev, pageIndex: 0 }))
                }}
                value={search}
                placeholder="Search menu (Name/Code)"
            />
            <div className="flex items-end gap-3">
                <div className="lg:flex gap-3 items-center hidden">
                    <Dropdown 
                        className="w-40"
                        onChange={(value) => {
                            setCategory(value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }))
                        }}
                        options={[{ label: 'All', value: '' }, ...menuCategoryOptions]}
                        value={category}
                        label="Category"
                    />
                    <Dropdown 
                        className="w-30"
                        onChange={(value) => {
                            setStatus(value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }))
                        }}
                        options={menuStatusOptions}
                        value={status}
                        label="Status"
                    />
                    <Dropdown 
                        className="w-30"
                        onChange={(value) => { 
                            setFilter(menuFilterOptions[value]);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }))
                        }}
                        options={Object.keys(menuFilterOptions).map(opt => ({ label: opt, value: opt }))}
                        value={getKeyByValue(menuFilterOptions, filter) || ""}
                        label="Sort"
                    />
                </div>
                {hasPermissions([PERMISSIONS.MENU_CREATE]) && (
                    <Button className="w-35 text-sm rounded-md" onClick={() => setShowModal(true)}>
                        <Plus size={18}/>
                        Create Menu
                    </Button>
                )}
                <FiltersMenu 
                    className="lg:hidden"
                    containerStyle="space-y-3"
                >
                    <Dropdown 
                        onChange={(value) => { 
                            setCategory(value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        options={[{ label: 'All', value: '' }, ...menuCategoryOptions]}
                        value={category}
                        label="Category"
                    />
                    <Dropdown 
                        onChange={(value) => { 
                            setStatus(value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        options={menuStatusOptions}
                        value={status}
                        label="Status"
                    />
                    <Dropdown 
                        onChange={(value) => { 
                            setFilter(menuFilterOptions[value]);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }))
                        }}
                        options={Object.keys(menuFilterOptions).map(opt => ({ label: opt, value: opt }))}
                        value={getKeyByValue(menuFilterOptions, filter) || ""}
                        label="Sort"
                    />
                </FiltersMenu>
            </div>
        </div>
    )
}