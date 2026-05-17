import type { ApiResponse } from "./types";

export interface Role {
    _id: string;
    name: string
    description: string
    permissions: Permission[]
    createdAt: Date;
}

export interface Permission {
    _id: string;
    action: string;
    role_id: number;
}

export interface GetRoleResponse {
    success: boolean
    role: Role
    permissions: string[]
}

export interface RoleWithUsersCount extends Role{
    usersCount: number;
}

export interface GetRolesResponse {
    success: boolean
    roles: RoleWithUsersCount[]
}

export interface CreateRoleResponse extends ApiResponse{
    role: Role
    permissions: Permission[]
}

export interface RoleDTO {
    name: string,
    description: string,
    permissions: string[]
}

export interface UpdateRoleResponse extends ApiResponse {
    role: Role
}