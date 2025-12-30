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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

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
            setLogoPreview(selectedProject.logo || null);
        } else {
            setFormData({
                name: "",
                client_id: "",
                description: "",
                start_date: "",
                end_date: "",
                status: "Planned",
                priority: "Medium",
                project_manager_ids: [],
                team_leader_ids: [],
                team_member_ids: [],
                budget: 0,
                currency: "USD",
                tags: [],
            });
            setLogoPreview(null);
        }
        setLogo(null);
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
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
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

        if (logo) {
            data.append("logo", logo);
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
                            <div className="flex flex-col items-center gap-4 mb-2">
                                <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-default-300 flex items-center justify-center overflow-hidden bg-default-50">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-default-400 text-xs text-center p-2">Project Logo</div>
                                    )}
                                </div>
                                <Button size="sm" variant="flat" onPress={() => document.getElementById("logo-upload")?.click()}>
                                    Upload Logo
                                </Button>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />
                            </div>

                            <Input
                                label="Project Name"
                                placeholder="Enter project name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                variant="bordered"
                                required
                            />

                            <Select
                                label="Client"
                                placeholder="Select a client"
                                selectedKeys={formData.client_id ? [formData.client_id] : []}
                                onSelectionChange={(keys) => handleSelectChange("client_id", Array.from(keys)[0])}
                                variant="bordered"
                                required
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
                            >
                                {employees.map((emp: any) => (
                                    <SelectItem key={emp.id}>
                                        {emp.name}
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
                            >
                                {employees.map((emp: any) => (
                                    <SelectItem key={emp.id}>
                                        {emp.name}
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
                            >
                                {employees.map((emp: any) => (
                                    <SelectItem key={emp.id}>
                                        {emp.name}
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
