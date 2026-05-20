import { useMutation } from "@tanstack/react-query";
import type { RoleDTO } from "../../types/role.type";
import { roleService } from "../../services/roleService";

export const useCreateRole = () => {
    return useMutation({
        mutationFn: (data: RoleDTO) =>
           roleService.createRole(data),
    });
};