import type { Menu } from "../../types/menu.type";
import { formatToPeso } from "../../utils/utils";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import ProductSkeleton from "./ProductSkeleton";

interface ProductsProps {
    isFetching: boolean;
    menus: Menu[];
    handleAddItem: (menu: Menu) => void;
}

export default function Products ({ isFetching, menus, handleAddItem } : ProductsProps) {

    return (
        <div className="flex-1 overflow-y-auto pr-1">
            {isFetching ? (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                    ))}
                </div>
            ) : menus?.length ? (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {menus.map((menu) => (
                    <button
                        className="cursor-pointer"
                        onClick={() => handleAddItem(menu)}
                        disabled={menu.status !== 'available'}
                    >
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
                            <Chip label={menu.status.toUpperCase()} variant={menu.status === 'available' ? 'success' : 'danger'} />
                        </Card>
                    </button>
                    ))}
                </div>
            ) : (
                <p className="text-center text-brown mt-5">
                    No Products Found
                </p>
            )}
        </div>
    )
}