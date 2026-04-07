"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import {
    getShiftsRequest,
    createShiftRequest,
    updateShiftRequest,
    deleteShiftRequest,
    clearShiftDetails,
} from "@/store/shift/action";
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
import { PlusIcon, PencilIcon, TrashIcon, Clock } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { addToast } from "@heroui/toast";
import AddEditShiftDrawer from "./AddEditShiftDrawer";
import DeleteShiftModal from "./DeleteShiftModal";

export default function ShiftListPage() {
    const dispatch = useDispatch();
    const {
        shifts,
        listLoading,
        createLoading,
        updateLoading,
        deleteLoading,
        createSuccess,
        updateSuccess,
        deleteSuccess,
        createError,
        updateError,
        deleteError
    } = useSelector((state: AppState) => state.Shift);

    const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onOpenChange: onAddEditOpenChange, onClose: onAddEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedShift, setSelectedShift] = useState<any>(null);

    // Initial Fetch
    useEffect(() => {
        dispatch(getShiftsRequest());
    }, [dispatch]);

    // Handle Success Actions
    useEffect(() => {
        if (createSuccess || updateSuccess || deleteSuccess) {
            onAddEditClose();
            onDeleteClose();
            // Show toast
            addToast({
                title: "Success",
                description: createSuccess || updateSuccess || deleteSuccess,
                color: "success"
            });
            dispatch(clearShiftDetails());
        }
    }, [createSuccess, updateSuccess, deleteSuccess, onAddEditClose, onDeleteClose, dispatch]);

    // Handle Error Actions
    useEffect(() => {
        const error = createError || updateError || deleteError;
        if (error) {
            addToast({
                title: "Error",
                description: error,
                color: "danger"
            });
            dispatch(clearShiftDetails()); // Clear error after showing toast if needed, or keep it.
        }
    }, [createError, updateError, deleteError, dispatch]);


    const handleCreate = () => {
        setMode("create");
        setSelectedShift(null);
        onAddEditOpen();
    };

    const handleEdit = (shift: any) => {
        setMode("edit");
        setSelectedShift(shift);
        onAddEditOpen();
    };

    const handleDeleteClick = (shift: any) => {
        setSelectedShift(shift);
        onDeleteOpen();
    };

    const handleAddEditSubmit = (formData: any) => {
        if (mode === "create") {
            dispatch(createShiftRequest(formData));
        } else {
            dispatch(updateShiftRequest(selectedShift.id, formData));
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedShift) {
            dispatch(deleteShiftRequest(selectedShift.id));
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <PageHeader
                    title="Shift Management"
                    description="Define work shifts, timings, and late policies."
                />
                <Button
                    color="primary"
                    variant="shadow"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                    className="w-full sm:w-auto font-bold"
                >
                    Add Shift
                </Button>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <Table aria-label="Shifts table" removeWrapper isHeaderSticky>
                    <TableHeader>
                        <TableColumn>SHIFT NAME</TableColumn>
                        <TableColumn>TIMINGS</TableColumn>
                        <TableColumn>LATE THRESHOLD</TableColumn>
                        <TableColumn>TYPE</TableColumn>
                        <TableColumn align="center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={shifts || []}
                        emptyContent={"No shifts found"}
                        isLoading={listLoading}
                    >
                        {(item: any) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="font-medium">{item.name}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-default-400" />
                                        <span>{item.start_time} - {item.end_time}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-default-500">{item.late_threshold_minutes} mins</div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={item.is_night_shift ? "secondary" : "warning"}
                                        size="sm"
                                        variant="flat"
                                    >
                                        {item.is_night_shift ? "Night Shift" : "Day Shift"}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="relative flex items-center justify-center gap-2">
                                        <span
                                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <PencilIcon size={18} />
                                        </span>
                                        <span
                                            className="text-lg text-danger cursor-pointer active:opacity-50"
                                            onClick={() => handleDeleteClick(item)}
                                        >
                                            <TrashIcon size={18} />
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {listLoading ? (
                    <div className="flex justify-center py-8 text-default-400">Loading shifts...</div>
                ) : (shifts || []).length > 0 ? (
                    (shifts as any[]).map((item: any) => (
                        <Card key={item.id} className="shadow-sm border border-default-100 bg-white dark:bg-zinc-900/50">
                            <CardBody className="p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-sm font-bold text-default-900">{item.name}</h3>
                                        <div className="flex items-center gap-1 text-default-500">
                                            <Clock size={12} />
                                            <span className="text-[10px] font-medium">{item.start_time} - {item.end_time}</span>
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

                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-bold text-default-400 uppercase tracking-wider">Late Threshold</span>
                                        <span className="text-xs font-semibold text-default-700">{item.late_threshold_minutes} mins</span>
                                    </div>
                                    <Chip
                                        color={item.is_night_shift ? "secondary" : "warning"}
                                        size="sm"
                                        variant="flat"
                                        className="h-6 text-[10px] font-bold"
                                    >
                                        {item.is_night_shift ? "Night Shift" : "Day Shift"}
                                    </Chip>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 text-default-400">No shifts found</div>
                )}
            </div>

            <AddEditShiftDrawer
                isOpen={isAddEditOpen}
                onOpenChange={onAddEditOpenChange}
                mode={mode}
                selectedShift={selectedShift}
                loading={createLoading || updateLoading}
                onSubmit={handleAddEditSubmit}
            />

            <DeleteShiftModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
            />
        </div>
    );
}
