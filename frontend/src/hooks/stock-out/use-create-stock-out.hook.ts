import { useMutation } from "@tanstack/react-query";
import type { CreateStockOutDTO } from "../../types/stockOut.type";
import { stockOutService } from "../../services/stockOutService";

export const useCreateStockOut = () => {
    return useMutation({
        mutationFn: (data: CreateStockOutDTO) =>
            stockOutService.createStockOut(data),
    });
};