"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    generateNDARequest,
    getNDAListRequest,
    clearNDAState,
} from "@/store/nda/action";
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
import { PlusIcon, CheckCircle2, Clock, FileText, Copy, FolderOpen } from "lucide-react";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { PermissionGuard } from "@/components/PermissionGuard";
import GenerateNDADrawer from "./GenerateNDADrawer";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Eye, Download } from "lucide-react";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import DownloadButton, { PDFDownloadButton } from "@/components/common/DownloadButton";

export default function NDAPage() {
    const dispatch = useDispatch();
    const { ndaList, generatedLink, loading, success, error } = useSelector(
        (state: RootState) => state.NDA
    );

    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onOpenChange: onDrawerOpenChange, onClose: onDrawerClose } = useDisclosure();
    const { isOpen: isDocsOpen, onOpen: onDocsOpen, onOpenChange: onDocsOpenChange } = useDisclosure();

    const [viewDocs, setViewDocs] = useState<{ docs: any[], title: string } | null>(null);
    const [previewData, setPreviewData] = useState<{ url: string; type: string; name: string } | null>(null);

    useEffect(() => {
        dispatch(getNDAListRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
                color: "success",
            });
        }
        if (error) {
            addToast({
                title: "Error",
                description: typeof error === "string" ? error : "Something went wrong",
                color: "danger",
            });
            dispatch(clearNDAState());
        }
    }, [success, error, dispatch]);

    const handleGenerate = (data: { employee_name: string; role: string; address: string }) => {
        dispatch(generateNDARequest(data));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Signed":
                return "success";
            case "Expired":
                return "danger";
            case "Pending":
                return "warning";
            default:
                return "default";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleViewDocs = (item: any) => {
        if (item.documents && item.documents.length > 0) {
            const docs = item.documents.map((doc: any, index: number) => ({
                url: doc.document_proof,
                name: doc.document_name || `Document ${index + 1}`,
                type: doc.file_type || 'application/pdf'
            }));
            setViewDocs({ docs, title: `${item.employee_name}'s Documents` });
            onDocsOpen();
        }
    };

    const handleCopyLink = (token: string) => {
        const fullLink = `${window.location.origin}/nda/${token}`;
        navigator.clipboard.writeText(fullLink).then(() => {
            addToast({
                title: "Copied!",
                description: "NDA link copied to clipboard.",
                color: "success",
            });
        }).catch(() => {
            addToast({
                title: "Error",
                description: "Failed to copy link.",
                color: "danger",
            });
        });
    };

    return (
        <PermissionGuard
            permission="employee:submit"
            fallback={
                <div className="p-6 text-center text-red-500">Access Denied</div>
            }
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <PageHeader title="NDA Management" />
                    <Button
                        color="primary"
                        endContent={<PlusIcon size={16} />}
                        onPress={onDrawerOpen}
                    >
                        Generate NDA Link
                    </Button>
                </div>


                {/* NDA List */}
                <Table
                    aria-label="NDA requests table"
                    removeWrapper
                    isHeaderSticky
                >
                    <TableHeader>
                        <TableColumn width={250}>EMPLOYEE DETAILS</TableColumn>
                        <TableColumn>ROLE</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>DOCUMENTS</TableColumn>
                        <TableColumn align="center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={ndaList || []}
                        emptyContent={"No NDA requests found"}
                        isLoading={loading}
                    >
                        {(item: any) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex flex-col max-w-[250px]">
                                        <p className="text-bold text-sm truncate" title={item.employee_name}>
                                            {item.employee_name}
                                        </p>
                                        <p className="text-tiny text-default-400 truncate" title={item.address}>
                                            {item.address}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{item.role}</span>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={getStatusColor(item.status)}
                                        size="sm"
                                        variant="flat"
                                        startContent={
                                            item.status === "Signed" ? (
                                                <CheckCircle2 size={14} />
                                            ) : item.status === "Pending" ? (
                                                <Clock size={14} />
                                            ) : (
                                                <FileText size={14} />
                                            )
                                        }
                                    >
                                        {item.status}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    {item.documents && item.documents.length > 0 ? (
                                        <div
                                            className="flex items-center gap-2 cursor-pointer text-primary hover:opacity-80 transition-opacity w-fit"
                                            onClick={() => handleViewDocs(item)}
                                        >
                                            <FolderOpen size={18} />
                                            <span className="text-small font-medium hover:underline">
                                                {item.documents.length}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-default-300 text-sm">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        {item.status !== "Signed" &&
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onPress={() => handleCopyLink(item.token)}
                                            aria-label="Copy NDA link"
                                        >
                                            <Copy size={16} />
                                        </Button>
                                        }
                                        {item.status === "Signed" && item.signed_pdf_path && (
                                            <PDFDownloadButton
                                                fileUrl={item.signed_pdf_path}
                                                baseName={item.employee_name}
                                                prefix="Signed_NDA"
                                                ariaLabel="Download Signed PDF"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Generate NDA Drawer */}
                <GenerateNDADrawer
                    isOpen={isDrawerOpen}
                    onOpenChange={onDrawerOpenChange}
                    loading={loading}
                    onSubmit={handleGenerate}
                    generatedLink={generatedLink}
                />

                {/* Documents Modal */}
                <Modal isOpen={isDocsOpen} onOpenChange={onDocsOpenChange} size="2xl">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    {viewDocs?.title ? `${viewDocs.title}'s Documents` : "Documents"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {viewDocs?.docs?.map((doc: any, index: number) => (
                                            <div key={index} className="border border-default-200 rounded-lg p-3 flex items-center justify-between hover:bg-default-50 transition-colors">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <FileTypeIcon fileType={doc.type} fileName={doc.url} />
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-small font-medium truncate" title={doc.name}>
                                                            {doc.name || `Document ${index + 1}`}
                                                        </span>
                                                        <span className="text-tiny text-default-400 capitalize">
                                                            {doc.type ? doc.type.split('/')[1] : 'Unknown'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        onPress={() => setPreviewData({
                                                            url: doc.url,
                                                            type: doc.type || 'application/pdf',
                                                            name: doc.name || `Document ${index + 1}`,
                                                        })}
                                                    >
                                                        <Eye size={18} className="text-default-500" />
                                                    </Button>
                                                    <DownloadButton
                                                        fileUrl={doc.url}
                                                        fileName={doc.name || `Document_${index + 1}.${doc.type?.split('/')[1] || 'pdf'}`}
                                                        iconSize={18}
                                                        ariaLabel={`Download ${doc.name || 'document'}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" variant="flat" onPress={onClose}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                {/* File Preview Modal */}
                {previewData && (
                    <FilePreviewModal
                        isOpen={Boolean(previewData)}
                        onClose={() => setPreviewData(null)}
                        fileUrl={previewData.url}
                        fileType={previewData.type}
                        fileName={previewData.name}
                    />
                )}
            </div>
        </PermissionGuard>
    );
}
