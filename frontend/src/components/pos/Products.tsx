import type { Menu } from "../../types/menu.type";
import { formatToPeso } from "../../utils/utils";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import ProductSkeleton from "./ProductSkeleton";

interface ProductsProps {
    isFetching: boolean;
    menus: Menu[];
    page: number;
    totalPages: number;
    handleAddItem: (menu: Menu) => void;
    handleSeeMore: () => void;
}

export default function Products({
    isFetching,
    menus,
    page,
    totalPages,
    handleAddItem,
    handleSeeMore
}: ProductsProps) {
    const hasMore = page < totalPages;

    return (
        <div className="flex-1 overflow-y-auto pr-1">

            {isFetching && page === 1 ? (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            ) : menus?.length ? (
                <>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {menus.map((menu) => (
                            <button
                                key={menu._id}
                                className="cursor-pointer"
                                onClick={() => handleAddItem(menu)}
                                disabled={menu.status !== "available"}
                            >
                                <Card className="flex flex-col items-center gap-3">
                                    <img
                                        className="w-full h-35 object-cover"
                                        src={menu.image_url || "/placeholder.png"}
                                        alt={menu.name}
                                    />

                                    <h1>{menu.name}</h1>
                                    <p>{formatToPeso(menu.price)}</p>

                                    <Chip
                                        label={menu.status.toUpperCase()}
                                        variant={
                                            menu.status === "available"
                                                ? "success"
                                                : "danger"
                                        }
                                    />
                                </Card>
                            </button>
                        ))}
                    </div>

                    {/* SEE MORE BUTTON */}
                    {hasMore && (
                        <div className="flex justify-center mt-5">
                            <button
                                onClick={handleSeeMore}
                                disabled={isFetching}
                                className="px-4 py-2 text-sm bg-main text-white rounded-md hover:bg-accent transition disabled:opacity-50"
                            >
                                {isFetching ? "Loading..." : "See More"}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-brown mt-5">
                    No Products Found
                </p>
            )}
        </div>
    );
}