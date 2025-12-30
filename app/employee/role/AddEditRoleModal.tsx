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

interface AddEditRoleModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    formData: {
        name: string;
        description: string;
        permissions: string;
    };
    setFormData: (data: any) => void;
    loading: boolean;
    onSubmit: () => void;
}

export default function AddEditRoleModal({
    isOpen,
    onOpenChange,
    mode,
    formData,
    setFormData,
    loading,
    onSubmit,
}: AddEditRoleModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Role" : "Edit Role"}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Name"
                                placeholder="Enter role name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                            <Input
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
                            <Textarea
                                label="Permissions"
                                placeholder="Enter permissions (comma separated)"
                                value={formData.permissions}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        permissions: e.target.value,
                                    })
                                }
                                description="e.g. read:users, write:users"
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
