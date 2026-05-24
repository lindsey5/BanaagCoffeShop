import { useQuery } from "@tanstack/react-query";
import type { GetMonthlyExpensesResponse } from "../../types/stockIn.type";
import { stockInService } from "../../services/stockInService";

export const useGetMonthlyExpenses = (year: number = 2026) => (
    useQuery<GetMonthlyExpensesResponse, Error>({
        queryKey: [`monthly-expenses`, year],
        queryFn: () => stockInService.getMonthlyExpenses(year),
        refetchOnWindowFocus: false,
    })
)