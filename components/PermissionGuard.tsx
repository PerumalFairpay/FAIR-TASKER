"use client";

import { useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";

interface PermissionGuardProps {
    permission?: string;
    permissions?: string[];
    requireAll?: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * A component that only renders its children if the user has the required permission(s).
 * Admins bypass all permission checks.
 */
export const PermissionGuard = ({
    permission,
    permissions,
    requireAll = false,
    children,
    fallback = null
}: PermissionGuardProps) => {
    const { user } = useSelector((state: AppState) => state.Auth);

    // If no user, or no role, deny access
    if (!user || !user.role) {
        return <>{fallback}</>;
    }

    // Admin bypass
    if (user.role.toLowerCase() === "admin") {
        return <>{children}</>;
    }

    const userPermissions = user.permissions || [];

    // Single permission check
    if (permission) {
        if (userPermissions.includes(permission)) {
            return <>{children}</>;
        }
        return <>{fallback}</>;
    }

    // Multiple permissions check
    if (permissions && permissions.length > 0) {
        if (requireAll) {
            const hasAll = permissions.every(p => userPermissions.includes(p));
            return hasAll ? <>{children}</> : <>{fallback}</>;
        } else {
            const hasAny = permissions.some(p => userPermissions.includes(p));
            return hasAny ? <>{children}</> : <>{fallback}</>;
        }
    }

    // If no permission requirements provided, allow access
    return <>{children}</>;
};
