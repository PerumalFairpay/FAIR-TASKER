"use client";

import React, { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { createTaskRequest, updateTaskRequest } from "@/store/task/action";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { X } from "lucide-react";

interface AddEditTaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    task?: any;
}

const AddEditTaskDrawer = ({ isOpen, onClose, task }: AddEditTaskDrawerProps) => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state: AppState) => state.Project);
    const { employees } = useSelector((state: AppState) => state.Employee);

    const [formData, setFormData] = useState({
        project_id: "",
        task_name: "",
        description: "",
        start_date: "",
        end_date: "",
        priority: "Medium",
        assigned_to: [] as string[],
        tags: [] as string[],
    });

    useEffect(() => {
        if (task) {
            setFormData({
                project_id: task.project_id || "",
                task_name: task.task_name || "",
                description: task.description || "",
                start_date: task.start_date || "",
                end_date: task.end_date || "",
                priority: task.priority || "Medium",
                assigned_to: task.assigned_to || [],
                tags: task.tags || [],
            });
        } else {
            setFormData({
                project_id: "",
                task_name: "",
                description: "",
                start_date: new Date().toISOString().split("T")[0],
                end_date: new Date().toISOString().split("T")[0],
                priority: "Medium",
                assigned_to: [],
                tags: [],
            });
        }
    }, [task, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (task) {
            dispatch(updateTaskRequest(task.id, formData));
        } else {
            dispatch(createTaskRequest(formData));
        }
        onClose();
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

                        <Input
                            label="Task Name"
                            placeholder="What needs to be done?"
                            value={formData.task_name}
                            onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
                            required
                        />

                        <Textarea
                            label="Description"
                            placeholder="Describe the task details..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        <div className="flex gap-4">
                            <Input
                                type="date"
                                label="Start Date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                            <Input
                                type="date"
                                label="End Date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                required
                            />
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
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="light" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button color="primary" type="submit">
                            {task ? "Update Task" : "Create Task"}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
};

export default AddEditTaskDrawer;
