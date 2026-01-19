
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
import { Checkbox } from "@heroui/checkbox";
import { Select, SelectItem } from "@heroui/select";
import { Trash2, Plus } from "lucide-react";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

interface ProcessStep {
    id: string;
    label: string;
    status: "Pending" | "Completed";
    assigned_to?: string;
    completed_at?: string;
}

interface OffboardingDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    employee: any;
    loading: boolean;
    onSubmit: (employeeId: string, data: FormData) => void;
}

export default function OffboardingDrawer({
    isOpen,
    onOpenChange,
    employee,
    loading,
    onSubmit,
}: OffboardingDrawerProps) {
    const [steps, setSteps] = useState<ProcessStep[]>([]);
    const [status, setStatus] = useState<string>("None");
    const [resignationDate, setResignationDate] = useState<string | null>(null);
    const [offboardingDate, setOffboardingDate] = useState<string | null>(null);
    const [notes, setNotes] = useState<string>("");

    useEffect(() => {
        if (isOpen && employee) {
            setStatus(employee.offboarding_status || "None");
            setResignationDate(employee.resignation_date || null);
            setOffboardingDate(employee.offboarding_date || null);
            setNotes(employee.exit_interview_notes || "");

            if (employee.offboarding_steps && Array.isArray(employee.offboarding_steps)) {
                setSteps(employee.offboarding_steps);
            } else {
                setSteps([]);
            }
        } else {
            setSteps([]);
            setStatus("None");
            setResignationDate(null);
            setOffboardingDate(null);
            setNotes("");
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
        formData.append("offboarding_status", status);
        formData.append("offboarding_steps", JSON.stringify(steps));
        if (resignationDate) formData.append("resignation_date", resignationDate);
        if (offboardingDate) formData.append("offboarding_date", offboardingDate);
        if (notes) formData.append("exit_interview_notes", notes);

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
                            Offboarding: {employee?.name}
                        </DrawerHeader>
                        <DrawerBody className="py-3">
                            <div className="flex flex-col gap-6">
                                {/* Status and Dates */}
                                <div className="flex flex-col gap-4 p-4 bg-default-50 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Select
                                            label="Status"
                                            size="sm"
                                            variant="bordered"
                                            selectedKeys={[status]}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <SelectItem key="None" textValue="None">None</SelectItem>
                                            <SelectItem key="Pending" textValue="Pending">Pending</SelectItem>
                                            <SelectItem key="In Progress" textValue="In Progress">In Progress</SelectItem>
                                            <SelectItem key="Completed" textValue="Completed">Completed</SelectItem>
                                        </Select>
                                        <div className="flex flex-col gap-1 justify-center">
                                            <div className="flex justify-between text-tiny text-default-500">
                                                <span>Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-default-200 rounded-full h-2">
                                                <div
                                                    className="bg-danger rounded-full h-2 transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <I18nProvider locale="en-GB">
                                            <DatePicker
                                                label="Resignation Date"
                                                variant="bordered"
                                                value={resignationDate ? parseDate(resignationDate) : null}
                                                onChange={(date) => setResignationDate(date?.toString() || null)}
                                            />
                                        </I18nProvider>
                                        <I18nProvider locale="en-GB">
                                            <DatePicker
                                                label="Last Working Day"
                                                variant="bordered"
                                                value={offboardingDate ? parseDate(offboardingDate) : null}
                                                onChange={(date) => setOffboardingDate(date?.toString() || null)}
                                            />
                                        </I18nProvider>
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
                                                No steps added.
                                            </div>
                                        )}
                                        {steps.map((step) => (
                                            <div key={step.id} className="flex items-center gap-3 p-2 border border-default-200 rounded-lg group bg-white dark:bg-default-100/50">
                                                <Checkbox
                                                    isSelected={step.status === "Completed"}
                                                    onValueChange={(isSelected) => handleStepChange(step.id, "status", isSelected ? "Completed" : "Pending")}
                                                    color="danger"
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

                                {/* Exit Interview Notes */}
                                <div>
                                    <Textarea
                                        label="Exit Interview Notes"
                                        placeholder="Enter notes from the exit interview..."
                                        variant="bordered"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="danger" onPress={handleSubmit} isLoading={loading}>
                                Save Changes
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
