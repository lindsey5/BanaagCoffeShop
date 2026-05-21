import { BarChart3, Package, TriangleAlert } from "lucide-react";
import { useGetOrderSalesByPeriod } from "../../hooks/order/use-get-sales-by-period.hook";
import { formatToPeso } from "../../utils/utils";
import MetricCard, { MetricCardSkeleton } from "./MetricCard";
import { useGetLowStockItems } from "../../hooks/inventory/use-get-total-low-stocks.hook";
import { useGetTotalItems } from "../../hooks/inventory/use-get-total-items.hook";

export const OrderSalesToday = () => {
    const { data, isFetching } = useGetOrderSalesByPeriod("today");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Sales Today"
            content={formatToPeso(data?.sales || 0)}
            icon={<BarChart3 size={25} />}
        />
    )
}

export const OrderSalesThisWeek = () => {
    const { data, isFetching } = useGetOrderSalesByPeriod("this-week");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Sales This Week"
            content={formatToPeso(data?.sales || 0)}
            icon={<BarChart3 size={25} />}
        />
    )
}

export const OrderSalesThisMonth = () => {
    const { data, isFetching } = useGetOrderSalesByPeriod("this-month");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Sales This Month"
            content={formatToPeso(data?.sales || 0)}
            icon={<BarChart3 size={25} />}
        />
    )
}

export const OrderSalesThisYear = () => {
    const { data, isFetching } = useGetOrderSalesByPeriod("this-year");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Sales This Year"
            content={formatToPeso(data?.sales || 0)}
            icon={<BarChart3 size={25} />}
        />
    )
}

export const TotalLowStockItems = () => {
    const { data, isFetching} = useGetLowStockItems();

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Low Stocks"
            content={data?.total.toString() || ""}
            icon={<TriangleAlert size={25}/>}
        />
    )
}

export const TotalInventoryItems = () => {
    const { data, isFetching} = useGetTotalItems();

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Items in Inventory"
            content={data?.total.toString() || ""}
            icon={<Package size={25}/>}
        />
    )
}