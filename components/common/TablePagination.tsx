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
        <div className={`flex flex-row flex-wrap items-center justify-between sm:justify-${align} gap-3 w-full py-4`}>
            {limit && onLimitChange && (
                <div className="flex items-center">
                    <Select
                        className="w-16"
                        size="sm"
                        selectedKeys={[limit.toString()]}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        aria-label="Rows per page"
                        variant="flat"
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
                size="sm"
                total={total}
                onChange={onChange}
                loop={loop}
                className="scale-90 sm:scale-100 origin-right"
            />
        </div>
    );
};

export default TablePagination;
