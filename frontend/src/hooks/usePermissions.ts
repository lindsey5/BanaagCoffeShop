import { useGetOwnRole } from "./role/use-get-own-role";

export default function usePermissions () {
    const { data, isFetching } = useGetOwnRole();
    const permissions = data?.permissions || [];

    return {
        hasPermissions: (requiredPermissions : string[]) => {
            if(permissions.length === 0) return false;
            return requiredPermissions.every(permission => permissions.includes(permission))
        },
        hasAnyPermissions: (anyPermissions: string[]) => {
            if (permissions.length === 0) return false;
            return anyPermissions.some(permission => permissions.includes(permission));
        },
        isLoading: isFetching
    }
}