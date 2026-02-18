
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
import { useDisclosure } from "@heroui/modal";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import {
    getPayslipComponentsRequest,
    deletePayslipComponentRequest,
} from "@/store/payslipComponent/action";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import AddEditPayslipComponentDrawer from "./AddEditPayslipComponentDrawer";
import DeletePayslipComponentModal from "./DeletePayslipComponentModal";
import { PageHeader } from "@/components/PageHeader";

export default function PayslipComponentsPage() {
    const dispatch = useDispatch();
    const { payslipComponents, payslipComponentsLoading, deletePayslipComponentLoading } = useSelector(
        (state: AppState) => state.PayslipComponent
    );

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<any>(null);
    const [initialType, setInitialType] = useState("Earnings");
    const [componentToDelete, setComponentToDelete] = useState<any>(null);

    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    useEffect(() => {
        dispatch(getPayslipComponentsRequest());
    }, [dispatch]);

    const handleEdit = (component: any) => {
        setSelectedComponent(component);
        setIsDrawerOpen(true);
    };

    const handleDeleteClick = (component: any) => {
        setComponentToDelete(component);
        onDeleteOpen();
    };

    const handleDeleteConfirm = () => {
        if (componentToDelete) {
            dispatch(deletePayslipComponentRequest(componentToDelete.id));
            onDeleteClose();
        }
    };

    const openDrawer = (type = "Earnings") => {
        setInitialType(type);
        setSelectedComponent(null);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedComponent(null);
    };

    // Filter components
    const earnings = (payslipComponents || []).filter((c: any) => c.type === "Earnings");
    const deductions = (payslipComponents || []).filter((c: any) => c.type === "Deductions");

    const renderTable = (items: any[], title: string, type: string) => (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-semibold text-default-700">{title}</h3>
                <Button
                    size="sm"
                    color={type === "Earnings" ? "success" : "danger"}
                    variant="flat"
                    onPress={() => openDrawer(type)}
                    startContent={<PlusIcon size={16} />}
                >
                    Add {title}
                </Button>
            </div>
            <Table aria-label={`${title} Table`} shadow="sm" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn align="end">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                    items={items}
                    isLoading={payslipComponentsLoading}
                    loadingContent={<div className="h-20 w-full animate-pulse bg-gray-200 rounded-md" />}
                    emptyContent={`No ${title.toLowerCase()} found`}
                >
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                <Chip
                                    color={item.is_active ? "success" : "default"}
                                    variant="flat"
                                    size="sm"
                                >
                                    {item.is_active ? "Active" : "Inactive"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => handleEdit(item)}
                                        className="text-default-400 cursor-pointer active:opacity-50"
                                    >
                                        <PencilIcon size={18} />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => handleDeleteClick(item)}
                                        className="text-danger cursor-pointer active:opacity-50"
                                    >
                                        <TrashIcon size={18} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Payslip Components" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderTable(earnings, "Earnings", "Earnings")}
                {renderTable(deductions, "Deductions", "Deductions")}
            </div>

            <AddEditPayslipComponentDrawer
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                selectedComponent={selectedComponent}
                initialType={selectedComponent ? selectedComponent.type : initialType}
            />

            <DeletePayslipComponentModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={handleDeleteConfirm}
                loading={deletePayslipComponentLoading ?? false}
                componentName={componentToDelete?.name}
            />
        </div>
    );
}
