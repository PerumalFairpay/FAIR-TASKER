"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    getExpensesRequest,
    createExpenseRequest,
    updateExpenseRequest,
    deleteExpenseRequest,
    clearExpenseDetails,
} from "@/store/expense/action";
import { getExpenseCategoriesRequest } from "@/store/expenseCategory/action";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useDisclosure } from "@heroui/modal";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import AddEditExpenseDrawer from "./AddEditExpenseDrawer";
import DeleteExpenseModal from "./DeleteExpenseModal";
import { PageHeader } from "@/components/PageHeader";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import { usePermissions, PermissionGuard } from "@/components/PermissionGuard";

export default function ExpenseListPage() {
    const dispatch = useDispatch();
    const {
        expenses,
        getExpensesLoading,
        createExpenseLoading,
        updateExpenseLoading,
        deleteExpenseLoading,
        createExpenseSuccessMessage,
        updateExpenseSuccessMessage,
        deleteExpenseSuccessMessage,
        createExpenseError,
        updateExpenseError,
        deleteExpenseError,
        getExpensesError
    } = useSelector((state: RootState) => state.Expense);
    const { expenseCategories } = useSelector((state: RootState) => state.ExpenseCategory);
    const { hasPermission } = usePermissions();

    const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onOpenChange: onAddEditOpenChange, onClose: onAddEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    const [previewData, setPreviewData] = useState<{ url: string; type: string; name: string } | null>(null);

    useEffect(() => {
        dispatch(getExpensesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (isAddEditOpen) {
            dispatch(getExpenseCategoriesRequest());
        }
    }, [isAddEditOpen, dispatch]);

    useEffect(() => {
        if (createExpenseSuccessMessage || updateExpenseSuccessMessage) {
            addToast({
                title: "Success",
                description: createExpenseSuccessMessage || updateExpenseSuccessMessage,
                color: "success"
            });
            onAddEditClose();
            dispatch(clearExpenseDetails());
        }
        if (deleteExpenseSuccessMessage) {
            addToast({
                title: "Success",
                description: deleteExpenseSuccessMessage,
                color: "success"
            });
            onDeleteClose();
            dispatch(clearExpenseDetails());
        }
        if (createExpenseError || updateExpenseError || deleteExpenseError || getExpensesError) {
            addToast({
                title: "Error",
                description: createExpenseError || updateExpenseError || deleteExpenseError || getExpensesError,
                color: "danger"
            });
            dispatch(clearExpenseDetails());
        }
    }, [createExpenseSuccessMessage, updateExpenseSuccessMessage, deleteExpenseSuccessMessage, createExpenseError, updateExpenseError, deleteExpenseError, getExpensesError, onAddEditClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setSelectedExpense(null);
        onAddEditOpen();
    };

    const handleEdit = (expense: any) => {
        setMode("edit");
        setSelectedExpense(expense);
        onAddEditOpen();
    };

    const handleDeleteClick = (expense: any) => {
        setSelectedExpense(expense);
        onDeleteOpen();
    };

    const handleAddEditSubmit = (formData: FormData) => {
        if (mode === "create") {
            dispatch(createExpenseRequest(formData));
        } else {
            dispatch(updateExpenseRequest(selectedExpense.id, formData));
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedExpense) {
            dispatch(deleteExpenseRequest(selectedExpense.id));
        }
    };

    const getCategoryName = (id: string) => {
        const cat = expenseCategories.find((c: any) => c.id === id);
        return cat ? cat.name : "Unknown";
    };

    return (
        <PermissionGuard permission="expense:view" fallback={<div className="p-6 text-center text-red-500">Access Denied</div>}>
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <PageHeader
                        title="Expenses"
                        description="Track and manage your business expenses"
                    />
                    <PermissionGuard permission="expense:submit">
                        <Button
                            color="primary"
                            variant="shadow"
                            endContent={<PlusIcon size={16} />}
                            onPress={handleCreate}
                            className="w-full sm:w-auto"
                        >
                            Add New Expense
                        </Button>
                    </PermissionGuard>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <Table aria-label="Expense table" removeWrapper isHeaderSticky>
                        <TableHeader>
                            <TableColumn>DATE</TableColumn>
                            <TableColumn>CATEGORY</TableColumn>
                            <TableColumn>SUB CATEGORY</TableColumn>
                            <TableColumn>PURPOSE</TableColumn>
                            <TableColumn>AMOUNT</TableColumn>
                            <TableColumn>MODE</TableColumn>
                            <TableColumn align="center">ATTACHMENT</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={expenses || []} emptyContent={"No expenses found"} isLoading={getExpensesLoading}>
                            {(item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.date}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm capitalize">{item.category_name || "Unknown"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-default-500 capitalize">{item.subcategory_name || "-"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">{item.purpose}</TableCell>
                                    <TableCell className="font-bold text-primary">
                                        ₹{parseFloat(item.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip className="capitalize" color="secondary" size="sm" variant="flat">
                                            {item.payment_mode}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            {item.attachment ? (
                                                <span
                                                    className="text-lg cursor-pointer active:opacity-50 hover:opacity-80 transition-opacity"
                                                    onClick={() => setPreviewData({
                                                        url: item.attachment,
                                                        type: item.file_type,
                                                        name: item.purpose ? `Proof - ${item.purpose}` : "Expense Proof"
                                                    })}
                                                >
                                                    <FileTypeIcon fileType={item.file_type} />
                                                </span>
                                            ) : (
                                                <span className="text-default-300">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center justify-center gap-2">
                                            {hasPermission("expense:submit") && (
                                                <>
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                                                        <PencilIcon size={18} />
                                                    </span>
                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteClick(item)}>
                                                        <TrashIcon size={18} />
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card View — NDA style */}
                <div className="md:hidden space-y-4">
                    {getExpensesLoading ? (
                        <div className="flex justify-center py-8 text-default-400">Loading expenses...</div>
                    ) : (expenses || []).length > 0 ? (
                        (expenses as any[]).map((item: any) => (
                            <Card key={item.id} className="shadow-sm border border-default-100 bg-white dark:bg-zinc-900/50">
                                <CardBody className="p-4 flex flex-col gap-4">
                                    {/* Header: Purpose + Payment Mode chip */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-sm font-bold text-default-900">{item.purpose || "—"}</h3>
                                            <p className="text-[10px] text-default-300 uppercase font-bold tracking-wider mt-1">
                                                {item.category_name || "Unknown"}
                                                {item.subcategory_name ? ` › ${item.subcategory_name}` : ""}
                                            </p>
                                        </div>
                                        <Chip className="capitalize h-6" color="secondary" size="sm" variant="flat">
                                            {item.payment_mode}
                                        </Chip>
                                    </div>

                                    <Divider className="opacity-50" />

                                    {/* NDA-style compact info bar */}
                                    <div className="flex justify-between items-center bg-default-50 dark:bg-white/5 p-2 rounded-xl">
                                        <div className="flex gap-4 items-center">
                                            {/* Amount */}
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-bold text-default-400 uppercase">Amount</span>
                                                <span className="text-tiny font-bold text-primary">
                                                    ₹{parseFloat(item.amount).toLocaleString()}
                                                </span>
                                            </div>
                                            {/* Date */}
                                            <div className="flex flex-col gap-0.5 border-l border-default-200 dark:border-white/10 pl-4">
                                                <span className="text-[9px] font-bold text-default-400 uppercase">Date</span>
                                                <span className="text-tiny">{item.date}</span>
                                            </div>
                                            {/* Attachment */}
                                            <div className="flex flex-col gap-0.5 border-l border-default-200 dark:border-white/10 pl-4">
                                                <span className="text-[9px] font-bold text-default-400 uppercase">Docs</span>
                                                {item.attachment ? (
                                                    <div
                                                        className="flex items-center gap-1 text-primary cursor-pointer"
                                                        onClick={() => setPreviewData({
                                                            url: item.attachment,
                                                            type: item.file_type,
                                                            name: item.purpose ? `Proof - ${item.purpose}` : "Expense Proof"
                                                        })}
                                                    >
                                                        <FileTypeIcon fileType={item.file_type} />
                                                    </div>
                                                ) : (
                                                    <span className="text-tiny text-default-300">-</span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            {hasPermission("expense:submit") && (
                                                <>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="flat"
                                                        onPress={() => handleEdit(item)}
                                                        className="bg-white dark:bg-zinc-800"
                                                    >
                                                        <PencilIcon size={14} className="text-default-400" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="flat"
                                                        color="danger"
                                                        onPress={() => handleDeleteClick(item)}
                                                    >
                                                        <TrashIcon size={14} className="text-danger" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 text-default-400">No expenses found</div>
                    )}
                </div>

                <AddEditExpenseDrawer
                    isOpen={isAddEditOpen}
                    onOpenChange={onAddEditOpenChange}
                    mode={mode}
                    selectedExpense={selectedExpense}
                    loading={mode === "create" ? createExpenseLoading : updateExpenseLoading}
                    onSubmit={handleAddEditSubmit}
                />

                <DeleteExpenseModal
                    isOpen={isDeleteOpen}
                    onOpenChange={onDeleteOpenChange}
                    onConfirm={handleDeleteConfirm}
                    loading={deleteExpenseLoading}
                />

                {previewData && (
                    <FilePreviewModal
                        isOpen={Boolean(previewData)}
                        onClose={() => setPreviewData(null)}
                        fileUrl={previewData.url}
                        fileType={previewData.type}
                        fileName={previewData.name}
                    />
                )}
            </div>
        </PermissionGuard>
    );
}
