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
import AddEditRoleDrawer from "./AddEditRoleDrawer";
import DeleteRoleModal from "./DeleteRoleModal";

export default function RolePage() {
    const dispatch = useDispatch();
    const { roles, loading, error, success } = useSelector(
        (state: RootState) => state.Role
    );
    const { permissions } = useSelector(
        (state: RootState) => state.Permission
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
        dispatch(getPermissionsRequest());
    }, [dispatch]);

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
            permissions: role.permissions || [],
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Roles" />
                <Button color="primary" endContent={<PlusIcon size={16} />} onPress={handleCreate}>
                    Add New Role
                </Button>
            </div>

            <Table aria-label="Roles table" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn>PERMISSIONS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={roles || []} emptyContent={"No roles found"} isLoading={loading}>
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
                                        item.permissions.slice(0, 3).map((permId: string) => {
                                            const perm = permissions.find((p: any) => p.id === permId);
                                            return (
                                                <Chip key={permId} size="sm" variant="flat">
                                                    {perm ? perm.slug : permId}
                                                </Chip>
                                            );
                                        })
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
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                                        <PencilIcon size={16} />
                                    </span>
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(item.id)}>
                                        <TrashIcon size={16} />
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

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
    );
}

