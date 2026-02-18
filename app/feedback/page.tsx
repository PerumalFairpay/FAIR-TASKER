"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageHeader } from "@/components/PageHeader";
import { AppState } from "@/store/rootReducer";
import {
    createFeedbackRequest,
    getFeedbacksRequest,
    updateFeedbackRequest,
    deleteFeedbackRequest,
    clearFeedback,
} from "@/store/feedback/action";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { format } from "date-fns";
import { Plus, Edit, Trash2 } from "lucide-react";
import { User as UserIcon } from "lucide-react";
import { User } from "@heroui/user";
import FileUpload from "@/components/common/FileUpload";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function FeedbackPage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: AppState) => state.Auth);
    const { feedbacks, listLoading, createLoading, createSuccess, createError, updateSuccess, updateError, deleteSuccess, deleteError } = useSelector((state: AppState) => state.Feedback);
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

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this feedback?")) {
            dispatch(deleteFeedbackRequest(id));
        }
    }


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
                return <Chip color={cellValue === "High" ? "danger" : cellValue === "Medium" ? "warning" : "success"} variant="dot">{cellValue}</Chip>;
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

            <Table aria-label="Feedback Table">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
                </TableHeader>
                <TableBody items={feedbacks || []} isLoading={listLoading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

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
