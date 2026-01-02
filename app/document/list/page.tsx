"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getDocumentsRequest,
    createDocumentRequest,
    updateDocumentRequest,
    deleteDocumentRequest,
    clearDocumentDetails,
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
import { PlusIcon, PencilIcon, TrashIcon, FileIcon, DownloadIcon } from "lucide-react";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import AddEditDocumentDrawer from "./AddEditDocumentDrawer";
import DeleteDocumentModal from "./DeleteDocumentModal";

export default function DocumentListPage() {
    const dispatch = useDispatch();
    const { documents, loading, success } = useSelector((state: RootState) => state.Document);
    const { documentCategories } = useSelector((state: RootState) => state.DocumentCategory);

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

    useEffect(() => {
        dispatch(getDocumentsRequest());
        dispatch(getDocumentCategoriesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onClose();
            onDeleteClose();
            dispatch(clearDocumentDetails());
            setDocumentToDelete(null);
        }
    }, [success, onClose, onDeleteClose, dispatch]);

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

    const handleSubmit = (formData: FormData) => {
        if (mode === "create") {
            dispatch(createDocumentRequest(formData));
        } else {
            dispatch(updateDocumentRequest(selectedDocument.id, formData));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Document Management</h1>
                    <p className="text-default-500">Manage and track your documents</p>
                </div>
                <Button color="primary" endContent={<PlusIcon size={16} />} onPress={handleCreate}>
                    Upload Document
                </Button>
            </div>

            <Table aria-label="Documents Table" shadow="sm" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>CATEGORY</TableColumn>
                    <TableColumn>UPLOAD DATE</TableColumn>
                    <TableColumn>EXPIRY DATE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={documents || []} emptyContent="No documents found" loadingContent="Loading..." isLoading={loading}>
                    {(doc: any) => {
                        const category = documentCategories?.find((c: any) => c.id === doc.document_category_id);
                        return (
                            <TableRow key={doc.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <FileIcon size={18} className="text-default-400" />
                                        <span className="font-medium">{doc.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{category?.name || "N/A"}</TableCell>
                                <TableCell>
                                    {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "-"}
                                </TableCell>
                                <TableCell>{doc.expiry_date || "-"}</TableCell>
                                <TableCell>
                                    <Chip
                                        color={doc.status === "Active" ? "success" : "danger"}
                                        variant="flat"
                                        size="sm"
                                    >
                                        {doc.status}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        {doc.file_path && (
                                            <Button size="sm" isIconOnly variant="light" as="a" href={doc.file_path} target="_blank">
                                                <DownloadIcon size={16} />
                                            </Button>
                                        )}
                                        <Button size="sm" isIconOnly variant="light" color="warning" onPress={() => handleEdit(doc)}>
                                            <PencilIcon size={16} />
                                        </Button>
                                        <Button size="sm" isIconOnly variant="light" color="danger" onPress={() => handleDeleteClick(doc.id)}>
                                            <TrashIcon size={16} />
                                        </Button>
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
                loading={loading}
                onSubmit={handleSubmit}
            />
            <DeleteDocumentModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={handleConfirmDelete}
                loading={loading}
            />
        </div>
    );
}
