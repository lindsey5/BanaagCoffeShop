import { useEffect, useMemo, useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import { useDebounce } from "../../hooks/useDebounce";
import type { SortOption } from "../../types/types";
import type { PaginationState } from "@tanstack/react-table";
import { useGetMenus } from "../../hooks/menu/use-get-menus.hook";
import Products from "../../components/pos/Products";
import CategoryTab from "../../components/pos/CategoryTab";
import POSControls from "../../components/pos/POSControls";
import RightPanel from "../../components/pos/RightPanel";
import type { CreateOrderItemDTO } from "../../types/order.type";
import type { Menu } from "../../types/menu.type";
import { kgToGram, lToMl } from "../../utils/utils";

export default function POS() {
    const [pagination, setPagination] = useState<PaginationState>({
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

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        order: filter.order,
        sort: filter.sort,
        search: debouncedSearch,
        category: category === "All" ? "" : category,
        status: ''
    }), [pagination, filter, debouncedSearch, category]);

    const { data, isFetching } = useGetMenus(params);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [orderItems, setOrderItems] = useState<CreateOrderItemDTO[]>([]);

    const handleAddItem = (menu: Menu) => {
        const existingItem = orderItems.find(item => item.menu_id === menu._id);

        const simulated = existingItem
            ? orderItems.map(item =>
                item.menu_id === menu._id
                    ? {
                            ...item,
                            quantity: item.quantity + 1,
                            total: (item.quantity + 1) * item.price
                        }
                    : item
            )
            : [
                ...orderItems,
                {
                    menu,
                    menu_id: menu._id,
                    price: menu.price,
                    quantity: 1,
                    total: menu.price
                }
            ];

        // =========================
        // GLOBAL INGREDIENT USAGE CHECK
        // =========================
        const ingredientUsage: Record<string, number> = {};

        for (const item of simulated) {
            for (const ing of item.menu.menuIngredients) {
                const inv = ing.inventoryItem;
                if (!inv) continue;

                const key = inv._id.toString();

                const amountUsed = ing.amount * item.quantity;

                ingredientUsage[key] =
                    (ingredientUsage[key] || 0) + amountUsed;
            }
        }

        // =========================
        // VALIDATION AGAINST INVENTORY
        // =========================
        for (const item of simulated) {
            for (const ing of item.menu.menuIngredients) {
                const inv = ing.inventoryItem;
                if (!inv) continue;

                const key = inv._id.toString();
                const used = ingredientUsage[key];

                const availableQty =
                    inv.unit === "kg"
                        ? kgToGram(inv.quantity)
                        : inv.unit === "l"
                        ? lToMl(inv.quantity)
                        : inv.quantity;

                const isValidUnit =
                    inv.unit === ing.unit ||
                    (inv.unit === "kg" && ing.unit === "g") ||
                    (inv.unit === "l" && ing.unit === "ml");

                if (!isValidUnit) return;

                if (used > availableQty) {
                    return; // block add
                }
            }
        }

        // =========================
        // COMMIT STATE ONLY IF VALID
        // =========================
        setOrderItems(simulated);
    };

    useEffect(() => {
        if(data?.menus) {
            if(pagination.pageIndex === 0) setMenus(data.menus);
            else setMenus(prev => [...prev, ...data.menus])
        }
    }, [data])

    return (
        <PageContainer
            title="Point of Sale"
            description="Create new orders, apply discounts, and generate receipts."
        >
            {/* MAIN LAYOUT */}
            <div className="flex items-start gap-5 min-h-[calc(100vh)]">

                {/* LEFT SIDE */}
                <div className="flex-1 flex flex-col min-w-0 space-y-3 overflow-hidden">

                    {/* CATEGORY FILTER */}
                    <CategoryTab category={category} setCategory={setCategory}/>

                    {/* SEARCH + SORT */}
                    <POSControls 
                        search={search} 
                        setSearch={setSearch} 
                        filter={filter} 
                        setFilter={setFilter}
                        setPagination={setPagination}
                    />

                    {/* PRODUCT GRID */}
                    <Products 
                        isFetching={isFetching} 
                        menus={menus}
                        handleAddItem={handleAddItem}
                        page={data?.pagination.page || 1}
                        totalPages={data?.pagination.totalPages || 1}
                        handleSeeMore={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1}))}
                    />
                </div>

                {/* RIGHT SIDE */}
                <RightPanel 
                    orderItems={orderItems}
                    setOrderItems={setOrderItems}
                />
            </div>
        </PageContainer>
    );
}