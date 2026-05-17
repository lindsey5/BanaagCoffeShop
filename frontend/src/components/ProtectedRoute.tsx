import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import usePermissions from '../hooks/usePermissions';
import { useAuthStore } from '../lib/store/authStore';

type ProtectedRouteProps = {
    children: ReactNode;
    requireAuthentication?: boolean;
    requiredPermissions?: string[];
    anyPermissions?: string[];
    redirectTo?: string;
};

export const ProtectedRoute = ({
    children,
    requireAuthentication = true,
    requiredPermissions = [],
    anyPermissions = [],
    redirectTo = '/',
}: ProtectedRouteProps) => {
    const {
        isLoading,
        hasPermissions,
        hasAnyPermissions
    } = usePermissions();
    const { isAuthenticated } = useAuthStore();

    if(isLoading) return <div>Loading...</div>
    
    if (requireAuthentication && !isAuthenticated()) {
        return <Navigate to={redirectTo} replace />;
    }

    if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = hasPermissions(requiredPermissions);

        if (!hasRequiredPermissions) {
            return <div>Unauthorized</div>
        }
    }

    if (anyPermissions.length > 0) {
        const hasAnyPermission = hasAnyPermissions(anyPermissions);

        if (!hasAnyPermission) {
            return <div>Unauthorized</div>
        }
    }
    
    return <>{children}</>;
};