"use client";

import React, { useEffect, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    getEmployeesRequest,
    updateEmployeeRequest,
    clearEmployeeDetails,
} from "@/store/employee/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { useDisclosure } from "@heroui/modal";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import OnboardingDrawer from "./OnboardingDrawer";
import { Settings2 } from "lucide-react";

export default function OnboardingPage() {
    const dispatch = useDispatch();
    const { employees, loading, success, error } = useSelector(
        (state: RootState) => state.Employee
    );

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [selectedEmployee, setSelectedEmployee] = React.useState<null | any>(null);

    useEffect(() => {
        dispatch(getEmployeesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
                color: "success"
            });
            onClose();
            dispatch(clearEmployeeDetails());
        }
        if (error) {
            addToast({
                title: "Error",
                description: typeof error === 'string' ? error : "Something went wrong",
                color: "danger"
            });
            dispatch(clearEmployeeDetails());
        }
    }, [success, error, onClose, dispatch]);

    const handleManage = (employee: any) => {
        setSelectedEmployee(employee);
        onOpen();
    };

    const handleSubmit = (employeeId: string, formData: FormData) => {
        dispatch(updateEmployeeRequest(employeeId, formData));
    };

    const onboardingEmployees = useMemo(() => {
        // Show if explicitly Pending/In Progress OR (status is Pending/In Progress default)
        // Adjust filter logic: show unless "Completed"
        return (employees || []).filter((e: any) => {
            const status = e.onboarding_status || "Pending";
            return status !== "Completed";
        });
    }, [employees]);

    const getProgress = (item: any) => {
        if (!item.onboarding_steps || !Array.isArray(item.onboarding_steps) || item.onboarding_steps.length === 0) return 0;
        const completed = item.onboarding_steps.filter((s: any) => s.status === "Completed").length;
        return Math.round((completed / item.onboarding_steps.length) * 100);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Employee Onboarding" />
            </div>

            <Table aria-label="Onboarding table" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>EMPLOYEE</TableColumn>
                    <TableColumn>DEPARTMENT</TableColumn>
                    <TableColumn>JOINING DATE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>PROGRESS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={onboardingEmployees} emptyContent={"No employees in onboarding"} isLoading={loading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: item.profile_picture }}
                                    description={item.email}
                                    name={item.name}
                                >
                                    {item.email}
                                </User>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm capitalize">{item.department || "N/A"}</p>
                                    <p className="text-tiny capitalize text-default-400">{item.designation || "N/A"}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-small">{item.date_of_joining || "N/A"}</span>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    className="capitalize"
                                    color={item.onboarding_status === "In Progress" ? "warning" : "default"}
                                    size="sm"
                                    variant="flat"
                                >
                                    {item.onboarding_status || "Pending"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 w-24">
                                    <span className="text-tiny text-default-400">{getProgress(item)}%</span>
                                    <div className="w-full bg-default-200 rounded-full h-1.5">
                                        <div
                                            className="bg-primary rounded-full h-1.5 transition-all"
                                            style={{ width: `${getProgress(item)}%` }}
                                        />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-center">
                                    <Button
                                        size="sm"
                                        variant="light"
                                        color="primary"
                                        startContent={<Settings2 size={16} />}
                                        onPress={() => handleManage(item)}
                                    >
                                        Manage
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <OnboardingDrawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                employee={selectedEmployee}
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
