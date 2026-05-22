import { useQuery } from "@tanstack/react-query";
import type { GetTotalUsersResponse } from "../../types/user.type";
import { userService } from "../../services/userService";

export const useGetTotalUsers = () => (
    useQuery<GetTotalUsersResponse, Error>({
        queryKey: ['users/total'],
        queryFn:() => userService.getTotalUsers(),
        refetchOnWindowFocus: false,
    })
)
