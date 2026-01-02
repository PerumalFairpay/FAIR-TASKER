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
import { useDisclosure } from "@heroui/modal";
import { PlusIcon, PencilIcon, TrashIcon, Eye } from "lucide-react";
import { Chip } from "@heroui/chip";
import AddEditExpenseDrawer from "./AddEditExpenseDrawer";
import DeleteExpenseModal from "./DeleteExpenseModal";

export default function ExpenseListPage() {
    const dispatch = useDispatch();
    const { expenses, loading, success } = useSelector((state: RootState) => state.Expense);
    const { expenseCategories } = useSelector((state: RootState) => state.ExpenseCategory);

    const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onOpenChange: onAddEditOpenChange, onClose: onAddEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedExpense, setSelectedExpense] = useState<any>(null);

    useEffect(() => {
        dispatch(getExpensesRequest());
        dispatch(getExpenseCategoriesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onAddEditClose();
            onDeleteClose();
            dispatch(clearExpenseDetails());
        }
    }, [success, onAddEditClose, onDeleteClose, dispatch]);

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

    // Helper to get category name
    const getCategoryName = (id: string) => {
        const cat = expenseCategories.find((c: any) => c.id === id);
        return cat ? cat.name : "Unknown";
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Expenses</h1>
                    <p className="text-default-500">Track and manage your business expenses</p>
                </div>
                <Button
                    color="primary"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                >
                    Add New Expense
                </Button>
            </div>

            <Table aria-label="Expense table" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>CATEGORY</TableColumn>
                    <TableColumn>PURPOSE</TableColumn>
                    <TableColumn>AMOUNT</TableColumn>
                    <TableColumn>MODE</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={expenses || []} emptyContent={"No expenses found"} isLoading={loading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.date}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm capitalize">{getCategoryName(item.expense_category_id)}</p>
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
                                <div className="relative flex items-center justify-center gap-2">
                                    {item.attachment && (
                                        <a href={item.attachment} target="_blank" rel="noreferrer" className="text-lg text-primary cursor-pointer active:opacity-50">
                                            <Eye size={18} />
                                        </a>
                                    )}
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                                        <PencilIcon size={18} />
                                    </span>
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteClick(item)}>
                                        <TrashIcon size={18} />
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AddEditExpenseDrawer
                isOpen={isAddEditOpen}
                onOpenChange={onAddEditOpenChange}
                mode={mode}
                selectedExpense={selectedExpense}
                loading={loading}
                onSubmit={handleAddEditSubmit}
            />

            <DeleteExpenseModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={handleDeleteConfirm}
                loading={loading}
            />
        </div>
    );
}
