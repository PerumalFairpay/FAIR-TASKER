"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    getMyAttendanceHistoryRequest,
    getAllAttendanceRequest,
    clockInRequest,
    clockOutRequest,
    clearAttendanceStatus,
    importAttendanceRequest,
    updateAttendanceStatusRequest
} from "@/store/attendance/action";
import { getEmployeesSummaryRequest } from "@/store/employee/action";
import { AppState } from "@/store/rootReducer";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { Avatar } from "@heroui/avatar";
import { Plus, MoreVertical, Calendar as CalendarIcon, Paperclip, Clock, LogOut, MapPin, Laptop, Fingerprint, Smartphone, List, CheckCircle, RefreshCw, Plane } from "lucide-react";
import { Select, SelectItem } from "@heroui/select";

import { addToast } from "@heroui/toast";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import FileUpload from "@/components/common/FileUpload";
import { FileDown, Upload } from "lucide-react";

interface AttendanceRecord {
    id: string;
    employee_details: {
        id: string;
        profile_picture?: string;
        email: string;
        name: string;
        employee_no_id?: string;
    };
    clock_in: string;
    clock_out?: string;
    status: string;
    device_type: string;
    total_work_hours?: string;
    location?: string;
    date: string;
}

import { startOfMonth, endOfMonth, format } from "date-fns";
import AttendanceCalendar from "./AttendanceCalendar";
import AttendanceMetrics from "./AttendanceMetrics";

const columns = [
    { name: "DATE", uid: "date" },
    { name: "EMPLOYEE", uid: "employee" },
    { name: "CLOCK IN", uid: "clock_in" },
    { name: "CLOCK OUT", uid: "clock_out" },
    { name: "DEVICE", uid: "device_type" },
    { name: "WORK HOURS", uid: "total_work_hours" },
    { name: "STATUS", uid: "status" },
    { name: "LOCATION", uid: "location" },
];

