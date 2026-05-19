import { useMutation } from "@tanstack/react-query";
import { menuService } from "../../services/menuService";

export const useUpdateMenu = () => {
    return useMutation({
        mutationFn: ({ data, id } : { data: FormData, id: string}) =>
            menuService.updateMenu(data, id),
    });
};