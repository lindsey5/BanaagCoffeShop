import { useMemo, useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import { useDebounce } from "../../hooks/useDebounce";
import type { SortOption } from "../../types/types";
import type { PaginationState } from "@tanstack/react-table";
import { useGetMenus } from "../../hooks/menu/use-get-menus.hook";
import Products from "../../components/pos/Products";
import CategoryTab from "../../components/pos/CategoryTab";
import POSControls from "../../components/pos/POSControls";
import RightPanel from "../../components/pos/RightPanel";
import type { CreateOrderDTO, CreateOrderItemDTO } from "../../types/order.type";
import type { Menu } from "../../types/menu.type";
import { kgToGram, lToMl } from "../../utils/utils";

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

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        order: filter.order,
        sort: filter.sort,
        search: debouncedSearch,
        category: category === "All" ? "" : category,
    }), [pagination, filter, debouncedSearch, category]);

    const { data, isFetching } = useGetMenus(params);
    const [orderItems, setOrderItems] = useState<CreateOrderItemDTO[]>([]);

    const handleAddItem = (menu : Menu) => {
        const existingItem = orderItems.find(item => item.menu_id === menu._id);

        let allowed = true;
        
        if(existingItem){
            const nextQty = existingItem.quantity + 1;
            for (const ing of existingItem.menu.menuIngredients) {
                const inv = ing.inventoryItem;
                const ingAmount = ing.amount * nextQty;

                const isSameUnit =
                    inv.unit === ing.unit;

                const isKgToG =
                    inv.unit === "kg" && ing.unit === "g";

                const isLToMl =
                    inv.unit === "l" && ing.unit === "ml";

                const availableQty =
                    isKgToG
                        ? kgToGram(inv.quantity)
                        : isLToMl
                            ? lToMl(inv.quantity)
                            : inv.quantity;

                if (!isSameUnit && !isKgToG && !isLToMl) {
                    allowed = false;
                    break;
                }

                if (availableQty < ingAmount) {
                    allowed = false;
                    break;
                }
            }
        }

        if(!allowed) return;

        setOrderItems(prev => existingItem ? prev.map(item => item.menu_id === menu._id ? { ...item, quantity: item.quantity + 1, total: item.quantity * item.price } : item) : 
        [...prev, { menu, menu_id: menu._id, price: menu.price, quantity: 1, total: menu.price }])

    }

    return (
        <PageContainer
            title="Point of Sale"
            description="Create new orders, apply discounts, and generate receipts."
        >
            {/* MAIN LAYOUT */}
            <div className="flex items-start gap-5 h-[calc(100vh)]">

                {/* LEFT SIDE */}
                <div className="flex-1 flex flex-col min-w-0 space-y-3 overflow-hidden">

                    {/* CATEGORY FILTER */}
                    <CategoryTab category={category} setCategory={setCategory}/>

                    {/* SEARCH + SORT */}
                    <POSControls search={search} setSearch={setSearch} filter={filter} setFilter={setFilter}/>

                    {/* PRODUCT GRID */}
                    <Products 
                        isFetching={isFetching} 
                        menus={data?.menus || []}
                        handleAddItem={handleAddItem}
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