export default function AttendancePage() {
    const dispatch = useDispatch();
    const {
        attendanceHistory,
        allAttendance,
        metrics,
        clockInLoading,
        clockInSuccess,
        clockInError,
        clockOutLoading,
        clockOutSuccess,
        clockOutError,
        getAllAttendanceLoading,
        importAttendanceLoading,
        importAttendanceSuccess,
        importAttendanceError,
        pagination
    } = useSelector((state: AppState) => state.Attendance);
    const { user } = useSelector((state: AppState) => state.Auth);
    const { employees } = useSelector((state: AppState) => state.Employee);

    const isAdmin = user?.role === 'admin';

    const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
    const [importFile, setImportFile] = useState<any[]>([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const limit = 20;

    // Status update state
    const [statusUpdateData, setStatusUpdateData] = useState<{
        attendanceId: string;
        oldStatus: string;
        newStatus: string;
        reason: string;
        notes: string;
    } | null>(null);

    // Local state for clock logic
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // Filters
    const [filters, setFilters] = useState({
        start_date: "",
        end_date: "",
        employee_id: "",
        status: ""
    });

    // Keep track of today's record separately to persist button state during filtering
    const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
    const [isClockOutPopoverOpen, setIsClockOutPopoverOpen] = useState(false);

    useEffect(() => {
        if (attendanceHistory?.length) {
            const todayStr = format(new Date(), "yyyy-MM-dd");
            const found = attendanceHistory.find((r: any) => r.date === todayStr);
            if (found) {
                setTodayRecord(found);
            }
        }
    }, [attendanceHistory]);

    useEffect(() => {
        setCurrentDate(new Date()); // Set initial date on client

        const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
        const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");

        if (isAdmin) {
            if (viewMode === "calendar") {
                dispatch(getAllAttendanceRequest({ start_date: start, end_date: end }));
            } else {
                dispatch(getAllAttendanceRequest({ ...filters, page, limit }));
            }


        } else {
            if (viewMode === "calendar") {
                dispatch(getMyAttendanceHistoryRequest({ start_date: start, end_date: end }));
            } else {
                dispatch(getMyAttendanceHistoryRequest({
                    start_date: filters.start_date,
                    end_date: filters.end_date
                }));
            }
        }

        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, [dispatch, isAdmin, filters, viewMode, currentMonth]);

    const uniqueEmployees = useMemo(() => {
        const sourceData = isAdmin ? allAttendance : attendanceHistory;
        if (!sourceData || sourceData.length === 0) return [];

        const empMap = new Map();
        sourceData.forEach((record: AttendanceRecord) => {
            if (record.employee_details && record.employee_details.id) {
                if (!empMap.has(record.employee_details.id)) {
                    empMap.set(record.employee_details.id, {
                        ...record.employee_details,
                        id: record.employee_details.id,
                        employee_id: record.employee_details.id,
                    });
                }
            }
        });
        return Array.from(empMap.values());
    }, [allAttendance, attendanceHistory, isAdmin]);

    const employeesList = useMemo(() => {
        if (isAdmin && employees && employees.length > 0) {
            return employees;
        }
        return uniqueEmployees;
    }, [isAdmin, employees, uniqueEmployees]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setCurrentMonth(new Date(e.target.value));
        }
    }

    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        const calculateElapsed = () => {
            const todayStr = format(new Date(), "yyyy-MM-dd");
            const todayRec = attendanceHistory?.find((r: any) => r.date === todayStr);

            if (todayRec && todayRec.clock_in && !todayRec.clock_out) {
                const clockInTime = new Date(todayRec.clock_in).getTime();
                const now = new Date().getTime();
                const diffSeconds = Math.floor((now - clockInTime) / 1000);
                setElapsedSeconds(diffSeconds > 0 ? diffSeconds : 0);
            } else if (todayRec && todayRec.clock_in && todayRec.clock_out) {
                const clockInTime = new Date(todayRec.clock_in).getTime();
                const clockOutTime = new Date(todayRec.clock_out).getTime();
                const diffSeconds = Math.floor((clockOutTime - clockInTime) / 1000);
                setElapsedSeconds(diffSeconds > 0 ? diffSeconds : 0);
            } else {
                setElapsedSeconds(0);
            }
        };

        calculateElapsed();
        const timer = setInterval(calculateElapsed, 1000);
        return () => clearInterval(timer);
    }, [attendanceHistory]);

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };


    // Handle Clock In/Out Toasts
    useEffect(() => {
        if (clockInSuccess) {
            addToast({
                title: "Success",
                description: "Clocked in successfully",
                color: "success"
            });
            dispatch(clearAttendanceStatus());
            if (!isAdmin) {
                dispatch(getMyAttendanceHistoryRequest());
            }
        }
        if (clockInError) {
            addToast({
                title: "Error",
                description: clockInError,
                color: "danger"
            });
            dispatch(clearAttendanceStatus());
        }
    }, [clockInSuccess, clockInError, dispatch, isAdmin]);

    useEffect(() => {
        if (clockOutSuccess) {
            addToast({
                title: "Success",
                description: "Clocked out successfully",
                color: "success"
            });
            dispatch(clearAttendanceStatus());
            if (!isAdmin) {
                dispatch(getMyAttendanceHistoryRequest());
            }
        }
        if (clockOutError) {
            addToast({
                title: "Error",
                description: clockOutError,
                color: "danger"
            });
            dispatch(clearAttendanceStatus());
        }
    }, [clockOutSuccess, clockOutError, dispatch, isAdmin]);

    useEffect(() => {
        if (importAttendanceSuccess) {
            addToast({
                title: "Success",
                description: "Attendance imported successfully",
                color: "success"
            });
            dispatch(clearAttendanceStatus());
            if (isAdmin) {
                if (viewMode === "calendar") {
                    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
                    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
                    dispatch(getAllAttendanceRequest({ start_date: start, end_date: end }));
                } else {
                    dispatch(getAllAttendanceRequest(filters));
                }
            }
        }
        if (importAttendanceError) {
            addToast({
                title: "Error",
                description: importAttendanceError,
                color: "danger"
            });
            dispatch(clearAttendanceStatus());
        }
    }, [importAttendanceSuccess, importAttendanceError, dispatch, isAdmin, viewMode, currentMonth, filters]);

    const handleClockIn = () => {
        const now = new Date();
        const payload = {
            date: format(now, "yyyy-MM-dd"),
            clock_in: now.toISOString(),
            device_type: "Web",
            location: "Web Portal", // Could be dynamic with navigator.geolocation
            notes: "Web Clock In"
        };

        dispatch(clockInRequest(payload));
    };

    const handleClockOut = () => {
        const now = new Date();
        const payload = {
            clock_out: now.toISOString(),
            device_type: "Web"
        };
        dispatch(clockOutRequest(payload));
    };

    // Check if already clocked in today
    const relevantRecord = todayRecord || attendanceHistory.find((record: any) =>
        record.date === format(new Date(), "yyyy-MM-dd")
    );

    const isTodayClockIn = !!relevantRecord && !!relevantRecord.clock_in;

    const isTodayClockOut = !!relevantRecord?.clock_out;

    const handleImportSubmit = () => {
        if (importFile.length > 0) {
            const file = importFile[0].file;
            dispatch(importAttendanceRequest(file));
            onImportClose();
            setImportFile([]);
        }
    };

    const getDeviceIcon = (device: string) => {
        switch (device?.toLowerCase()) {
            case 'biometric': return <Fingerprint className="w-5 h-5" />;
            case 'mobile': return <Smartphone className="w-5 h-5" />;
            case 'auto sync': return <RefreshCw className="w-5 h-5" />;
            default: return <Laptop className="w-5 h-5" />;
        }
    };

    const renderCell = (item: AttendanceRecord, columnKey: React.Key) => {
        const cellValue = item[columnKey as keyof AttendanceRecord];

        switch (columnKey) {
            case "employee":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: item.employee_details?.profile_picture }}
                        description={item.employee_details?.email}
                        name={item.employee_details?.name}
                    />
                );
            case "clock_in":
            case "clock_out":
                if (typeof cellValue === "string") {
                    const date = new Date(cellValue);
                    if (!isNaN(date.getTime())) {
                        return format(date, "hh:mm a");
                    }
                }
                return "-";
            case "status":
                let color: "success" | "danger" | "warning" | "primary" | "default" = "default";
                if (cellValue === "Present") color = "success";
                else if (cellValue === "Absent") color = "danger";
                else if (cellValue === "Leave") color = "warning";
                else if (cellValue === "Holiday") color = "primary";

                if (isAdmin) {
                    return (
                        <Select
                            size="sm"
                            variant="flat"
                            color={color}
                            className="w-32"
                            aria-label="Update Status"
                            selectedKeys={[cellValue as string]}
                            onSelectionChange={(keys) => {
                                const newStatus = Array.from(keys)[0] as string;
                                if (newStatus && newStatus !== cellValue) {
                                    setStatusUpdateData({
                                        attendanceId: item.id,
                                        oldStatus: cellValue as string,
                                        newStatus,
                                        reason: '',
                                        notes: ''
                                    });
                                }
                            }}
                        >
                            <SelectItem key="Present">Present</SelectItem>
                            <SelectItem key="Absent">Absent</SelectItem>
                            <SelectItem key="Leave">Leave</SelectItem>
                            <SelectItem key="Holiday">Holiday</SelectItem>
                            <SelectItem key="Late">Late</SelectItem>
                        </Select>
                    );
                }

                return (
                    <Chip className="capitalize" color={color} size="sm" variant="flat">
                        {cellValue as string}
                    </Chip>
                );
            case "device_type":
                return (
                    <div className="flex items-center gap-2">
                        {getDeviceIcon(cellValue as string)}
                        <span className="text-small">{cellValue as string}</span>
                    </div>
                );
            case "total_work_hours":
                return cellValue ? `${cellValue} hrs` : "-";
            case "location":
                return (
                    <div className="max-w-[300px] truncate text-small" title={cellValue as string}>
                        {cellValue as string || "-"}
                    </div>
                );
            default:
                return cellValue as React.ReactNode;
        }
    };

    const displayData = isAdmin ? allAttendance : attendanceHistory;



    const todayStats = metrics?.today || { total_present: 0, on_time: 0, late: 0, absent: 0, leave: 0, holiday: 0, overtime: 0 };
    const monthStats = metrics?.month || { total_present: 0, on_time: 0, late: 0, absent: 0, leave: 0, holiday: 0, overtime: 0 };
    const yearStats = metrics?.year || { total_present: 0, on_time: 0, late: 0, absent: 0, leave: 0, holiday: 0, overtime: 0 };

    const todayTotal = (todayStats.total_present || 0) + (todayStats.absent || 0) + (todayStats.leave || 0) + (todayStats.holiday || 0);


    const displayColumns = isAdmin ? columns : columns.filter(col => col.uid !== "employee");

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <PageHeader title={isAdmin ? "Attendance" : "My Attendance"} />

                <div className="flex items-center gap-4 flex-wrap justify-end">
                    {isAdmin && (
                        <Button
                            color="secondary"
                            variant="flat"
                            isIconOnly
                            onPress={onImportOpen}
                            aria-label="Import Attendance"
                        >
                            <Upload size={18} />
                        </Button>
                    )}

                    {/* Controls Section - View Toggle & Filters */}
                    <div className="flex gap-2 items-center">
                        {/* List Filters - Date Range */}
                        {viewMode === "list" && (
                            <>
                                <DatePicker
                                    size="sm"
                                    variant="bordered"
                                    className="w-36"
                                    value={filters.start_date ? parseDate(filters.start_date) : undefined}
                                    onChange={(date) => handleFilterChange("start_date", date ? date.toString() : "")}
                                    aria-label="Start Date"
                                />
                                <span className="text-default-400">-</span>
                                <DatePicker
                                    size="sm"
                                    variant="bordered"
                                    className="w-36"
                                    value={filters.end_date ? parseDate(filters.end_date) : undefined}
                                    onChange={(date) => handleFilterChange("end_date", date ? date.toString() : "")}
                                    aria-label="End Date"
                                />
                            </>
                        )}

                        {/* Calendar Month Picker */}
                        {viewMode === "calendar" && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="month"
                                    aria-label="Select Month"
                                    className="border-default-200 border rounded-lg px-3 py-1.5 text-sm bg-default-50 outline-none focus:ring-2 ring-primary"
                                    value={format(currentMonth, "yyyy-MM")}
                                    onChange={handleMonthChange}
                                />
                            </div>
                        )}

                        {/* View Toggle */}
                        <div className="flex bg-default-100 p-1 rounded-lg">
                            <Button
                                size="sm"
                                isIconOnly
                                variant={viewMode === "list" ? "solid" : "light"}
                                color={viewMode === "list" ? "primary" : "default"}
                                onPress={() => setViewMode("list")}
                                className="rounded-md"
                            >
                                <List size={18} />
                            </Button>
                            <Button
                                size="sm"
                                isIconOnly
                                variant={viewMode === "calendar" ? "solid" : "light"}
                                color={viewMode === "calendar" ? "primary" : "default"}
                                onPress={() => setViewMode("calendar")}
                                className="rounded-md"
                            >
                                <CalendarIcon size={18} />
                            </Button>
                        </div>

                        {/* List Filters - Admin Options */}
                        {viewMode === "list" && isAdmin && (
                            <>
                                <Select
                                    size="sm"
                                    variant="bordered"
                                    placeholder="Status"
                                    aria-label="Filter by Status"
                                    className="w-32"
                                    selectedKeys={filters.status ? [filters.status] : []}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                >
                                    <SelectItem key="Present">Present</SelectItem>
                                    <SelectItem key="Late">Late</SelectItem>
                                    <SelectItem key="Absent">Absent</SelectItem>
                                    <SelectItem key="Holiday">Holiday</SelectItem>
                                    <SelectItem key="Leave">Leave</SelectItem>

                                </Select>

                                <Select
                                    size="sm"
                                    variant="bordered"
                                    placeholder="Employee"
                                    aria-label="Filter by Employee"
                                    className="w-40"
                                    selectedKeys={filters.employee_id ? [filters.employee_id] : []}
                                    onChange={(e) => handleFilterChange("employee_id", e.target.value)}
                                    onOpenChange={(isOpen) => {
                                        if (isOpen) {
                                            dispatch(getEmployeesSummaryRequest());
                                        }
                                    }}
                                >
                                    {employeesList?.map((emp: any) => (
                                        <SelectItem key={emp.employee_no_id} textValue={emp.name}>
                                            <div className="flex items-center gap-2">
                                                <Avatar size="sm" src={emp.profile_picture} name={emp.name} className="w-6 h-6" />
                                                <span>{emp.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </Select>
                            </>
                        )}
                    </div>

                    {!isAdmin && (
                        <>
                            {relevantRecord?.status === 'Leave' ? (
                                <Button
                                    className="cursor-default opacity-100 font-semibold"
                                    variant="flat"
                                    color="secondary"
                                    startContent={<Plane size={20} />}
                                    disableAnimation
                                >
                                    On Leave
                                </Button>
                            ) : !isTodayClockIn && (user?.work_mode === 'Remote' || user?.work_mode === 'Hybrid') ? (
                                <Button
                                    color="primary"
                                    size="md"
                                    startContent={<Clock size={20} />}
                                    onPress={handleClockIn}
                                    isLoading={clockInLoading}
                                    className="shadow-lg shadow-primary/40 font-semibold"
                                >
                                    Clock In
                                </Button>
                            ) : !isTodayClockOut && (user?.work_mode === 'Remote' || user?.work_mode === 'Hybrid') ? (
                                <Popover
                                    isOpen={isClockOutPopoverOpen}
                                    onOpenChange={setIsClockOutPopoverOpen}
                                    placement="bottom"
                                    showArrow
                                >
                                    <PopoverTrigger>
                                        <Button
                                            color="warning"
                                            size="md"
                                            variant="flat"
                                            startContent={<LogOut size={20} />}
                                            isLoading={clockOutLoading}
                                            className="font-semibold"
                                        >
                                            Clock Out
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="px-1 py-2 w-56">
                                            <div className="text-small font-bold">Confirmation</div>
                                            <div className="text-tiny mt-1">Are you sure you want to clock out?</div>
                                            <div className="flex gap-2 mt-3 justify-end">
                                                <Button
                                                    size="md"
                                                    variant="light"
                                                    onPress={() => setIsClockOutPopoverOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="md"
                                                    color="warning"
                                                    onPress={() => {
                                                        handleClockOut();
                                                        setIsClockOutPopoverOpen(false);
                                                    }}
                                                >
                                                    Yes, Clock Out
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : isTodayClockOut && user?.work_mode === 'Remote' ? (
                                <Button
                                    className="cursor-default opacity-100 font-semibold"
                                    variant="flat"
                                    color="success"
                                    startContent={<CheckCircle size={20} />}
                                    disableAnimation
                                >
                                    Done for Today
                                </Button>
                            ) : null}
                        </>
                    )}

                    <div className="text-right hidden xl:block border-l pl-4 ml-2 border-divider">
                        <div className="text-xl font-bold">
                            {currentDate ? format(currentDate, "hh:mm:ss a") : "--:--:-- --"}
                        </div>
                        <div className="text-small text-default-500">
                            {currentDate ? format(currentDate, "EEEE, MMMM do yyyy") : ""}
                        </div>
                    </div>
                </div>
            </div>



            <AttendanceMetrics
                isAdmin={isAdmin}
                todayStats={todayStats}
                monthStats={monthStats}
                yearStats={yearStats}
                elapsedSeconds={elapsedSeconds}
            />

            {viewMode === "calendar" ? (
                <AttendanceCalendar
                    employees={isAdmin ? employeesList : [{
                        id: user?.id,
                        name: user?.name,
                        email: user?.email,
                        employee_id: user?.employee_id,
                        employee_no_id: user?.employee_no_id,
                        profile_picture: user?.profile_picture
                    }]}
                    attendance={isAdmin ? allAttendance : attendanceHistory}
                    currentMonth={currentMonth}
                />
            ) : (
                <>

                    {/* Data Table */}
                    <Table aria-label="Attendance History Table" removeWrapper isHeaderSticky>
                        <TableHeader columns={displayColumns}>
                            {(column: any) => (
                                <TableColumn
                                    key={column.uid}
                                    align={column.uid === "actions" ? "center" : "start"}
                                    className={column.uid === "location" ? "max-w-[200px]" : ""}
                                >
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={displayData} emptyContent={"No attendance records found."}>
                            {(item: AttendanceRecord) => (
                                <TableRow key={item.id}>
                                    {(columnKey: React.Key) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {pagination && pagination.total_pages > 1 && (
                        <div className="flex justify-center mt-4">
                            <Pagination
                                isCompact
                                showControls
                                total={pagination.total_pages}
                                page={page}
                                onChange={(p) => setPage(p)}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Import Modal */}
            <Modal isOpen={isImportOpen} onClose={onImportClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Import Attendance</ModalHeader>
                    <ModalBody>
                        <p className="text-small text-default-500 mb-4">
                            Upload an Excel file containing attendance data. The file should have columns:
                            <span className="font-semibold"> Employee ID (Biometric ID), Date, Clock In, Clock Out, Status.</span>
                        </p>
                        <FileUpload
                            files={importFile}
                            setFiles={setImportFile}
                            acceptedFileTypes={[
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'application/vnd.ms-excel'
                            ]}
                            labelIdle='Drag & Drop attendance excel or <span class="filepond--label-action">Browse</span>'
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onImportClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleImportSubmit}
                            isDisabled={importFile.length === 0}
                            isLoading={importAttendanceLoading}
                        >
                            Start Import
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Status Update Modal */}
            <Modal
                isOpen={!!statusUpdateData}
                onClose={() => setStatusUpdateData(null)}
                size="md"
            >
                <ModalContent>
                    <ModalHeader>Update Attendance Status</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-default-500 mb-1">New Status</p>
                                <Chip color="primary" variant="flat">{statusUpdateData?.newStatus}</Chip>
                            </div>

                            {statusUpdateData?.newStatus === 'Leave' && (
                                <Input
                                    label="Reason"
                                    placeholder="Enter leave reason"
                                    value={statusUpdateData?.reason || ''}
                                    onChange={(e) => setStatusUpdateData(prev => prev ? { ...prev, reason: e.target.value } : null)}
                                    isRequired
                                />
                            )}

                            <Textarea
                                label={statusUpdateData?.oldStatus === 'Leave' && statusUpdateData?.newStatus !== 'Leave' ? "Rejection Reason" : "Notes"}
                                placeholder={statusUpdateData?.oldStatus === 'Leave' && statusUpdateData?.newStatus !== 'Leave' ? "Enter reason for rejecting the leave request" : "Add notes (optional)"}
                                value={statusUpdateData?.notes || ''}
                                onChange={(e) => setStatusUpdateData(prev => prev ? { ...prev, notes: e.target.value } : null)}
                                minRows={3}
                                description={statusUpdateData?.oldStatus === 'Leave' && statusUpdateData?.newStatus !== 'Leave' ? "This will be saved as the rejection reason for the associated leave request" : undefined}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            onPress={() => setStatusUpdateData(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={() => {
                                if (statusUpdateData) {
                                    dispatch(updateAttendanceStatusRequest(
                                        statusUpdateData.attendanceId,
                                        {
                                            status: statusUpdateData.newStatus,
                                            reason: statusUpdateData.reason || undefined,
                                            notes: statusUpdateData.notes || undefined
                                        }
                                    ));
                                    setStatusUpdateData(null);
                                }
                            }}
                            isDisabled={statusUpdateData?.newStatus === 'Leave' && !statusUpdateData?.reason}
                        >
                            Update Status
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
