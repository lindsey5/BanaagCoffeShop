import type { Dispatch, SetStateAction } from "react";
import { menuFilterOptions } from "../../lib/contants/menu";
import { getKeyByValue } from "../../utils/utils";
import Dropdown from "../ui/Dropdown";
import SearchField from "../ui/SearchField";
import type { SortOption } from "../../types/types";

interface POSControlsProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    filter: SortOption;
    setFilter: Dispatch<SetStateAction<SortOption>>;
}

export default function POSControls ({ search, setSearch, filter, setFilter } : POSControlsProps) {
    return (
        <div className="flex items-end gap-3">
            <SearchField
                placeholder="Search products by code or name..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
            />
            <Dropdown
                className="min-w-30"
                onChange={(value) => setFilter(menuFilterOptions[value])}
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