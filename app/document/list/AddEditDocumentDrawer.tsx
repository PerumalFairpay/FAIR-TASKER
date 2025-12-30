import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getDocumentCategoriesRequest } from "@/store/documentCategory/action";
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

interface AddEditDocumentDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    selectedDocument?: any;
    loading: boolean;
    onSubmit: (formData: FormData) => void;
}

export default function AddEditDocumentDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedDocument,
    loading,
    onSubmit,
}: AddEditDocumentDrawerProps) {
    const dispatch = useDispatch();
    const { documentCategories } = useSelector((state: RootState) => state.DocumentCategory);

    const categoryOptions = useMemo(() => buildDropdownOptions(documentCategories || []), [documentCategories]);

    const [formData, setFormData] = useState<any>({});
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            dispatch(getDocumentCategoriesRequest());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (isOpen && mode === "edit" && selectedDocument) {
            setFormData({ ...selectedDocument });
        } else if (isOpen && mode === "create") {
            setFormData({
                status: "Active",
            });
            setFile(null);
        }
    }, [isOpen, mode, selectedDocument]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        const data = new FormData();

        // Fields to append
        const fields = ["name", "document_category_id", "description", "expiry_date", "status"];

        fields.forEach(field => {
            if (formData[field] !== undefined && formData[field] !== null) {
                data.append(field, formData[field]);
            }
        });

        if (file) {
            data.append("file", file);
        }

        onSubmit(data);
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Document" : "Edit Document"}
                        </DrawerHeader>
                        <DrawerBody className="gap-6 py-4">
                            <Input
                                label="Document Name"
                                placeholder="Enter document name"
                                labelPlacement="outside"
                                value={formData.name || ""}
                                onChange={(e) => handleChange("name", e.target.value)}
                                isRequired
                                variant="bordered"
                            />

                            <Select
                                label="Category"
                                placeholder="Select Category"
                                labelPlacement="outside"
                                selectedKeys={formData.document_category_id ? [formData.document_category_id] : []}
                                onChange={(e) => handleChange("document_category_id", e.target.value)}
                                isRequired
                                variant="bordered"
                            >
                                {categoryOptions.map((cat: any) => (
                                    <SelectItem key={cat.id} textValue={cat.name}>
                                        {cat.displayName}
                                    </SelectItem>
                                ))}
                            </Select>

                            <DatePicker
                                label="Expiry Date"
                                labelPlacement="outside"
                                variant="bordered"
                                value={formData.expiry_date ? parseDate(formData.expiry_date) : null}
                                onChange={(date) => date && handleChange("expiry_date", date.toString())}
                            />

                            <Select
                                label="Status"
                                placeholder="Select Status"
                                labelPlacement="outside"
                                selectedKeys={formData.status ? [formData.status] : ["Active"]}
                                onChange={(e) => handleChange("status", e.target.value)}
                                isRequired
                                variant="bordered"
                            >
                                <SelectItem key="Active" textValue="Active">Active</SelectItem>
                                <SelectItem key="Inactive" textValue="Inactive">Inactive</SelectItem>
                                <SelectItem key="Expired" textValue="Expired">Expired</SelectItem>
                            </Select>

                            <Textarea
                                label="Description"
                                placeholder="Enter document description"
                                labelPlacement="outside"
                                value={formData.description || ""}
                                onChange={(e) => handleChange("description", e.target.value)}
                                variant="bordered"
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-small font-medium text-foreground">Document File</label>
                                <div className="border-2 border-dashed border-default-200 rounded-xl p-4 hover:border-primary transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <p className="text-tiny text-default-500">
                                            {file ? file.name : "Click or drag to upload"}
                                        </p>
                                        {mode === "edit" && selectedDocument?.file_path && !file && (
                                            <p className="text-[10px] text-primary">Keep existing file</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="light" onPress={onClose} fullWidth>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading} fullWidth>
                                {mode === "create" ? "Add Document" : "Save Changes"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
