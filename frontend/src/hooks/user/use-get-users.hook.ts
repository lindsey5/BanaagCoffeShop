import { useQuery } from "@tanstack/react-query";
import type { GetUsersParams, GetUsersResponse } from "../../types/user.type";
import { userService } from "../../services/userService";

export const useGetUsers = (params : GetUsersParams) => (
    useQuery<GetUsersResponse, Error>({
        queryKey: ['users', params],
        queryFn:() => userService.getUsers(params),
        refetchOnWindowFocus: false,
    })
)
