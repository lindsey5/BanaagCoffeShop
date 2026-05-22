import { useGetTopProducts } from "../../hooks/menu/use-get-top-products.hook";
import { WhiteCard } from "../ui/Card";

export default function TopProducts () {
    const { data } = useGetTopProducts();

    return (
        <WhiteCard className="min-w-100 lg:w-100 flex flex-col gap-5 max-h-[300px] md:h-[500px] md:max-h-[500px]">
            <h1 className="text-lg font-bold">Top 10 Products</h1>
            <div className="space-y-2 min-h-0 flex-grow overflow-y-auto">
                {data?.topProducts.map(product => (
                    <div className="flex gap-3">
                        <img className="w-20 h-20 object-cover rounded-md" src={product.menu.image_url} alt={product.menu.name} />
                        <div className="space-y-2">
                            <h1 className="font-bold">{product.menu.name}</h1>
                            <p>Total Sold: {product.totalSold}</p>
                        </div>
                    </div>
                ))}
            </div>
        </WhiteCard>
    )
}