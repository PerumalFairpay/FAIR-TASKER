import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeleteRoleModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    loading: boolean;
    onConfirm: () => void;
}

export default function DeleteRoleModal({
    isOpen,
    onOpenChange,
    loading,
    onConfirm,
}: DeleteRoleModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Role</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to delete this role? This action cannot be undone.</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="danger" onPress={onConfirm} isLoading={loading}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
