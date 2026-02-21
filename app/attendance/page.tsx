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
    editAttendanceRequest,
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
import { Plus, MoreVertical, Calendar as CalendarIcon, Paperclip, Clock, LogOut, MapPin, Laptop, Fingerprint, Smartphone, List, CheckCircle, RefreshCw, Plane, Pencil } from "lucide-react";
import { Select, SelectItem } from "@heroui/select";

import { addToast } from "@heroui/toast";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Pagination } from "@heroui/pagination";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import FileUpload from "@/components/common/FileUpload";
import { FileDown, Upload } from "lucide-react";
import Lottie from "lottie-react";
import HRMLoading from "@/app/assets/HRMLoading.json";

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
    status: string;              // Primary: Present | Absent | Leave | Holiday
    attendance_status?: string;  // Detailed: Ontime | Late | Permission | Half Day | CL | SL | ...
    leave_type_code?: string;    // e.g. "CL", "SL", "LOP"
    is_permission?: boolean;
    is_half_day?: boolean;
    is_late?: boolean;
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
    { name: "ACTIONS", uid: "actions" },
];

// Helper: convert ISO timestamp → "HH:MM" for time input (displayed in local/IST time)
function isoToTimeInput(iso?: string): string {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        // getHours/getMinutes returns local time (IST in browser)
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    } catch { return ""; }
}

