"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Download } from "lucide-react";
import { addToast } from "@heroui/toast";
import { downloadFile, downloadPDF } from "@/utils/downloadFile";

interface DownloadButtonProps {
    /** URL of the file to download */
    fileUrl: string;
    /** Name to save the file as */
    fileName: string;
    /** Button size */
    size?: "sm" | "md" | "lg";
    /** Button variant */
    variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
    /** Button color */
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    /** Whether to show only icon */
    isIconOnly?: boolean;
    /** Custom icon size */
    iconSize?: number;
    /** Custom aria label */
    ariaLabel?: string;
    /** Success message */
    successMessage?: string;
    /** Error message */
    errorMessage?: string;
    /** Additional className */
    className?: string;
    /** Button text (only shown if isIconOnly is false) */
    children?: React.ReactNode;
}

export default function DownloadButton({
    fileUrl,
    fileName,
    size = "sm",
    variant = "light",
    color = "default",
    isIconOnly = true,
    iconSize = 16,
    ariaLabel = "Download file",
    successMessage = "File downloaded successfully",
    errorMessage = "Failed to download file",
    className,
    children,
}: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] = React.useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadFile(fileUrl, fileName);
            addToast({
                title: "Success",
                description: successMessage,
                color: "success",
            });
        } catch (error) {
            addToast({
                title: "Error",
                description: errorMessage,
                color: "danger",
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            isIconOnly={isIconOnly}
            size={size}
            variant={variant}
            color={color}
            aria-label={ariaLabel}
            onPress={handleDownload}
            isLoading={isDownloading}
            className={className}
        >
            {isIconOnly ? <Download size={iconSize} /> : children || <Download size={iconSize} />}
        </Button>
    );
}

interface PDFDownloadButtonProps extends Omit<DownloadButtonProps, 'fileName'> {
    /** Base name for the PDF (e.g., employee name) */
    baseName: string;
    /** Prefix for the filename (default: 'Document') */
    prefix?: string;
}

/**
 * Specialized button for downloading PDFs with automatic naming
 */
export function PDFDownloadButton({
    fileUrl,
    baseName,
    prefix = "Document",
    successMessage = "PDF downloaded successfully",
    errorMessage = "Failed to download PDF",
    ...props
}: PDFDownloadButtonProps) {
    const fileName = `${prefix}_${baseName.replace(/\s+/g, '_')}.pdf`;

    return (
        <DownloadButton
            fileUrl={fileUrl}
            fileName={fileName}
            successMessage={successMessage}
            errorMessage={errorMessage}
            {...props}
        />
    );
}
