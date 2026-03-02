"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    getLeaveTypesRequest,
    createLeaveTypeRequest,
    updateLeaveTypeRequest,
    deleteLeaveTypeRequest,
    clearLeaveTypeDetails,
} from "@/store/leaveType/action";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { PlusIcon, PencilIcon, TrashIcon, Info, ClipboardList } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import DeleteLeaveTypeModal from "./DeleteLeaveTypeModal";
import AddEditLeaveTypeDrawer from "./AddEditLeaveTypeDrawer";

export default function LeaveTypePage() {
    const dispatch = useDispatch();
    const { leaveTypes, loading, success } = useSelector((state: RootState) => state.LeaveType);

    const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onOpenChange: onAddEditOpenChange, onClose: onAddEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedLeaveType, setSelectedLeaveType] = useState<any>(null);

    useEffect(() => {
        dispatch(getLeaveTypesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onAddEditClose();
            onDeleteClose();
            dispatch(clearLeaveTypeDetails());
        }
    }, [success, onAddEditClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setSelectedLeaveType(null);
        onAddEditOpen();
    };

    const handleEdit = (leaveType: any) => {
        setMode("edit");
        setSelectedLeaveType(leaveType);
        onAddEditOpen();
    };

    const handleDeleteClick = (leaveType: any) => {
        setSelectedLeaveType(leaveType);
        onDeleteOpen();
    };

    const handleAddEditSubmit = (data: any) => {
        if (mode === "create") {
            dispatch(createLeaveTypeRequest(data));
        } else {
            dispatch(updateLeaveTypeRequest(selectedLeaveType.id, data));
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedLeaveType) {
            dispatch(deleteLeaveTypeRequest(selectedLeaveType.id));
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "Paid": return "success";
            case "Unpaid": return "danger";
            case "Sick": return "warning";
            case "Casual": return "primary";
            default: return "default";
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <PageHeader
                    title="Leave Types"
                    description="Configure different types of leaves and their policies"
                />
                <Button
                    color="primary"
                    variant="shadow"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                    className="w-full sm:w-auto font-bold"
                >
                    Add Leave Type
                </Button>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <Table aria-label="Leave type table" shadow="sm" removeWrapper isHeaderSticky>
                    <TableHeader>
                        <TableColumn>LEAVE NAME (CODE)</TableColumn>
                        <TableColumn>TYPE</TableColumn>
                        <TableColumn>YEARLY DAYS</TableColumn>
                        <TableColumn>MONTHLY LIMIT</TableColumn>
                        <TableColumn>POLICIES</TableColumn>
                        <TableColumn>REQUIREMENTS</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn align="center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody items={leaveTypes || []} emptyContent={"No leave types found"} isLoading={loading}>
                        {(item: any) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <ClipboardList size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-default-700">{item.name}</span>
                                            <span className="text-tiny text-default-400 font-mono underline decoration-dotted">
                                                {item.code}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={getTypeColor(item.type)}
                                        size="sm"
                                        variant="flat"
                                        className="capitalize font-medium"
                                    >
                                        {item.type}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-semibold">{item.number_of_days} Days</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-default-600 font-medium">{item.monthly_allowed} / Month</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-1">
                                            <Chip size="sm" variant="flat" color={item.can_carry_forward ? "secondary" : "default"} className="h-5 text-[10px]">
                                                {item.can_carry_forward ? "Carry Forward" : "No Carry"}
                                            </Chip>
                                        </div>
                                        <div className="flex gap-1">
                                            <Chip size="sm" variant="flat" color={item.can_encash ? "success" : "default"} className="h-5 text-[10px]">
                                                {item.can_encash ? "Encashable" : "No Encash"}
                                            </Chip>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        {item.probation_period_months > 0 && (
                                            <span className="text-tiny text-default-500 font-medium">Probation: {item.probation_period_months}m</span>
                                        )}
                                        {item.min_service_days > 0 && (
                                            <span className="text-tiny text-default-500 font-medium">Service: {item.min_service_days}d</span>
                                        )}
                                        {!(item.probation_period_months > 0 || item.min_service_days > 0) && (
                                            <span className="text-sm text-default-300">-</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={item.status === "Active" ? "success" : "default"}
                                        size="sm"
                                        variant="dot"
                                    >
                                        {item.status}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="relative flex items-center justify-center gap-2">
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

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="flex justify-center py-8 text-default-400 font-medium">Loading leave types...</div>
                ) : (leaveTypes || []).length > 0 ? (
                    (leaveTypes as any[]).map((item: any) => (
                        <Card key={item.id} className="shadow-sm border border-default-100 bg-white dark:bg-zinc-900/50">
                            <CardBody className="p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary/10 flex items-center justify-center text-primary">
                                            <ClipboardList size={22} />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-bold text-default-900">{item.name}</h3>
                                            <span className="text-[10px] text-default-400 font-mono tracking-tight">{item.code}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="flat"
                                            onPress={() => handleEdit(item)}
                                            className="bg-default-50 dark:bg-white/5"
                                        >
                                            <PencilIcon size={14} className="text-default-400" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="flat"
                                            color="danger"
                                            onPress={() => handleDeleteClick(item)}
                                            className="bg-danger-50 dark:bg-danger/10"
                                        >
                                            <TrashIcon size={14} className="text-danger" />
                                        </Button>
                                    </div>
                                </div>

                                <Divider className="opacity-50" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-bold text-default-400 uppercase tracking-wider">Leave Policy</span>
                                        <div className="flex items-center gap-2">
                                            <Chip
                                                color={getTypeColor(item.type)}
                                                size="sm"
                                                variant="flat"
                                                className="h-5 text-[9px] font-bold"
                                            >
                                                {item.type}
                                            </Chip>
                                            <Chip
                                                color={item.status === "Active" ? "success" : "default"}
                                                size="sm"
                                                variant="flat"
                                                className="h-5 text-[9px] font-bold"
                                            >
                                                {item.status}
                                            </Chip>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-0.5 text-right">
                                        <span className="text-[9px] font-bold text-default-400 uppercase tracking-wider">Yearly Quota</span>
                                        <span className="text-sm font-bold text-default-700">{item.number_of_days} Days</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-start bg-default-50 dark:bg-white/5 p-2 rounded-lg border border-default-100 dark:border-default-50">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-1">
                                            <Chip size="sm" variant="flat" color={item.can_carry_forward ? "secondary" : "default"} className="h-4 text-[8px] px-1 uppercase font-bold">
                                                C/F: {item.can_carry_forward ? "Yes" : "No"}
                                            </Chip>
                                            <Chip size="sm" variant="flat" color={item.can_encash ? "success" : "default"} className="h-4 text-[8px] px-1 uppercase font-bold">
                                                Encash: {item.can_encash ? "Yes" : "No"}
                                            </Chip>
                                        </div>
                                        <div className="flex flex-col">
                                            {item.probation_period_months > 0 && <span className="text-[10px] text-default-500 font-medium">Probation: {item.probation_period_months}m</span>}
                                            {item.min_service_days > 0 && <span className="text-[10px] text-default-500 font-medium">Service: {item.min_service_days}d</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-0.5 text-right">
                                        <span className="text-[9px] font-bold text-default-400 uppercase leading-none">Monthly Limit</span>
                                        <span className="text-[10px] font-semibold text-default-600">{item.monthly_allowed} / Month</span>
                                        {item.allowed_hours > 0 && (
                                            <span className="text-[10px] font-semibold text-primary">{item.allowed_hours} Hours Max</span>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 text-default-400 italic">No leave types found</div>
                )}
            </div>

            <AddEditLeaveTypeDrawer
                isOpen={isAddEditOpen}
                onOpenChange={onAddEditOpenChange}
                mode={mode}
                selectedLeaveType={selectedLeaveType}
                loading={loading}
                onSubmit={handleAddEditSubmit}
            />

            <DeleteLeaveTypeModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={handleDeleteConfirm}
                loading={loading}
                leaveTypeName={selectedLeaveType?.name}
            />
        </div>
    );
}
