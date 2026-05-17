import type { AuthResponse, LoginPayload } from "../types/auth.type";
import { apiAxios, HttpMethod } from "../lib/api/apiAxios";

const baseUrl = 'auth'

export const authService = {
    login: (data: LoginPayload): Promise<AuthResponse> =>
        apiAxios<AuthResponse>(`${baseUrl}/login`, {
        method: HttpMethod.POST,
        data,
        }),

    refreshAccessToken: (refreshToken : string): Promise<AuthResponse> => 
        apiAxios<AuthResponse>(`${baseUrl}/refreshToken`, {
            method: HttpMethod.POST,
            data: { refreshToken }
        }),
};