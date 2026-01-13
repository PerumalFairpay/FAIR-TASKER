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
import { AlertCircle } from "lucide-react";

interface DeleteLeaveTypeModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: () => void;
    loading: boolean;
    leaveTypeName: string;
}

export default function DeleteLeaveTypeModal({
    isOpen,
    onOpenChange,
    onConfirm,
    loading,
    leaveTypeName,
}: DeleteLeaveTypeModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Delete Leave Type
                        </ModalHeader>
                        <ModalBody className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center text-danger">
                                <AlertCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Are you sure?</h3>
                                <p className="text-default-500 text-sm">
                                    You are about to delete <span className="font-bold text-default-900">{leaveTypeName}</span>.
                                    This action cannot be undone.
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
