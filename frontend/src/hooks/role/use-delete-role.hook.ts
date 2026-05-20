import { useMutation } from "@tanstack/react-query";
import { roleService } from "../../services/roleService";

export const useDeleteRole = () => {
    return useMutation({
        mutationFn: (id: string) =>
           roleService.deleteRole(id),
    });
};