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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    title="Leave Types"
                    description="Configure different types of leaves and their policies"
                />
                <Button
                    color="primary"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                >
                    Add Leave Type
                </Button>
            </div>

            <Table aria-label="Leave type table" shadow="sm" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>LEAVE NAME (CODE)</TableColumn>
                    <TableColumn>TYPE</TableColumn>
                    <TableColumn>YEARLY DAYS</TableColumn>
                    <TableColumn>MONTHLY LIMIT</TableColumn>
                    <TableColumn>DURATION LIMIT</TableColumn>
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
                                {item.allowed_hours > 0 ? (
                                    <span className="text-sm text-default-600 font-medium">{item.allowed_hours} Hours</span>
                                ) : (
                                    <span className="text-sm text-default-300">-</span>
                                )}
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
