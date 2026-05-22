import { useMutation } from "@tanstack/react-query";
import { userService } from "../../services/userService";

export const useDeleteUser = () => {
    return useMutation({
        mutationFn: (id: string) =>
            userService.deleteUser(id),
    });
};