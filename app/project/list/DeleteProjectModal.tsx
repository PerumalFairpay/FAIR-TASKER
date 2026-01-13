"use client";

import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeleteProjectModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function DeleteProjectModal({
    isOpen,
    onOpenChange,
    onConfirm,
    loading,
}: DeleteProjectModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Project</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="flat" onPress={onClose}>
                                No, Keep it
                            </Button>
                            <Button color="danger" onPress={onConfirm} isLoading={loading}>
                                Yes, Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
