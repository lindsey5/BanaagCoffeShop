import { useMutation } from "@tanstack/react-query";
import type { UpdateProfilePayload } from "../../types/user.type";
import { userService } from "../../services/userService";
import { useAuthStore } from "../../lib/store/authStore";

export const useUpdateProfile = () => {
    const { setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data : UpdateProfilePayload) =>
            userService.updateOwnAccount(data),
        onSuccess: (data) => setUser(data.user)
    });
};