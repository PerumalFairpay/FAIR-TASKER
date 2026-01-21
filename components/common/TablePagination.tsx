import React from "react";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";

interface TablePaginationProps {
    page: number;
    total: number;
    onChange: (page: number) => void;
    limit?: number;
    onLimitChange?: (limit: number) => void;
    align?: "start" | "center" | "end";
    showControls?: boolean;
    loop?: boolean;
}

const TablePagination: React.FC<TablePaginationProps> = ({
    page,
    total,
    onChange,
    limit,
    onLimitChange,
    align = "end",
    showControls = true,
    loop = false
}) => {
    return (
        <div className={`flex flex-col md:flex-row gap-4 items-center justify-${align} w-full py-4`}>
            {limit && onLimitChange && (
                <div className="flex items-center gap-2">
                    <span className="text-small text-default-400">Rows per page:</span>
                    <Select
                        className="w-20"
                        size="sm"
                        selectedKeys={[limit.toString()]}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        aria-label="Rows per page"
                    >
                        <SelectItem key="5" textValue="5">5</SelectItem>
                        <SelectItem key="10" textValue="10">10</SelectItem>
                        <SelectItem key="20" textValue="20">20</SelectItem>
                        <SelectItem key="50" textValue="50">50</SelectItem>
                    </Select>
                </div>
            )}

            <Pagination
                isCompact
                showControls={showControls}
                showShadow
                color="primary"
                page={page}
                total={total}
                onChange={onChange}
                loop={loop}
            />
        </div>
    );
};

export default TablePagination;
