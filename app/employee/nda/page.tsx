"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    generateNDARequest,
    getNDAListRequest,
    clearNDAState,
    regenerateNDARequest,
    deleteNDARequest,
    updateNDAStatusRequest,
} from "@/store/nda/action";
import { RootState } from "@/store/store";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
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
import { PlusIcon, CheckCircle2, Clock, FileText, Copy, FolderOpen, RefreshCw, Search, Filter, Trash, CheckCircle, XCircle, MoreVertical, AlertCircle } from "lucide-react";
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
    const {
        ndaList, generatedLink, meta,
        getListLoading, getListError,
        generateLoading, generateSuccess, generateError,
        regenerateLoading, regenerateSuccess, regenerateError,
        deleteLoading, deleteSuccess, deleteError,
        updateStatusLoading, updateStatusSuccess, updateStatusError
    } = useSelector(
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

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    // Review/Status Update State
    const [statusUpdateId, setStatusUpdateId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const { isOpen: isRejectOpen, onOpen: onRejectOpen, onOpenChange: onRejectOpenChange, onClose: onRejectClose } = useDisclosure();

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
        const successMessage = generateSuccess || regenerateSuccess || deleteSuccess || updateStatusSuccess;
        const errorMessage = getListError || generateError || regenerateError || deleteError || updateStatusError;

        if (successMessage) {
            addToast({
                title: "Success",
                description: successMessage,
                color: "success",
            });
            // We don't clear state here to keep currentNDA/generatedLink available if needed
        }
        if (errorMessage) {
            addToast({
                title: "Error",
                description: typeof errorMessage === "string" ? errorMessage : "Something went wrong",
                color: "danger",
            });
            dispatch(clearNDAState());
        }
    }, [generateSuccess, regenerateSuccess, deleteSuccess, getListError, generateError, regenerateError, deleteError, dispatch]);

    const handleGenerate = (data: {
        first_name: string;
        last_name: string;
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
        setRegenerateExpiry(48); // Default to 1 hour
        onRegenerateOpen();
    };

    const confirmRegenerate = () => {
        if (regenerateId) {
            dispatch(regenerateNDARequest({ ndaId: regenerateId, expires_in_hours: regenerateExpiry }));
            onRegenerateClose();
            setRegenerateId(null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteNDARequest(deleteId));
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleStatusUpdate = (id: string, status: "Approved" | "Rejected", reason?: string) => {
        if (status === "Rejected" && !reason) {
            setStatusUpdateId(id);
            setRejectionReason("");
            onRejectOpen();
            return;
        }

        dispatch(updateNDAStatusRequest(id, { 
            status, 
            ...(reason && { rejection_reason: reason }) 
        }));
        
        if (status === "Rejected") {
            onRejectClose();
            setStatusUpdateId(null);
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
            case "Document Uploaded":
                return "secondary";
            case "Approved":
                return "success";
            case "Rejected":
                return "danger";
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
            const employee_name = `${item.first_name} ${item.last_name}`.trim();
            setViewDocs({ docs, title: `${employee_name}'s Documents` });
            onDocsOpen();
        }
    };

    const handleCopyLink = (token: string) => {
        const fullLink = `${window.location.origin}/employee/nda/${token}`;
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
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <PageHeader title="NDA Management" />
                    <Button
                        color="primary"
                        variant="shadow"
                        startContent={<PlusIcon size={16} />}
                        onPress={onDrawerOpen}
                        className="w-full sm:w-auto"
                    >
                        Generate NDA
                    </Button>
                </div>


                <div className="flex flex-col gap-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <Input
                            isClearable
                            className="col-span-1 sm:col-span-8 w-full"
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
                        <Select
                            className="col-span-1 sm:col-span-4 w-full"
                            defaultSelectedKeys={["All"]}
                            selectedKeys={[statusFilter]}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            startContent={<Filter size={16} />}
                            variant="bordered"
                            aria-label="Filter by status"
                        >
                            <SelectItem key="All">All Status</SelectItem>
                            <SelectItem key="Pending">Pending</SelectItem>
                            <SelectItem key="Document Uploaded">Document Uploaded</SelectItem>
                            <SelectItem key="Signed">Signed</SelectItem>
                            <SelectItem key="Approved">Approved</SelectItem>
                            <SelectItem key="Rejected">Rejected</SelectItem>
                            <SelectItem key="Expired">Expired</SelectItem>
                        </Select>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
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
                            isLoading={getListLoading}
                        >
                            {(item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex flex-col max-w-[250px]">
                                            <p className="text-bold text-sm truncate" title={`${item.first_name} ${item.last_name}`}>
                                                {item.first_name} {item.last_name}
                                            </p>
                                            <p className="text-tiny text-default-400 truncate" title={item.email}>
                                                {item.email}
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
                                                ) : item.status === "Approved" ? (
                                                    <CheckCircle size={14} />
                                                ) : item.status === "Rejected" ? (
                                                    <XCircle size={14} />
                                                ) : (
                                                    <FileText size={14} />
                                                )
                                            }
                                        >
                                            {item.status}
                                        </Chip>
                                        {item.status === "Rejected" && item.rejection_reason && (
                                            <Tooltip content={item.rejection_reason}>
                                                <div className="mt-1 flex items-center gap-1 text-danger cursor-help">
                                                    <AlertCircle size={12} />
                                                    <span className="text-[10px] font-medium">Reason</span>
                                                </div>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {(item.status === "Signed" || item.status === "Approved") && (item.browser || item.os || item.device_type || item.ip_address) ? (
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
                                            {item.status !== "Signed" && item.status !== "Approved" &&
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
                                                    {item.status !== "Document Uploaded" && (
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
                                                    )}
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        color="danger"
                                                        onPress={() => handleDeleteClick(item.id)}
                                                        aria-label="Delete NDA Request"
                                                        title="Delete NDA Request"
                                                    >
                                                        <Trash size={16} />
                                                    </Button>
                                                </>
                                            }
                                            {(item.status === "Signed" || item.status === "Approved") && item.signed_pdf_path && (
                                                <div className="flex gap-1">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        onPress={() => setPreviewData({
                                                            url: item.signed_pdf_path?.document_proof,
                                                            type: 'application/pdf',
                                                            name: `Signed_NDA_${item.first_name}_${item.last_name}.pdf`,
                                                        })}
                                                        aria-label="View Signed PDF"
                                                    >
                                                        <Eye size={18} className="text-default-500" />
                                                    </Button>
                                                    <PDFDownloadButton
                                                        fileUrl={item.signed_pdf_path?.document_proof}
                                                        baseName={`${item.first_name}_${item.last_name}`}
                                                        prefix="Signed_NDA"
                                                        ariaLabel="Download Signed PDF"
                                                    />
                                                </div>
                                            )}

                                            {/* Review Dropdown */}
                                            {(item.status === "Signed" || item.status === "Document Uploaded" || item.status === "Approved") && (
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            className="text-primary"
                                                            aria-label="Review Actions"
                                                        >
                                                            <MoreVertical size={18} />
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        aria-label="NDA Review Actions"
                                                        onAction={(key) => handleStatusUpdate(item.id, key as "Approved" | "Rejected")}
                                                    >
                                                        {item.status === "Signed" ? (
                                                            <DropdownItem
                                                                key="Approved"
                                                                startContent={<CheckCircle size={16} className="text-success" />}
                                                                className="text-success"
                                                            >
                                                                Approve
                                                            </DropdownItem>
                                                        ) : (
                                                            <DropdownItem key="no-action" className="hidden" aria-hidden="true" />
                                                        )}
                                                        <DropdownItem
                                                            key="Rejected"
                                                            startContent={<XCircle size={16} className="text-danger" />}
                                                            className="text-danger"
                                                        >
                                                            Reject
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {getListLoading ? (
                        <div className="flex justify-center py-8">
                            <span className="text-default-400">Loading NDA requests...</span>
                        </div>
                    ) : ndaList && ndaList.length > 0 ? (
                        <>
                            {ndaList.map((item: any) => (
                                <Card key={item.id} className="shadow-sm border border-default-100 bg-white dark:bg-zinc-900/50">
                                    <CardBody className="p-4 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-sm font-bold text-default-900">{item.first_name} {item.last_name}</h3>
                                                <p className="text-tiny text-default-400">{item.email}</p>
                                                <p className="text-[10px] text-default-300 uppercase font-bold tracking-wider mt-1">{item.role}</p>
                                            </div>
                                            <Chip
                                                color={getStatusColor(item.status)}
                                                size="sm"
                                                variant="flat"
                                                className="h-6"
                                                startContent={
                                                    item.status === "Signed" ? (
                                                        <CheckCircle2 size={12} />
                                                    ) : item.status === "Pending" ? (
                                                        <Clock size={12} />
                                                    ) : item.status === "Approved" ? (
                                                        <CheckCircle size={12} />
                                                    ) : item.status === "Rejected" ? (
                                                        <XCircle size={12} />
                                                    ) : (
                                                        <FileText size={12} />
                                                    )
                                                }
                                            >
                                                {item.status}
                                            </Chip>
                                        </div>

                                        <Divider className="opacity-50" />

                                        <div className="flex justify-between items-center bg-default-50 dark:bg-white/5 p-2 rounded-xl mt-1">
                                            <div className="flex gap-6 items-center">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[9px] font-bold text-default-400 uppercase">System</span>
                                                    <span className="text-tiny">{item.device_type || "-"}</span>
                                                </div>
                                                <div className="flex flex-col gap-0.5 border-l border-default-200 dark:border-white/10 pl-4">
                                                    <span className="text-[9px] font-bold text-default-400 uppercase">Docs</span>
                                                    {item.documents && item.documents.length > 0 ? (
                                                        <div
                                                            className="flex items-center gap-1.5 text-primary cursor-pointer"
                                                            onClick={() => handleViewDocs(item)}
                                                        >
                                                            <FolderOpen size={14} />
                                                            <span className="font-medium underline text-tiny">{item.documents.length}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-tiny text-default-300">-</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {item.status !== "Signed" && item.status !== "Approved" && (
                                                    <>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="flat"
                                                            onPress={() => handleCopyLink(item.token)}
                                                            className="bg-white dark:bg-zinc-800"
                                                        >
                                                            <Copy size={16} />
                                                        </Button>
                                                        {item.status !== "Document Uploaded" && (
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="flat"
                                                                color="primary"
                                                                onPress={() => handleRegenerateClick(item.id)}
                                                            >
                                                                <RefreshCw size={16} />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="flat"
                                                            color="danger"
                                                            onPress={() => handleDeleteClick(item.id)}
                                                        >
                                                            <Trash size={16} />
                                                        </Button>
                                                    </>
                                                )}
                                            {(item.status === "Signed" || item.status === "Approved") && item.signed_pdf_path && (
                                                <div className="flex gap-2">
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="flat"
                                                            onPress={() => setPreviewData({
                                                                url: item.signed_pdf_path?.document_proof,
                                                                type: 'application/pdf',
                                                                name: `Signed_NDA_${item.first_name}_${item.last_name}.pdf`,
                                                            })}
                                                        >
                                                            <Eye size={18} />
                                                        </Button>
                                                        <PDFDownloadButton
                                                            fileUrl={item.signed_pdf_path?.document_proof}
                                                            baseName={`${item.first_name}_${item.last_name}`}
                                                            prefix="Signed_NDA"
                                                        />
                                                    </div>
                                                )}
                                                {/* Review Dropdown for Mobile */}
                                                {(item.status === "Signed" || item.status === "Document Uploaded" || item.status === "Approved") && (
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="flat"
                                                                color="primary"
                                                                className="bg-primary/10"
                                                                aria-label="Review Actions"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu
                                                            aria-label="NDA Review Actions"
                                                            onAction={(key) => handleStatusUpdate(item.id, key as "Approved" | "Rejected")}
                                                        >
                                                            {item.status === "Signed" ? (
                                                                <DropdownItem
                                                                    key="Approved"
                                                                    startContent={<CheckCircle size={16} className="text-success" />}
                                                                    className="text-success"
                                                                >
                                                                    Approve
                                                                </DropdownItem>
                                                            ) : (
                                                                <DropdownItem key="no-action" className="hidden" aria-hidden="true" />
                                                            )}
                                                            <DropdownItem
                                                                key="Rejected"
                                                                startContent={<XCircle size={16} className="text-danger" />}
                                                                className="text-danger"
                                                            >
                                                                Reject
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                )}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                            {meta && meta.total_items > 0 && (
                                <div className="mt-4 flex justify-center">
                                    <TablePagination
                                        page={page}
                                        total={meta.total_pages}
                                        onChange={(p) => setPage(p)}
                                        limit={limit}
                                        onLimitChange={(l) => { setLimit(l); setPage(1); }}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 text-default-400">
                            No NDA requests found
                        </div>
                    )}
                </div>

                {/* Generate NDA Drawer */}
                <GenerateNDADrawer
                    isOpen={isDrawerOpen}
                    onOpenChange={onDrawerOpenChange}
                    loading={generateLoading}
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
                                        <SelectItem key="48">2 Days</SelectItem>
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

                {/* Delete Confirmation Modal */}
                <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} size="sm">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
                                <ModalBody>
                                    <p className="text-sm text-default-500">
                                        Are you sure you want to delete this NDA request? This action cannot be undone.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="light" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button color="danger" onPress={confirmDelete}>
                                        Delete
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                {/* Reject Confirmation Modal with Reason */}
                <Modal isOpen={isRejectOpen} onOpenChange={onRejectOpenChange} size="md">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Reject NDA Request</ModalHeader>
                                <ModalBody className="flex flex-col gap-4">
                                    <p className="text-sm text-default-500">
                                        Please provide a reason for rejecting this NDA request. The employee will need to re-upload documents and re-sign.
                                    </p>
                                    <Input
                                        label="Rejection Reason"
                                        placeholder="Enter reason for rejection"
                                        variant="bordered"
                                        value={rejectionReason}
                                        onValueChange={setRejectionReason}
                                        isRequired
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="light" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        color="danger" 
                                        onPress={() => statusUpdateId && handleStatusUpdate(statusUpdateId, "Rejected", rejectionReason)}
                                        isDisabled={!rejectionReason.trim() || updateStatusLoading}
                                        isLoading={updateStatusLoading}
                                    >
                                        Confirm Reject
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </PermissionGuard >
    );
}
