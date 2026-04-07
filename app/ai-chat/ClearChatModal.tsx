import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Trash2 } from "lucide-react";

interface ClearChatModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export default function ClearChatModal({
    isOpen,
    onOpenChange,
    onConfirm,
}: ClearChatModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            classNames={{
                base: "border border-default-100 dark:border-white/10 bg-white/90 dark:bg-[#09090b]/95 backdrop-blur-xl",
                header: "border-b border-default-100 dark:border-white/5",
                footer: "border-t border-default-100 dark:border-white/5",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex items-center gap-2">
                            <Trash2 size={18} className="text-danger" />
                            <span className="text-default-900 dark:text-default-100">Clear Chat History</span>
                        </ModalHeader>
                        <ModalBody className="py-6">
                            <p className="text-default-600 dark:text-default-400">
                                Are you sure you want to clear all messages? This action cannot be undone and your conversation with Astro will be started fresh.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={onClose}
                                className="font-medium"
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                variant="flat"
                                onPress={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="font-semibold"
                            >
                                Clear History
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
