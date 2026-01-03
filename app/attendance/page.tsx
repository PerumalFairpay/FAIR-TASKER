"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    getMyAttendanceHistoryRequest,
    getAllAttendanceRequest,
    clockInRequest,
    clockOutRequest,
    clearAttendanceStatus,
    importAttendanceRequest
} from "@/store/attendance/action";
import { AppState } from "@/store/rootReducer";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { Avatar } from "@heroui/avatar";
import { Plus, MoreVertical, Calendar as CalendarIcon, Paperclip, Clock, LogOut, MapPin, Laptop, Fingerprint, Smartphone, List } from "lucide-react";
import { Select, SelectItem } from "@heroui/select";
import { getEmployeesRequest } from "@/store/employee/action";
import { addToast } from "@heroui/toast";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import FileUpload from "@/components/common/FileUpload";
import { FileDown, Upload } from "lucide-react";

interface AttendanceRecord {
    id: string;
    employee_details: {
        profile_picture?: string;
        email: string;
        name: string;
    };
    clock_in: string;
    clock_out?: string;
    status: string;
    device_type: string;
    total_work_hours?: string;
    location?: string;
    date: string;
}

import { getHolidaysRequest } from "@/store/holiday/action";
import { startOfMonth, endOfMonth, format } from "date-fns";
import AttendanceCalendar from "./AttendanceCalendar";

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
    const { attendanceHistory, allAttendance, metrics, loading, success, error } = useSelector((state: AppState) => state.Attendance);
    const { user } = useSelector((state: AppState) => state.Auth);
    const { employees } = useSelector((state: AppState) => state.Employee);
    const { holidays } = useSelector((state: AppState) => state.Holiday); // Fetch holidays state
    const isAdmin = user?.role === 'admin';

    const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
    const [importFile, setImportFile] = useState<any[]>([]);

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

    useEffect(() => {
        setCurrentDate(new Date()); // Set initial date on client

        const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
        const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");

        if (isAdmin) {
            if (viewMode === "calendar") {
                dispatch(getAllAttendanceRequest({ start_date: start, end_date: end }));
            } else {
                dispatch(getAllAttendanceRequest(filters));
            }

            if (employees.length === 0) {
                dispatch(getEmployeesRequest());
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

        if (viewMode === "calendar") {
            dispatch(getHolidaysRequest());
        }

        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, [dispatch, isAdmin, filters, viewMode, currentMonth]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setCurrentMonth(new Date(e.target.value));
        }
    }

    // Handle Toasts
    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
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
            } else {
                dispatch(getMyAttendanceHistoryRequest());
            }
        }
        if (error) {
            addToast({
                title: "Error",
                description: error,
                color: "danger"
            });
            dispatch(clearAttendanceStatus());
        }
    }, [success, error, dispatch, isAdmin, viewMode, currentMonth, filters]);

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
    const isTodayClockIn = attendanceHistory.some((record: any) =>
        record.date === format(new Date(), "yyyy-MM-dd")
    );

    const isTodayClockOut = attendanceHistory.some((record: any) =>
        record.date === format(new Date(), "yyyy-MM-dd") && record.clock_out
    );

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
            default:
                return cellValue as React.ReactNode;
        }
    };

    const displayData = isAdmin ? allAttendance : attendanceHistory;

    // Helper stats
    const totalDays = metrics?.total_records || 0;
    const presentDays = metrics?.present || 0;
    const absentDays = metrics?.absent || 0;
    const leaveDays = metrics?.leave || 0;

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

                        {/* List Filters */}
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

                                {isAdmin && (
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
                                        </Select>

                                        <Select
                                            size="sm"
                                            variant="bordered"
                                            placeholder="Employee"
                                            aria-label="Filter by Employee"
                                            className="w-40"
                                            selectedKeys={filters.employee_id ? [filters.employee_id] : []}
                                            onChange={(e) => handleFilterChange("employee_id", e.target.value)}
                                        >
                                            {employees?.map((emp: any) => (
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
                            </>
                        )}

                        {/* Calendar Month Picker - For All Users */}
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
                    </div>

                    <div className="text-right hidden xl:block border-l pl-4 ml-2 border-divider">
                        <div className="text-xl font-bold">
                            {currentDate ? format(currentDate, "hh:mm:ss a") : "--:--:-- --"}
                        </div>
                        <div className="text-small text-default-500">
                            {currentDate ? format(currentDate, "EEEE, MMMM do yyyy") : ""}
                        </div>
                    </div>

                    {!isAdmin && (
                        <>
                            {!isTodayClockIn ? (
                                <Button
                                    color="primary"
                                    size="lg"
                                    startContent={<Clock size={20} />}
                                    onPress={handleClockIn}
                                    isLoading={loading}
                                    className="shadow-lg shadow-primary/40 font-semibold"
                                >
                                    Clock In
                                </Button>
                            ) : !isTodayClockOut ? (
                                <Button
                                    color="warning"
                                    size="lg"
                                    variant="flat"
                                    startContent={<LogOut size={20} />}
                                    onPress={handleClockOut}
                                    isLoading={loading}
                                    className="font-semibold"
                                >
                                    Clock Out
                                </Button>
                            ) : (
                                <Button disabled variant="faded" color="success" startContent={<Clock size={20} />}>
                                    Done for Today
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>



            {viewMode === "calendar" ? (
                <Card className="shadow-sm">
                    <CardBody>
                        <AttendanceCalendar
                            employees={isAdmin ? employees : [{
                                name: user?.name,
                                email: user?.email,
                                employee_id: user?.employee_id || user?.id,
                                employee_no_id: user?.employee_no_id,
                                profile_picture: user?.profile_picture
                            }]}
                            attendance={isAdmin ? allAttendance : attendanceHistory}
                            holidays={holidays || []}
                            currentMonth={currentMonth}
                        />
                    </CardBody>
                </Card>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="shadow-sm">
                            <CardBody className="py-4">
                                <p className="text-small text-default-500 uppercase font-bold">{isAdmin ? "Total Records" : "Total Days"}</p>
                                <h4 className="text-2xl font-bold mt-1">{totalDays}</h4>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm border-l-4 border-success">
                            <CardBody className="py-4">
                                <p className="text-small text-default-500 uppercase font-bold">Present</p>
                                <h4 className="text-2xl font-bold mt-1 text-success">{presentDays}</h4>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm border-l-4 border-danger">
                            <CardBody className="py-4">
                                <p className="text-small text-default-500 uppercase font-bold">Absent</p>
                                <h4 className="text-2xl font-bold mt-1 text-danger">{absentDays}</h4>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm border-l-4 border-warning">
                            <CardBody className="py-4">
                                <p className="text-small text-default-500 uppercase font-bold">Leave</p>
                                <h4 className="text-2xl font-bold mt-1 text-warning">{leaveDays}</h4>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Data Table */}
                    <Table aria-label="Attendance History Table">
                        <TableHeader columns={columns}>
                            {(column: any) => (
                                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
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
                </>
            )}

            {/* Import Modal */}
            <Modal isOpen={isImportOpen} onClose={onImportClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Import Attendance</ModalHeader>
                    <ModalBody>
                        <p className="text-small text-default-500 mb-4">
                            Upload an Excel file containing attendance data. The file should have columns:
                            <span className="font-semibold"> Employee ID, Date, Clock In, Clock Out, Status.</span>
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
                            isLoading={loading}
                        >
                            Start Import
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
