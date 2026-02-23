import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";

interface AddEditShiftDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    selectedShift?: any;
    loading: boolean;
    onSubmit: (data: any) => void;
}

export default function AddEditShiftDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedShift,
    loading,
    onSubmit,
}: AddEditShiftDrawerProps) {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && selectedShift) {
                setFormData({ ...selectedShift });
            } else {
                setFormData({
                    name: "",
                    start_time: "09:00",
                    end_time: "18:00",
                    late_threshold_minutes: 15,
                    is_night_shift: false
                });
            }
        }
    }, [isOpen, mode, selectedShift]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Shift" : "Edit Shift"}
                        </DrawerHeader>
                        <DrawerBody className="gap-4 py-4">
                            <Input
                                label="Shift Name"
                                placeholder="e.g. Morning Shift"
                                labelPlacement="outside"
                                value={formData.name || ""}
                                onChange={(e) => handleChange("name", e.target.value)}
                                isRequired
                                variant="bordered"
                            />

                            <div className="flex gap-4">
                                <Input
                                    label="Start Time"
                                    type="time"
                                    labelPlacement="outside"
                                    value={formData.start_time || ""}
                                    onChange={(e) => handleChange("start_time", e.target.value)}
                                    isRequired
                                    variant="bordered"
                                    className="flex-1"
                                />
                                <Input
                                    label="End Time"
                                    type="time"
                                    labelPlacement="outside"
                                    value={formData.end_time || ""}
                                    onChange={(e) => handleChange("end_time", e.target.value)}
                                    isRequired
                                    variant="bordered"
                                    className="flex-1"
                                />
                            </div>

                            <Input
                                label="Late Threshold (Minutes)"
                                type="number"
                                placeholder="e.g. 15"
                                labelPlacement="outside"
                                value={formData.late_threshold_minutes?.toString() || ""}
                                onChange={(e) => handleChange("late_threshold_minutes", parseInt(e.target.value))}
                                variant="bordered"
                                description="Grace period before marking as Late"
                            />

                            <div className="flex justify-between items-center py-2 px-1">
                                <span className="text-small font-medium">Night Shift</span>
                                <Switch
                                    isSelected={formData.is_night_shift || false}
                                    onValueChange={(isSelected) => handleChange("is_night_shift", isSelected)}
                                />
                            </div>

                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="light" onPress={onClose} fullWidth>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading} fullWidth>
                                {mode === "create" ? "Create Shift" : "Save Changes"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
