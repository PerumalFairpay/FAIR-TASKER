"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import OffboardingDrawer from "./OffboardingDrawer";
import { Settings2, UserMinus } from "lucide-react";
import { Select, SelectItem } from "@heroui/select";

export default function OffboardingPage() {
    const dispatch = useDispatch();
    const { employees, loading, success, error } = useSelector(
        (state: RootState) => state.Employee
    );

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isInitOpen, onOpen: onInitOpen, onOpenChange: onInitOpenChange, onClose: onInitClose } = useDisclosure();

    const [selectedEmployee, setSelectedEmployee] = React.useState<null | any>(null);
    const [employeeToOffboard, setEmployeeToOffboard] = useState<string>("");

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
            onInitClose();
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
    }, [success, error, onClose, onInitClose, dispatch]);

    const handleManage = (employee: any) => {
        setSelectedEmployee(employee);
        onOpen();
    };

    const handleSubmit = (employeeId: string, formData: FormData) => {
        dispatch(updateEmployeeRequest(employeeId, formData));
    };

    const handleInitiateOffboarding = () => {
        if (!employeeToOffboard) return;
        const formData = new FormData();
        formData.append("offboarding_status", "Pending");
        // We could add default steps here if we wanted
        dispatch(updateEmployeeRequest(employeeToOffboard, formData));
    };

    const offboardingEmployees = useMemo(() => {
        return (employees || []).filter((e: any) => e.offboarding_status && e.offboarding_status !== "None");
    }, [employees]);

    const availableEmployees = useMemo(() => {
        return (employees || []).filter((e: any) => !e.offboarding_status || e.offboarding_status === "None");
    }, [employees]);

    const getProgress = (item: any) => {
        if (!item.offboarding_steps || !Array.isArray(item.offboarding_steps) || item.offboarding_steps.length === 0) return 0;
        const completed = item.offboarding_steps.filter((s: any) => s.status === "Completed").length;
        return Math.round((completed / item.offboarding_steps.length) * 100);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Employee Offboarding" />
                <Button color="danger" startContent={<UserMinus size={16} />} onPress={onInitOpen}>
                    Initiate Offboarding
                </Button>
            </div>

            <Table aria-label="Offboarding table" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>EMPLOYEE</TableColumn>
                    <TableColumn>DEPARTMENT</TableColumn>
                    <TableColumn>LAST WORKING DAY</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>PROGRESS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={offboardingEmployees} emptyContent={"No employees in offboarding"} isLoading={loading}>
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
                                <span className="text-small">{item.offboarding_date || "Not set"}</span>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    className="capitalize"
                                    color={item.offboarding_status === "Completed" ? "default" : "danger"}
                                    size="sm"
                                    variant="flat"
                                >
                                    {item.offboarding_status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 w-24">
                                    <span className="text-tiny text-default-400">{getProgress(item)}%</span>
                                    <div className="w-full bg-default-200 rounded-full h-1.5">
                                        <div
                                            className="bg-danger rounded-full h-1.5 transition-all"
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

            <OffboardingDrawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                employee={selectedEmployee}
                loading={loading}
                onSubmit={handleSubmit}
            />

            <Modal isOpen={isInitOpen} onOpenChange={onInitOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Initiate Offboarding</ModalHeader>
                            <ModalBody>
                                <p className="text-sm text-default-500 mb-2">Select an employee to start the offboarding process.</p>
                                <Select
                                    label="Employee"
                                    placeholder="Select an employee"
                                    selectedKeys={employeeToOffboard ? [employeeToOffboard] : []}
                                    onChange={(e) => setEmployeeToOffboard(e.target.value)}
                                >
                                    {availableEmployees.map((emp: any) => (
                                        <SelectItem key={emp.id} textValue={emp.name}>
                                            {emp.name} ({emp.email})
                                        </SelectItem>
                                    ))}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Cancel</Button>
                                <Button color="danger" onPress={handleInitiateOffboarding} isDisabled={!employeeToOffboard} isLoading={loading}>
                                    Start Offboarding
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
