"use client";

import React, { useEffect, useState, useRef } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { createTaskRequest, updateTaskRequest, deleteTaskRequest } from "@/store/task/action";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { X, Trash2, Calendar as CalendarIcon, Clock } from "lucide-react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import FileUpload from "@/components/common/FileUpload";

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface AddEditTaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    task?: any;
    selectedDate?: string;
    allowedStatuses?: string[];
}

interface Attachment {
    file_name: string;
    file_url: string;
    file_type?: string;
}

const AddEditTaskDrawer = ({ isOpen, onClose, task, selectedDate, allowedStatuses }: AddEditTaskDrawerProps) => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state: AppState) => state.Project);
    const { employees } = useSelector((state: AppState) => state.Employee);
    const {
        createTaskLoading, createTaskSuccess,
        updateTaskLoading, updateTaskSuccess,
        deleteTaskLoading, deleteTaskSuccess
    } = useSelector((state: AppState) => state.Task);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!task;
    const loading = isEditMode ? (updateTaskLoading || deleteTaskLoading) : createTaskLoading;
    const success = isEditMode ? (updateTaskSuccess || deleteTaskSuccess) : createTaskSuccess;

    const initialFormData = {
        project_id: "",
        task_name: "",
        description: "",
        start_date: selectedDate || new Date().toISOString().split("T")[0],
        end_date: selectedDate || new Date().toISOString().split("T")[0],
        start_time: "09:00",
        end_time: "18:00",
        priority: "Medium",
        assigned_to: [] as string[],
        tags: [] as string[],
        status: "Todo" // Default status
    };

    const [formData, setFormData] = useState(initialFormData);
    const [existingAttachments, setExistingAttachments] = useState<(string | Attachment)[]>([]);
    const [newAttachments, setNewAttachments] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsSubmitting(false);
            if (task) {
                setFormData({
                    project_id: task.project_id || "",
                    task_name: task.task_name || "",
                    description: task.description || "",
                    start_date: task.start_date || "",
                    end_date: task.end_date || "",
                    start_time: task.start_time || "09:00",
                    end_time: task.end_time || "18:00",
                    priority: task.priority || "Medium",
                    assigned_to: task.assigned_to || [],
                    tags: task.tags || [],
                    status: task.status || "Todo"
                });
                setExistingAttachments(task.attachments || []);
                setNewAttachments([]);
            } else {
                setFormData({
                    ...initialFormData,
                    start_date: selectedDate || new Date().toISOString().split("T")[0],
                    end_date: selectedDate || new Date().toISOString().split("T")[0],
                    status: allowedStatuses?.[0] || "Todo"
                });
                setExistingAttachments([]);
                setNewAttachments([]);
            }
        } else {
            // Reset form when drawer closes
            setFormData(initialFormData);
            setExistingAttachments([]);
            setNewAttachments([]);
            setIsSubmitting(false);
        }
    }, [task, isOpen, selectedDate, allowedStatuses]);

    useEffect(() => {
        if (isSubmitting && !loading && success) {
            onClose();
            setIsSubmitting(false);
        }
    }, [loading, success, isSubmitting, onClose]);

    const removeExistingAttachment = (index: number) => {
        const newExisting = [...existingAttachments];
        newExisting.splice(index, 1);
        setExistingAttachments(newExisting);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append("project_id", formData.project_id);
        data.append("task_name", formData.task_name);
        data.append("description", formData.description);
        data.append("start_date", formData.start_date);
        data.append("end_date", formData.end_date);
        data.append("start_time", formData.start_time);
        data.append("end_time", formData.end_time);
        data.append("priority", formData.priority);
        data.append("status", formData.status);
        data.append("progress", task?.progress?.toString() || "0");

        formData.assigned_to.forEach(id => data.append("assigned_to[]", id));
        formData.tags.forEach(tag => data.append("tags[]", tag));

        // Append new files from FilePond
        newAttachments.forEach(fileItem => {
            data.append("attachments", fileItem.file);
        });

        if (task) {
            dispatch(updateTaskRequest(task.id, data));
        } else {
            dispatch(createTaskRequest(data));
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} size="md">
            <DrawerContent>
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    <DrawerHeader className="flex flex-col gap-1">
                        {task ? "Edit Task" : "Create New Task"}
                    </DrawerHeader>
                    <DrawerBody className="gap-4">
                        <Select
                            label="Project"
                            placeholder="Select project"
                            selectedKeys={formData.project_id ? [formData.project_id] : []}
                            onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                            required
                        >
                            {projects.map((project: any) => (
                                <SelectItem key={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </Select>

                        {allowedStatuses && (
                            <Select
                                label="Status"
                                placeholder="Select status"
                                selectedKeys={formData.status ? [formData.status] : []}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                required
                            >
                                {allowedStatuses.map((status) => (
                                    <SelectItem key={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </Select>
                        )}

                        <Input
                            label="Task Name"
                            placeholder="What needs to be done?"
                            value={formData.task_name}
                            onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
                            required
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-small font-medium text-foreground">
                                Description
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => setFormData({ ...formData, description: value })}
                                className="rounded-xl mb-4"
                                style={{ height: "200px", marginBottom: "50px" }}
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
                                min-height: 150px;
                            }
                            .dark .ql-editor { color: #E3E3E3; }
                            .dark .ql-stroke { stroke: #E3E3E3 !important; }
                            .dark .ql-fill { fill: #E3E3E3 !important; }
                            .dark .ql-picker { color: #E3E3E3 !important; }
                        `}</style>

                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <DatePicker
                                    label="Start Date"
                                    value={formData.start_date ? parseDate(formData.start_date) : undefined}
                                    onChange={(date) => {
                                        const newStartStr = date ? date.toString() : "";
                                        let newEndStr = formData.end_date;
                                        if (newStartStr && formData.end_date && newStartStr > formData.end_date) {
                                            newEndStr = newStartStr;
                                        }
                                        setFormData({ ...formData, start_date: newStartStr, end_date: newEndStr });
                                    }}
                                    isRequired
                                    isDisabled={!task}
                                    className="flex-1"
                                />
                                <Input
                                    type="time"
                                    label="Start Time"
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex gap-4">
                                <DatePicker
                                    label="End Date"
                                    value={formData.end_date ? parseDate(formData.end_date) : undefined}
                                    onChange={(date) => setFormData({ ...formData, end_date: date ? date.toString() : "" })}
                                    isRequired
                                    minValue={formData.start_date ? parseDate(formData.start_date) : undefined}
                                    className="flex-1"
                                />
                                <Input
                                    type="time"
                                    label="End Time"
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    className="w-[150px]"
                                />
                            </div>
                        </div>

                        <Select
                            label="Priority"
                            selectedKeys={[formData.priority]}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <SelectItem key="Low">Low</SelectItem>
                            <SelectItem key="Medium">Medium</SelectItem>
                            <SelectItem key="High">High</SelectItem>
                            <SelectItem key="Urgent">Urgent</SelectItem>
                        </Select>

                        <Select
                            label="Assigned To"
                            placeholder="Select team members"
                            selectionMode="multiple"
                            selectedKeys={new Set(formData.assigned_to)}
                            onSelectionChange={(keys) => setFormData({ ...formData, assigned_to: Array.from(keys) as string[] })}
                            renderValue={(items) => (
                                <div className="flex flex-wrap gap-1">
                                    {items.map((item) => (
                                        <Chip key={item.key} size="sm" variant="flat">
                                            {item.textValue}
                                        </Chip>
                                    ))}
                                </div>
                            )}
                        >
                            {employees.map((employee: any) => (
                                <SelectItem
                                    key={employee.employee_no_id}
                                    textValue={employee.name}
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar size="sm" src={employee.profile_picture} name={employee.name} />
                                        <span>{employee.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>

                        <Input
                            label="Tags (Comma separated)"
                            placeholder="e.g. backend, bug, ui"
                            value={formData.tags.join(", ")}
                            onChange={(e) => setFormData({
                                ...formData,
                                tags: e.target.value.split(",").map(t => t.trim()).filter(t => t !== "")
                            })}
                        />

                        {/* Attachment Section */}
                        <div className="flex flex-col gap-2">
                            <label className="text-small font-medium text-foreground">
                                Attachments
                            </label>

                            <FileUpload
                                files={newAttachments}
                                setFiles={setNewAttachments}
                                allowMultiple={true}
                                maxFiles={5}
                                name="attachments"
                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                            />

                            <div className="flex flex-wrap gap-2">
                                {/* Existing Attachments */}
                                {existingAttachments.map((item, index) => {
                                    let fileName = "";
                                    let url = "";

                                    if (typeof item === "string") {
                                        url = item;
                                        fileName = url.split("/").pop() || "Attached File";
                                    } else {
                                        url = item.file_url;
                                        fileName = item.file_name;
                                    }

                                    return (
                                        <Chip
                                            key={`existing-${index}`}
                                            onClose={() => removeExistingAttachment(index)}
                                            variant="flat"
                                            color="secondary"
                                        >
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{fileName}</a>
                                        </Chip>
                                    );
                                })}
                            </div>
                        </div>

                    </DrawerBody>
                    <DrawerFooter>
                        <div className="flex w-full justify-between">
                            {task && (
                                <Button
                                    color="danger"
                                    variant="flat"
                                    startContent={!loading && <Trash2 size={18} />}
                                    isLoading={loading && isSubmitting}
                                    isDisabled={loading}
                                    onPress={() => {
                                        setIsSubmitting(true);
                                        dispatch(deleteTaskRequest(task.id));
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                            <div className="flex gap-2 ml-auto">
                                <Button variant="light" onPress={onClose} isDisabled={loading}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit" isLoading={loading && isSubmitting} isDisabled={loading}>
                                    {task ? "Update Task" : "Create Task"}
                                </Button>
                            </div>
                        </div>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
};

export default AddEditTaskDrawer;
