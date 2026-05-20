import Chart, { ChartSkeleton } from "../ui/Chart";
import { useGetOrderMonthlySales } from "../../hooks/order/use-get-monthly-sales.hook";

export default function MonthlySales () {
    const { data, isFetching } = useGetOrderMonthlySales(2026);
    
    if(isFetching) return <ChartSkeleton />

    return (
        <Chart 
            formatToPeso
            labels={data?.monthlySales.map(sale => sale.month) || []}
            title="Monthly Sales"
            values={data?.monthlySales.map(sale => sale.totalSales) || []}
        />
    )
}