function buildISOFromDateAndTime(dateStr: string, timeStr: string): string {
    if (!dateStr || !timeStr) return "";
    const d = new Date(`${dateStr}T${timeStr}:00`);
    return d.toISOString(); // e.g. "2026-02-21T14:31:00.000Z"
}


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
        getMyHistoryLoading,
        getAllAttendanceLoading,
        importAttendanceLoading,
        importAttendanceSuccess,
        importAttendanceError,
        editAttendanceLoading,
        editAttendanceSuccess,
        editAttendanceError,
        pagination
    } = useSelector((state: AppState) => state.Attendance);
    const { user } = useSelector((state: AppState) => state.Auth);
    const { employees } = useSelector((state: AppState) => state.Employee);

    const isAdmin = user?.role === 'admin';

    const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [importFile, setImportFile] = useState<any[]>([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const limit = 20;

    // Edit modal state
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
    const [editForm, setEditForm] = useState({
        clock_in: "",
        clock_out: "",
        status: "",
        attendance_status: "",
        notes: "",
    });

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

    // Edit attendance toast handler
    useEffect(() => {
        if (editAttendanceSuccess) {
            addToast({
                title: "Success",
                description: "Attendance record updated successfully",
                color: "success"
            });
            dispatch(clearAttendanceStatus());
            onEditClose();
        }
        if (editAttendanceError) {
            addToast({
                title: "Error",
                description: editAttendanceError,
                color: "danger"
            });
            dispatch(clearAttendanceStatus());
        }
    }, [editAttendanceSuccess, editAttendanceError, dispatch]);

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

    // Open edit modal pre-filled with the selected record
    const handleEditOpen = (record: AttendanceRecord) => {
        setSelectedRecord(record);
        setEditForm({
            clock_in: isoToTimeInput(record.clock_in),
            clock_out: isoToTimeInput(record.clock_out),
            status: record.status || "",
            attendance_status: record.attendance_status || "",
            notes: "",
        });
        onEditOpen();
    };

    const handleEditSave = () => {
        if (!selectedRecord) return;

        const data: any = {};
        if (editForm.clock_in) {
            data.clock_in = buildISOFromDateAndTime(selectedRecord.date, editForm.clock_in);
        }
        if (editForm.clock_out) {
            data.clock_out = buildISOFromDateAndTime(selectedRecord.date, editForm.clock_out);
        }
        if (editForm.status) data.status = editForm.status;
        if (editForm.attendance_status) data.attendance_status = editForm.attendance_status;
        if (editForm.notes) data.notes = editForm.notes;

        dispatch(editAttendanceRequest({ id: selectedRecord.id, data }));
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
            case "status": {
                // Build a compound label from primary status + attendance_status sub-status
                const primary = item.status || "";
                const sub = item.attendance_status || "";
                const typeCode = item.leave_type_code || "";

                // Determine badge color
                let color: "success" | "danger" | "warning" | "primary" | "default" | "secondary" = "default";
                let label = primary;

                if (primary === "Present") {
                    if (sub === "Permission") {
                        label = "Present · Permission";
                        color = "secondary";
                    } else if (sub === "Half Day") {
                        label = "Present · Half Day";
                        color = "primary";
                    } else if (sub === "Late") {
                        label = "Present · Late";
                        color = "warning";
                    } else {
                        label = "Present · On Time";
                        color = "success";
                    }
                } else if (primary === "Absent") {
                    color = "danger";
                    label = "Absent";
                } else if (primary === "Leave") {
                    color = "warning";
                    label = sub === "Half Day"
                        ? "Leave · Half Day"
                        : typeCode
                            ? `Leave · ${typeCode}`
                            : "Leave";
                } else if (primary === "Holiday") {
                    color = "primary";
                    label = "Holiday";
                }

                return (
                    <Chip className="capitalize whitespace-nowrap" color={color} size="sm" variant="flat">
                        {label}
                    </Chip>
                );
            }
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
            case "actions":
                if (!isAdmin) return null;
                return (
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="Edit attendance"
                        onPress={() => handleEditOpen(item)}
                    >
                        <Pencil size={15} />
                    </Button>
                );
            default:
                return cellValue as React.ReactNode;
        }
    };

    const displayData = isAdmin ? allAttendance : attendanceHistory;



    const defaultStats = { total_present: 0, on_time: 0, late: 0, absent: 0, leave: 0, holiday: 0, permission: 0, half_day: 0 };
    const todayStats = metrics?.today || defaultStats;
    const monthStats = metrics?.month || defaultStats;
    const yearStats = metrics?.year || defaultStats;

    const todayTotal = (todayStats.total_present || 0) + (todayStats.absent || 0) + (todayStats.leave || 0) + (todayStats.holiday || 0);


    const displayColumns = isAdmin ? columns : columns.filter(col => col.uid !== "employee" && col.uid !== "actions");

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
                                    className="w-36"
                                    selectedKeys={filters.status ? [filters.status] : []}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                >
                                    <SelectItem key="Present">Present</SelectItem>
                                    <SelectItem key="Ontime">Present · On Time</SelectItem>
                                    <SelectItem key="Late">Present · Late</SelectItem>
                                    <SelectItem key="Permission">Present · Permission</SelectItem>
                                    <SelectItem key="Half Day">Present · Half Day</SelectItem>
                                    <SelectItem key="Absent">Absent</SelectItem>
                                    <SelectItem key="Leave">Leave</SelectItem>
                                    <SelectItem key="Holiday">Holiday</SelectItem>
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
                            {relevantRecord?.status === 'Leave' && relevantRecord?.attendance_status !== 'Half Day' ? (
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
                                <div className="flex items-center gap-3">
                                    {relevantRecord?.attendance_status === 'Half Day' && (
                                        <Chip color="primary" variant="flat" size="sm" className="font-semibold px-2 h-8">
                                            Half Day Leave
                                        </Chip>
                                    )}
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
                                </div>
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
                                            startContent={relevantRecord?.device_type === 'Biometric' ? <Fingerprint size={20} /> : <LogOut size={20} />}
                                            isLoading={clockOutLoading}
                                            className="font-semibold"
                                            isDisabled={relevantRecord?.device_type === 'Biometric'}
                                        >
                                            {relevantRecord?.device_type === 'Biometric' ? "Biometric Clocked" : "Clock Out"}
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
                isBiometric={relevantRecord?.device_type === 'Biometric'}
            />


            {(getAllAttendanceLoading || getMyHistoryLoading) ? (
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="w-64 h-64">
                        <Lottie animationData={HRMLoading} loop={true} />
                    </div>
                </div>
            ) : viewMode === "calendar" ? (
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

            {/* Edit Attendance Drawer (Admin only) */}
            <Drawer isOpen={isEditOpen} onClose={onEditClose} size="md">
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Pencil size={18} className="text-primary" />
                                    <span>Edit Attendance</span>
                                </div>
                                {selectedRecord && (
                                    <p className="text-small font-normal text-default-500">
                                        {selectedRecord.employee_details?.name} &mdash; {selectedRecord.date}
                                    </p>
                                )}
                            </DrawerHeader>
                            <DrawerBody className="gap-6 py-4">
                                {editForm.status !== "Absent" && editForm.status !== "Holiday" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            type="time"
                                            label="Clock In (IST)"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            value={editForm.clock_in}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, clock_in: e.target.value }))}
                                        />
                                        <Input
                                            type="time"
                                            label="Clock Out (IST)"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            value={editForm.clock_out}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, clock_out: e.target.value }))}
                                        />
                                    </div>
                                )}

                                <Select
                                    label="Primary Status"
                                    placeholder="Select Status"
                                    labelPlacement="outside"
                                    size="md"
                                    variant="bordered"
                                    selectedKeys={editForm.status ? [editForm.status] : []}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        setEditForm(prev => {
                                            if (newStatus === "Absent" || newStatus === "Holiday") {
                                                return { ...prev, status: newStatus, clock_in: "", clock_out: "", attendance_status: "" };
                                            } else if (newStatus !== "Present") {
                                                return { ...prev, status: newStatus, attendance_status: "" };
                                            }
                                            return { ...prev, status: newStatus };
                                        });
                                    }}
                                >
                                    <SelectItem key="Present">Present</SelectItem>
                                    <SelectItem key="Absent">Absent</SelectItem>
                                    <SelectItem key="Holiday">Holiday</SelectItem>
                                </Select>

                                {editForm.status === "Present" && (
                                    <Select
                                        label="Attendance Status"
                                        placeholder="Select Status"
                                        labelPlacement="outside"
                                        size="md"
                                        variant="bordered"
                                        selectedKeys={editForm.attendance_status ? [editForm.attendance_status] : []}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, attendance_status: e.target.value }))}
                                    >
                                        <SelectItem key="Ontime">On Time</SelectItem>
                                        <SelectItem key="Late">Late</SelectItem>
                                        <SelectItem key="Permission">Permission</SelectItem>
                                        <SelectItem key="Half Day">Half Day</SelectItem>
                                    </Select>
                                )}

                                <Textarea
                                    label="Admin Notes"
                                    placeholder="Reason for edit (optional)"
                                    labelPlacement="outside"
                                    size="md"
                                    variant="bordered"
                                    value={editForm.notes}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                    minRows={3}
                                />
                            </DrawerBody>
                            <DrawerFooter className="border-t border-divider">
                                <Button variant="light" color="danger" onPress={onClose} fullWidth>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleEditSave}
                                    isLoading={editAttendanceLoading}
                                    fullWidth
                                >
                                    Save Changes
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>


        </div>
    );
}
