import type { Dispatch, SetStateAction } from "react";
import { getKeyByValue } from "../../utils/utils";
import Dropdown from "../ui/Dropdown";
import SearchField from "../ui/SearchField";
import type { SortOption } from "../../types/types";
import type { PaginationState } from "@tanstack/react-table";

interface POSControlsProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    filter: SortOption;
    setFilter: Dispatch<SetStateAction<SortOption>>;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export const menuFilterOptions :  Record<string, SortOption> = {
    'Name (A-Z)' : { sort: 'name', order: 'asc' },
    'Name (Z-A)' : { sort: 'name', order: 'desc' },
    'Newest': { sort: 'createdAt', order: 'desc' },
    'Oldest': { sort: 'createdAt', order: 'asc' },
}

export default function POSControls ({ search, setSearch, filter, setFilter, setPagination } : POSControlsProps) {
    return (
        <div className="flex items-end gap-3">
            <SearchField
                placeholder="Search products (Code/Name)"
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination(prev => ({ ...prev, pageIndex: 0 }))
                }}
                value={search}
            />
            <Dropdown
                className="min-w-30"
                onChange={(value) => {
                    setFilter(menuFilterOptions[value]);
                    setPagination(prev => ({ ...prev, pageIndex: 0 }))
                }}
                options={Object.keys(menuFilterOptions).map((opt) => ({
                    label: opt,
                    value: opt,
                }))}
                value={getKeyByValue(menuFilterOptions, filter) || ""}
                label="Sort"
            />
        </div>
    )
}