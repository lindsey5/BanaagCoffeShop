import type { PaginationResponse, PaginationParams } from "./pagination.type";
import type { Role } from "./role.type";
import type { ApiResponse } from "./types";

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role_id: string;
    role: string;
    createdAt: Date;
}

export interface UserResponse extends ApiResponse {
    user: User
}

export interface CreateUserPayload {
    firstname: string;
    lastname: string;
    email: string;
    role_id: string;
    password: string;
}

export interface UpdateUserOwnPayload {
    firstname: string;
    lastname: string;
    email: string
}

export interface UpdateUserPayload {
    firstname: string;
    lastname: string;
    email: string
    role_id: string;
    password?: string;
}

export interface GetUsersCountResponse {
    success: boolean,
    usersCount: {
        role_name: string;
        total: number;
    }[]
}

export interface GetUser {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    role_id: string;
    role: Role;
    createdAt: Date;
}

export interface GetUsersParams extends PaginationParams {
    search?: string;
    role?: string;
}

export interface GetUsersResponse extends PaginationResponse {
    users: GetUser[]
}

export interface ChangePasswordPayload { 
    currentPassword: string; 
    newPassword: string;
    confirmPassword: string;
}

export interface GetTotalUsersResponse {
    success: boolean;
    totalUsers: number;
}