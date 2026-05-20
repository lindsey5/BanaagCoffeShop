import { useQuery } from "@tanstack/react-query";
import type { GetRoleResponse } from "../../types/role.type";
import { roleService } from "../../services/roleService";

export const useGetRoleById = (id: string) => (
    useQuery<GetRoleResponse, Error>({
        queryKey: [`roles/${id}`],
        queryFn:() => roleService.getRoleById(id),
        refetchOnWindowFocus: false,
    })
)
