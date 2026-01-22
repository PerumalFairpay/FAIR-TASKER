"use client";

import React, { useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    getEmployeesRequest,
    deleteEmployeeRequest,
    createEmployeeRequest,
    updateEmployeeRequest,
    clearEmployeeDetails,
} from "@/store/employee/action";
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
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { User } from "@heroui/user";
import { PlusIcon, PencilIcon, TrashIcon, FolderOpen, Eye, Download, X, ShieldCheck, Filter } from "lucide-react";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import AddEditEmployeeDrawer from "./AddEditEmployeeDrawer";
import UserPermissionsDrawer from "./UserPermissionsDrawer";
import { PermissionGuard } from "@/components/PermissionGuard";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import TablePagination from "@/components/common/TablePagination";
import { useState, useCallback } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { SearchIcon } from "lucide-react";
import { debounce } from "lodash";

export default function EmployeeListPage() {
    const dispatch = useDispatch();
    const { employees, loading, success, error, meta } = useSelector(
        (state: RootState) => state.Employee
    );

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isDocsOpen, onOpen: onDocsOpen, onOpenChange: onDocsOpenChange } = useDisclosure();
    const { isOpen: isPermOpen, onOpen: onPermOpen, onOpenChange: onPermOpenChange } = useDisclosure();

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedEmployee, setSelectedEmployee] = useState<null | any>(null);
    const [previewData, setPreviewData] = useState<{ url: string; type: string; name: string } | null>(null);
    const [viewDocs, setViewDocs] = useState<{ docs: any[], title: string } | null>(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [workModeFilter, setWorkModeFilter] = useState("all");

    // Debounce search to avoid too many API calls
    const debouncedSearch = useCallback(
        debounce((value) => {
            dispatch(getEmployeesRequest(1, limit, {
                search: value,
                status: statusFilter !== "all" ? statusFilter : undefined,
                role: roleFilter !== "all" ? roleFilter : undefined,
                work_mode: workModeFilter !== "all" ? workModeFilter : undefined
            }));
            setPage(1); // Reset to page 1 on search
        }, 500),
        [limit, statusFilter, roleFilter, workModeFilter, dispatch]
    );

    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedSearch(value);
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = {
            search,
            status: key === "status" ? (value !== "all" ? value : undefined) : (statusFilter !== "all" ? statusFilter : undefined),
            role: key === "role" ? (value !== "all" ? value : undefined) : (roleFilter !== "all" ? roleFilter : undefined),
            work_mode: key === "work_mode" ? (value !== "all" ? value : undefined) : (workModeFilter !== "all" ? workModeFilter : undefined)
        };

        if (key === "status") setStatusFilter(value);
        if (key === "role") setRoleFilter(value);
        if (key === "work_mode") setWorkModeFilter(value);

        setPage(1);
        dispatch(getEmployeesRequest(1, limit, newFilters));
    };

    useEffect(() => {
        dispatch(getEmployeesRequest(page, limit, {
            search,
            status: statusFilter !== "all" ? statusFilter : undefined,
            role: roleFilter !== "all" ? roleFilter : undefined,
            work_mode: workModeFilter !== "all" ? workModeFilter : undefined
        }));
    }, [dispatch, page, limit]); // Keep dependencies minimal to avoid loops

    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
                color: "success"
            });
            onClose();
            onDeleteClose();
            dispatch(clearEmployeeDetails());
            dispatch(getEmployeesRequest(page, limit));
        }
        if (error) {
            addToast({
                title: "Error",
                description: typeof error === 'string' ? error : "Something went wrong",
                color: "danger"
            });
            dispatch(clearEmployeeDetails());
        }
    }, [success, error, onClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setSelectedEmployee(null);
        onOpen();
    };

    const handleEdit = (employee: any) => {
        setMode("edit");
        setSelectedEmployee(employee);
        onOpen();
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteEmployeeRequest(deleteId));
        }
    };

    const handleSubmit = (formData: FormData) => {
        if (mode === "create") {
            dispatch(createEmployeeRequest(formData));
        } else {
            if (selectedEmployee) {
                dispatch(updateEmployeeRequest(selectedEmployee.id, formData));
            }
        }
    };

    const handleViewDocs = (item: any) => {
        let docs = [];
        if (item.documents && item.documents.length > 0) {
            docs = item.documents;
        } else if (item.document_proof) {
            docs = [{
                document_name: item.document_name || "Document",
                document_proof: item.document_proof,
                file_type: item.file_type
            }];
        }

        if (docs.length > 0) {
            setViewDocs({ docs, title: item.name });
            onDocsOpen();
        }
    };

    const handlePermissions = (employee: any) => {
        setSelectedEmployee(employee);
        onPermOpen();
    };

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <PageHeader title="Employees" />
                    <PermissionGuard permission="employee:create">
                        <Button color="primary" endContent={<PlusIcon size={16} />} onPress={handleCreate}>
                            Add New Employee
                        </Button>
                    </PermissionGuard>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <Input
                        classNames={{
                            base: "w-full md:w-[25%]",
                            mainWrapper: "h-full",
                            input: "text-small",
                            inputWrapper: "h-10 font-normal text-default-500 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100",
                        }}
                        placeholder="Search employees..."
                        size="sm"
                        startContent={<SearchIcon size={18} />}
                        value={search}
                        onValueChange={handleSearchChange}
                    />
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <Select
                            label="Status"
                            placeholder="Filter by status"
                            labelPlacement="outside"
                            size="sm"
                            className="w-[150px]"
                            classNames={{
                                trigger: "h-10 bg-default-100 data-[hover=true]:bg-default-200 border-none shadow-none",
                                value: "text-small",
                            }}
                            selectedKeys={[statusFilter]}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            radius="lg"
                            startContent={<Filter size={14} className="text-default-500" />}
                        >
                            <SelectItem key="all" textValue="All Status">All Status</SelectItem>
                            <SelectItem key="Active" textValue="Active">Active</SelectItem>
                            <SelectItem key="Inactive" textValue="Inactive">Inactive</SelectItem>
                            <SelectItem key="Onboarding" textValue="Onboarding">Onboarding</SelectItem>
                            <SelectItem key="Offboarding" textValue="Offboarding">Offboarding</SelectItem>
                            <SelectItem key="Probation" textValue="Probation">Probation</SelectItem>
                            <SelectItem key="Terminated" textValue="Terminated">Terminated</SelectItem>
                        </Select>
                        <Select
                            label="Role"
                            placeholder="Filter by role"
                            labelPlacement="outside"
                            size="sm"
                            className="w-[150px]"
                            classNames={{
                                trigger: "h-10 bg-default-100 data-[hover=true]:bg-default-200 border-none shadow-none",
                                value: "text-small",
                            }}
                            selectedKeys={[roleFilter]}
                            onChange={(e) => handleFilterChange("role", e.target.value)}
                            radius="lg"
                            startContent={<ShieldCheck size={14} className="text-default-500" />}
                        >
                            <SelectItem key="all" textValue="All Roles">All Roles</SelectItem>
                            <SelectItem key="employee" textValue="Employee">Employee</SelectItem>
                            <SelectItem key="manager" textValue="Manager">Manager</SelectItem>
                            <SelectItem key="hr" textValue="HR">HR</SelectItem>
                            <SelectItem key="admin" textValue="Admin">Admin</SelectItem>
                        </Select>
                        <Select
                            label="Work Mode"
                            placeholder="Filter by mode"
                            labelPlacement="outside"
                            size="sm"
                            className="w-[150px]"
                            classNames={{
                                trigger: "h-10 bg-default-100 data-[hover=true]:bg-default-200 border-none shadow-none",
                                value: "text-small",
                            }}
                            selectedKeys={[workModeFilter]}
                            onChange={(e) => handleFilterChange("work_mode", e.target.value)}
                            radius="lg"
                            startContent={<FolderOpen size={14} className="text-default-500" />}
                        >
                            <SelectItem key="all" textValue="All Modes">All Modes</SelectItem>
                            <SelectItem key="Office" textValue="Office">Office</SelectItem>
                            <SelectItem key="Remote" textValue="Remote">Remote</SelectItem>
                            <SelectItem key="Hybrid" textValue="Hybrid">Hybrid</SelectItem>
                        </Select>
                    </div>
                </div>
            </div>

            <Table
                aria-label="Employee table"
                removeWrapper
                isHeaderSticky
                bottomContent={
                    meta && meta.total_items > 10 && (
                        <TablePagination
                            page={page}
                            total={meta.total_pages}
                            onChange={(p) => setPage(p)}
                            limit={limit}
                            onLimitChange={(l) => { setLimit(l); setPage(1); }}
                        />
                    )
                }
            >
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>DESIGNATION</TableColumn>
                    <TableColumn>WORK MODE</TableColumn>
                    <TableColumn>CONTACT</TableColumn>
                    <TableColumn>DOCUMENT</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={employees || []} emptyContent={"No employees found"} isLoading={loading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: item.profile_picture }}
                                    description={item.email}
                                    name={item.name}
                                >
                                    {item.email}
                                </User>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm capitalize">{item.designation || "N/A"}</p>
                                    <p className="text-bold text-tiny capitalize text-default-400">{item.department || "N/A"}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip className="capitalize" size="sm" variant="flat">
                                    {item.work_mode || "N/A"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm capitalize">{item.mobile || "N/A"}</p>
                                </div>
                            </TableCell>
                            <TableCell>


                                {(item.documents && item.documents.length > 0) || item.document_proof ? (
                                    <div
                                        className="flex items-center gap-2 cursor-pointer text-primary hover:opacity-80 transition-opacity w-fit"
                                        onClick={() => handleViewDocs(item)}
                                    >
                                        <FolderOpen size={18} />
                                        <span className="text-small font-medium hover:underline">
                                            {item.documents?.length || 1}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-default-300 text-sm">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm capitalize">{item.role}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip className="capitalize" color={item.status === "Active" ? "success" : "danger"} size="sm" variant="flat">
                                    {item.status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-center gap-2">
                                    <PermissionGuard permission="employee:edit">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                                            <PencilIcon size={16} />
                                        </span>
                                    </PermissionGuard>
                                    <PermissionGuard permission="employee:delete">
                                        <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(item.id)}>
                                            <TrashIcon size={16} />
                                        </span>
                                    </PermissionGuard>
                                    <PermissionGuard permission="permission:manage">
                                        <span className="text-lg text-secondary cursor-pointer active:opacity-50" onClick={() => handlePermissions(item)}>
                                            <ShieldCheck size={16} />
                                        </span>
                                    </PermissionGuard>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AddEditEmployeeDrawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                mode={mode}
                selectedEmployee={selectedEmployee}
                loading={loading}
                onSubmit={handleSubmit}
            />

            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Delete Employee</ModalHeader>
                            <ModalBody>
                                <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="danger" onPress={confirmDelete} isLoading={loading}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

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
                                                <FileTypeIcon fileType={doc.file_type} fileName={doc.document_proof} />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-small font-medium truncate" title={doc.document_name}>
                                                        {doc.document_name || `Document ${index + 1}`}
                                                    </span>
                                                    <span className="text-tiny text-default-400 capitalize">
                                                        {doc.file_type ? doc.file_type.split('/')[1] : 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button isIconOnly size="sm" variant="light" onPress={() => setPreviewData({
                                                    url: doc.document_proof,
                                                    type: doc.file_type || 'application/pdf',
                                                    name: doc.document_name || `Document ${index + 1}`,
                                                })}>
                                                    <Eye size={18} className="text-default-500" />
                                                </Button>
                                                <a href={doc.document_proof} download target="_blank" rel="noopener noreferrer">
                                                    <Button isIconOnly size="sm" variant="light">
                                                        <Download size={18} className="text-default-500" />
                                                    </Button>
                                                </a>
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

            <UserPermissionsDrawer
                isOpen={isPermOpen}
                onClose={onPermOpenChange}
                employee={selectedEmployee}
            />

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
    );
}
