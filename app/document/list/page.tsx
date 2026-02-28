"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getDocumentsRequest,
    createDocumentRequest,
    updateDocumentRequest,
    deleteDocumentRequest,
    clearDocumentDetails,
    updateDocumentStatusRequest,
} from "@/store/document/action";
import { getDocumentCategoriesRequest } from "@/store/documentCategory/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { PlusIcon, PencilIcon, TrashIcon, DownloadIcon, SearchIcon } from "lucide-react";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import AddEditDocumentDrawer from "./AddEditDocumentDrawer";
import DeleteDocumentModal from "./DeleteDocumentModal";
import { PageHeader } from "@/components/PageHeader";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import { usePermissions, PermissionGuard } from "@/components/PermissionGuard";

const STATUS_OPTIONS = [
    { key: "", label: "All Status" },
    { key: "Active", label: "Active" },
    { key: "Inactive", label: "Inactive" },
    { key: "Expired", label: "Expired" },
    { key: "Archived", label: "Archived" },
];

const statusColorMap: Record<string, "success" | "danger" | "warning" | "default"> = {
    Active: "success",
    Inactive: "danger",
    Expired: "warning",
    Archived: "default",
};

export default function DocumentListPage() {
    const dispatch = useDispatch();
    const {
        documents,
        getDocumentsLoading,
        createDocumentSuccessMessage,
        updateDocumentSuccessMessage,
        deleteDocumentSuccessMessage,
        updateDocumentStatusSuccessMessage,
        createDocumentLoading,
        updateDocumentLoading,
        deleteDocumentLoading,
        updateDocumentStatusLoading
    } = useSelector((state: RootState) => state.Document);
    const { documentCategories } = useSelector((state: RootState) => state.DocumentCategory);
    const { hasPermission } = usePermissions();
    const canManageDocs = hasPermission("document:submit");

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onOpenChange: onDeleteOpenChange,
        onClose: onDeleteClose
    } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

    // Filter state
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Fetch with current filters
    const fetchDocuments = useCallback(
        (search: string, status: string) => {
            const finalStatus = canManageDocs ? status : "Active";
            dispatch(
                getDocumentsRequest({
                    ...(search ? { search } : {}),
                    ...(finalStatus ? { status: finalStatus } : {}),
                })
            );
        },
        [dispatch, canManageDocs]
    );

    // Initial load
    useEffect(() => {
        dispatch(getDocumentCategoriesRequest());
        fetchDocuments("", canManageDocs ? "" : "Active");
    }, [dispatch, canManageDocs]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDocuments(searchValue, statusFilter);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchValue]);

    // Immediate status filter
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setStatusFilter(val);
        fetchDocuments(searchValue, val);
    };

    useEffect(() => {
        if (createDocumentSuccessMessage || updateDocumentSuccessMessage || deleteDocumentSuccessMessage || updateDocumentStatusSuccessMessage) {
            onClose();
            onDeleteClose();
            dispatch(clearDocumentDetails());
            setDocumentToDelete(null);
        }
    }, [createDocumentSuccessMessage, updateDocumentSuccessMessage, deleteDocumentSuccessMessage, updateDocumentStatusSuccessMessage]);

    const handleCreate = () => {
        setMode("create");
        setSelectedDocument(null);
        onOpen();
    };

    const handleEdit = (doc: any) => {
        setMode("edit");
        setSelectedDocument(doc);
        onOpen();
    };

    const handleDeleteClick = (id: string) => {
        setDocumentToDelete(id);
        onDeleteOpen();
    };

    const handleConfirmDelete = () => {
        if (documentToDelete) {
            dispatch(deleteDocumentRequest(documentToDelete));
        }
    };

    const handleStatusUpdate = (id: string, newStatus: string) => {
        dispatch(updateDocumentStatusRequest(id, newStatus));
    };

    const handleSubmit = (formData: FormData) => {
        if (mode === "create") {
            dispatch(createDocumentRequest(formData));
        } else {
            dispatch(updateDocumentRequest(selectedDocument.id, formData));
        }
    };

    return (
        <PermissionGuard permission="document:view" fallback={<div className="p-6 text-center text-red-500">Access Denied</div>}>
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <PageHeader
                        title="Document Management"
                        description="Manage and track your documents"
                    />
                    <PermissionGuard permission="document:submit">
                        <Button
                            color="primary"
                            variant="shadow"
                            endContent={<PlusIcon size={16} />}
                            onPress={handleCreate}
                            className="w-full sm:w-auto"
                        >
                            Upload Document
                        </Button>
                    </PermissionGuard>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <Input
                        placeholder="Search by document name..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        startContent={<SearchIcon size={16} className="text-default-400" />}
                        isClearable
                        onClear={() => setSearchValue("")}
                        variant="bordered"
                        className="w-full sm:max-w-xs"
                    />
                    <PermissionGuard permission="document:submit">
                        <Select
                            placeholder="All Status"
                            selectedKeys={statusFilter ? [statusFilter] : [""]}
                            onChange={handleStatusChange}
                            variant="bordered"
                            className="w-full sm:max-w-[160px]"
                            aria-label="Filter by status"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.key} textValue={opt.label}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </PermissionGuard>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <Table aria-label="Documents Table" shadow="sm" removeWrapper isHeaderSticky>
                        <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>CATEGORY</TableColumn>
                            <TableColumn>SUBCATEGORY</TableColumn>
                            <TableColumn>UPLOAD DATE</TableColumn>
                            <TableColumn>EXPIRY DATE</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={canManageDocs ? (documents || []) : (documents || []).filter((doc: any) => doc.status === "Active")}
                            emptyContent="No documents found"
                            loadingContent="Loading..."
                            isLoading={getDocumentsLoading}
                        >
                            {(doc: any) => {
                                const category = documentCategories?.find((c: any) => c.id === doc.document_category_id);
                                const subcategory = documentCategories?.find((c: any) => c.id === doc.document_subcategory_id);
                                return (
                                    <TableRow key={doc.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileTypeIcon fileType={doc.file_type} fileName={doc.name} />
                                                <span className="font-medium">{doc.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{category?.name || "N/A"}</TableCell>
                                        <TableCell>{subcategory?.name || "-"}</TableCell>
                                        <TableCell>
                                            {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell>{doc.expiry_date || "-"}</TableCell>
                                        <TableCell>
                                            {hasPermission("document:submit") ? (
                                                <Select
                                                    size="sm"
                                                    selectedKeys={[doc.status]}
                                                    onChange={(e) => {
                                                        if (e.target.value && e.target.value !== doc.status) {
                                                            handleStatusUpdate(doc.id, e.target.value);
                                                        }
                                                    }}
                                                    variant="flat"
                                                    color={statusColorMap[doc.status] || "default"}
                                                    className="w-[120px]"
                                                    aria-label="Update Status"
                                                >
                                                    {STATUS_OPTIONS.filter((opt) => opt.key !== "").map((opt) => (
                                                        <SelectItem key={opt.key} textValue={opt.label}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <Chip
                                                    color={statusColorMap[doc.status] || "default"}
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {doc.status}
                                                </Chip>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                {doc.file_path && (
                                                    <Button
                                                        size="sm"
                                                        isIconOnly
                                                        variant="light"
                                                        as="a"
                                                        href={`${doc.file_path}?filename=${encodeURIComponent(doc.name)}`}
                                                        target="_blank"
                                                    >
                                                        <DownloadIcon size={16} />
                                                    </Button>
                                                )}
                                                {hasPermission("document:submit") && (
                                                    <>
                                                        <Button size="sm" isIconOnly variant="light" color="warning" onPress={() => handleEdit(doc)}>
                                                            <PencilIcon size={16} />
                                                        </Button>
                                                        <Button size="sm" isIconOnly variant="light" color="danger" onPress={() => handleDeleteClick(doc.id)}>
                                                            <TrashIcon size={16} />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            }}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card View — NDA style */}
                <div className="md:hidden space-y-4">
                    {getDocumentsLoading ? (
                        <div className="flex justify-center py-8 text-default-400">Loading documents...</div>
                    ) : (() => {
                        const docs = canManageDocs
                            ? (documents || [])
                            : (documents || []).filter((d: any) => d.status === "Active");
                        return docs.length > 0 ? (
                            docs.map((doc: any) => {
                                const category = documentCategories?.find((c: any) => c.id === doc.document_category_id);
                                const subcategory = documentCategories?.find((c: any) => c.id === doc.document_subcategory_id);
                                return (
                                    <Card key={doc.id} className="shadow-sm border border-default-100 bg-white dark:bg-zinc-900/50">
                                        <CardBody className="p-4 flex flex-col gap-4">
                                            {/* Header: Name + file icon + status */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-2 min-w-0">
                                                    <div className="shrink-0 mt-0.5">
                                                        <FileTypeIcon fileType={doc.file_type} fileName={doc.name} />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 min-w-0">
                                                        <h3 className="text-sm font-bold text-default-900 truncate">{doc.name}</h3>
                                                        <p className="text-[10px] text-default-300 uppercase font-bold tracking-wider">
                                                            {category?.name || "N/A"}
                                                            {subcategory?.name ? ` › ${subcategory.name}` : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Status: dropdown for admins, chip for others */}
                                                {hasPermission("document:submit") ? (
                                                    <Select
                                                        size="sm"
                                                        selectedKeys={[doc.status]}
                                                        onChange={(e) => {
                                                            if (e.target.value && e.target.value !== doc.status) {
                                                                handleStatusUpdate(doc.id, e.target.value);
                                                            }
                                                        }}
                                                        variant="flat"
                                                        color={statusColorMap[doc.status] || "default"}
                                                        className="w-[110px] shrink-0"
                                                        aria-label="Update Status"
                                                    >
                                                        {STATUS_OPTIONS.filter((opt) => opt.key !== "").map((opt) => (
                                                            <SelectItem key={opt.key} textValue={opt.label}>
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                ) : (
                                                    <Chip
                                                        color={statusColorMap[doc.status] || "default"}
                                                        variant="flat"
                                                        size="sm"
                                                        className="h-6 shrink-0"
                                                    >
                                                        {doc.status}
                                                    </Chip>
                                                )}
                                            </div>

                                            <Divider className="opacity-50" />

                                            {/* NDA-style compact info bar */}
                                            <div className="flex justify-between items-center bg-default-50 dark:bg-white/5 p-2 rounded-xl">
                                                <div className="flex gap-4 items-center">
                                                    {/* Upload Date */}
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-bold text-default-400 uppercase">Uploaded</span>
                                                        <span className="text-tiny">
                                                            {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "-"}
                                                        </span>
                                                    </div>
                                                    {/* Expiry */}
                                                    <div className="flex flex-col gap-0.5 border-l border-default-200 dark:border-white/10 pl-4">
                                                        <span className="text-[9px] font-bold text-default-400 uppercase">Expiry</span>
                                                        <span className="text-tiny">{doc.expiry_date || "-"}</span>
                                                    </div>
                                                </div>
                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    {doc.file_path && (
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="flat"
                                                            as="a"
                                                            href={`${doc.file_path}?filename=${encodeURIComponent(doc.name)}`}
                                                            target="_blank"
                                                            className="bg-white dark:bg-zinc-800"
                                                        >
                                                            <DownloadIcon size={14} className="text-default-500" />
                                                        </Button>
                                                    )}
                                                    {hasPermission("document:submit") && (
                                                        <>
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="flat"
                                                                color="warning"
                                                                onPress={() => handleEdit(doc)}
                                                            >
                                                                <PencilIcon size={14} />
                                                            </Button>
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="flat"
                                                                color="danger"
                                                                onPress={() => handleDeleteClick(doc.id)}
                                                            >
                                                                <TrashIcon size={14} />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 text-default-400">No documents found</div>
                        );
                    })()}
                </div>

                <AddEditDocumentDrawer
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    mode={mode}
                    selectedDocument={selectedDocument}
                    loading={mode === "create" ? createDocumentLoading : updateDocumentLoading}
                    onSubmit={handleSubmit}
                />
                <DeleteDocumentModal
                    isOpen={isDeleteOpen}
                    onOpenChange={onDeleteOpenChange}
                    onConfirm={handleConfirmDelete}
                    loading={deleteDocumentLoading}
                />
            </div>
        </PermissionGuard>
    );
}
