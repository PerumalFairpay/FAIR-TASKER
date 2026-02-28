"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    getRolesRequest,
    createRoleRequest,
    updateRoleRequest,
    deleteRoleRequest,
    clearRoleDetails,
} from "@/store/role/action";
import { getPermissionsRequest } from "@/store/permission/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { useDisclosure } from "@heroui/modal";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import AddEditRoleDrawer from "./AddEditRoleDrawer";
import DeleteRoleModal from "./DeleteRoleModal";

import { PermissionGuard } from "@/components/PermissionGuard";

export default function RolePage() {
    const dispatch = useDispatch();
    const { roles, loading, error, success } = useSelector(
        (state: RootState) => state.Role
    );



    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        permissions: [] as string[], // List of Permission IDs
    });

    useEffect(() => {
        dispatch(getRolesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (isOpen) {
            dispatch(getPermissionsRequest());
        }
    }, [dispatch, isOpen]);

    useEffect(() => {
        if (success) {
            onClose();
            onDeleteClose();
            dispatch(clearRoleDetails());
        }
    }, [success, onClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setFormData({ name: "", description: "", permissions: [] });
        onOpen();
    };

    const handleEdit = (role: any) => {
        setMode("edit");
        setSelectedRole(role);
        setFormData({
            name: role.name,
            description: role.description || "",
            // Extract IDs from permission objects
            permissions: role.permissions ? role.permissions.map((p: any) => p.id) : [],
        });
        onOpen();
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteRoleRequest(deleteId));
        }
    };

    const handleSubmit = () => {
        const payload = {
            name: formData.name,
            description: formData.description,
            permissions: formData.permissions,
        };

        if (mode === "create") {
            dispatch(createRoleRequest(payload));
        } else {
            dispatch(updateRoleRequest(selectedRole.id, payload));
        }
    };

    return (
        <PermissionGuard permission="role:view" fallback={<div className="p-6 text-center text-red-500">Access Denied</div>}>
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <PageHeader title="Roles" />
                    <PermissionGuard permission="role:submit">
                        <Button
                            color="primary"
                            variant="shadow"
                            endContent={<PlusIcon size={16} />}
                            onPress={handleCreate}
                            className="w-full sm:w-auto font-bold"
                        >
                            Add New Role
                        </Button>
                    </PermissionGuard>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                    <Table aria-label="Roles table" removeWrapper isHeaderSticky>
                        <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>DESCRIPTION</TableColumn>
                            <TableColumn>PERMISSIONS</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={Array.isArray(roles) ? roles : []} emptyContent={"No roles found"} isLoading={loading}>
                            {(item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm capitalize">{item.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm text-default-500">{item.description || "-"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap max-w-xs">
                                            {item.permissions && item.permissions.length > 0 ? (
                                                item.permissions.slice(0, 3).map((perm: any) => (
                                                    <Chip key={perm.id} size="sm" variant="flat">
                                                        {perm.name}
                                                    </Chip>
                                                ))
                                            ) : (
                                                <span className="text-default-400 text-sm">-</span>
                                            )}
                                            {item.permissions && item.permissions.length > 3 && (
                                                <Chip size="sm" variant="flat">+{item.permissions.length - 3}</Chip>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center justify-center gap-2">
                                            <PermissionGuard permission="role:submit">
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                                                    <PencilIcon size={16} />
                                                </span>
                                            </PermissionGuard>
                                            <PermissionGuard permission="role:submit">
                                                <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(item.id)}>
                                                    <TrashIcon size={16} />
                                                </span>
                                            </PermissionGuard>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-8 text-default-400">Loading roles...</div>
                    ) : (Array.isArray(roles) ? roles : []).length > 0 ? (
                        (roles as any[]).map((item: any) => (
                            <Card key={item.id} className="shadow-sm border border-default-100 bg-white dark:bg-zinc-900/50">
                                <CardBody className="p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-0.5">
                                            <h3 className="text-sm font-bold text-default-900 capitalize">{item.name}</h3>
                                            <p className="text-tiny text-default-500">{item.description || "No description"}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PermissionGuard permission="role:submit">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="flat"
                                                    onPress={() => handleEdit(item)}
                                                    className="bg-default-50 dark:bg-white/5"
                                                >
                                                    <PencilIcon size={14} className="text-default-400" />
                                                </Button>
                                            </PermissionGuard>
                                            <PermissionGuard permission="role:submit">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="flat"
                                                    color="danger"
                                                    onPress={() => handleDelete(item.id)}
                                                    className="bg-danger-50 dark:bg-danger/10"
                                                >
                                                    <TrashIcon size={14} className="text-danger" />
                                                </Button>
                                            </PermissionGuard>
                                        </div>
                                    </div>

                                    <Divider className="opacity-50" />

                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Permissions</span>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {item.permissions && item.permissions.length > 0 ? (
                                                item.permissions.slice(0, 5).map((perm: any) => (
                                                    <Chip key={perm.id} size="sm" variant="flat" className="h-5 text-[10px]">
                                                        {perm.name}
                                                    </Chip>
                                                ))
                                            ) : (
                                                <span className="text-tiny text-default-300 italic">No permissions assigned</span>
                                            )}
                                            {item.permissions && item.permissions.length > 5 && (
                                                <Chip size="sm" variant="flat" className="h-5 text-[10px]">
                                                    +{item.permissions.length - 5} more
                                                </Chip>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 text-default-400">No roles found</div>
                    )}
                </div>

                <AddEditRoleDrawer
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    mode={mode}
                    formData={formData}
                    setFormData={setFormData}
                    loading={loading}
                    onSubmit={handleSubmit}
                />

                <DeleteRoleModal
                    isOpen={isDeleteOpen}
                    onOpenChange={onDeleteOpenChange}
                    loading={loading}
                    onConfirm={confirmDelete}
                />
            </div>
        </PermissionGuard>
    );
}

