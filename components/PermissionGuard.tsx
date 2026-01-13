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
 * Helper function to check permissions
 */
export const hasPermission = (user: any, permission?: string, permissions?: string[], requireAll = false) => {
    if (!user || !user.role) return false;
    if (user.role.toLowerCase() === "admin") return true;

    const userPermissions = user.permissions || [];

    if (permission) {
        return userPermissions.includes(permission);
    }

    if (permissions && permissions.length > 0) {
        if (requireAll) {
            return permissions.every(p => userPermissions.includes(p));
        } else {
            return permissions.some(p => userPermissions.includes(p));
        }
    }

    return true;
};

/**
 * Hook to check permissions in functional components
 */
export const usePermissions = () => {
    const { user } = useSelector((state: AppState) => state.Auth);

    return {
        hasPermission: (permission?: string, permissions?: string[], requireAll = false) =>
            hasPermission(user, permission, permissions, requireAll),
        user,
        isAdmin: user?.role?.toLowerCase() === "admin"
    };
};

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

    if (hasPermission(user, permission, permissions, requireAll)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
