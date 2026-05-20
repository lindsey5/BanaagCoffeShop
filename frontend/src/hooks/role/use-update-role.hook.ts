import { useMutation } from "@tanstack/react-query";
import type { RoleDTO } from "../../types/role.type";
import { roleService } from "../../services/roleService";

export const useUpdateRole = () => {
    return useMutation({
        mutationFn: ({ data, id } : { data: RoleDTO, id: string }) =>
           roleService.updateRole(id, data),
    });
};