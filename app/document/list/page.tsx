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
            dispatch(
                getDocumentsRequest({
                    ...(search ? { search } : {}),
                    ...(status ? { status } : {}),
                })
            );
        },
        [dispatch]
    );

    // Initial load
    useEffect(() => {
        dispatch(getDocumentCategoriesRequest());
        fetchDocuments("", "");
    }, [dispatch]);

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
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <PageHeader
                        title="Document Management"
                        description="Manage and track your documents"
                    />
                    <PermissionGuard permission="document:submit">
                        <Button color="primary" variant="shadow" endContent={<PlusIcon size={16} />} onPress={handleCreate}>
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
                        className="sm:max-w-xs"
                    />
                    <Select
                        placeholder="All Status"
                        selectedKeys={statusFilter ? [statusFilter] : [""]}
                        onChange={handleStatusChange}
                        variant="bordered"
                        className="sm:max-w-[160px]"
                        aria-label="Filter by status"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.key} textValue={opt.label}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                {/* Table */}
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
                    <TableBody items={documents || []} emptyContent="No documents found" loadingContent="Loading..." isLoading={getDocumentsLoading}>
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
