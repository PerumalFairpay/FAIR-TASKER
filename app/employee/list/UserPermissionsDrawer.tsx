
import React, { useEffect, useMemo } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    updateUserPermissionsRequest,
    getUserPermissionsRequest,
} from "@/store/employee/action";
import { getPermissionsRequest } from "@/store/permission/action";

interface UserPermissionsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    employee: any;
}

export default function UserPermissionsDrawer({
    isOpen,
    onClose,
    employee,
}: UserPermissionsDrawerProps) {
    const dispatch = useDispatch();
    const {
        userPermissions,
        getPermissionsLoading,
        updatePermissionsLoading
    } = useSelector(
        (state: RootState) => state.Employee
    );
    const { permissions: allPermissions, loading: permLoading } = useSelector(
        (state: RootState) => state.Permission
    );

    const [selected, setSelected] = React.useState<string[]>([]);

    useEffect(() => {
        if (isOpen && employee?.id) {
            dispatch(getPermissionsRequest());
            dispatch(getUserPermissionsRequest(employee.id));
        }
    }, [isOpen, employee, dispatch]);

    useEffect(() => {
        if (userPermissions?.direct_permissions) {
            setSelected(userPermissions.direct_permissions);
        }
    }, [userPermissions]);

    const handleSave = () => {
        if (employee?.id) {
            dispatch(updateUserPermissionsRequest(employee.id, selected));
            onClose();
        }
    };

    const groupedPermissions = useMemo(() => {
        const groups: { [key: string]: any[] } = {};
        allPermissions.forEach((p: any) => {
            const module = p.module || "Other";
            if (!groups[module]) groups[module] = [];
            groups[module].push(p);
        });
        return groups;
    }, [allPermissions]);

    return (
        <Drawer isOpen={isOpen} onOpenChange={onClose} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            User Permissions: {employee?.name}
                        </DrawerHeader>
                        <DrawerBody className="py-6">
                            {permLoading || getPermissionsLoading ? (
                                <div className="flex justify-center p-10">Loading...</div>
                            ) : (
                                <div className="flex flex-col gap-8">
                                    {Object.entries(groupedPermissions).map(([module, perms]) => (
                                        <div key={module} className="flex flex-col gap-3">
                                            {/* Module Separator matching AddEditRoleDrawer */}
                                            <div className="flex items-center gap-2">
                                                <span className="h-px bg-default-200 flex-1"></span>
                                                <p className="text-[10px] font-bold text-default-400 uppercase tracking-wider">{module}</p>
                                                <span className="h-px bg-default-200 flex-1"></span>
                                            </div>

                                            <div className="flex flex-col gap-4 pl-2">
                                                {perms.map((p) => {
                                                    const isRolePermission = userPermissions?.role_permissions?.includes(p.id);
                                                    const isDirectPermission = selected.includes(p.id);
                                                    const isSelected = isRolePermission || isDirectPermission;

                                                    return (
                                                        <Checkbox
                                                            key={p.id}
                                                            value={p.id}
                                                            isSelected={isSelected}
                                                            isDisabled={isRolePermission}
                                                            onValueChange={(checked) => {
                                                                if (isRolePermission) return;
                                                                if (checked) {
                                                                    setSelected([...selected, p.id]);
                                                                } else {
                                                                    setSelected(selected.filter((s) => s !== p.id));
                                                                }
                                                            }}
                                                            classNames={{
                                                                label: "w-full",
                                                                base: "max-w-full"
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex flex-col leading-tight">
                                                                    <span className="text-sm font-medium text-default-700">{p.name}</span>
                                                                    <span className="text-tiny text-default-400 font-mono">{p.slug}</span>
                                                                </div>
                                                                {isRolePermission && (
                                                                    <span className="text-tiny text-default-400 bg-default-100 px-2 py-0.5 rounded-full">Role</span>
                                                                )}
                                                            </div>
                                                        </Checkbox>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    {allPermissions.length === 0 && (
                                        <div className="text-center py-8 bg-default-50 rounded-xl border-2 border-dashed border-default-200">
                                            <p className="text-sm text-default-400 italic">No permissions available.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSave} isLoading={updatePermissionsLoading}>
                                Save Permissions
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
