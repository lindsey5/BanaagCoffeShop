import { OrderSalesThisMonth, OrderSalesThisWeek, OrderSalesThisYear, OrderSalesToday } from "../../components/dashboard/MetricCards";
import MonthlySales from "../../components/dashboard/MonthlySales";
import PageContainer from "../../components/ui/PageContainer";

export default function Dashboard () {
    return (
        <PageContainer title="Dashboard" description="">
           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <OrderSalesToday />
                <OrderSalesThisWeek />
                <OrderSalesThisMonth />
                <OrderSalesThisYear />
           </div>
           <MonthlySales />
        </PageContainer>
    )
}