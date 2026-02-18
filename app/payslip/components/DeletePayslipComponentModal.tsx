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
import { AlertTriangle } from "lucide-react";

interface DeletePayslipComponentModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: () => void;
    loading: boolean;
    componentName?: string;
}

export default function DeletePayslipComponentModal({
    isOpen,
    onOpenChange,
    onConfirm,
    loading,
    componentName,
}: DeletePayslipComponentModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Component</ModalHeader>
                        <ModalBody className="flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center text-danger">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-default-700">Are you sure?</p>
                                <p className="text-sm text-default-500">
                                    You are about to delete <strong>{componentName}</strong>. This action cannot be undone.
                                </p>
                            </div>
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
