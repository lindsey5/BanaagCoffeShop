import { useMutation } from "@tanstack/react-query";
import type { MenuDTO } from "../../types/menu.type";
import { menuService } from "../../services/menuService";

export const useUpdateMenu = () => {
    return useMutation({
        mutationFn: ({ data, id } : { data: MenuDTO, id: string}) =>
            menuService.updateMenu(data, id),
    });
};