import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getAssetCategoriesRequest } from "@/store/assetCategory/action";
import { getEmployeesSummaryRequest } from "@/store/employee/action";
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

interface AddEditAssetDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    selectedAsset?: any;
    loading: boolean;
    assetCategories: any[];
    onSubmit: (formData: FormData) => void;
}

export default function AddEditAssetDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedAsset,
    loading,
    assetCategories,
    onSubmit,
}: AddEditAssetDrawerProps) {
    const dispatch = useDispatch();
    const { employees } = useSelector((state: RootState) => state.Employee);

    const categoryOptions = useMemo(() => buildDropdownOptions(assetCategories || []), [assetCategories]);

    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            dispatch(getAssetCategoriesRequest());
            dispatch(getEmployeesSummaryRequest());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (isOpen && mode === "edit" && selectedAsset) {
            setFormData({ ...selectedAsset });
        } else if (isOpen && mode === "create") {
            setFormData({
                purchase_date: new Date().toISOString().split('T')[0],
                status: "Available",
                purchase_cost: 0,
            });
            setFiles([]);
        }
    }, [isOpen, mode, selectedAsset]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const data = new FormData();

        const fields = [
            "asset_name", "asset_category_id", "manufacturer", "supplier",
            "purchase_from", "model_no", "serial_no", "purchase_date",
            "purchase_cost", "warranty_expiry", "condition", "status",
            "assigned_to", "description"
        ];

        fields.forEach(field => {
            if (formData[field] !== undefined && formData[field] !== null) {
                data.append(field, formData[field]);
            }
        });

        if (files.length > 0) {
            files.forEach((fileItem) => {
                data.append("images", fileItem.file);
            });
        }

        onSubmit(data);
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1 px-6">
                            {mode === "create" ? "Add New Asset" : "Edit Asset"}
                        </DrawerHeader>
                        <DrawerBody className="gap-6 py-6 px-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Asset Name"
                                    placeholder="Enter asset name"
                                    labelPlacement="outside"
                                    value={formData.asset_name || ""}
                                    onChange={(e) => handleChange("asset_name", e.target.value)}
                                    isRequired
                                    variant="bordered"
                                />

                                <Select
                                    label="Category"
                                    placeholder="Select Category"
                                    labelPlacement="outside"
                                    selectedKeys={formData.asset_category_id ? [formData.asset_category_id] : []}
                                    onChange={(e) => handleChange("asset_category_id", e.target.value)}
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
                                    label="Manufacturer"
                                    placeholder="e.g. Dell, Apple"
                                    labelPlacement="outside"
                                    value={formData.manufacturer || ""}
                                    onChange={(e) => handleChange("manufacturer", e.target.value)}
                                    variant="bordered"
                                />

                                <Input
                                    label="Model Number"
                                    placeholder="e.g. Latitude 5420"
                                    labelPlacement="outside"
                                    value={formData.model_no || ""}
                                    onChange={(e) => handleChange("model_no", e.target.value)}
                                    variant="bordered"
                                />

                                <Input
                                    label="Serial Number"
                                    placeholder="Unique Serial/Service Tag"
                                    labelPlacement="outside"
                                    value={formData.serial_no || ""}
                                    onChange={(e) => handleChange("serial_no", e.target.value)}
                                    variant="bordered"
                                />

                                <Input
                                    label="Supplier"
                                    placeholder="Purchased from supplier"
                                    labelPlacement="outside"
                                    value={formData.supplier || ""}
                                    onChange={(e) => handleChange("supplier", e.target.value)}
                                    variant="bordered"
                                />

                                <Input
                                    label="Purchase From"
                                    placeholder="Store/Vendor"
                                    labelPlacement="outside"
                                    value={formData.purchase_from || ""}
                                    onChange={(e) => handleChange("purchase_from", e.target.value)}
                                    variant="bordered"
                                />

                                <Input
                                    label="Purchase Cost"
                                    placeholder="0.00"
                                    type="number"
                                    labelPlacement="outside"
                                    value={formData.purchase_cost || ""}
                                    onChange={(e) => handleChange("purchase_cost", e.target.value)}
                                    variant="bordered"
                                    startContent={<span className="text-default-400">₹</span>}
                                />

                                <DatePicker
                                    label="Purchase Date"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={formData.purchase_date ? parseDate(formData.purchase_date) : today(getLocalTimeZone())}
                                    onChange={(date) => date && handleChange("purchase_date", date.toString())}
                                />

                                <DatePicker
                                    label="Warranty Expiry"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={formData.warranty_expiry ? parseDate(formData.warranty_expiry) : null}
                                    onChange={(date) => date && handleChange("warranty_expiry", date.toString())}
                                />

                                <Select
                                    label="Condition"
                                    placeholder="Select Condition"
                                    labelPlacement="outside"
                                    selectedKeys={formData.condition ? [formData.condition] : []}
                                    onChange={(e) => handleChange("condition", e.target.value)}
                                    variant="bordered"
                                >
                                    <SelectItem key="New" textValue="New">New</SelectItem>
                                    <SelectItem key="Good" textValue="Good">Good</SelectItem>
                                    <SelectItem key="Fair" textValue="Fair">Fair</SelectItem>
                                    <SelectItem key="Poor" textValue="Poor">Poor</SelectItem>
                                    <SelectItem key="Damaged" textValue="Damaged">Damaged</SelectItem>
                                </Select>

                                <Select
                                    label="Status"
                                    placeholder="Select Status"
                                    labelPlacement="outside"
                                    selectedKeys={formData.status ? [formData.status] : ["Available"]}
                                    onChange={(e) => handleChange("status", e.target.value)}
                                    variant="bordered"
                                >
                                    <SelectItem key="Available" textValue="Available">Available</SelectItem>
                                    <SelectItem key="Assigned" textValue="Assigned">Assigned</SelectItem>
                                    <SelectItem key="In Repair" textValue="In Repair">In Repair</SelectItem>
                                    <SelectItem key="Scrapped" textValue="Scrapped">Scrapped</SelectItem>
                                    <SelectItem key="Lost" textValue="Lost">Lost</SelectItem>
                                </Select>

                                <Select
                                    label="Assigned To"
                                    placeholder="Select Employee"
                                    labelPlacement="outside"
                                    selectedKeys={formData.assigned_to ? [formData.assigned_to] : []}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("assigned_to", value);
                                        if (value) {
                                            handleChange("status", "Assigned");
                                        }
                                    }}
                                    variant="bordered"
                                    onOpenChange={(isOpen) => {
                                        if (isOpen && (!employees || employees.length === 0)) {
                                            dispatch(getEmployeesSummaryRequest());
                                        }
                                    }}
                                >
                                    {(employees || []).map((emp: any) => (
                                        <SelectItem key={emp.id} textValue={emp.name}>
                                            <div className="flex gap-2 items-center">
                                                {emp.profile_picture ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={emp.profile_picture}
                                                        alt={emp.name}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-default-200 flex items-center justify-center text-xs font-semibold text-default-500">
                                                        {emp.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-small">{emp.name}</span>
                                                    <span className="text-tiny text-default-400">{emp.email}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <Textarea
                                label="Description"
                                placeholder="Additional details about the asset"
                                labelPlacement="outside"
                                value={formData.description || ""}
                                onChange={(e) => handleChange("description", e.target.value)}
                                variant="bordered"
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-small font-medium text-foreground">Asset Images</label>
                                <FileUpload
                                    files={files}
                                    setFiles={setFiles}
                                    name="images"
                                    allowMultiple={true}
                                    labelIdle='Drag & Drop images or <span class="filepond--label-action">Browse</span>'
                                    acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'application/pdf']}
                                />
                            </div>
                        </DrawerBody>
                        <DrawerFooter className="px-6 py-4 border-t border-divider">
                            <Button color="danger" variant="light" onPress={onClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading} className="flex-1">
                                {mode === "create" ? "Create Asset" : "Save Changes"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
