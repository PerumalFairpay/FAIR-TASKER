"use client";

import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { XCircle } from "lucide-react";

interface RejectLeaveModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: (reason: string) => void;
    loading: boolean;
}

export default function RejectLeaveModal({
    isOpen,
    onOpenChange,
    onConfirm,
    loading,
}: RejectLeaveModalProps) {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setReason("");
        }
    }, [isOpen]);

    const handleConfirm = () => {
        onConfirm(reason);
        setReason(""); // Reset after confirm
    };

    const handleClose = (onClose: () => void) => {
        setReason("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Reject Leave Request
                        </ModalHeader>
                        <ModalBody className="flex flex-col gap-4">
                            <div className="flex flex-col items-center text-center gap-2 mb-2">
                                <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center text-danger">
                                    <XCircle size={24} />
                                </div>
                                <p className="text-default-500 text-sm">
                                    Please provide a reason for rejecting this leave request.
                                </p>
                            </div>

                            <Textarea
                                label="Rejection Reason"
                                placeholder="Enter reason for rejection..."
                                variant="bordered"
                                color="danger"
                                value={reason}
                                onValueChange={setReason}
                                minRows={3}
                                isRequired
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={() => handleClose(onClose)}>
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                onPress={handleConfirm}
                                isLoading={loading}
                                isDisabled={!reason.trim()}
                            >
                                Reject Request
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
