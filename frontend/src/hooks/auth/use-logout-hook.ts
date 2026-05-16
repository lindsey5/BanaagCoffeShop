import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../lib/store/authStore";

export const logoutMutate = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
        const { logout } = useAuthStore.getState();
        logout();
    },
});
