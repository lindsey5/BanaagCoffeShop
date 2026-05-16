import type { AuthResponse, LoginPayload } from "../types/auth.type";
import { apiAxios, HttpMethod } from "../lib/api/apiAxios";

export const authService = {
    login: (data: LoginPayload): Promise<AuthResponse> =>
        apiAxios<AuthResponse>("auth/login", {
        method: HttpMethod.POST,
        data,
        }),

    logout: (): Promise<void> =>
        apiAxios<void>("auth/logout", {
            method: HttpMethod.POST,
        }),

    refreshAccessToken: (refreshToken : string): Promise<AuthResponse> => 
        apiAxios<AuthResponse>("auth/refreshToken", {
        method: HttpMethod.POST,
        data: { refreshToken }
        }),
};