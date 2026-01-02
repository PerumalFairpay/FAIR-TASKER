import React from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";

interface AddEditPermissionDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    formData: {
        name: string;
        slug: string;
        description: string;
        module: string;
    };
    setFormData: (data: any) => void;
    loading: boolean;
    onSubmit: () => void;
}

export default function AddEditPermissionDrawer({
    isOpen,
    onOpenChange,
    mode,
    formData,
    setFormData,
    loading,
    onSubmit,
}: AddEditPermissionDrawerProps) {
    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Permission" : "Edit Permission"}
                        </DrawerHeader>
                        <DrawerBody className="py-6">
                            <div className="flex flex-col gap-5">
                                <Input
                                    label="Name"
                                    labelPlacement="outside"
                                    placeholder="e.g. View Employee"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    variant="bordered"
                                    isRequired
                                />
                                <Input
                                    label="Slug"
                                    labelPlacement="outside"
                                    placeholder="e.g. employee:view"
                                    isReadOnly={mode === "edit"}
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slug: e.target.value })
                                    }
                                    variant="bordered"
                                    description={mode === "edit" ? "Slug cannot be changed after creation" : "Unique identifier for permission check"}
                                />
                                <Input
                                    label="Module"
                                    labelPlacement="outside"
                                    placeholder="e.g. Employee"
                                    value={formData.module}
                                    onChange={(e) =>
                                        setFormData({ ...formData, module: e.target.value })
                                    }
                                    variant="bordered"
                                />
                                <Textarea
                                    label="Description"
                                    labelPlacement="outside"
                                    placeholder="Enter description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    variant="bordered"
                                />
                            </div>
                        </DrawerBody>
                        <DrawerFooter className="">
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={onSubmit} isLoading={loading}>
                                {mode === "create" ? "Create Permission" : "Update Permission"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
