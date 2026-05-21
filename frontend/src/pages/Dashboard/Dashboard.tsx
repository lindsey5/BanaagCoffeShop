import { OrderSalesThisMonth, OrderSalesThisWeek, OrderSalesThisYear, OrderSalesToday, TotalInventoryItems, TotalLowStockItems, TotalOutOfStocks } from "../../components/dashboard/MetricCards";
import MonthlySales from "../../components/dashboard/MonthlySales";
import TopProducts from "../../components/dashboard/TopProducts";
import PageContainer from "../../components/ui/PageContainer";

export default function Dashboard () {
    return (
        <PageContainer title="Dashboard" description="Overview of your system metrics">
           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <OrderSalesToday />
                <OrderSalesThisWeek />
                <OrderSalesThisMonth />
                <OrderSalesThisYear />
                <TotalLowStockItems />
                <TotalOutOfStocks />
                <TotalInventoryItems />
           </div>
           <div className="flex lg:flex-row flex-col gap-5">
                <MonthlySales />
                <TopProducts />
           </div>
        </PageContainer>
    )
}