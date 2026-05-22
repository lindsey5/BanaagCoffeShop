import { useMutation } from "@tanstack/react-query";
import type { UpdateUserPayload } from "../../types/user.type";
import { userService } from "../../services/userService";

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: ({ data, id } : { data: UpdateUserPayload, id: string }) =>
            userService.updateUser(id, data),
    });
};