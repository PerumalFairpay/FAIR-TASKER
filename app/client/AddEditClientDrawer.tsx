import React, { useEffect, useState } from "react";
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
import FileUpload from "@/components/common/FileUpload";

interface AddEditClientDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    selectedClient?: any;
    loading: boolean;
    onSubmit: (formData: FormData) => void;
}

export default function AddEditClientDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedClient,
    loading,
    onSubmit,
}: AddEditClientDrawerProps) {
    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && mode === "edit" && selectedClient) {
            setFormData({ ...selectedClient });
            setFiles([]); // Reset files, as we don't pre-populate existing files in FilePond usually for this flow
        } else if (isOpen && mode === "create") {
            setFormData({
                status: "Active"
            });
            setFiles([]);
        }
    }, [isOpen, mode, selectedClient]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const data = new FormData();
        const fields = [
            "company_name",
            "contact_name",
            "contact_email",
            "contact_mobile",
            "contact_person_designation",
            "contact_address",
            "description",
            "status"
        ];

        fields.forEach(field => {
            if (formData[field] !== undefined && formData[field] !== null) {
                data.append(field, formData[field]);
            }
        });

        // Append the first file if it exists, as logo
        if (files.length > 0) {
            data.append("logo", files[0].file);
        }

        onSubmit(data);
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Client/Vendor" : "Edit Client/Vendor"}
                        </DrawerHeader>
                        <DrawerBody className="gap-4 py-4">
                            <Input
                                label="Company Name"
                                placeholder="Enter company name"
                                labelPlacement="outside"
                                value={formData.company_name || ""}
                                onChange={(e) => handleChange("company_name", e.target.value)}
                                isRequired
                                variant="bordered"
                            />
                            <div className="flex gap-4">
                                <Input
                                    label="Contact Name"
                                    placeholder="Enter contact name"
                                    labelPlacement="outside"
                                    value={formData.contact_name || ""}
                                    onChange={(e) => handleChange("contact_name", e.target.value)}
                                    isRequired
                                    variant="bordered"
                                    className="flex-1"
                                />
                                <Input
                                    label="Designation"
                                    placeholder="e.g. Manager"
                                    labelPlacement="outside"
                                    value={formData.contact_person_designation || ""}
                                    onChange={(e) => handleChange("contact_person_designation", e.target.value)}
                                    variant="bordered"
                                    className="flex-1"
                                />
                            </div>
                            <div className="flex gap-4">
                                <Input
                                    label="Email"
                                    placeholder="contact@company.com"
                                    type="email"
                                    labelPlacement="outside"
                                    value={formData.contact_email || ""}
                                    onChange={(e) => handleChange("contact_email", e.target.value)}
                                    isRequired
                                    variant="bordered"
                                    className="flex-1"
                                />
                                <Input
                                    label="Mobile"
                                    placeholder="Enter mobile number"
                                    labelPlacement="outside"
                                    value={formData.contact_mobile || ""}
                                    onChange={(e) => handleChange("contact_mobile", e.target.value)}
                                    isRequired
                                    variant="bordered"
                                    className="flex-1"
                                />
                            </div>
                            <Textarea
                                label="Address"
                                placeholder="Enter company address"
                                labelPlacement="outside"
                                value={formData.contact_address || ""}
                                onChange={(e) => handleChange("contact_address", e.target.value)}
                                variant="bordered"
                            />
                            <Textarea
                                label="Description"
                                placeholder="Short description"
                                labelPlacement="outside"
                                value={formData.description || ""}
                                onChange={(e) => handleChange("description", e.target.value)}
                                variant="bordered"
                            />
                            <Select
                                label="Status"
                                placeholder="Select status"
                                labelPlacement="outside"
                                selectedKeys={formData.status ? [formData.status] : ["Active"]}
                                onChange={(e) => handleChange("status", e.target.value)}
                                variant="bordered"
                            >
                                <SelectItem key="Active" textValue="Active">Active</SelectItem>
                                <SelectItem key="Inactive" textValue="Inactive">Inactive</SelectItem>
                            </Select>

                            <div className="flex flex-col gap-2">
                                <label className="text-small font-medium text-foreground">Company Logo</label>
                                <FileUpload
                                    files={files}
                                    setFiles={setFiles}
                                    name="logo"
                                    allowMultiple={false}
                                    labelIdle='Drag & Drop your logo or <span class="filepond--label-action">Browse</span>'
                                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
                                />
                                 
                            </div>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="light" onPress={onClose} fullWidth>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading} fullWidth>
                                {mode === "create" ? "Create Client" : "Save Changes"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
