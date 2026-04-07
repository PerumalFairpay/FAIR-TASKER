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
import { Clock, AlertTriangle } from "lucide-react";

interface CompensatePermissionModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function CompensatePermissionModal({
    isOpen,
    onOpenChange,
    onConfirm,
    loading,
}: CompensatePermissionModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex items-center gap-2">
                            <Clock size={20} className="text-primary" />
                            Mark Permission as Compensated
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 flex gap-3">
                                    <AlertTriangle size={20} className="text-primary mt-1 shrink-0" />
                                    <p className="text-sm text-primary-900 dark:text-primary-100 leading-relaxed">
                                        Are you sure you want to mark this permission as <strong>Compensated</strong>?
                                        This will prevent it from being automatically converted to LOP at the end of the month.
                                    </p>
                                </div>
                                <p className="text-xs text-default-500 italic">
                                    Confirming this means the employee has already made up for these hours (e.g., worked extra on another day).
                                </p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose} isDisabled={loading}>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => {
                                    onConfirm();
                                }}
                                isLoading={loading}
                            >
                                Confirm Compensation
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
