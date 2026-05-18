import { useQuery } from "@tanstack/react-query";
import type { GetRoleResponse } from "../../types/role.type";
import { roleService } from "../../services/roleService";

export const useGetOwnRole = () => (
    useQuery<GetRoleResponse, Error>({
        queryKey: ['role'],
        queryFn:() => roleService.getOwnRole(),
        staleTime: Infinity, 
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
)
