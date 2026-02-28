"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
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
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
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
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <PageHeader
                    title="Holidays"
                    description="Manage company holidays and special events"
                />
                <Button
                    color="primary"
                    variant="shadow"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                    className="w-full sm:w-auto font-bold"
                >
                    Add New Holiday
                </Button>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <Table aria-label="Holiday table" shadow="sm" removeWrapper isHeaderSticky>
                    <TableHeader>
                        <TableColumn>HOLIDAY NAME</TableColumn>
                        <TableColumn>DATE</TableColumn>
                        <TableColumn>TYPE</TableColumn>
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
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="flex justify-center py-8 text-default-400 font-medium italic">Loading holidays...</div>
                ) : (holidays || []).length > 0 ? (
                    (holidays as any[]).map((item: any) => (
                        <Card key={item.id} className="shadow-sm border border-default-100 bg-white dark:bg-zinc-900/50">
                            <CardBody className="p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary/10 flex items-center justify-center text-primary">
                                            <Calendar size={22} />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-bold text-default-900">{item.name}</h3>
                                            <span className="text-[10px] text-default-400 font-medium">{item.date}</span>
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
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-default-400 uppercase tracking-wider">Holiday Type</span>
                                        <Chip
                                            color={getTypeColor(item.holiday_type)}
                                            size="sm"
                                            variant="flat"
                                            className="h-5 text-[9px] font-bold w-fit"
                                        >
                                            {item.holiday_type}
                                        </Chip>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        <span className="text-[9px] font-bold text-default-400 uppercase tracking-wider">Status</span>
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

                                {item.description && (
                                    <div className="mt-1">
                                        <p className="text-[11px] text-default-500 leading-relaxed italic border-l-2 border-primary/20 pl-2">
                                            {item.description}
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 text-default-400 italic">No holidays found</div>
                )}
            </div>

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
