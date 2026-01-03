"use client";

import React, { useEffect, useState } from "react";
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
import AddEditPermissionModal from "./AddEditPermissionModal";
import DeletePermissionModal from "./DeletePermissionModal";

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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Permissions</h1>
                <Button color="primary" endContent={<PlusIcon size={16} />} onPress={handleCreate}>
                    Add New Permission
                </Button>
            </div>

            <Table aria-label="Permissions table">
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

            <AddEditPermissionModal
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
    );
}
