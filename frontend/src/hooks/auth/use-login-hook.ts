import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../lib/store/authStore";

export interface LoginPayload {
    email: string;
    password: string;
}

export const useLogin = () => {
    const { setAuth, setUser } = useAuthStore();
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: ({ email, password }: LoginPayload) =>
            authService.login({ email, password }),

        onSuccess: (data) => {
            setAuth(data.token.accessToken, data.token.refreshToken);
            setUser(data.user);
            navigate('/dashboard');
        },
    });
};