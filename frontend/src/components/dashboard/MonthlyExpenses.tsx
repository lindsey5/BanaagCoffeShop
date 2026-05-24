import { useState } from "react";
import Chart, { ChartSkeleton } from "../ui/Chart";
import Dropdown from "../ui/Dropdown";
import { useGetMonthlyExpenses } from "../../hooks/stock-in/use-get-monthly-expenses.hook";

export const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const currentYear = new Date().getFullYear();
    const y = currentYear - i;
    return { label: y.toString(), value: y.toString() };
});

export default function MonthlyExpenses () {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<string>(currentYear.toString());

    const { data, isFetching } = useGetMonthlyExpenses(Number(year));
    
    if(isFetching) return <ChartSkeleton />

    return (
        <div className="relative flex-1">
            <Dropdown
                className="absolute right-5 top-5"
                options={yearOptions}
                value={year}
                onChange={setYear}
            />
            <Chart 
                formatToPeso
                labels={data?.monthlyExpenses.map(sale => sale.month) || []}
                title="Monthly Expenses"
                values={data?.monthlyExpenses.map(sale => sale.totalExpenses) || []}
            />
        </div>
    )
}