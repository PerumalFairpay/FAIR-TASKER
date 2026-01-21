"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesRequest, updateEmployeeRequest, clearEmployeeDetails } from "@/store/employee/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Plus, Trash2, X, CheckSquare, Settings, ArrowRight, Settings2 } from "lucide-react";
import { Progress } from "@heroui/progress";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { User } from "@heroui/user";

export default function OnboardingPage() {
    const dispatch = useDispatch();
    const { employees, loading, success, error } = useSelector((state: RootState) => state.Employee);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [onboardingTasks, setOnboardingTasks] = useState<any[]>([]);
    const [showNewTaskInput, setShowNewTaskInput] = useState(false);

    const DEFAULT_ONBOARDING_TASKS = [
        "Document Verification",
        "IT Induction",
        "Email Creation",
        "Badge Creation",
        // "Stationary Allocation",
        "Laptop Allocation",
        "Monitor Allocation",
        "Headset Allocation",
        "Keyboard & Mouse Allocation"
    ];
    const [newTaskName, setNewTaskName] = useState("");
    const [isCompleting, setIsCompleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);

    const onboardingEmployees = (employees || []).filter((emp: any) => emp.status === "Onboarding");

    useEffect(() => {
        dispatch(getEmployeesRequest(1, 1000, {}));
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
                color: "success"
            });
            dispatch(clearEmployeeDetails());
            dispatch(getEmployeesRequest(1, 1000, {}));
            if (isCompleting) {
                setIsDrawerOpen(false);
                setIsCompleting(false);
            }
            setIsSaving(false);
            setIsCompletingOnboarding(false);
        }
        if (error) {
            addToast({
                title: "Error",
                description: typeof error === 'string' ? error : "Something went wrong",
                color: "danger"
            });
            dispatch(clearEmployeeDetails());
            setIsSaving(false);
            setIsCompletingOnboarding(false);
        }
    }, [success, error, dispatch]);

    useEffect(() => {
        if (selectedEmployee) {
            const existingTasks = selectedEmployee.onboarding_checklist || [];

            if (existingTasks.length === 0) {
                // Populate default tasks if checklist is empty
                const defaultTasks = DEFAULT_ONBOARDING_TASKS.map(taskName => ({
                    name: taskName,
                    status: "Pending",
                    completed_at: null
                }));
                setOnboardingTasks(defaultTasks);
            } else {
                setOnboardingTasks(existingTasks);
            }
        }
    }, [selectedEmployee]);

    const handleOpenDrawer = (employee: any) => {
        setSelectedEmployee(employee);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedEmployee(null);
        setOnboardingTasks([]);
        setShowNewTaskInput(false);
        setNewTaskName("");
    };

    const handleTaskAction = (action: 'add' | 'delete' | 'toggle', payload?: any) => {
        if (action === 'add' && newTaskName) {
            setOnboardingTasks([...onboardingTasks, { name: newTaskName, status: "Pending", completed_at: null }]);
            setNewTaskName("");
            setShowNewTaskInput(false);
        } else if (action === 'delete') {
            setOnboardingTasks(onboardingTasks.filter((_, i) => i !== payload));
        } else if (action === 'toggle') {
            setOnboardingTasks(onboardingTasks.map((t, i) =>
                i === payload
                    ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed", completed_at: t.status === "Pending" ? new Date().toISOString() : null }
                    : t
            ));
        }
    };

    const handleSaveProgress = () => {
        if (!selectedEmployee) return;

        setIsSaving(true);
        const formData = new FormData();
        formData.append("onboarding_checklist", JSON.stringify(onboardingTasks));

        dispatch(updateEmployeeRequest(selectedEmployee.id, formData));
    };

    const handleCompleteOnboarding = () => {
        if (!selectedEmployee) return;

        setIsCompleting(true);
        setIsCompletingOnboarding(true);
        const formData = new FormData();
        formData.append("status", "Probation");
        formData.append("onboarding_checklist", JSON.stringify(onboardingTasks));

        dispatch(updateEmployeeRequest(selectedEmployee.id, formData));
    };

    const calculateProgress = (tasks: any[]) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === "Completed").length;
        return Math.round((completed / tasks.length) * 100);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Employee Onboarding" />
            </div>

            <Table aria-label="Onboarding employees table" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>EMPLOYEE</TableColumn>
                    <TableColumn>DEPARTMENT</TableColumn>
                    <TableColumn>PROGRESS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={onboardingEmployees} emptyContent="No employees in onboarding phase" isLoading={loading}>
                    {(employee: any) => {
                        const progress = calculateProgress(employee.onboarding_checklist || []);
                        return (
                            <TableRow key={employee.id}>
                                <TableCell>
                                    <User
                                        avatarProps={{ radius: "lg", src: employee.profile_picture }}
                                        description={employee.designation || "N/A"}
                                        name={employee.name}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <p className="text-bold text-sm capitalize">{employee.department || "N/A"}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 min-w-[120px]">
                                        <div className="flex justify-between items-center">
                                            <span className="text-tiny text-default-500">PROGRESS</span>
                                            <span className="text-tiny font-semibold text-primary">{progress}%</span>
                                        </div>
                                        <Progress
                                            value={progress}
                                            color={progress === 100 ? "success" : "primary"}
                                            size="sm"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="relative flex items-center justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="light"
                                            color="primary"
                                            startContent={<Settings2 size={16} />}
                                            onPress={() => handleOpenDrawer(employee)}
                                        >
                                            Manage
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    }}
                </TableBody>
            </Table>

            <Drawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} size="lg">
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-default-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold">{selectedEmployee?.name}</h2>
                                        <p className="text-small text-default-500">
                                            {selectedEmployee?.designation} • {selectedEmployee?.department}
                                        </p>
                                    </div>
                                </div>
                            </DrawerHeader>
                            <DrawerBody className="pt-6">
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-default-700">Progress</span>
                                            <span className="text-sm font-semibold text-primary">{calculateProgress(onboardingTasks)}%</span>
                                        </div>
                                        <Progress
                                            value={calculateProgress(onboardingTasks)}
                                            color={calculateProgress(onboardingTasks) === 100 ? "success" : "primary"}
                                            size="md"
                                        />
                                        <p className="text-tiny text-default-500">
                                            {onboardingTasks.filter(t => t.status === "Completed").length} of {onboardingTasks.length} tasks completed
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Checklist</h3>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            variant="flat"
                                            onPress={() => setShowNewTaskInput(true)}
                                            startContent={<Plus size={16} />}
                                        >
                                            Add Step
                                        </Button>
                                    </div>

                                    {showNewTaskInput && (
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter task name..."
                                                value={newTaskName}
                                                onChange={(e) => setNewTaskName(e.target.value)}
                                                size="sm"
                                                autoFocus
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') handleTaskAction('add');
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                isIconOnly
                                                color="success"
                                                onPress={() => handleTaskAction('add')}
                                            >
                                                <CheckSquare size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                isIconOnly
                                                color="danger"
                                                variant="light"
                                                onPress={() => {
                                                    setShowNewTaskInput(false);
                                                    setNewTaskName("");
                                                }}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        {onboardingTasks.length === 0 ? (
                                            <div className="text-center text-default-400 py-12 border border-dashed border-default-200 rounded-lg">
                                                <CheckSquare size={48} className="mx-auto mb-3 opacity-50" />
                                                <p>No onboarding tasks yet.</p>
                                                <p className="text-tiny mt-1">Click "Add Step" to get started.</p>
                                            </div>
                                        ) : (
                                            onboardingTasks.map((task, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <Checkbox
                                                            isSelected={task.status === "Completed"}
                                                            onValueChange={() => handleTaskAction('toggle', index)}
                                                            color="primary"
                                                        />
                                                        <span className={task.status === "Completed" ? "text-default-400 line-through" : "text-default-700"}>
                                                            {task.name}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                        onPress={() => handleTaskAction('delete', index)}
                                                    >
                                                        <Trash2 size={18} className="text-danger" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </DrawerBody>
                            <DrawerFooter className="border-t border-default-200 justify-between">
                                <Button
                                    color="primary"
                                    variant="flat"
                                    onPress={handleSaveProgress}
                                    isLoading={isSaving}
                                >
                                    Save Progress
                                </Button>
                                <Button
                                    color="success"
                                    endContent={<ArrowRight size={16} />}
                                    onPress={handleCompleteOnboarding}
                                    isLoading={isCompletingOnboarding}
                                    isDisabled={calculateProgress(onboardingTasks) < 100}
                                >
                                    Complete Onboarding
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
