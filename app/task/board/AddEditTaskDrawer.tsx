"use client";

import React, { useEffect, useState, useRef } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { createTaskRequest, updateTaskRequest, deleteTaskRequest, clearTaskDetails } from "@/store/task/action";
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
    const { user } = useSelector((state: AppState) => state.Auth);
    const {
        createTaskLoading, createTaskSuccess,
        updateTaskLoading, updateTaskSuccess,
        deleteTaskLoading, deleteTaskSuccess
    } = useSelector((state: AppState) => state.Task);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!task;

    // Derived loading state for disabling inputs generally
    const anyLoading = createTaskLoading || updateTaskLoading || deleteTaskLoading;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    const initialFormData = {
        project_id: "",
        task_name: "",
        description: "",
        start_date: todayStr,
        end_date: todayStr,
        start_time: currentTime,
        end_time: "18:00",
        priority: "Medium",
        assigned_to: [] as string[],
        tags: [] as string[],
        status: "Todo"
    };

    const [formData, setFormData] = useState(initialFormData);
    const [existingAttachments, setExistingAttachments] = useState<(string | Attachment)[]>([]);
    const [newAttachments, setNewAttachments] = useState<any[]>([]);

    const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            dispatch(clearTaskDetails());
            setErrors({});
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
                    start_date: todayStr,
                    end_date: todayStr,
                    status: allowedStatuses?.[0] || "Todo",
                    assigned_to: user?.employee_id ? [user.employee_id] : []
                });
                setExistingAttachments([]);
                setNewAttachments([]);
            }
        } else {
            dispatch(clearTaskDetails());
            setFormData(initialFormData);
            setExistingAttachments([]);
            setNewAttachments([]);
            setErrors({});
        }
    }, [task, isOpen, selectedDate, allowedStatuses, user, dispatch]);

    useEffect(() => {
        // Close if any success flag is raised and its corresponding loading is finished
        if (
            (createTaskSuccess && !createTaskLoading) ||
            (updateTaskSuccess && !updateTaskLoading) ||
            (deleteTaskSuccess && !deleteTaskLoading)
        ) {
            onClose();
        }
    }, [createTaskSuccess, createTaskLoading, updateTaskSuccess, updateTaskLoading, deleteTaskSuccess, deleteTaskLoading, onClose]);

    const removeExistingAttachment = (index: number) => {
        const newExisting = [...existingAttachments];
        newExisting.splice(index, 1);
        setExistingAttachments(newExisting);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.project_id) {
            newErrors.project_id = "Project is required";
        }

        if (!formData.task_name.trim()) {
            newErrors.task_name = "Task name is required";
        }

        if (!formData.description || formData.description === "<p><br></p>") {
            newErrors.description = "Description is required";
        }

        if (formData.assigned_to.length === 0) {
            newErrors.assigned_to = "At least one assignee is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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

        newAttachments.forEach(fileItem => {
            data.append("attachments", fileItem.file);
        });

        if (task) {
            dispatch(updateTaskRequest(task.id, data));
        } else {
            dispatch(createTaskRequest(data));
        }
    };

    const handleDeleteTask = () => {
        setIsDeletePopoverOpen(false);
        dispatch(deleteTaskRequest(task.id));
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
                            onChange={(e) => {
                                setFormData({ ...formData, project_id: e.target.value });
                                if (e.target.value) setErrors((prev) => ({ ...prev, project_id: "" }));
                            }}
                            isInvalid={!!errors.project_id}
                            errorMessage={errors.project_id}
                            isDisabled={anyLoading}
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
                                selectedKeys={
                                    formData.status && allowedStatuses.includes(formData.status)
                                        ? [formData.status]
                                        : []
                                }
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                required
                                isDisabled={anyLoading}
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
                            onChange={(e) => {
                                setFormData({ ...formData, task_name: e.target.value });
                                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, task_name: "" }));
                            }}
                            isInvalid={!!errors.task_name}
                            errorMessage={errors.task_name}
                            isDisabled={anyLoading}
                        />

                        <div className="flex flex-col gap-2">
                            <label className={`text-small font-medium ${errors.description ? "text-danger" : "text-foreground"}`}>
                                Description
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => {
                                    setFormData({ ...formData, description: value });
                                    if (value && value !== "<p><br></p>") setErrors((prev) => ({ ...prev, description: "" }));
                                }}
                                className="rounded-xl mb-4"
                                style={{
                                    height: "200px",
                                    marginBottom: "50px",
                                    border: errors.description ? "1px solid var(--heroui-danger)" : undefined,
                                    borderRadius: "0.75rem"
                                }}
                                readOnly={anyLoading}
                            />
                            {errors.description && (
                                <div className="text-tiny text-danger -mt-8">{errors.description}</div>
                            )}
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
                                    isDisabled={!task || anyLoading}
                                    className="flex-1"
                                />
                                <Input
                                    type="time"
                                    label="Start Time"
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    className="w-[150px]"
                                    isDisabled={anyLoading} // Always disabled in some cases, but logicwise should follow
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
                                    isDisabled={anyLoading}
                                />
                                <Input
                                    type="time"
                                    label="End Time"
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    className="w-[150px]"
                                    isDisabled={anyLoading}
                                />
                            </div>
                        </div>

                        <Select
                            label="Priority"
                            selectedKeys={[formData.priority]}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            isDisabled={anyLoading}
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
                            onSelectionChange={(keys) => {
                                const newKeys = Array.from(keys) as string[];
                                setFormData({ ...formData, assigned_to: newKeys });
                                if (newKeys.length > 0) setErrors((prev) => ({ ...prev, assigned_to: "" }));
                            }}
                            isInvalid={!!errors.assigned_to}
                            errorMessage={errors.assigned_to}
                            isDisabled={anyLoading}
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
                            isDisabled={anyLoading}
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
                                <Popover
                                    isOpen={isDeletePopoverOpen}
                                    onOpenChange={setIsDeletePopoverOpen}
                                    placement="top"
                                    motionProps={{
                                        variants: {
                                            enter: {
                                                height: "auto",
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    height: { type: "spring", stiffness: 200, damping: 20 },
                                                    opacity: { duration: 0.2 },
                                                    y: { type: "spring", stiffness: 200, damping: 20 },
                                                },
                                            },
                                            exit: {
                                                height: 0,
                                                opacity: 0,
                                                y: -10,
                                                transition: {
                                                    height: { duration: 0.2, ease: "easeInOut" },
                                                    opacity: { duration: 0.15 },
                                                    y: { duration: 0.2, ease: "easeInOut" },
                                                },
                                            },
                                        },
                                        initial: { height: 0, opacity: 0, y: -10 },
                                        animate: "enter",
                                        exit: "exit",
                                        style: { overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", transformOrigin: "top" },
                                    }}
                                >
                                    <PopoverTrigger>
                                        <Button
                                            color="danger"
                                            variant="flat"
                                            startContent={!deleteTaskLoading && <Trash2 size={18} />}
                                            isLoading={deleteTaskLoading}
                                            isDisabled={anyLoading}
                                        >
                                            Delete
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px]">
                                        <div className="px-1 py-2">
                                            <div className="text-small font-bold mb-2">Confirm Delete</div>
                                            <div className="text-tiny mb-3">
                                                Are you sure you want to delete this task? This action cannot be undone.
                                            </div>
                                            {task && (
                                                <div className="text-tiny text-default-500 mb-3">
                                                    Task: <strong>{task.task_name}</strong>
                                                </div>
                                            )}
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => setIsDeletePopoverOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    onPress={handleDeleteTask}
                                                    isLoading={deleteTaskLoading}
                                                    isDisabled={anyLoading}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                            <div className="flex gap-2 ml-auto">
                                <Button variant="light" onPress={onClose} isDisabled={anyLoading}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    isLoading={createTaskLoading || updateTaskLoading}
                                    isDisabled={anyLoading}
                                >
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
