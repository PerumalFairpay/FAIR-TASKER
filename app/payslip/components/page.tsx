
"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import {
    getPayslipComponentsRequest,
    deletePayslipComponentRequest,
} from "@/store/payslipComponent/action";
import { EditIcon, DeleteIcon, PlusIcon } from "lucide-react";
import AddEditPayslipComponentDrawer from "./AddEditPayslipComponentDrawer";
import { PageHeader } from "@/components/PageHeader";

export default function PayslipComponentsPage() {
    const dispatch = useDispatch();
    const { payslipComponents, payslipComponentsLoading } = useSelector(
        (state: AppState) => state.PayslipComponent
    );

    const [isOpen, setIsOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);

    useEffect(() => {
        dispatch(getPayslipComponentsRequest());
    }, [dispatch]);

    const handleEdit = (component: any) => {
        setSelectedComponent(component);
        setIsOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this component?")) {
            dispatch(deletePayslipComponentRequest(id));
        }
    };

    const openDrawer = () => {
        setSelectedComponent(null);
        setIsOpen(true);
    };

    const closeDrawer = () => {
        setIsOpen(false);
        setSelectedComponent(null);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Payslip Components" />
                <Button color="primary" onPress={openDrawer} startContent={<PlusIcon size={16} />}>
                    Add Component
                </Button>
            </div>

            <Table aria-label="Payslip Components Table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>TYPE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                    items={payslipComponents || []}
                    isLoading={payslipComponentsLoading}
                    loadingContent={<div className="h-20 w-full animate-pulse bg-gray-200 rounded-md" />}
                    emptyContent={"No components found"}
                >
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                <Chip
                                    color={item.type === "Earnings" ? "success" : "danger"}
                                    variant="flat"
                                    size="sm"
                                >
                                    {item.type}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={item.is_active ? "success" : "default"}
                                    variant="dot"
                                    size="sm"
                                >
                                    {item.is_active ? "Active" : "Inactive"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Tooltip content="Edit component">
                                        <span
                                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <EditIcon size={18} />
                                        </span>
                                    </Tooltip>
                                    <Tooltip color="danger" content="Delete component">
                                        <span
                                            className="text-lg text-danger cursor-pointer active:opacity-50"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <DeleteIcon size={18} />
                                        </span>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AddEditPayslipComponentDrawer
                isOpen={isOpen}
                onClose={closeDrawer}
                selectedComponent={selectedComponent}
            />
        </div>
    );
}
