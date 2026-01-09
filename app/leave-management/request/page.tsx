"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    getLeaveRequestsRequest,
    createLeaveRequestRequest,
    updateLeaveRequestRequest,
    updateLeaveStatusRequest,
    deleteLeaveRequestRequest,
    clearLeaveRequestDetails,
} from "@/store/leaveRequest/action";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import {
    PlusIcon, PencilIcon, TrashIcon,
    Calendar, CheckCircle2, XCircle,
    Clock, User as UserIcon, FileText,
    MoreVertical, Eye, Paperclip
} from "lucide-react";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import AddEditLeaveRequestDrawer from "./AddEditLeaveRequestDrawer";
import RejectLeaveModal from "./RejectLeaveModal";
import { User } from "@heroui/user";
import { Tooltip } from "@heroui/tooltip";
import { PermissionGuard, usePermissions } from "@/components/PermissionGuard";

export default function LeaveRequestPage() {
    const dispatch = useDispatch();
    const { leaveRequests, loading, success } = useSelector((state: RootState) => state.LeaveRequest);
    const { hasPermission, user } = usePermissions();

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isRejectOpen, onOpen: onRejectOpen, onOpenChange: onRejectOpenChange, onClose: onRejectClose } = useDisclosure();
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [rejectRequestId, setRejectRequestId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(getLeaveRequestsRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onClose();
            onRejectClose();
            dispatch(clearLeaveRequestDetails());
        }
    }, [success, onClose, onRejectClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setSelectedRequest(null);
        onOpen();
    };

    const handleEdit = (request: any) => {
        setMode("edit");
        setSelectedRequest(request);
        onOpen();
    };

    const handleStatusUpdate = (id: string, status: string) => {
        dispatch(updateLeaveStatusRequest(id, status));
    };

    const handleRejectClick = (id: string) => {
        setRejectRequestId(id);
        onRejectOpen();
    };

    const handleRejectConfirm = (reason: string) => {
        if (rejectRequestId) {
            dispatch(updateLeaveStatusRequest(rejectRequestId, "Rejected", reason));
        }
    };

    const handleDelete = (id: string) => {
        dispatch(deleteLeaveRequestRequest(id));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Approved": return "success";
            case "Rejected": return "danger";
            case "Pending": return "warning";
            default: return "default";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Approved": return <CheckCircle2 size={14} />;
            case "Rejected": return <XCircle size={14} />;
            case "Pending": return <Clock size={14} />;
            default: return null;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    title="Leave Requests"
                    description="Track and manage employee leave applications"
                />
                <Button
                    color="primary"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                >
                    Apply Leave
                </Button>
            </div>

            <Table aria-label="Leave request table" shadow="sm" key={user?.id || "loading"} removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>EMPLOYEE</TableColumn>
                    <TableColumn>LEAVE TYPE</TableColumn>
                    <TableColumn>DURATION</TableColumn>
                    <TableColumn>DAYS</TableColumn>
                    <TableColumn>REASON</TableColumn>
                    <TableColumn>ATTACHMENT</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={leaveRequests || []} emptyContent={"No leave requests found"} isLoading={loading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <User
                                    name={item.employee_details?.name || "Unknown"}
                                    description={item.employee_details?.employee_no_id}
                                    avatarProps={{
                                        src: item.employee_details?.profile_picture,
                                        name: item.employee_details?.name?.charAt(0)
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{item.leave_type_details?.name}</span>
                                    <span className="text-tiny text-default-400">{item.leave_duration_type}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={12} className="text-default-400" />
                                        <span>{item.start_date}</span>
                                        {item.start_date !== item.end_date && (
                                            <>
                                                <span className="text-default-300">→</span>
                                                <span>{item.end_date}</span>
                                            </>
                                        )}
                                    </div>
                                    {item.half_day_session && (
                                        <span className="text-tiny text-primary-500 font-medium">
                                            {item.half_day_session}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip variant="flat" size="sm" color="secondary">
                                    {item.total_days} {item.total_days === 1 ? "Day" : "Days"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-default-600">
                                    {item.reason}
                                </span>
                            </TableCell>
                            <TableCell>
                                {item.attachment && (
                                    <Tooltip content="View Attachment">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            as="a"
                                            href={item.attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Paperclip size={18} className="text-primary" />
                                        </Button>
                                    </Tooltip>
                                )}
                            </TableCell>
                            <TableCell>
                                {item.status === "Rejected" && item.rejection_reason ? (
                                    <Tooltip
                                        content={item.rejection_reason}
                                        color="danger"
                                        closeDelay={0}
                                        classNames={{
                                            content: "max-w-xs"
                                        }}
                                    >
                                        <div className="cursor-help">
                                            <Chip
                                                color={getStatusColor(item.status)}
                                                size="sm"
                                                variant="flat"
                                                startContent={getStatusIcon(item.status)}
                                                className="gap-1 px-2 font-medium"
                                            >
                                                {item.status}
                                            </Chip>
                                        </div>
                                    </Tooltip>
                                ) : (
                                    <Chip
                                        color={getStatusColor(item.status)}
                                        size="sm"
                                        variant="flat"
                                        startContent={getStatusIcon(item.status)}
                                        className="gap-1 px-2 font-medium"
                                    >
                                        {item.status}
                                    </Chip>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly variant="light" size="sm">
                                                <MoreVertical size={18} className="text-default-400" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Action Menu">
                                            {hasPermission("leave:approve") && (
                                                <DropdownItem
                                                    key="approve"
                                                    startContent={<CheckCircle2 size={16} className="text-success" />}
                                                    onPress={() => handleStatusUpdate(item.id, "Approved")}
                                                    className="text-success"
                                                >
                                                    Approve
                                                </DropdownItem>
                                            )}
                                            {hasPermission("leave:approve") && (
                                                <DropdownItem
                                                    key="reject"
                                                    startContent={<XCircle size={16} className="text-danger" />}
                                                    onPress={() => handleRejectClick(item.id)}
                                                    className="text-danger"
                                                >
                                                    Reject
                                                </DropdownItem>
                                            )}

                                            {(user?.role !== "employee" || item.status === "Pending") && (
                                                <DropdownItem
                                                    key="edit"
                                                    startContent={<PencilIcon size={16} />}
                                                    onPress={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </DropdownItem>
                                            )}

                                            {(user?.role !== "employee" || item.status === "Pending") && (
                                                <DropdownItem
                                                    key="delete"
                                                    startContent={<TrashIcon size={16} />}
                                                    onPress={() => handleDelete(item.id)}
                                                    className="text-danger"
                                                >
                                                    Delete
                                                </DropdownItem>
                                            )}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AddEditLeaveRequestDrawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                mode={mode}
                selectedRequest={selectedRequest}
                loading={loading}
                onSubmit={(data) => {
                    if (mode === "create") {
                        dispatch(createLeaveRequestRequest(data));
                    } else {
                        dispatch(updateLeaveRequestRequest(selectedRequest.id, data));
                    }
                }}
            />

            <RejectLeaveModal
                isOpen={isRejectOpen}
                onOpenChange={onRejectOpenChange}
                onConfirm={handleRejectConfirm}
                loading={loading}
            />
        </div>
    );
}
