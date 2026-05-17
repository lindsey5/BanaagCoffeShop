import type { User } from "./user.type"

export interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null

    setAuth: (accessToken: string, refreshToken: string) => void
    setUser: (user : User) => void
    isAuthenticated: () => boolean
    logout: () => void
}

export interface AuthResponse { 
    success: boolean
    user: User,
    message?: string,
    token: {
        accessToken: string
        refreshToken: string
    }
}

export interface LoginPayload {
    email: string;
    password: string;
}