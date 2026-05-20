
import { useGetOrderSalesByPeriod } from "../../hooks/order/use-get-sales-by-period.hook";
import { formatToPeso } from "../../utils/utils";
import MetricCard, { MetricCardSkeleton } from "./MetricCard";

export const OrderSalesToday = () => {
    const { data, isFetching } = useGetOrderSalesByPeriod("today");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Sales Today"
            content={formatToPeso(data?.sales || 0)}
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
        />
    )
}