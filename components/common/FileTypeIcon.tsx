import React from "react";
import { FileTextIcon, ImageIcon, TableIcon, FileIcon } from "lucide-react";

interface FileTypeIconProps {
    fileType?: string | null;
    fileName?: string | null;
    size?: number;
    className?: string;
}

export default function FileTypeIcon({
    fileType,
    fileName,
    size = 18,
    className = ""
}: FileTypeIconProps) {
    const type = fileType?.toLowerCase() || "";
    const name = fileName?.toLowerCase() || "";

    if (type.includes("pdf") || name.endsWith(".pdf")) {
        return <FileTextIcon size={size} className={`text-red-500 ${className}`} />;
    }
    else if (type.includes("image") || name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return <ImageIcon size={size} className={`text-purple-500 ${className}`} />;
    }
    else if (type.includes("sheet") || type.includes("excel") || type.includes("csv") || name.match(/\.(xls|xlsx|csv)$/)) {
        return <TableIcon size={size} className={`text-green-500 ${className}`} />;
    }
    else if (type.includes("word") || type.includes("document") || name.match(/\.(doc|docx)$/)) {
        return <FileTextIcon size={size} className={`text-blue-500 ${className}`} />;
    }

    return <FileIcon size={size} className={`text-default-400 ${className}`} />;
}
