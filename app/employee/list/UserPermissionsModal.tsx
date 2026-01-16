
import React, { useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    updateUserPermissionsRequest,
    getUserPermissionsRequest,
    clearEmployeeDetails,
} from "@/store/employee/action";
import { getPermissionsRequest } from "@/store/permission/action";
import { Chip } from "@heroui/chip";
import { ScrollShadow } from "@heroui/scroll-shadow";

interface UserPermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: any;
}

export default function UserPermissionsModal({
    isOpen,
    onClose,
    employee,
}: UserPermissionsModalProps) {
    const dispatch = useDispatch();
    const { userPermissions, loading: empLoading } = useSelector(
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
        if (userPermissions) {
            setSelected(userPermissions);
        }
    }, [userPermissions]);

    const handleSave = () => {
        if (employee?.id) {
            // We only send the permissions that are explicitly selected for the user
            dispatch(updateUserPermissionsRequest(employee.id, selected));
            onClose();
        }
    };

    // Group permissions by module
    const groupedPermissions = React.useMemo(() => {
        const groups: { [key: string]: any[] } = {};
        allPermissions.forEach((p: any) => {
            const module = p.module || "Other";
            if (!groups[module]) groups[module] = [];
            groups[module].push(p);
        });
        return groups;
    }, [allPermissions]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            User Permissions: {employee?.name}
                        </ModalHeader>
                        <ModalBody>
                            {permLoading || empLoading ? (
                                <div className="flex justify-center p-10">Loading...</div>
                            ) : (
                                <ScrollShadow className="h-[400px]">
                                    <div className="flex flex-col gap-4">
                                        {Object.entries(groupedPermissions).map(([module, perms]) => (
                                            <div key={module} className="border p-4 rounded-lg">
                                                <h3 className="text-lg font-semibold mb-2 text-primary">{module}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {perms.map((p) => (
                                                        <Switch
                                                            key={p.slug}
                                                            size="sm"
                                                            isSelected={selected.includes(p.slug)}
                                                            onValueChange={(isSelected) => {
                                                                if (isSelected) {
                                                                    setSelected([...selected, p.slug]);
                                                                } else {
                                                                    setSelected(selected.filter((s) => s !== p.slug));
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-small">{p.name}</span>
                                                                <span className="text-tiny text-default-400">{p.description}</span>
                                                            </div>
                                                        </Switch>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollShadow>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSave} isLoading={empLoading}>
                                Save Permissions
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
