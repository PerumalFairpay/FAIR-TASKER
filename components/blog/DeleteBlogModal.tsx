"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlogRequest } from "@/store/blog/action";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    blogToDelete: any;
}

const DeleteBlogModal: React.FC<DeleteBlogModalProps> = ({ isOpen, onClose, blogToDelete }) => {
    const dispatch = useDispatch();
    const { deleteBlogLoading } = useSelector((state: any) => state.Blog);

    const handleDelete = () => {
        if (blogToDelete) {
            dispatch(deleteBlogRequest(blogToDelete.id));
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            className="bg-white dark:bg-[#1f1f1f] border border-[#e5e7eb] dark:border-[#444746]"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 px-6 py-4 border-b border-[#e5e7eb] dark:border-[#444746]">
                            <div className="flex items-center gap-2 text-[#d93025] dark:text-[#f28b82]">
                                <AlertTriangle className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">Delete Blog Post</h2>
                            </div>
                        </ModalHeader>
                        <ModalBody className="px-6 py-6">
                            <p className="text-[#1f1f1f] dark:text-[#E3E3E3]">
                                Are you sure you want to delete <span className="font-semibold">"{blogToDelete?.title}"</span>?
                                This action cannot be undone.
                            </p>
                        </ModalBody>
                        <ModalFooter className="border-t border-[#e5e7eb] dark:border-[#444746] px-6 py-4">
                            <Button
                                variant="light"
                                onPress={onClose}
                                className="font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]"
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                onPress={handleDelete}
                                isLoading={deleteBlogLoading}
                                className="font-medium bg-[#d93025] text-white shadow-md"
                            >
                                {deleteBlogLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default DeleteBlogModal;
