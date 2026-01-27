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
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { CircularProgress } from "@heroui/progress";
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

import { Select, SelectItem } from "@heroui/select";
import { getEmployeesSummaryRequest } from "@/store/employee/action";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import FilePreviewModal from "@/components/common/FilePreviewModal";

export default function LeaveRequestPage() {
    const dispatch = useDispatch();
    const { leaveRequests, leaveMetrics, loading, success } = useSelector((state: RootState) => state.LeaveRequest);
    const { employees } = useSelector((state: RootState) => state.Employee);
    const { hasPermission, user } = usePermissions();

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isRejectOpen, onOpen: onRejectOpen, onOpenChange: onRejectOpenChange, onClose: onRejectClose } = useDisclosure();
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [rejectRequestId, setRejectRequestId] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<{ url: string; type: string; name: string } | null>(null);

    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [employeeFilter, setEmployeeFilter] = useState<string>("");



    useEffect(() => {
        const filters: any = { status: statusFilter };
        if (employeeFilter) filters.id = employeeFilter;
        dispatch(getLeaveRequestsRequest(filters));
    }, [dispatch, statusFilter, employeeFilter]);

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
                <div className="flex gap-4">
                    {(user?.role === "admin" || user?.role === "hr") && (
                        <Select
                            label="Employee"
                            placeholder="Filter by Employee"
                            className="w-48"
                            size="sm"
                            selectedKeys={employeeFilter ? [employeeFilter] : []}
                            onChange={(e) => setEmployeeFilter(e.target.value)}
                            onOpenChange={(isOpen) => {
                                if (isOpen && (!employees || employees.length === 0)) {
                                    dispatch(getEmployeesSummaryRequest());
                                }
                            }}
                        >
                            {(employees || []).map((emp: any) => (
                                <SelectItem key={emp.id} textValue={emp.name}>
                                    <div className="flex gap-2 items-center">
                                        {emp.profile_picture ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={emp.profile_picture}
                                                alt={emp.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-default-200 flex items-center justify-center text-xs font-semibold text-default-500">
                                                {emp.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-small">{emp.name}</span>
                                            <span className="text-tiny text-default-400">{emp.email}</span>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>
                    )}
                    <Select
                        label="Status"
                        placeholder="Filter by Status"
                        className="w-36"
                        size="sm"
                        selectedKeys={statusFilter ? [statusFilter] : []}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {["All", "Pending", "Approved", "Rejected"].map((status) => (
                            <SelectItem key={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </Select>
                    <Button
                        color="primary"
                        endContent={<PlusIcon size={16} />}
                        onPress={handleCreate}
                    >
                        Apply Leave
                    </Button>
                </div>
            </div>

            {user?.role === "employee" && leaveMetrics && leaveMetrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 mb-6">
                    {leaveMetrics.map((metric: any, index: number) => {
                        const percentage = metric.total_allowed > 0 ? (metric.available / metric.total_allowed) * 100 : 0;
                        let color: "success" | "warning" | "danger" = "success";
                        if (percentage < 25) color = "danger";
                        else if (percentage < 50) color = "warning";

                        const textColorMap = {
                            success: "text-success",
                            warning: "text-warning",
                            danger: "text-danger"
                        };

                        return (
                            <Card key={index} shadow="sm" className="border border-default-100/50">
                                <CardBody className="p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-small font-semibold text-default-700 truncate" title={metric.leave_type}>{metric.leave_type}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Chip size="sm" variant="flat" color={color} className="h-4 px-1 text-[9px] uppercase font-bold tracking-wider min-w-min">
                                                    {metric.code}
                                                </Chip>
                                                <div className="flex items-center gap-1 text-[9px] font-medium text-default-500 bg-default-100/50 px-1.5 py-0.5 rounded-full border border-default-100/50 whitespace-nowrap">
                                                    <span className="text-default-700 font-semibold">{metric.used}</span> Used
                                                    <div className="w-[1px] h-2 bg-default-300 mx-0.5"></div>
                                                    <span className="text-default-700 font-semibold">{metric.total_allowed}</span> Total
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-1 mt-1.5">
                                                <span className={`text-2xl font-bold ${textColorMap[color]} leading-none`}>
                                                    {metric.available}
                                                </span>
                                                <span className="text-[10px] text-default-500 font-medium">Days Left</span>
                                            </div>
                                        </div>
                                        <div className="relative flex items-center justify-center flex-shrink-0">
                                            <CircularProgress
                                                classNames={{
                                                    svg: "w-10 h-10 drop-shadow-sm",
                                                    indicator: "stroke-current",
                                                    track: "stroke-default-100",
                                                }}
                                                value={percentage}
                                                color={color}
                                                aria-label="Leave Balance"
                                                strokeWidth={3}
                                            />
                                            <span className="absolute text-[9px] font-medium text-default-500">
                                                {Math.round(percentage)}%
                                            </span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            )}

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
                                    {item.leave_duration_type === "Permission" && item.start_time && item.end_time && (
                                        <div className="flex items-center gap-1.5 text-tiny text-warning-600 font-medium bg-warning-50 px-1.5 py-0.5 rounded-md w-fit">
                                            <Clock size={10} />
                                            <span>{item.start_time} - {item.end_time}</span>
                                        </div>
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
                                {item.attachment ? (
                                    <div
                                        className="cursor-pointer active:opacity-50 hover:opacity-80 transition-opacity w-fit"
                                        onClick={() => {
                                            const extension = item.attachment.split('.').pop()?.toLowerCase();
                                            let type = item.file_type;
                                            if (!type) {
                                                if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
                                                    type = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
                                                } else if (extension === 'pdf') {
                                                    type = 'application/pdf';
                                                }
                                            }
                                            setPreviewData({
                                                url: item.attachment,
                                                type: type,
                                                name: "Leave Attachment",
                                            });
                                        }}
                                    >
                                        <FileTypeIcon
                                            fileType={item.file_type}
                                            fileName={item.attachment}
                                        />
                                    </div>
                                ) : (
                                    <span className="text-default-300 text-sm">-</span>
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

                                            {/* {(user?.role !== "employee" || item.status === "Pending") && (
                                                <DropdownItem
                                                    key="delete"
                                                    startContent={<TrashIcon size={16} />}
                                                    onPress={() => handleDelete(item.id)}
                                                    className="text-danger"
                                                >
                                                    Delete
                                                </DropdownItem>
                                            )} */}
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

            {previewData && (
                <FilePreviewModal
                    isOpen={Boolean(previewData)}
                    onClose={() => setPreviewData(null)}
                    fileUrl={previewData.url}
                    fileType={previewData.type}
                    fileName={previewData.name}
                />
            )}
        </div>
    );
}
