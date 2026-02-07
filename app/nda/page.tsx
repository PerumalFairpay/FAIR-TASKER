"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    generateNDARequest,
    getNDAListRequest,
    clearNDAState,
    regenerateNDARequest,
} from "@/store/nda/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { PlusIcon, CheckCircle2, Clock, FileText, Copy, FolderOpen, RefreshCw, Search, Filter } from "lucide-react";
import TablePagination from "@/components/common/TablePagination";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { PermissionGuard } from "@/components/PermissionGuard";
import GenerateNDADrawer from "./GenerateNDADrawer";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Eye, Download } from "lucide-react";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import DownloadButton, { PDFDownloadButton } from "@/components/common/DownloadButton";
import { Tooltip } from "@heroui/tooltip";

export default function NDAPage() {
    const dispatch = useDispatch();
    const { ndaList, generatedLink, loading, success, error, meta } = useSelector(
        (state: RootState) => state.NDA
    );

    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onOpenChange: onDrawerOpenChange, onClose: onDrawerClose } = useDisclosure();
    const { isOpen: isDocsOpen, onOpen: onDocsOpen, onOpenChange: onDocsOpenChange } = useDisclosure();

    const [viewDocs, setViewDocs] = useState<{ docs: any[], title: string } | null>(null);
    const [previewData, setPreviewData] = useState<{ url: string; type: string; name: string } | null>(null);

    // Regeneration State
    const [regenerateId, setRegenerateId] = useState<string | null>(null);
    const [regenerateExpiry, setRegenerateExpiry] = useState<number>(1);
    const { isOpen: isRegenerateOpen, onOpen: onRegenerateOpen, onOpenChange: onRegenerateOpenChange, onClose: onRegenerateClose } = useDisclosure();

    // Pagination & Filter State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [limit, setLimit] = useState(10);

    // Fetch NDA List with Filters
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(getNDAListRequest({
                page,
                limit,
                search,
                status: statusFilter
            }));
        }, 500);
        return () => clearTimeout(timer);
    }, [dispatch, page, limit, search, statusFilter]);

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

    const handleGenerate = (data: {
        employee_name: string;
        email: string;
        mobile: string;
        role: string;
        address: string;
        residential_address: string;
        expires_in_hours: number;
        required_documents: string[];
    }) => {
        dispatch(generateNDARequest(data));
    };

    const handleRegenerateClick = (id: string) => {
        setRegenerateId(id);
        setRegenerateExpiry(1); // Default to 1 hour
        onRegenerateOpen();
    };

    const confirmRegenerate = () => {
        if (regenerateId) {
            dispatch(regenerateNDARequest({ ndaId: regenerateId, expires_in_hours: regenerateExpiry }));
            onRegenerateClose();
            setRegenerateId(null);
        }
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


                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex justify-between items-center gap-3">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%]"
                            placeholder="Search by name, email..."
                            startContent={<Search size={16} />}
                            value={search}
                            onClear={() => setSearch("")}
                            onValueChange={(val) => {
                                setSearch(val);
                                setPage(1);
                            }}
                            variant="bordered"
                        />
                        <div className="flex gap-3">
                            <Select
                                className="w-full sm:min-w-[150px]"
                                defaultSelectedKeys={["All"]}
                                selectedKeys={[statusFilter]}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                startContent={<Filter size={16} />}
                                variant="bordered"
                            >
                                <SelectItem key="All">All Status</SelectItem>
                                <SelectItem key="Pending">Pending</SelectItem>
                                <SelectItem key="Signed">Signed</SelectItem>
                                <SelectItem key="Expired">Expired</SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* NDA List */}
                <Table
                    aria-label="NDA requests table"
                    removeWrapper
                    isHeaderSticky
                    bottomContent={
                        meta && meta.total_items > 0 ? (
                            <TablePagination
                                page={page}
                                total={meta.total_pages}
                                onChange={(p) => setPage(p)}
                                limit={limit}
                                onLimitChange={(l) => { setLimit(l); setPage(1); }}
                            />
                        ) : null
                    }
                >
                    <TableHeader>
                        <TableColumn width={250}>EMPLOYEE DETAILS</TableColumn>
                        <TableColumn>ROLE</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn width={200}>SYSTEM DETAILS</TableColumn>
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
                                    {item.status === "Signed" && (item.browser || item.os || item.device_type || item.ip_address) ? (
                                        <Tooltip
                                            content={
                                                <div className="px-1 py-2">
                                                    <div className="text-small font-bold mb-2">System Details</div>
                                                    <div className="flex flex-col gap-1.5">
                                                        {item.browser && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-tiny text-default-400">Browser:</span>
                                                                <span className="text-tiny font-medium">{item.browser}</span>
                                                            </div>
                                                        )}
                                                        {item.os && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-tiny text-default-400">OS:</span>
                                                                <span className="text-tiny font-medium">{item.os}</span>
                                                            </div>
                                                        )}
                                                        {item.device_type && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-tiny text-default-400">Device:</span>
                                                                <span className="text-tiny font-medium">{item.device_type}</span>
                                                            </div>
                                                        )}
                                                        {item.ip_address && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-tiny text-default-400">IP:</span>
                                                                <span className="text-tiny font-mono">{item.ip_address}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            }
                                            placement="top"
                                        >
                                            <span className="text-sm font-medium cursor-help underline decoration-dotted">
                                                {item.device_type || "Desktop"}
                                            </span>
                                        </Tooltip>
                                    ) : (
                                        <span className="text-default-300 text-sm">-</span>
                                    )}
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
                                            <>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => handleCopyLink(item.token)}
                                                    aria-label="Copy NDA link"
                                                >
                                                    <Copy size={16} />
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="primary"
                                                    onPress={() => handleRegenerateClick(item.id)}
                                                    aria-label="Regenerate Link"
                                                    title="Regenerate Link"
                                                >
                                                    <RefreshCw size={16} />
                                                </Button>
                                            </>
                                        }
                                        {item.status === "Signed" && item.signed_pdf_path && (
                                            <div className="flex gap-1">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => setPreviewData({
                                                        url: item.signed_pdf_path?.document_proof,
                                                        type: 'application/pdf',
                                                        name: `Signed_NDA_${item.employee_name}.pdf`,
                                                    })}
                                                    aria-label="View Signed PDF"
                                                >
                                                    <Eye size={18} className="text-default-500" />
                                                </Button>
                                                <PDFDownloadButton
                                                    fileUrl={item.signed_pdf_path?.document_proof}
                                                    baseName={item.employee_name}
                                                    prefix="Signed_NDA"
                                                    ariaLabel="Download Signed PDF"
                                                />
                                            </div>
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

                {/* Regenerate Confirmation Modal */}
                <Modal isOpen={isRegenerateOpen} onOpenChange={onRegenerateOpenChange} size="sm">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Regenerate Link</ModalHeader>
                                <ModalBody className="flex flex-col gap-6">
                                    <p className="text-sm text-default-500">
                                        This will invalidate the previous link and generate a new one. Please select the new expiry time.
                                    </p>
                                    <Select
                                        label="Expiry Time"
                                        placeholder="Select expiry time"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        selectedKeys={[regenerateExpiry.toString()]}
                                        onChange={(e) => setRegenerateExpiry(Number(e.target.value))}
                                    >
                                        <SelectItem key="1">1 Hour</SelectItem>
                                        <SelectItem key="24">24 Hours</SelectItem>
                                        <SelectItem key="48">48 Hours</SelectItem>
                                        <SelectItem key="168">7 Days</SelectItem>
                                    </Select>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="light" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" onPress={confirmRegenerate}>
                                        Regenerate
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </PermissionGuard>
    );
}
