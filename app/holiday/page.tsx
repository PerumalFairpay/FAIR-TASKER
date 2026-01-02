"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    getHolidaysRequest,
    createHolidayRequest,
    updateHolidayRequest,
    deleteHolidayRequest,
    clearHolidayDetails,
} from "@/store/holiday/action";
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
import { PlusIcon, PencilIcon, TrashIcon, Calendar, Info } from "lucide-react";
import { Chip } from "@heroui/chip";
import DeleteHolidayModal from "./DeleteHolidayModal";
import AddEditHolidayDrawer from "./AddEditHolidayDrawer";

export default function HolidayPage() {
    const dispatch = useDispatch();
    const { holidays, loading, success } = useSelector((state: RootState) => state.Holiday);

    const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onOpenChange: onAddEditOpenChange, onClose: onAddEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedHoliday, setSelectedHoliday] = useState<any>(null);

    useEffect(() => {
        dispatch(getHolidaysRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onAddEditClose();
            onDeleteClose();
            dispatch(clearHolidayDetails());

        }
    }, [success, onAddEditClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setSelectedHoliday(null);
        onAddEditOpen();
    };

    const handleEdit = (holiday: any) => {
        setMode("edit");
        setSelectedHoliday(holiday);
        onAddEditOpen();
    };

    const handleDeleteClick = (holiday: any) => {
        setSelectedHoliday(holiday);
        onDeleteOpen();
    };

    const handleAddEditSubmit = (data: any) => {
        if (mode === "create") {
            dispatch(createHolidayRequest(data));
        } else {
            dispatch(updateHolidayRequest(selectedHoliday.id, data));
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedHoliday) {
            dispatch(deleteHolidayRequest(selectedHoliday.id));
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "Public": return "success";
            case "Mandatory": return "danger";
            case "Optional": return "warning";
            case "Restricted": return "secondary";
            default: return "default";
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Holidays</h1>
                    <p className="text-default-500">Manage company holidays and special events</p>
                </div>
                <Button
                    color="primary"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                >
                    Add New Holiday
                </Button>
            </div>

            <Table aria-label="Holiday table" shadow="sm" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>HOLIDAY NAME</TableColumn>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>TYPE</TableColumn>
                    <TableColumn>RESTRICTED</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={holidays || []} emptyContent={"No holidays found"} isLoading={loading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-default-700">{item.name}</span>
                                    {item.description && (
                                        <span className="text-tiny text-default-400 truncate max-w-[200px]">
                                            {item.description}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-default-400" />
                                    <span className="text-sm">{item.date}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={getTypeColor(item.holiday_type)}
                                    size="sm"
                                    variant="flat"
                                    className="capitalize"
                                >
                                    {item.holiday_type}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={item.is_restricted ? "warning" : "default"}
                                    size="sm"
                                    variant="dot"
                                >
                                    {item.is_restricted ? "Yes" : "No"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={item.status === "Active" ? "success" : "default"}
                                    size="sm"
                                    variant="flat"
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

            <AddEditHolidayDrawer
                isOpen={isAddEditOpen}
                onOpenChange={onAddEditOpenChange}
                mode={mode}
                selectedHoliday={selectedHoliday}
                loading={loading}
                onSubmit={handleAddEditSubmit}
            />

            <DeleteHolidayModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={handleDeleteConfirm}
                loading={loading}
                holidayName={selectedHoliday?.name}
            />
        </div>
    );
}
