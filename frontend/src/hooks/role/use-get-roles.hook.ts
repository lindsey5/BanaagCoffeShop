import { useQuery } from "@tanstack/react-query";
import type { GetRolesResponse } from "../../types/role.type";
import { roleService } from "../../services/roleService";

export const useGetRoles = () => (
    useQuery<GetRolesResponse, Error>({
        queryKey: ['roles'],
        queryFn:() => roleService.getRoles(),
        refetchOnWindowFocus: false,
    })
)
