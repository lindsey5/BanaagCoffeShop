import { useMutation } from "@tanstack/react-query";
import type { CreateUserPayload } from "../../types/user.type";
import { userService } from "../../services/userService";

export const useCreateUser = () => {
    return useMutation({
        mutationFn: (data: CreateUserPayload) =>
            userService.createUser(data),
    });
};