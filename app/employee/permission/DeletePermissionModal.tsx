import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeletePermissionModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    loading: boolean;
    onConfirm: () => void;
}

export default function DeletePermissionModal({
    isOpen,
    onOpenChange,
    loading,
    onConfirm,
}: DeletePermissionModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Permission</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to delete this permission? This action cannot be undone.</p>
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
