"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getEmployeesRequest,
    deleteEmployeeRequest,
    createEmployeeRequest,
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
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { User } from "@heroui/user";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Chip } from "@heroui/chip";
import AddEditEmployeeDrawer from "./AddEditEmployeeDrawer";

export default function EmployeeListPage() {
    const dispatch = useDispatch();
    const { employees, loading, success } = useSelector(
        (state: RootState) => state.Employee
    );

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [mode, setMode] = React.useState<"create" | "edit">("create");
    const [selectedEmployee, setSelectedEmployee] = React.useState<null | any>(null);

    useEffect(() => {
        dispatch(getEmployeesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onClose();
            onDeleteClose();
            dispatch(clearEmployeeDetails());
        }
    }, [success, onClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setSelectedEmployee(null);
        onOpen();
    };

    const handleEdit = (employee: any) => {
        setMode("edit");
        setSelectedEmployee(employee);
        onOpen();
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteEmployeeRequest(deleteId));
        }
    };

    const handleSubmit = (formData: FormData) => {
        if (mode === "create") {
            dispatch(createEmployeeRequest(formData));
        } else {
            if (selectedEmployee) {
                dispatch(updateEmployeeRequest(selectedEmployee.id, formData));
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Employees</h1>
                <Button color="primary" endContent={<PlusIcon size={16} />} onPress={handleCreate}>
                    Add New Employee
                </Button>
            </div>

            <Table aria-label="Employee table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={employees || []} emptyContent={"No employees found"} isLoading={loading}>
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
                                    <p className="text-bold text-sm capitalize">{item.role}</p>
                                    <p className="text-bold text-tiny capitalize text-default-400">{item.department}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip className="capitalize" color={item.status === "Active" ? "success" : "danger"} size="sm" variant="flat">
                                    {item.status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-center gap-2">
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                                        <PencilIcon size={16} />
                                    </span>
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(item.id)}>
                                        <TrashIcon size={16} />
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AddEditEmployeeDrawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                mode={mode}
                selectedEmployee={selectedEmployee}
                loading={loading}
                onSubmit={handleSubmit}
            />

            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Delete Employee</ModalHeader>
                            <ModalBody>
                                <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="danger" onPress={confirmDelete} isLoading={loading}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
