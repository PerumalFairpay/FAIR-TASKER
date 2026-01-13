import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getExpenseCategoriesRequest } from "@/store/expenseCategory/action";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import FileUpload from "@/components/common/FileUpload";

// Helper to build hierarchy for dropdown
const buildDropdownOptions = (categories: any[]) => {
    if (!categories) return [];

    const map = new Map();
    const roots: any[] = [];

    // Create nodes
    categories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
    });

    // Build tree
    categories.forEach(cat => {
        const node = map.get(cat.id);
        if (cat.parent_id && map.has(cat.parent_id)) {
            map.get(cat.parent_id).children.push(node);
        } else {
            roots.push(node);
        }
    });

    const options: any[] = [];

    // Flatten with level
    const traverse = (nodes: any[], level: number) => {
        nodes.forEach(node => {
            options.push({
                ...node,
                displayName: level > 0 ? `${".".repeat(level * 4)} ${node.name}` : node.name
            });
            if (node.children.length > 0) {
                traverse(node.children, level + 1);
            }
        });
    };

    traverse(roots, 0);
    return options;
};

interface AddEditExpenseDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    selectedExpense?: any;
    loading: boolean;
    onSubmit: (formData: FormData) => void;
}

export default function AddEditExpenseDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedExpense,
    loading,
    onSubmit,
}: AddEditExpenseDrawerProps) {
    const dispatch = useDispatch();
    const { expenseCategories } = useSelector((state: RootState) => state.ExpenseCategory);

    const categoryOptions = useMemo(() => buildDropdownOptions(expenseCategories || []), [expenseCategories]);

    const [formData, setFormData] = useState<any>({});
    const [attachmentFiles, setAttachmentFiles] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            dispatch(getExpenseCategoriesRequest());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (isOpen && mode === "edit" && selectedExpense) {
            setFormData({ ...selectedExpense });
        } else if (isOpen && mode === "create") {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                payment_mode: "Cash"
            });
            setAttachmentFiles([]);
        }
    }, [isOpen, mode, selectedExpense]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handled by FileUpload
    };

    const handleSubmit = () => {
        const data = new FormData();

        // Fields to append
        const fields = ["expense_category_id", "amount", "purpose", "payment_mode", "date"];

        fields.forEach(field => {
            if (formData[field] !== undefined && formData[field] !== null) {
                data.append(field, formData[field]);
            }
        });

        if (attachmentFiles.length > 0) {
            data.append("attachment", attachmentFiles[0].file);
        }

        onSubmit(data);
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Expense" : "Edit Expense"}
                        </DrawerHeader>
                        <DrawerBody className="gap-6 py-4">
                            <Select
                                label="Category"
                                placeholder="Select Category"
                                labelPlacement="outside"
                                selectedKeys={formData.expense_category_id ? [formData.expense_category_id] : []}
                                onChange={(e) => handleChange("expense_category_id", e.target.value)}
                                isRequired
                                variant="bordered"
                            >
                                {categoryOptions.map((cat: any) => (
                                    <SelectItem key={cat.id} textValue={cat.name}>
                                        {cat.displayName}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Input
                                label="Amount"
                                placeholder="0.00"
                                type="number"
                                labelPlacement="outside"
                                value={formData.amount || ""}
                                onChange={(e) => handleChange("amount", e.target.value)}
                                isRequired
                                variant="bordered"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">₹</span>
                                    </div>
                                }
                            />

                            <DatePicker
                                label="Date"
                                labelPlacement="outside"
                                isRequired
                                variant="bordered"
                                value={formData.date ? parseDate(formData.date) : today(getLocalTimeZone())}
                                onChange={(date) => date && handleChange("date", date.toString())}
                            />

                            <Select
                                label="Payment Mode"
                                placeholder="Select Mode"
                                labelPlacement="outside"
                                selectedKeys={formData.payment_mode ? [formData.payment_mode] : []}
                                onChange={(e) => handleChange("payment_mode", e.target.value)}
                                isRequired
                                variant="bordered"
                            >
                                <SelectItem key="Cash" textValue="Cash">Cash</SelectItem>
                                <SelectItem key="Bank Transfer" textValue="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem key="Credit Card" textValue="Credit Card">Credit Card</SelectItem>
                                <SelectItem key="UPI" textValue="UPI">UPI</SelectItem>
                                <SelectItem key="Cheque" textValue="Cheque">Cheque</SelectItem>
                            </Select>

                            <Textarea
                                label="Purpose"
                                placeholder="What was this expense for?"
                                labelPlacement="outside"
                                value={formData.purpose || ""}
                                onChange={(e) => handleChange("purpose", e.target.value)}
                                isRequired
                                variant="bordered"
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-small font-medium text-foreground">Attachment (Optional)</label>
                                <FileUpload
                                    files={attachmentFiles}
                                    setFiles={setAttachmentFiles}
                                    name="attachment"
                                    labelIdle='Drag & Drop your receipt or <span class="filepond--label-action">Browse</span>'
                                    acceptedFileTypes={['image/*', 'application/pdf']}
                                />
                            </div>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="light" onPress={onClose} fullWidth>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading} fullWidth>
                                {mode === "create" ? "Create Expense" : "Save Changes"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
