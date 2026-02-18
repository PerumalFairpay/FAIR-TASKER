"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageHeader } from "@/components/PageHeader";
import { AppState } from "@/store/rootReducer";
import {
    createFeedbackRequest,
    getFeedbacksRequest,
    updateFeedbackRequest,
    updateFeedbackStatusRequest,
    deleteFeedbackRequest,
    clearFeedback,
} from "@/store/feedback/action";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { format } from "date-fns";
import {
    Plus, Edit, Trash2, MessageSquare, Bug, Lightbulb,
    ClipboardList, Search, Calendar, Paperclip, MoreVertical,
    Clock, LayoutGrid, List, AlertCircle, ChevronsUp, ChevronsDown
} from "lucide-react";
import { User as UserIcon } from "lucide-react";
import { User } from "@heroui/user";
import { Tooltip } from "@heroui/tooltip";
import { Image } from "@heroui/image";
import FileUpload from "@/components/common/FileUpload";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function FeedbackPage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: AppState) => state.Auth);
    const {
        feedbacks,
        metrics,
        listLoading,
        createLoading,
        createSuccess,
        createError,
        updateSuccess,
        updateError,
        deleteSuccess,
        deleteError
    } = useSelector((state: AppState) => state.Feedback);
    const isAdmin = user?.role === "admin";

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        type: "Bug",
        priority: "Medium",
        attachments: [] as File[],
    });
    const [files, setFiles] = useState<any[]>([]);
    const [editingFeedback, setEditingFeedback] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewType, setViewType] = useState<"card" | "table">("card");

    useEffect(() => {
        dispatch(getFeedbacksRequest());
    }, [dispatch]);

    useEffect(() => {
        if (createSuccess) {
            addToast({ title: "Success", description: createSuccess, color: "success" });
            dispatch(clearFeedback());
            onClose();
            resetForm();
        }
        if (createError) {
            addToast({ title: "Error", description: createError, color: "danger" });
            dispatch(clearFeedback());
        }
        if (updateSuccess) {
            addToast({ title: "Success", description: updateSuccess, color: "success" });
            dispatch(clearFeedback());
            onClose();
            resetForm();
        }
        if (updateError) {
            addToast({ title: "Error", description: updateError, color: "danger" });
            dispatch(clearFeedback());
        }
        if (deleteSuccess) {
            addToast({ title: "Success", description: deleteSuccess, color: "success" });
            dispatch(clearFeedback());
        }
        if (deleteError) {
            addToast({ title: "Error", description: deleteError, color: "danger" });
            dispatch(clearFeedback());
        }
    }, [createSuccess, createError, updateSuccess, updateError, deleteSuccess, deleteError, dispatch]);

    const resetForm = () => {
        setFormData({
            subject: "",
            description: "",
            type: "Bug",
            priority: "Medium",
            attachments: [],
        });
        setFiles([]);
        setEditingFeedback(null);
    };

    const handleOpen = (feedback?: any) => {
        if (feedback) {
            setEditingFeedback(feedback);
            setFormData({
                subject: feedback.subject,
                description: feedback.description,
                type: feedback.type,
                priority: feedback.priority,
                attachments: [],
            });
            // We don't populate files for edit as they are on server
            setFiles([]);
        } else {
            resetForm();
        }
        onOpen();
    };

    const handleSubmit = () => {
        const data = new FormData();
        if (!editingFeedback) {
            data.append("employee_id", user?.employee_id);
            data.append("employee_name", user?.name);
        }
        data.append("subject", formData.subject);
        data.append("description", formData.description);
        data.append("type", formData.type);
        data.append("priority", formData.priority);

        if (files.length > 0) {
            files.forEach((file: any) => {
                data.append("attachments", file.file);
            });
        }

        if (editingFeedback) {
            dispatch(updateFeedbackRequest(editingFeedback.id, data));
        } else {
            dispatch(createFeedbackRequest(data));
        }
    };

    const handleStatusUpdate = (id: string, newStatus: string) => {
        dispatch(updateFeedbackStatusRequest(id, newStatus));
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this feedback?")) {
            dispatch(deleteFeedbackRequest(id));
        }
    }

    const filteredFeedbacks = useMemo(() => {
        let result = feedbacks || [];

        if (statusFilter !== "all") {
            result = result.filter((f: any) => f.status === statusFilter);
        }

        if (searchTerm) {
            const lowerFilter = searchTerm.toLowerCase();
            result = result.filter((f: any) =>
                f.subject.toLowerCase().includes(lowerFilter) ||
                f.employee_name?.toLowerCase().includes(lowerFilter) ||
                f.description?.toLowerCase().includes(lowerFilter)
            );
        }

        return result;
    }, [feedbacks, statusFilter, searchTerm]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open": return "primary";
            case "In Review": return "warning";
            case "Resolved": return "success";
            case "Closed": return "default";
            default: return "default";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "Bug": return "danger";
            case "Feature Request": return "primary";
            case "General": return "secondary";
            default: return "default";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Bug": return <Bug size={14} />;
            case "Feature Request": return <Lightbulb size={14} />;
            case "General": return <MessageSquare size={14} />;
            default: return <MessageSquare size={14} />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High": return "danger";
            case "Medium": return "warning";
            case "Low": return "success";
            default: return "default";
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case "High": return <AlertCircle size={14} />;
            case "Medium": return <ChevronsUp size={14} />;
            case "Low": return <ChevronsDown size={14} />;
            default: return null;
        }
    };


    const renderCell = (item: any, columnKey: React.Key) => {
        const cellValue = item[columnKey as keyof any];
        switch (columnKey) {
            case "employee_name": {
                const emp = item.employee;
                return (
                    <User
                        name={emp?.name || cellValue}
                        description={emp ? `${emp.designation || ""}${emp.department ? ` · ${emp.department}` : ""}` : item.employee_id}
                        avatarProps={{
                            src: emp?.profile_picture || undefined,
                            showFallback: true,
                            name: emp?.name || cellValue,
                        }}
                    />
                );
            }
            case "type":
                return <Chip color={cellValue === "Bug" ? "danger" : "primary"} variant="flat">{cellValue}</Chip>;
            case "priority":
                return (
                    <Chip
                        color={getPriorityColor(cellValue)}
                        variant="flat"
                        size="sm"
                        startContent={getPriorityIcon(cellValue)}
                        className="font-bold border-none"
                    >
                        {cellValue}
                    </Chip>
                );
            case "status":
                return <Chip color={cellValue === "Resolved" ? "success" : "default"} variant="flat">{cellValue}</Chip>;
            case "created_at":
                return format(new Date(cellValue), "MMM dd, yyyy");
            case "attachments":
                if (cellValue && cellValue.length > 0) {
                    return (
                        <div className="flex gap-2">
                            {cellValue.map((url: string, index: number) => (
                                <Link key={index} href={url} target="_blank" className="text-primary hover:underline">
                                    <LinkIcon size={16} />
                                </Link>
                            ))}
                        </div>
                    );
                }
                return "-";
            case "actions":
                return (
                    <div className="flex gap-2">
                        <Button isIconOnly size="sm" variant="light" onPress={() => handleOpen(item)}>
                            <Edit size={16} />
                        </Button>
                        {isAdmin && (
                            <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => handleDelete(item.id)}>
                                <Trash2 size={16} />
                            </Button>
                        )}
                    </div>
                );
            default:
                return cellValue;
        }
    };

    const columns = [
        { name: "EMPLOYEE", uid: "employee_name" },
        { name: "SUBJECT", uid: "subject" },
        { name: "TYPE", uid: "type" },
        { name: "PRIORITY", uid: "priority" },
        { name: "STATUS", uid: "status" },
        { name: "ATTACHMENTS", uid: "attachments" },
        { name: "DATE", uid: "created_at" },
        { name: "ACTIONS", uid: "actions" },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Feedback" />
                {!isAdmin && (
                    <Button color="primary" onPress={() => handleOpen()} startContent={<Plus size={18} />}>
                        Submit Feedback
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card radius="md" className="bg-white dark:bg-content1 border-1 border-divider shadow-sm">
                    <CardBody className="flex flex-row items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <p className="text-small text-default-500">Total Feedbacks</p>
                            <p className="text-2xl font-bold">{metrics?.total || 0}</p>
                        </div>
                    </CardBody>
                </Card>
                <Card radius="md" className="bg-white dark:bg-content1 border-1 border-divider shadow-sm">
                    <CardBody className="flex flex-row items-center gap-4">
                        <div className="p-3 rounded-xl bg-danger/10 text-danger">
                            <Bug size={24} />
                        </div>
                        <div>
                            <p className="text-small text-default-500">Bugs</p>
                            <p className="text-2xl font-bold">{metrics?.by_type?.Bug || 0}</p>
                        </div>
                    </CardBody>
                </Card>
                <Card radius="md" className="bg-white dark:bg-content1 border-1 border-divider shadow-sm">
                    <CardBody className="flex flex-row items-center gap-4">
                        <div className="p-3 rounded-xl bg-success/10 text-success">
                            <Lightbulb size={24} />
                        </div>
                        <div>
                            <p className="text-small text-default-500">Feature Requests</p>
                            <p className="text-2xl font-bold">{metrics?.by_type?.["Feature Request"] || 0}</p>
                        </div>
                    </CardBody>
                </Card>
                <Card radius="md" className="bg-default-50 border-none shadow-sm">
                    <CardBody className="flex flex-row items-center gap-4">
                        <div className="p-3 rounded-xl bg-warning/10 text-warning">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <p className="text-small text-default-500">General</p>
                            <p className="text-2xl font-bold">{metrics?.by_type?.General || 0}</p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Tabs
                        aria-label="Status filters"
                        color="primary"
                        variant="solid"
                        size="sm"
                        radius="md"
                        selectedKey={statusFilter}
                        onSelectionChange={(key) => setStatusFilter(key as string)}
                        classNames={{
                            tabList: "bg-default-100 p-1",
                            cursor: "bg-white shadow-sm",
                            tabContent: "group-data-[selected=true]:text-secondary font-bold px-3"
                        }}
                    >
                        <Tab key="all" title={`All (${metrics?.total || 0})`} />
                        <Tab key="Open" title={`Open (${metrics?.by_status?.Open || 0})`} />
                        <Tab key="In Review" title={`In Review (${metrics?.by_status?.["In Review"] || 0})`} />
                        <Tab key="Resolved" title={`Resolved (${metrics?.by_status?.Resolved || 0})`} />
                        <Tab key="Closed" title={`Closed (${metrics?.by_status?.Closed || 0})`} />
                    </Tabs>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Search feedback..."
                        startContent={<Search size={18} className="text-default-400" />}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        className="w-full md:w-64"
                        variant="bordered"
                    />
                    <div className="flex bg-default-100 rounded-lg p-1">
                        <Button
                            isIconOnly
                            size="sm"
                            variant={viewType === "card" ? "flat" : "light"}
                            className={viewType === "card" ? "bg-white dark:bg-default-200 shadow-sm" : ""}
                            onPress={() => setViewType("card")}
                        >
                            <LayoutGrid size={16} />
                        </Button>
                        <Button
                            isIconOnly
                            size="sm"
                            variant={viewType === "table" ? "flat" : "light"}
                            className={viewType === "table" ? "bg-white dark:bg-default-200 shadow-sm" : ""}
                            onPress={() => setViewType("table")}
                        >
                            <List size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            {viewType === "table" ? (
                <Table aria-label="Feedback Table" removeWrapper isHeaderSticky>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
                    </TableHeader>
                    <TableBody items={filteredFeedbacks} isLoading={listLoading}>
                        {(item: any) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {listLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="h-64 animate-pulse bg-default-100" />
                        ))
                    ) : filteredFeedbacks.length > 0 ? (
                        filteredFeedbacks.map((item: any) => (
                            <Card
                                key={item.id}
                                radius="md"
                                className="border-1 border-divider bg-white dark:bg-content1 shadow-sm overflow-hidden"
                            >
                                {item.attachments?.[0] && (
                                    <div className="p-2.5 pb-0">
                                        <div className="group relative h-32 w-full overflow-hidden rounded-lg border-1 border-divider/50">
                                            <Image
                                                src={item.attachments[0].replace("host.docker.internal", "localhost")}
                                                alt="Cover"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                removeWrapper
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                            {item.attachments.length > 1 && (
                                                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
                                                    +{item.attachments.length - 1} More
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <CardHeader className="flex justify-between items-start pb-0 pt-4">
                                    <div className="flex gap-2 flex-wrap">
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color={getTypeColor(item.type)}
                                            startContent={getTypeIcon(item.type)}
                                            className="px-2"
                                        >
                                            {item.type}
                                        </Chip>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color={getPriorityColor(item.priority)}
                                            startContent={getPriorityIcon(item.priority)}
                                            className="font-bold border-none"
                                        >
                                            {item.priority}
                                        </Chip>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button isIconOnly size="sm" variant="light" onPress={() => handleOpen(item)}>
                                            <Edit size={16} className="text-default-400" />
                                        </Button>
                                        {isAdmin && (
                                            <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => handleDelete(item.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardBody className="gap-2 py-4">
                                    <h3 className="font-bold text-lg leading-tight">
                                        {item.subject}
                                    </h3>
                                    <div className="relative mt-2 p-3 bg-default-100/40 rounded-lg border-l-2 border-primary/50">
                                        <div
                                            className="text-default-600 text-sm leading-relaxed line-clamp-4 overflow-hidden 
                                                       [&>p]:mb-1 [&>b]:text-foreground [&>strong]:text-foreground
                                                       [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4
                                                       [&>a]:text-primary [&>a]:underline"
                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 mt-auto pt-4">
                                        {isAdmin ? (
                                            <Dropdown size="sm">
                                                <DropdownTrigger>
                                                    <Chip
                                                        size="sm"
                                                        color={getStatusColor(item.status)}
                                                        variant="flat"
                                                        className="font-medium cursor-pointer hover:opacity-80 transition-opacity"
                                                    >
                                                        {item.status}
                                                    </Chip>
                                                </DropdownTrigger>
                                                <DropdownMenu
                                                    aria-label="Change status"
                                                    onAction={(key) => handleStatusUpdate(item.id, key as string)}
                                                    selectedKeys={[item.status]}
                                                    selectionMode="single"
                                                >
                                                    <DropdownItem key="Open">Open</DropdownItem>
                                                    <DropdownItem key="In Review">In Review</DropdownItem>
                                                    <DropdownItem key="Resolved">Resolved</DropdownItem>
                                                    <DropdownItem key="Closed">Closed</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        ) : (
                                            <Chip
                                                size="sm"
                                                color={getStatusColor(item.status)}
                                                variant="flat"
                                                className="font-medium"
                                            >
                                                {item.status}
                                            </Chip>
                                        )}
                                        {item.attachments?.length > 0 && (
                                            <Tooltip content={`${item.attachments.length} Attachment(s)`} size="sm" closeDelay={0}>
                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-bold border border-primary/10 cursor-help">
                                                    <Paperclip size={12} />
                                                    <span>{item.attachments.length}</span>
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                </CardBody>
                                <CardFooter className="border-t border-divider py-3 px-4 flex justify-between items-end">
                                    <User
                                        name={item.employee?.name || item.employee_name}
                                        description={item.employee?.designation || "Employee"}
                                        avatarProps={{
                                            src: item.employee?.profile_picture,
                                            size: "sm",
                                            showFallback: true,
                                            name: item.employee?.name || item.employee_name
                                        }}
                                        classNames={{
                                            name: "text-xs font-semibold",
                                            description: "text-[10px]"
                                        }}
                                    />
                                    <div className="flex flex-col items-end gap-1 text-default-400 text-[10px] font-medium pb-0.5">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} className="text-default-300" />
                                            {format(new Date(item.created_at), "MMM dd, yyyy")}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} className="text-default-300" />
                                            {format(new Date(item.created_at), "hh:mm aa")}
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-default-400 gap-4 bg-default-50 rounded-3xl border-2 border-dashed border-divider">
                            <MessageSquare size={48} className="opacity-20" />
                            <div className="text-center">
                                <p className="font-semibold text-lg">No feedback found</p>
                                <p className="text-small">Try changing your filters or search term.</p>
                            </div>
                            <Button
                                variant="flat"
                                color="primary"
                                onPress={() => { setSearchTerm(""); setStatusFilter("all"); }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>{editingFeedback ? "Edit Feedback" : "Submit Feedback"}</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Subject"
                            placeholder="Enter subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                        <div className="flex flex-col gap-1">
                            <label className="text-small font-medium text-foreground">Description</label>
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => setFormData({ ...formData, description: value })}
                                className="rounded-xl"
                                style={{ height: "180px", marginBottom: "50px", borderRadius: "0.75rem" }}
                            />
                        </div>
                        <style jsx global>{`
                            .ql-toolbar.ql-snow {
                                border-color: var(--heroui-default-200) !important;
                                border-top-left-radius: 0.75rem;
                                border-top-right-radius: 0.75rem;
                            }
                            .ql-container.ql-snow {
                                border-color: var(--heroui-default-200) !important;
                                border-bottom-left-radius: 0.75rem;
                                border-bottom-right-radius: 0.75rem;
                            }
                            .dark .ql-editor { color: #E3E3E3; }
                            .dark .ql-stroke { stroke: #E3E3E3 !important; }
                            .dark .ql-fill { fill: #E3E3E3 !important; }
                            .dark .ql-picker { color: #E3E3E3 !important; }
                            .dark .ql-toolbar.ql-snow, .dark .ql-container.ql-snow {
                                background-color: #27272A;
                            }
                        `}</style>
                        <Select
                            label="Type"
                            placeholder="Select type"
                            selectedKeys={[formData.type]}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <SelectItem key="Bug">Bug</SelectItem>
                            <SelectItem key="Feature Request">Feature Request</SelectItem>
                            <SelectItem key="General">General</SelectItem>
                        </Select>
                        <Select
                            label="Priority"
                            placeholder="Select priority"
                            selectedKeys={[formData.priority]}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <SelectItem key="High">High</SelectItem>
                            <SelectItem key="Medium">Medium</SelectItem>
                            <SelectItem key="Low">Low</SelectItem>
                        </Select>
                        <div className="mt-2">
                            <p className="text-small mb-2">Attachments</p>
                            <FileUpload
                                files={files}
                                setFiles={setFiles}
                                allowMultiple={true}
                                maxFiles={5}
                                acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                                labelIdle='Drag & Drop images only or <span class="filepond--label-action">Browse</span>'
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleSubmit} isLoading={createLoading}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
