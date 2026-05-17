import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type {
    GetRolesResponse,
    GetRoleResponse,
    RoleDTO,
    UpdateRoleResponse,
    CreateRoleResponse
} from "../types/role.type";
import type { ApiResponse } from "../types/types";

const baseUrl = 'roles';

export const roleService = {
    getOwnRole: (): Promise<GetRoleResponse> => {
        return apiAxios<GetRoleResponse>(`${baseUrl}/me`, {
            method: HttpMethod.GET,
        });
    },

    getRoles: (): Promise<GetRolesResponse> => {
        return apiAxios<GetRolesResponse>(baseUrl, {
            method: HttpMethod.GET,
        });
    },

    createRole: (data: RoleDTO): Promise<CreateRoleResponse> => {
        return apiAxios<CreateRoleResponse>(baseUrl, {
            method: HttpMethod.POST,
            data
        });
    },

    getRoleById: (id: string): Promise<GetRoleResponse> => {
        return apiAxios<GetRoleResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.GET,
        });
    },

    updateRole: (id: string, data: RoleDTO): Promise<UpdateRoleResponse> => {
        return apiAxios<UpdateRoleResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.PUT,
            data
        });
    },

    deleteRole: (id: string): Promise<ApiResponse> => {
        return apiAxios<ApiResponse>(`${baseUrl}/${id}`, {
            method: HttpMethod.DELETE
        });
    },
};