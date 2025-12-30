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
import { Checkbox } from "@heroui/checkbox";

interface AddEditHolidayDrawerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mode: "create" | "edit";
    selectedHoliday: any;
    loading: boolean;
    onSubmit: (data: any) => void;
}

export default function AddEditHolidayDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedHoliday,
    loading,
    onSubmit,
}: AddEditHolidayDrawerProps) {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        description: "",
        holiday_type: "Public",
        is_restricted: false,
        status: "Active",
    });

    useEffect(() => {
        if (mode === "edit" && selectedHoliday) {
            setFormData({
                name: selectedHoliday.name || "",
                date: selectedHoliday.date || "",
                description: selectedHoliday.description || "",
                holiday_type: selectedHoliday.holiday_type || "Public",
                is_restricted: selectedHoliday.is_restricted || false,
                status: selectedHoliday.status || "Active",
            });
        } else {
            setFormData({
                name: "",
                date: "",
                description: "",
                holiday_type: "Public",
                is_restricted: false,
                status: "Active",
            });
        }
    }, [mode, selectedHoliday, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const holidayTypes = ["Public", "Mandatory", "Optional", "Restricted"];
    const statuses = ["Active", "Inactive"];

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add New Holiday" : "Edit Holiday"}
                        </DrawerHeader>
                        <DrawerBody className="gap-4 pb-8">
                            <Input
                                label="Holiday Name"
                                placeholder="e.g., New Year's Day"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                variant="bordered"
                                isRequired
                            />

                            <DatePicker
                                label="Holiday Date"
                                name="date"
                                value={formData.date ? parseDate(formData.date) : null}
                                onChange={(date) => handleSelectChange("date", date?.toString())}
                                variant="bordered"
                                isRequired
                            />

                            <Select
                                label="Holiday Type"
                                placeholder="Select type"
                                selectedKeys={[formData.holiday_type]}
                                onSelectionChange={(keys) => handleSelectChange("holiday_type", Array.from(keys)[0])}
                                variant="bordered"
                            >
                                {holidayTypes.map((type) => (
                                    <SelectItem key={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </Select>

                            <div className="flex flex-col gap-2 p-2 border rounded-lg border-default-200">
                                <Checkbox
                                    isSelected={formData.is_restricted}
                                    onValueChange={(val) => handleSelectChange("is_restricted", val)}
                                >
                                    Is Restricted/Optional Holiday?
                                </Checkbox>
                                <p className="text-tiny text-default-400 pl-7">
                                    Restricted holidays are optional for employees.
                                </p>
                            </div>

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

                            <Textarea
                                label="Description"
                                placeholder="Enter holiday details"
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
                                {mode === "create" ? "Create Holiday" : "Update Holiday"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
