import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeleteAssetCategoryModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    loading: boolean;
    categoryName?: string;
}

export default function DeleteAssetCategoryModal({
    isOpen,
    onOpenChange,
    onConfirm,
    loading,
    categoryName,
}: DeleteAssetCategoryModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-danger">
                            Delete Asset Category
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                Are you sure you want to delete the category <strong>"{categoryName}"</strong>?
                                This action cannot be undone and may affect assets assigned to this category.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
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
