"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesRequest, updateEmployeeRequest, clearEmployeeDetails } from "@/store/employee/action";
import { getAssetsRequest } from "@/store/asset/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { Input, Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { LogOut, Plus, Trash2, X, CheckSquare, Calendar, FileText, Package, Settings, Settings2 } from "lucide-react";
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
    const { assets } = useSelector((state: RootState) => state.Asset || { assets: [] });

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

    const offboardingEmployees = useMemo(() => {
        return (employees || []).filter((emp: any) => emp.status === "Offboarding");
    }, [employees]);

    const assignedAssets = useMemo(() => {
        if (!selectedEmployee?.id) return [];
        return assets.filter((asset: any) => asset.assigned_to === selectedEmployee.id);
    }, [assets, selectedEmployee]);

    useEffect(() => {
        dispatch(getEmployeesRequest());
        dispatch(getAssetsRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
                color: "success"
            });
            dispatch(clearEmployeeDetails());
            dispatch(getEmployeesRequest());
            setIsDrawerOpen(false);
        }
        if (error) {
            addToast({
                title: "Error",
                description: typeof error === 'string' ? error : "Something went wrong",
                color: "danger"
            });
            dispatch(clearEmployeeDetails());
        }
    }, [success, error, dispatch]);

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

            // Filter out existing asset tasks that are no longer assigned
            const currentAssetIds = assignedAssets.map((a: any) => a.id);
            const nonAssetTasks = existingTasks.filter((task: any) =>
                !task.is_asset_task || currentAssetIds.includes(task.asset_id)
            );

            // Check which asset tasks already exist
            const existingAssetIds = existingTasks
                .filter((task: any) => task.is_asset_task)
                .map((task: any) => task.asset_id);

            const newAssetTasks = assetTasks.filter((task: any) =>
                !existingAssetIds.includes(task.asset_id)
            );

            // Merge: asset tasks first, then other tasks
            const mergedTasks = [...assetTasks.filter((task: any) =>
                existingAssetIds.includes(task.asset_id)
            ).map((newTask: any) => {
                const existing = existingTasks.find((t: any) => t.asset_id === newTask.asset_id);
                return existing || newTask;
            }), ...newAssetTasks, ...nonAssetTasks];

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

        const formData = new FormData();
        formData.append("offboarding_checklist", JSON.stringify(offboardingTasks));
        formData.append("resignation_date", exitDetails.resignation_date);
        formData.append("last_working_day", exitDetails.last_working_day);
        formData.append("exit_interview_notes", exitDetails.exit_interview_notes);

        dispatch(updateEmployeeRequest(selectedEmployee.id, formData));
    };

    const handleCompleteOffboarding = () => {
        if (!selectedEmployee) return;

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
                    <TableColumn>ASSETS PENDING</TableColumn>
                    <TableColumn>PROGRESS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={offboardingEmployees} emptyContent="No employees in offboarding phase" isLoading={loading}>
                    {(employee: any) => {
                        const progress = calculateProgress(employee.offboarding_checklist || []);
                        const employeeAssets = assets.filter((asset: any) => asset.assigned_to === employee.id);

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
                                    {employeeAssets.length > 0 ? (
                                        <Chip size="sm" color="danger" variant="flat">
                                            {employeeAssets.length} Asset{employeeAssets.length !== 1 ? 's' : ''}
                                        </Chip>
                                    ) : (
                                        <Chip size="sm" color="success" variant="flat">
                                            All Returned
                                        </Chip>
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
                                <Tabs aria-label="Offboarding sections" color="warning">
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
                                                            <Chip size="sm" color="danger" variant="flat">Pending Return</Chip>
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
                            <DrawerFooter className="border-t border-default-200">
                                <Button
                                    color="primary"
                                    variant="flat"
                                    onPress={handleSaveProgress}
                                    isLoading={loading}
                                >
                                    Save Progress
                                </Button>
                                <Button
                                    color="danger"
                                    endContent={<LogOut size={16} />}
                                    onPress={handleCompleteOffboarding}
                                    isLoading={loading}
                                    isDisabled={!isReadyToComplete()}
                                >
                                    Complete Offboarding
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
