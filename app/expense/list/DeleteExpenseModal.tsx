import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeleteExpenseModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function DeleteExpenseModal({
    isOpen,
    onOpenChange,
    onConfirm,
    loading,
}: DeleteExpenseModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Expense</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
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
