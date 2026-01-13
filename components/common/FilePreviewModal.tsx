import React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from "@heroui/drawer";

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string | null;
    fileType: string | null;
    fileName: string;
}

export default function FilePreviewModal({
    isOpen,
    onClose,
    fileUrl,
    fileType,
    fileName,
}: FilePreviewModalProps) {
    if (!fileUrl) return null;

    const isImage = fileType?.includes("image") ||
        fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

    if (isImage) {
        return (
            <Lightbox
                open={isOpen}
                close={onClose}
                slides={[{ src: fileUrl }]}
                plugins={[Zoom]}
                controller={{ closeOnBackdropClick: true }}
            />
        );
    }

    // For PDF and others, use a Drawer with iframe
    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onClose}
            size="2xl"
            classNames={{
                body: "p-0",
            }}
        >
            <DrawerContent>
                {(onCloseDrawer) => (
                    <>
                        <DrawerHeader className="flex items-center gap-2 border-b justify-between pr-10">
                            <span className="truncate max-w-[80%]">{fileName || "Document Preview"}</span>
                        </DrawerHeader>
                        <DrawerBody className="p-0">
                            <iframe
                                src={`${fileUrl}?filename=${encodeURIComponent(fileName)}&content_type=${encodeURIComponent(fileType || "")}`}
                                title="Document Preview"
                                className="w-full h-full border-none bg-gray-100 min-h-[80vh]"
                            />
                        </DrawerBody>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
