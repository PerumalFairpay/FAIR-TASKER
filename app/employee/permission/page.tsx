"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    getPermissionsRequest,
    createPermissionRequest,
    updatePermissionRequest,
    deletePermissionRequest,
    clearPermissionDetails,
} from "@/store/permission/action";
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
import AddEditPermissionDrawer from "./AddEditPermissionDrawer";
import DeletePermissionModal from "./DeletePermissionModal";

import { PermissionGuard } from "@/components/PermissionGuard";

export default function PermissionPage() {
    const dispatch = useDispatch();
    const { permissions, loading, error } = useSelector(
        (state: RootState) => state.Permission
    );

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedPermission, setSelectedPermission] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        module: "",
    });

    useEffect(() => {
        dispatch(getPermissionsRequest());
    }, [dispatch]);

    const handleCreate = () => {
        setMode("create");
        setFormData({ name: "", slug: "", description: "", module: "" });
        onOpen();
    };

    const handleEdit = (permission: any) => {
        setMode("edit");
        setSelectedPermission(permission);
        setFormData({
            name: permission.name,
            slug: permission.slug,
            description: permission.description || "",
            module: permission.module || "",
        });
        onOpen();
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deletePermissionRequest(deleteId));
            onDeleteClose();
        }
    };

    const handleSubmit = () => {
        if (mode === "create") {
            dispatch(createPermissionRequest(formData));
        } else {
            dispatch(updatePermissionRequest(selectedPermission.id, formData));
        }
        onClose();
    };

    return (
        <PermissionGuard permission="permission:view" fallback={<div className="p-6 text-center text-red-500">Access Denied</div>}>
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <PageHeader title="Permissions" />
                    <PermissionGuard permission="permission:submit">
                        <Button
                            color="primary"
                            variant="shadow"
                            endContent={<PlusIcon size={16} />}
                            onPress={handleCreate}
                            className="w-full sm:w-auto font-bold"
                        >
                            Add New Permission
                        </Button>
                    </PermissionGuard>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                    <Table aria-label="Permissions table" removeWrapper isHeaderSticky>
                        <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>SLUG</TableColumn>
                            <TableColumn>MODULE</TableColumn>
                            <TableColumn>DESCRIPTION</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={permissions || []} emptyContent={"No permissions found"} isLoading={loading}>
                            {(item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <p className="text-bold text-sm capitalize">{item.name}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" color="primary">{item.slug}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm">{item.module || "-"}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-default-500">{item.description || "-"}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center justify-center gap-2">
                                            <PermissionGuard permission="permission:submit">
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                                                    <PencilIcon size={16} />
                                                </span>
                                            </PermissionGuard>
                                            <PermissionGuard permission="permission:submit">
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
                        <div className="flex justify-center py-8 text-default-400">Loading permissions...</div>
                    ) : (permissions || []).length > 0 ? (
                        (permissions as any[]).map((item: any) => (
                            <Card key={item.id} className="shadow-sm border border-default-100 bg-white dark:bg-zinc-900/50">
                                <CardBody className="p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-0.5">
                                            <h3 className="text-sm font-bold text-default-900 capitalize">{item.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Chip size="sm" variant="flat" color="primary" className="h-5 text-[10px] font-bold">
                                                    {item.slug}
                                                </Chip>
                                                {item.module && (
                                                    <span className="text-[10px] text-default-400 font-medium px-1.5 py-0.5 bg-default-50 dark:bg-white/5 rounded">
                                                        {item.module}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PermissionGuard permission="permission:submit">
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
                                            <PermissionGuard permission="permission:submit">
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

                                    {item.description && (
                                        <>
                                            <Divider className="opacity-50" />
                                            <p className="text-tiny text-default-500 leading-relaxed italic">
                                                {item.description}
                                            </p>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 text-default-400">No permissions found</div>
                    )}
                </div>

                <AddEditPermissionDrawer
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    mode={mode}
                    formData={formData}
                    setFormData={setFormData}
                    loading={loading}
                    onSubmit={handleSubmit}
                />

                <DeletePermissionModal
                    isOpen={isDeleteOpen}
                    onOpenChange={onDeleteOpenChange}
                    loading={loading}
                    onConfirm={confirmDelete}
                />
            </div>
        </PermissionGuard>
    );
}
