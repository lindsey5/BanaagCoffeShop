import { useMemo, useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import { menuCategories, menuFilterOptions } from "../../lib/contants/menu";
import SearchField from "../../components/ui/SearchField";
import { useDebounce } from "../../hooks/useDebounce";
import Dropdown from "../../components/ui/Dropdown";
import type { SortOption } from "../../types/types";
import { formatToPeso, getKeyByValue } from "../../utils/utils";
import type { PaginationState } from "@tanstack/react-table";
import { useGetMenus } from "../../hooks/menu/use-get-menus.hook";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const MenuCardSkeleton = () => {
    return (
        <Card className="animate-pulse flex flex-col items-center gap-3 p-3">
        <div className="w-full h-35 bg-loading rounded" />
        <div className="w-3/4 h-4 bg-loading rounded" />
        <div className="w-1/2 h-4 bg-loading rounded" />
        <div className="w-full h-9 bg-loading rounded" />
        </Card>
    );
};

export default function POS() {
    const [pagination] = useState<PaginationState>({
        pageSize: 50,
        pageIndex: 0,
    });

    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 0.8);

    const [filter, setFilter] = useState<SortOption>({
        sort: "createdAt",
        order: "desc",
    });

    const params = useMemo(
        () => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        order: filter.order,
        sort: filter.sort,
        search: debouncedSearch,
        category: category === "All" ? "" : category,
        }),
        [pagination, filter, debouncedSearch, category]
    );

    const { data, isFetching } = useGetMenus(params);

    return (
        <PageContainer
            title="Point of Sale"
            description="Create new orders, apply discounts, and generate receipts."
        >
            {/* MAIN LAYOUT */}
            <div className="flex gap-5 h-[calc(100vh-208px)]">

                {/* LEFT SIDE */}
                <div className="flex-1 flex flex-col min-w-0 space-y-3 overflow-hidden">

                    {/* CATEGORY FILTER */}
                    <div className="flex overflow-x-auto gap-2 pb-3">
                        {["All", ...menuCategories].map((item) => {
                            const active = category === item;

                            return (
                                <button
                                    key={item}
                                    onClick={() => setCategory(item)}
                                    className={`cursor-pointer min-w-20 flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                        active
                                        ? "bg-accent text-white"
                                        : "bg-main/40 hover:bg-main"
                                    }`}
                                >
                                {item}
                                </button>
                            );
                        })}
                    </div>

                    {/* SEARCH + SORT */}
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

                    {/* PRODUCT GRID */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        {isFetching ? (
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                <MenuCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : data?.menus?.length ? (
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                {data.menus.map((menu) => (
                                <Card
                                    key={menu._id}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <img
                                    className="w-full h-35 object-contain"
                                    src={menu.image_url || "/placeholder.png"}
                                    alt={menu.name}
                                    />

                                    <h1>{menu.name}</h1>
                                    <p>{formatToPeso(menu.price)}</p>

                                    <Button className="w-full py-2">Add</Button>
                                </Card>
                                ))}
                            </div>
                        ) : (
                        <p className="text-center text-brown mt-5">
                            No Products Found
                        </p>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <Card className="w-90 hidden lg:flex flex-col h-full sticky top-0">
                    <></>
                </Card>

            </div>
        </PageContainer>
    );
}