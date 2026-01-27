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
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

interface AddEditLeaveTypeDrawerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mode: "create" | "edit";
    selectedLeaveType: any;
    loading: boolean;
    onSubmit: (data: any) => void;
}

export default function AddEditLeaveTypeDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedLeaveType,
    loading,
    onSubmit,
}: AddEditLeaveTypeDrawerProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "Paid",
        code: "",
        status: "Active",
        number_of_days: 0,
        monthly_allowed: 0,
        allowed_hours: 0,
    });

    useEffect(() => {
        if (mode === "edit" && selectedLeaveType) {
            setFormData({
                name: selectedLeaveType.name || "",
                type: selectedLeaveType.type || "Paid",
                code: selectedLeaveType.code || "",
                status: selectedLeaveType.status || "Active",
                number_of_days: selectedLeaveType.number_of_days || 0,
                monthly_allowed: selectedLeaveType.monthly_allowed || 0,
                allowed_hours: selectedLeaveType.allowed_hours || 0,
            });
        } else {
            setFormData({
                name: "",
                type: "Paid",
                code: "",
                status: "Active",
                number_of_days: 0,
                monthly_allowed: 0,
                allowed_hours: 0,
            });
        }
    }, [mode, selectedLeaveType, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "number_of_days" || name === "monthly_allowed" || name === "allowed_hours" ? parseFloat(value) || 0 : value
        }));
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const leaveTypesList = ["Paid", "Unpaid"];
    const statuses = ["Active", "Inactive"];

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add New Leave Type" : "Edit Leave Type"}
                        </DrawerHeader>
                        <DrawerBody className="gap-4 pb-8">
                            <Input
                                label="Leave Type Name"
                                placeholder="e.g., Annual Leave"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                variant="bordered"
                                isRequired
                            />

                            <Input
                                label="Leave Code"
                                placeholder="e.g., AL"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                variant="bordered"
                                isRequired
                            />

                            <Select
                                label="Leave Type"
                                placeholder="Select type"
                                selectedKeys={[formData.type]}
                                onSelectionChange={(keys) => handleSelectChange("type", Array.from(keys)[0])}
                                variant="bordered"
                            >
                                {leaveTypesList.map((type) => (
                                    <SelectItem key={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Input
                                label="Number of Days (Yearly)"
                                placeholder="e.g., 12"
                                type="number"
                                name="number_of_days"
                                value={formData.number_of_days.toString()}
                                onChange={handleInputChange}
                                variant="bordered"
                                isRequired
                            />

                            <Input
                                label="Monthly Allowed"
                                placeholder="e.g., 1"
                                type="number"
                                name="monthly_allowed"
                                value={formData.monthly_allowed.toString()}
                                onChange={handleInputChange}
                                variant="bordered"
                                isRequired
                            />

                            <Input
                                label="Allowed Hours (Optional)"
                                placeholder="e.g., 2 (for permissions)"
                                type="number"
                                name="allowed_hours"
                                value={formData.allowed_hours.toString()}
                                onChange={handleInputChange}
                                variant="bordered"
                                description="Set 0 if not applicable"
                            />

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
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                                {mode === "create" ? "Create Leave Type" : "Update Leave Type"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
