"use client";

import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { getEmployeesSummaryRequest } from "@/store/employee/action";
import FileUpload from "@/components/common/FileUpload";

interface AddEditProjectDrawerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mode: "create" | "edit";
    selectedProject: any;
    loading: boolean;
    onSubmit: (data: any) => void;
}

export default function AddEditProjectDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedProject,
    loading,
    onSubmit,
}: AddEditProjectDrawerProps) {
    const dispatch = useDispatch();
    const { clients } = useSelector((state: RootState) => state.Client);
    const { employees } = useSelector((state: RootState) => state.Employee);

    const [formData, setFormData] = useState({
        name: "",
        client_id: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Planned",
        priority: "Medium",
        project_manager_ids: [] as string[],
        team_leader_ids: [] as string[],
        team_member_ids: [] as string[],
        budget: 0,
        currency: "USD",
        tags: [] as string[],
    });
    const [logoFiles, setLogoFiles] = useState<any[]>([]);

    useEffect(() => {
        if (mode === "edit" && selectedProject) {
            setFormData({
                name: selectedProject.name || "",
                client_id: selectedProject.client_id || "",
                description: selectedProject.description || "",
                start_date: selectedProject.start_date || "",
                end_date: selectedProject.end_date || "",
                status: selectedProject.status || "Planned",
                priority: selectedProject.priority || "Medium",
                project_manager_ids: selectedProject.project_manager_ids || [],
                team_leader_ids: selectedProject.team_leader_ids || [],
                team_member_ids: selectedProject.team_member_ids || [],
                budget: selectedProject.budget || 0,
                currency: selectedProject.currency || "USD",
                tags: selectedProject.tags || [],
            });
            setLogoFiles([]);
        }
    }, [mode, selectedProject, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (name: string, keys: Set<React.Key>) => {
        const values = Array.from(keys) as string[];
        setFormData((prev) => ({ ...prev, [name]: values }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handled by FileUpload
    };

    const handleSubmit = () => {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("client_id", formData.client_id);
        data.append("description", formData.description);
        data.append("start_date", formData.start_date);
        data.append("end_date", formData.end_date);
        data.append("status", formData.status);
        data.append("priority", formData.priority);
        data.append("budget", String(formData.budget));
        data.append("currency", formData.currency);

        // Arrays as JSON strings for the updated backend
        data.append("project_manager_ids", JSON.stringify(formData.project_manager_ids));
        data.append("team_leader_ids", JSON.stringify(formData.team_leader_ids));
        data.append("team_member_ids", JSON.stringify(formData.team_member_ids));
        data.append("tags", JSON.stringify(formData.tags));

        if (logoFiles.length > 0) {
            data.append("logo", logoFiles[0].file);
        }

        onSubmit(data);
    };

    const statuses = ["Planned", "In Progress", "Completed", "On Hold"];
    const priorities = ["Low", "Medium", "High", "Urgent"];

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add New Project" : "Edit Project"}
                        </DrawerHeader>
                        <DrawerBody className="gap-4 pb-8 scrollbar-hide overflow-y-auto">
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="text-small font-medium text-foreground">Project Logo</label>
                                <FileUpload
                                    files={logoFiles}
                                    setFiles={setLogoFiles}
                                    name="logo"
                                    labelIdle='Drag & Drop your logo or <span class="filepond--label-action">Browse</span>'
                                    acceptedFileTypes={['image/*']}
                                />
                            </div>

                            <Input
                                label="Project Name"
                                placeholder="Enter project name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                variant="bordered"
                                isRequired
                            />

                            <Select
                                label="Client"
                                placeholder="Select a client"
                                selectedKeys={formData.client_id ? [formData.client_id] : []}
                                onSelectionChange={(keys) => handleSelectChange("client_id", Array.from(keys)[0])}
                                variant="bordered"
                                isRequired
                            >
                                {clients.map((client: any) => (
                                    <SelectItem key={client.id}>
                                        {client.contact_name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <div className="flex gap-4">
                                <DatePicker
                                    label="Start Date"
                                    name="start_date"
                                    value={formData.start_date ? parseDate(formData.start_date) : null}
                                    onChange={(date) => handleSelectChange("start_date", date?.toString())}
                                    variant="bordered"
                                />
                                <DatePicker
                                    label="End Date"
                                    name="end_date"
                                    value={formData.end_date ? parseDate(formData.end_date) : null}
                                    onChange={(date) => handleSelectChange("end_date", date?.toString())}
                                    variant="bordered"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Select
                                    label="Status"
                                    placeholder="Select status"
                                    selectedKeys={[formData.status]}
                                    onSelectionChange={(keys) => handleSelectChange("status", Array.from(keys)[0])}
                                    variant="bordered"
                                >
                                    {statuses.map((s) => (
                                        <SelectItem key={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Priority"
                                    placeholder="Select priority"
                                    selectedKeys={[formData.priority]}
                                    onSelectionChange={(keys) => handleSelectChange("priority", Array.from(keys)[0])}
                                    variant="bordered"
                                >
                                    {priorities.map((p) => (
                                        <SelectItem key={p}>
                                            {p}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <Select
                                label="Project Managers"
                                selectionMode="multiple"
                                placeholder="Select project managers"
                                selectedKeys={new Set(formData.project_manager_ids)}
                                onSelectionChange={(keys) => handleMultiSelectChange("project_manager_ids", keys as Set<React.Key>)}
                                variant="bordered"
                                onOpenChange={(isOpen) => {
                                    if (isOpen && (!employees || employees.length === 0)) {
                                        dispatch(getEmployeesSummaryRequest());
                                    }
                                }}
                            >
                                {employees
                                    .filter((emp: any) => (!formData.team_leader_ids.includes(emp.id) && !formData.team_member_ids.includes(emp.id)) || formData.project_manager_ids.includes(emp.id))
                                    .map((emp: any) => (
                                        <SelectItem key={emp.id} textValue={emp.name}>
                                            <div className="flex gap-2 items-center">
                                                {emp.profile_picture ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={emp.profile_picture}
                                                        alt={emp.name}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-default-200 flex items-center justify-center text-xs font-semibold text-default-500">
                                                        {emp.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-small">{emp.name}</span>
                                                    <span className="text-tiny text-default-400">{emp.email}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                            </Select>

                            <Select
                                label="Team Leaders"
                                selectionMode="multiple"
                                placeholder="Select team leaders"
                                selectedKeys={new Set(formData.team_leader_ids)}
                                onSelectionChange={(keys) => handleMultiSelectChange("team_leader_ids", keys as Set<React.Key>)}
                                variant="bordered"
                                onOpenChange={(isOpen) => {
                                    if (isOpen && (!employees || employees.length === 0)) {
                                        dispatch(getEmployeesSummaryRequest());
                                    }
                                }}
                            >
                                {employees
                                    .filter((emp: any) => (!formData.project_manager_ids.includes(emp.id) && !formData.team_member_ids.includes(emp.id)) || formData.team_leader_ids.includes(emp.id))
                                    .map((emp: any) => (
                                        <SelectItem key={emp.id} textValue={emp.name}>
                                            <div className="flex gap-2 items-center">
                                                {emp.profile_picture ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={emp.profile_picture}
                                                        alt={emp.name}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-default-200 flex items-center justify-center text-xs font-semibold text-default-500">
                                                        {emp.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-small">{emp.name}</span>
                                                    <span className="text-tiny text-default-400">{emp.email}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                            </Select>

                            <Select
                                label="Team Members"
                                selectionMode="multiple"
                                placeholder="Select team members"
                                selectedKeys={new Set(formData.team_member_ids)}
                                onSelectionChange={(keys) => handleMultiSelectChange("team_member_ids", keys as Set<React.Key>)}
                                variant="bordered"
                                onOpenChange={(isOpen) => {
                                    if (isOpen && (!employees || employees.length === 0)) {
                                        dispatch(getEmployeesSummaryRequest());
                                    }
                                }}
                            >
                                {employees
                                    .filter((emp: any) => (!formData.project_manager_ids.includes(emp.id) && !formData.team_leader_ids.includes(emp.id)) || formData.team_member_ids.includes(emp.id))
                                    .map((emp: any) => (
                                        <SelectItem key={emp.id} textValue={emp.name}>
                                            <div className="flex gap-2 items-center">
                                                {emp.profile_picture ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={emp.profile_picture}
                                                        alt={emp.name}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-default-200 flex items-center justify-center text-xs font-semibold text-default-500">
                                                        {emp.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-small">{emp.name}</span>
                                                    <span className="text-tiny text-default-400">{emp.email}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                            </Select>

                            <div className="flex gap-4">
                                <Input
                                    label="Budget"
                                    type="number"
                                    name="budget"
                                    value={formData.budget.toString()}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">$</span>
                                        </div>
                                    }
                                />
                                <Input
                                    label="Currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    variant="bordered"
                                />
                            </div>

                            <Textarea
                                label="Description"
                                placeholder="Enter project description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                variant="bordered"
                            />
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                                {mode === "create" ? "Create Project" : "Update Project"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
