import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordPayload } from "../../types/user.type";
import { userService } from "../../services/userService";

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data : ChangePasswordPayload) =>
            userService.changePassword(data)
    });
};