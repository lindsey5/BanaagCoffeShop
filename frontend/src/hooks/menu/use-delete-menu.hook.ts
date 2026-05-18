import { useMutation } from "@tanstack/react-query";
import { menuService } from "../../services/menuService";

export const useDeleteMenu = () => {
    return useMutation({
        mutationFn: (id: string) =>
            menuService.deleteMenu(id),
    });
};