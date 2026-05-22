import { apiAxios, HttpMethod } from "../lib/api/apiAxios"
import type { ChangePasswordPayload, CreateUserPayload, UserResponse, GetTotalUsersResponse, GetUsersCountResponse, GetUsersParams, GetUsersResponse, UpdateUserOwnPayload, UpdateUserPayload } from "../types/user.type"

export const userService = {
    updateOwnAccount: (data: UpdateUserOwnPayload) => {
        return apiAxios<UserResponse>("users/me", {
            method: HttpMethod.PUT,
            data,
        })
    },

    getUsers: (params : GetUsersParams) => {
        return apiAxios<GetUsersResponse>("users", {
            method: HttpMethod.GET,
            params
        })
    },

    getUsersCount: () => {
        return apiAxios<GetUsersCountResponse>("users/count", {
            method: HttpMethod.GET,
        })
    },

    getTotalUsers: () => {
        return apiAxios<GetTotalUsersResponse>("users/total", {
            method: HttpMethod.GET,
        })
    },

    createUser: (data : CreateUserPayload) => {
        return apiAxios<UserResponse>("users", {
            method: HttpMethod.POST,
            data
        })
    },

    updateUser: (id : string, data : UpdateUserPayload) => {
        return apiAxios<UserResponse>(`users/${id}`, {
            method: HttpMethod.PUT,
            data
        })
    },

    changePassword: (data: ChangePasswordPayload) => {
        return apiAxios<{ message?: string}>("users/change-password", {
            method: HttpMethod.PATCH,
            data,
        })
    },

    deleteUser: (id : string) => {
        return apiAxios<UserResponse>(`users/${id}`, {
            method: HttpMethod.DELETE,
        })
    },

    isEmailExist: ({id, email} : { id?: string, email: string}) => {
        return apiAxios<UserResponse>(`users/email`, {
            method: HttpMethod.GET,
            params: {
                email,
                id
            }
        })
    },

}