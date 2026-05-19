import { useMutation } from "@tanstack/react-query";
import { menuService } from "../../services/menuService";

export const useCreateMenu = () => {
    return useMutation({
        mutationFn: (data: FormData) =>
            menuService.createMenu(data),
    });
};