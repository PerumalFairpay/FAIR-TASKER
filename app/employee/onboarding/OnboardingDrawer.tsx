
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
import { Checkbox } from "@heroui/checkbox";
import { Select, SelectItem } from "@heroui/select";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { Chip } from "@heroui/chip";

interface ProcessStep {
    id: string;
    label: string;
    status: "Pending" | "Completed";
    assigned_to?: string;
    completed_at?: string;
}

interface OnboardingDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    employee: any;
    loading: boolean;
    onSubmit: (employeeId: string, data: FormData) => void;
}

export default function OnboardingDrawer({
    isOpen,
    onOpenChange,
    employee,
    loading,
    onSubmit,
}: OnboardingDrawerProps) {
    const [steps, setSteps] = useState<ProcessStep[]>([]);
    const [status, setStatus] = useState<string>("Pending");

    useEffect(() => {
        if (isOpen && employee) {
            setStatus(employee.onboarding_status || "Pending");
            if (employee.onboarding_steps && Array.isArray(employee.onboarding_steps)) {
                setSteps(employee.onboarding_steps);
            } else {
                setSteps([]);
            }
        } else {
            setSteps([]);
            setStatus("Pending");
        }
    }, [isOpen, employee]);

    const handleAddStep = () => {
        const newStep: ProcessStep = {
            id: Date.now().toString(),
            label: "",
            status: "Pending"
        };
        setSteps([...steps, newStep]);
    };

    const handleRemoveStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id));
    };

    const handleStepChange = (id: string, field: keyof ProcessStep, value: any) => {
        setSteps(steps.map(s => {
            if (s.id === id) {
                const updated = { ...s, [field]: value };
                if (field === "status") {
                    updated.completed_at = value === "Completed" ? new Date().toISOString() : undefined;
                }
                return updated;
            }
            return s;
        }));
    };

    const handleSubmit = () => {
        if (!employee) return;

        const formData = new FormData();
        formData.append("onboarding_status", status);
        formData.append("onboarding_steps", JSON.stringify(steps));

        onSubmit(employee.id, formData);
    };

    const progress = steps.length > 0
        ? Math.round((steps.filter(s => s.status === "Completed").length / steps.length) * 100)
        : 0;

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            Onboarding: {employee?.name}
                        </DrawerHeader>
                        <DrawerBody className="py-3">
                            <div className="flex flex-col gap-6">
                                {/* Status and Progress */}
                                <div className="flex flex-col gap-4 p-4 bg-default-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-small">Status</span>
                                        <Select
                                            size="sm"
                                            className="w-40"
                                            selectedKeys={[status]}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <SelectItem key="Pending" textValue="Pending">Pending</SelectItem>
                                            <SelectItem key="In Progress" textValue="In Progress">In Progress</SelectItem>
                                            <SelectItem key="Completed" textValue="Completed">Completed</SelectItem>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between text-tiny text-default-500">
                                            <span>Progress</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-default-200 rounded-full h-2">
                                            <div
                                                className="bg-primary rounded-full h-2 transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Checklist */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-medium">Checklist</h3>
                                        <Button size="sm" variant="flat" color="primary" startContent={<Plus size={16} />} onPress={handleAddStep}>
                                            Add Step
                                        </Button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {steps.length === 0 && (
                                            <div className="text-center p-4 text-default-400 text-sm italic">
                                                No steps added. Add steps to track progress.
                                            </div>
                                        )}
                                        {steps.map((step, index) => (
                                            <div key={step.id} className="flex items-center gap-3 p-2 border border-default-200 rounded-lg group bg-white dark:bg-default-100/50">
                                                <Checkbox
                                                    isSelected={step.status === "Completed"}
                                                    onValueChange={(isSelected) => handleStepChange(step.id, "status", isSelected ? "Completed" : "Pending")}
                                                />
                                                <Input
                                                    size="sm"
                                                    variant="bordered"
                                                    classNames={{ inputWrapper: "border-none shadow-none bg-transparent group-hover:bg-default-100" }}
                                                    value={step.label}
                                                    placeholder="Task description..."
                                                    onChange={(e) => handleStepChange(step.id, "label", e.target.value)}
                                                />
                                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleRemoveStep(step.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                                Save Changes
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
