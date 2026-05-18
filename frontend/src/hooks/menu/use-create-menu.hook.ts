import { useMutation } from "@tanstack/react-query";
import type { MenuDTO } from "../../types/menu.type";
import { menuService } from "../../services/menuService";

export const useCreateMenu = () => {
    return useMutation({
        mutationFn: (data: MenuDTO) =>
            menuService.createMenu(data),
    });
};