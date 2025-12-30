import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeleteClientModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function DeleteClientModal({
    isOpen,
    onOpenChange,
    onConfirm,
    loading,
}: DeleteClientModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Client/Vendor</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to delete this client/vendor? This action cannot be undone.</p>
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
