import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";

interface AddEditPermissionModalProps {
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

export default function AddEditPermissionModal({
    isOpen,
    onOpenChange,
    mode,
    formData,
    setFormData,
    loading,
    onSubmit,
}: AddEditPermissionModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Permission" : "Edit Permission"}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Name"
                                placeholder="e.g. View Employee"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                            <Input
                                label="Slug"
                                placeholder="e.g. employee:view"
                                disabled={mode === "edit"}
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({ ...formData, slug: e.target.value })
                                }
                            />
                            <Input
                                label="Module"
                                placeholder="e.g. Employee"
                                value={formData.module}
                                onChange={(e) =>
                                    setFormData({ ...formData, module: e.target.value })
                                }
                            />
                            <Textarea
                                label="Description"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={onSubmit} isLoading={loading}>
                                {mode === "create" ? "Create" : "Update"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
