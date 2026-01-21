"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesRequest, updateEmployeeRequest, clearEmployeeDetails } from "@/store/employee/action";
import { getAssetsByEmployeeRequest, clearAssetDetails, assignAssetRequest } from "@/store/asset/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { Input, Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { LogOut, Plus, Trash2, X, CheckSquare, Calendar, FileText, Package, Settings, Settings2, RefreshCcw } from "lucide-react";
import { Progress } from "@heroui/progress";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { User } from "@heroui/user";
import { Tabs, Tab } from "@heroui/tabs";

export default function OffboardingPage() {
    const dispatch = useDispatch();
    const { employees, loading, success, error } = useSelector((state: RootState) => state.Employee);
    const { employeeAssets } = useSelector((state: RootState) => state.Asset || { employeeAssets: [] });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [offboardingTasks, setOffboardingTasks] = useState<any[]>([]);
    const [showNewTaskInput, setShowNewTaskInput] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [exitDetails, setExitDetails] = useState({
        resignation_date: "",
        last_working_day: "",
        exit_interview_notes: ""
    });
    const [isCompleting, setIsCompleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompletingOffboarding, setIsCompletingOffboarding] = useState(false);
    const [returningAssetId, setReturningAssetId] = useState<string | null>(null);
    const [assetToReturn, setAssetToReturn] = useState<any>(null);
    const { isOpen: isReturnModalOpen, onOpen: onReturnModalOpen, onOpenChange: onReturnModalOpenChange } = useDisclosure();

    const DEFAULT_OFFBOARDING_TASKS = [
        "Revoke System Access",
        "Exit Interview",
        "ID Card Return",
        "Full & Final Settlement",
        "Collect Laptop",
        "Collect Monitor",
        "Collect Headset",
        "Collect Keyboard & Mouse"
    ];

    const offboardingEmployees = useMemo(() => {
        return (employees || []).filter((emp: any) => emp.status === "Offboarding");
    }, [employees]);

    const assignedAssets = useMemo(() => {
        if (!selectedEmployee?.id) return [];
        return employeeAssets || [];
    }, [employeeAssets, selectedEmployee]);

    useEffect(() => {
        dispatch(getEmployeesRequest(1, 1000, { status: "Offboarding" }));
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
                color: "success"
            });
            dispatch(clearEmployeeDetails());
            dispatch(getEmployeesRequest(1, 1000, { status: "Offboarding" }));
            if (isCompleting) {
                setIsDrawerOpen(false);
                setIsCompleting(false);
            }
            setIsSaving(false);
            setIsCompletingOffboarding(false);
        }
        if (error) {
            addToast({
                title: "Error",
                description: typeof error === 'string' ? error : "Something went wrong",
                color: "danger"
            });
            dispatch(clearEmployeeDetails());
            setIsSaving(false);
            setIsCompletingOffboarding(false);
        }
    }, [success, error, dispatch]);

    // Add explicit reloading of assets when assignment changes occur
    useEffect(() => {
        if (selectedEmployee?.id && returningAssetId === null) {
            // Checks if we just finished returning an asset (returningAssetId set to null)
            // But actually, the reducer handles the list update optimistically/via response
            // So we might not need to manually refetch if the reducer logic is correct
            // Let's rely on Redux state updates for now.
        }
    }, [returningAssetId, selectedEmployee]);

    useEffect(() => {
        if (selectedEmployee) {
            // Get existing checklist from employee data
            const existingTasks = selectedEmployee.offboarding_checklist || [];

            // Generate asset return tasks
            const assetTasks = assignedAssets.map((asset: any) => ({
                name: `Return Asset: ${asset.asset_name} (Serial: ${asset.serial_no})`,
                status: "Pending",
                completed_at: null,
                asset_id: asset.id,
                is_asset_task: true
            }));

            // Helper to check if a task matches an asset
            const isTaskForAsset = (task: any, assetId: string, taskName: string) => {
                if (task.asset_id === assetId) return true;
                if (task.name === taskName) return true;
                return false;
            };

            // 1. Identify existing tasks that are NOT asset tasks or match current assets
            const validExistingTasks = existingTasks.filter((task: any) => {
                // If it's explicitly an asset task, keep it only if the asset is still assigned
                // BUT: If the asset is gone (unassigned), this task should naturally disappear or be marked completed?
                // For now, let's keep logic simple: if asset exists, show task.
                if (task.is_asset_task && task.asset_id) {
                    return assignedAssets.some((a: any) => a.id === task.asset_id);
                }
                // If it looks like an asset task (by name) but has no ID, check if it matches a current asset
                const matchingAsset = assetTasks.find((at: any) => at.name === task.name);
                if (matchingAsset) return true;

                // Keep all other tasks
                return true;
            });

            // IF existing checklist (from DB) is empty, assume we need to populate defaults
            let initialTasks = [...validExistingTasks];
            if (existingTasks.length === 0) {
                // ... defaults logic
                const defaultTasks = DEFAULT_OFFBOARDING_TASKS.map(taskName => ({
                    name: taskName,
                    status: "Pending",
                    completed_at: null
                }));
                initialTasks = [...defaultTasks];
            }

            // 2. Merge assets into the valid existing tasks
            const mergedTasks = [...initialTasks];

            assetTasks.forEach((assetTask: any) => {
                const existingMatchIndex = mergedTasks.findIndex((t: any) =>
                    isTaskForAsset(t, assetTask.asset_id, assetTask.name)
                );

                if (existingMatchIndex !== -1) {
                    // Update
                    mergedTasks[existingMatchIndex] = {
                        ...mergedTasks[existingMatchIndex],
                        asset_id: assetTask.asset_id,
                        is_asset_task: true
                    };
                } else {
                    // Add new
                    mergedTasks.push(assetTask);
                }
            });

            setOffboardingTasks(mergedTasks);
            setExitDetails({
                resignation_date: selectedEmployee.resignation_date || "",
                last_working_day: selectedEmployee.last_working_day || "",
                exit_interview_notes: selectedEmployee.exit_interview_notes || ""
            });
        }
    }, [selectedEmployee, assignedAssets]);

    const handleOpenDrawer = (employee: any) => {
        setSelectedEmployee(employee);
        setIsDrawerOpen(true);
        dispatch(getAssetsByEmployeeRequest(employee.id));
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedEmployee(null);
        setOffboardingTasks([]);
        setShowNewTaskInput(false);
        setNewTaskName("");
        setExitDetails({
            resignation_date: "",
            last_working_day: "",
            exit_interview_notes: ""
        });
        dispatch(clearAssetDetails());
    };

    const handleReturnClick = (asset: any) => {
        setAssetToReturn(asset);
        onReturnModalOpen();
    };

    const confirmReturnAsset = () => {
        if (!assetToReturn) return;

        setReturningAssetId(assetToReturn.id);
        dispatch(assignAssetRequest(assetToReturn.id, null));

        onReturnModalOpenChange(); // Close modal
        setAssetToReturn(null);

        setTimeout(() => setReturningAssetId(null), 1000);
    };

    const handleTaskAction = (action: 'add' | 'delete' | 'toggle', payload?: any) => {
        if (action === 'add' && newTaskName) {
            setOffboardingTasks([...offboardingTasks, { name: newTaskName, status: "Pending", completed_at: null }]);
            setNewTaskName("");
            setShowNewTaskInput(false);
        } else if (action === 'delete') {
            const taskToDelete = offboardingTasks[payload];
            if (taskToDelete?.is_asset_task) {
                addToast({
                    title: "Cannot Delete",
                    description: "Asset return tasks cannot be deleted. Please return the asset first.",
                    color: "warning"
                });
                return;
            }
            setOffboardingTasks(offboardingTasks.filter((_, i) => i !== payload));
        } else if (action === 'toggle') {
            setOffboardingTasks(offboardingTasks.map((t, i) =>
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
        formData.append("offboarding_checklist", JSON.stringify(offboardingTasks));
        formData.append("resignation_date", exitDetails.resignation_date);
        formData.append("last_working_day", exitDetails.last_working_day);
        formData.append("exit_interview_notes", exitDetails.exit_interview_notes);

        dispatch(updateEmployeeRequest(selectedEmployee.id, formData));
    };

    const handleCompleteOffboarding = () => {
        if (!selectedEmployee) return;

        setIsCompleting(true);
        setIsCompletingOffboarding(true);
        const formData = new FormData();
        formData.append("status", "Inactive");
        formData.append("offboarding_checklist", JSON.stringify(offboardingTasks));
        formData.append("resignation_date", exitDetails.resignation_date);
        formData.append("last_working_day", exitDetails.last_working_day);
        formData.append("exit_interview_notes", exitDetails.exit_interview_notes);

        dispatch(updateEmployeeRequest(selectedEmployee.id, formData));
    };

    const calculateProgress = (tasks: any[]) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === "Completed").length;
        return Math.round((completed / tasks.length) * 100);
    };

    const isReadyToComplete = () => {
        const checklistComplete = calculateProgress(offboardingTasks) === 100;
        const assetsReturned = assignedAssets.length === 0;
        const detailsComplete = exitDetails.resignation_date && exitDetails.last_working_day;
        return checklistComplete && assetsReturned && detailsComplete;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Employee Offboarding" />
            </div>

            <Table aria-label="Offboarding employees table" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>EMPLOYEE</TableColumn>
                    <TableColumn>LAST WORKING DAY</TableColumn>
                    <TableColumn>PROGRESS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={offboardingEmployees} emptyContent="No employees in offboarding phase" isLoading={loading}>
                    {(employee: any) => {
                        const progress = calculateProgress(employee.offboarding_checklist || []);

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
                                    {employee.last_working_day ? (
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-danger-500" />
                                            <span className="text-sm text-danger-500">
                                                {new Date(employee.last_working_day).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-default-400">Not set</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 min-w-[120px]">
                                        <div className="flex justify-between items-center">
                                            <span className="text-tiny text-default-500">PROGRESS</span>
                                            <span className="text-tiny font-semibold text-warning">{progress}%</span>
                                        </div>
                                        <Progress
                                            value={progress}
                                            color={progress === 100 ? "success" : "warning"}
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
                                <Tabs
                                    aria-label="Offboarding sections"
                                    color="warning"
                                    classNames={{
                                        base: "w-full",
                                        tabList: "bg-default-100 p-1 rounded-xl w-full flex justify-between",
                                        cursor: "rounded-lg bg-white dark:bg-default-200 shadow-sm",
                                        tab: "h-10",
                                        tabContent: "font-semibold text-default-500 group-data-[selected=true]:text-primary"
                                    }}
                                >
                                    <Tab key="exit-details" title={
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} />
                                            <span>Exit Details</span>
                                        </div>
                                    }>
                                        <div className="space-y-4 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <I18nProvider locale="en-GB">
                                                    <DatePicker
                                                        label="Resignation Date"
                                                        labelPlacement="outside"
                                                        variant="bordered"
                                                        value={exitDetails.resignation_date ? parseDate(exitDetails.resignation_date) : null}
                                                        onChange={(date) => setExitDetails({ ...exitDetails, resignation_date: date?.toString() || "" })}
                                                    />
                                                </I18nProvider>
                                                <I18nProvider locale="en-GB">
                                                    <DatePicker
                                                        label="Last Working Day"
                                                        labelPlacement="outside"
                                                        variant="bordered"
                                                        value={exitDetails.last_working_day ? parseDate(exitDetails.last_working_day) : null}
                                                        onChange={(date) => setExitDetails({ ...exitDetails, last_working_day: date?.toString() || "" })}
                                                    />
                                                </I18nProvider>
                                            </div>
                                            <Textarea
                                                label="Exit Interview Notes"
                                                placeholder="Enter notes from exit interview..."
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={exitDetails.exit_interview_notes}
                                                onChange={(e) => setExitDetails({ ...exitDetails, exit_interview_notes: e.target.value })}
                                                minRows={4}
                                            />
                                        </div>
                                    </Tab>

                                    <Tab key="assets" title={
                                        <div className="flex items-center gap-2">
                                            <Package size={16} />
                                            <span>Asset Recovery</span>
                                            {assignedAssets.length > 0 && (
                                                <Chip size="sm" color="danger" variant="flat">{assignedAssets.length}</Chip>
                                            )}
                                        </div>
                                    }>
                                        <div className="pt-4">
                                            {assignedAssets.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {assignedAssets.map((asset: any) => (
                                                        <div key={asset.id} className="p-3 border border-danger-200 bg-danger-50 rounded-lg flex justify-between items-center">
                                                            <div>
                                                                <p className="font-medium text-danger-700">{asset.asset_name}</p>
                                                                <p className="text-tiny text-danger-500">Serial: {asset.serial_no} • {asset.category?.name}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Chip size="sm" color="danger" variant="flat">Pending Return</Chip>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    variant="flat"
                                                                    startContent={<RefreshCcw size={14} />}
                                                                    onPress={() => handleReturnClick(asset)}
                                                                    isLoading={returningAssetId === asset.id}
                                                                >
                                                                    Return
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center p-8 bg-success-50 text-success-700 rounded-lg">
                                                    <Package size={48} className="mx-auto mb-3 opacity-70" />
                                                    <p className="font-medium">All assets returned</p>
                                                </div>
                                            )}
                                        </div>
                                    </Tab>

                                    <Tab key="checklist" title={
                                        <div className="flex items-center gap-2">
                                            <CheckSquare size={16} />
                                            <span>Checklist</span>
                                        </div>
                                    }>
                                        <div className="space-y-4 pt-4">
                                            <div className="flex flex-col gap-2 mb-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-default-700">Progress</span>
                                                    <span className="text-sm font-semibold text-warning">{calculateProgress(offboardingTasks)}%</span>
                                                </div>
                                                <Progress
                                                    value={calculateProgress(offboardingTasks)}
                                                    color={calculateProgress(offboardingTasks) === 100 ? "success" : "warning"}
                                                    size="md"
                                                />
                                                <p className="text-tiny text-default-500">
                                                    {offboardingTasks.filter(t => t.status === "Completed").length} of {offboardingTasks.length} tasks completed
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
                                                {offboardingTasks.length === 0 ? (
                                                    <div className="text-center text-default-400 py-12 border border-dashed border-default-200 rounded-lg">
                                                        <CheckSquare size={48} className="mx-auto mb-3 opacity-50" />
                                                        <p>No offboarding tasks yet.</p>
                                                        <p className="text-tiny mt-1">Click "Add Step" to get started.</p>
                                                    </div>
                                                ) : (
                                                    offboardingTasks.map((task, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex items-center justify-between p-3 border rounded-lg hover:bg-default-50 transition-colors ${task.is_asset_task
                                                                ? "border-warning-300 bg-warning-50/50"
                                                                : "border-default-200"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3 flex-1">
                                                                {task.is_asset_task && (
                                                                    <Package size={18} className="text-warning-600 flex-shrink-0" />
                                                                )}
                                                                <Checkbox
                                                                    isSelected={task.status === "Completed"}
                                                                    onValueChange={() => handleTaskAction('toggle', index)}
                                                                    color={task.is_asset_task ? "warning" : "primary"}
                                                                />
                                                                <span className={task.status === "Completed" ? "text-default-400 line-through" : "text-default-700"}>
                                                                    {task.name}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {task.is_asset_task && (
                                                                    <Chip size="sm" color="warning" variant="flat">
                                                                        Asset
                                                                    </Chip>
                                                                )}
                                                                <Button
                                                                    isIconOnly
                                                                    size="sm"
                                                                    color="danger"
                                                                    variant="light"
                                                                    onPress={() => handleTaskAction('delete', index)}
                                                                    isDisabled={task.is_asset_task}
                                                                >
                                                                    <Trash2 size={18} className="text-danger" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </Tab>
                                </Tabs>
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
                                    color="danger"
                                    endContent={<LogOut size={16} />}
                                    onPress={handleCompleteOffboarding}
                                    isLoading={isCompletingOffboarding}
                                    isDisabled={!isReadyToComplete()}
                                >
                                    Complete Offboarding
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <Modal isOpen={isReturnModalOpen} onOpenChange={onReturnModalOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirm Return</ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure you want to return the asset <strong>{assetToReturn?.asset_name}</strong>?
                                </p>
                                <p className="text-sm text-default-500">
                                    This will unassign the asset from the employee and make it available for other assignments.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={confirmReturnAsset}>
                                    Confirm Return
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
