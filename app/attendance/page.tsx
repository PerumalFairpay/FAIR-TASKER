"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getMyAttendanceHistoryRequest,
    clockInRequest,
    clockOutRequest,
    clearAttendanceStatus
} from "@/store/attendance/action";
import { AppState } from "@/store/rootReducer";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Clock, LogOut, MapPin, Laptop, Fingerprint, Smartphone } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

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
    const { attendanceHistory, loading, success, error } = useSelector((state: AppState) => state.Attendance);

    // Local state for clock logic
    const [currentDate, setCurrentDate] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentDate(new Date()); // Set initial date on client
        dispatch(getMyAttendanceHistoryRequest());

        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, [dispatch]);

    // Handle Toasts
    useEffect(() => {
        if (success) {
            toast.success(success);
            dispatch(clearAttendanceStatus());
            dispatch(getMyAttendanceHistoryRequest()); // Refresh table
        }
        if (error) {
            toast.error(error);
            dispatch(clearAttendanceStatus());
        }
    }, [success, error, dispatch]);

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
        record.date === format(new Date(), "yyyy-MM-dd") && record.clock_out !== null
    );

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
                return (
                    <Chip className="capitalize" color={cellValue === "Present" ? "success" : "danger"} size="sm" variant="flat">
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

    // Helper stats
    const totalDays = attendanceHistory.length;
    const presentDays = attendanceHistory.filter((r: any) => r.status === "Present").length;

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Attendance</h1>
                    <p className="text-default-500">Track your daily work logs</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-xl font-bold">
                            {currentDate ? format(currentDate, "hh:mm:ss a") : "--:--:-- --"}
                        </div>
                        <div className="text-small text-default-500">
                            {currentDate ? format(currentDate, "EEEE, MMMM do yyyy") : ""}
                        </div>
                    </div>

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
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="shadow-sm">
                    <CardBody className="py-4">
                        <p className="text-small text-default-500 uppercase font-bold">Total Days</p>
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
                        <h4 className="text-2xl font-bold mt-1 text-danger">0</h4>
                    </CardBody>
                </Card>
                <Card className="shadow-sm border-l-4 border-warning">
                    <CardBody className="py-4">
                        <p className="text-small text-default-500 uppercase font-bold">Avg Hours</p>
                        <h4 className="text-2xl font-bold mt-1 text-warning">8.5</h4>
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
                <TableBody items={attendanceHistory} emptyContent={"No attendance history found."}>
                    {(item: AttendanceRecord) => (
                        <TableRow key={item.id}>
                            {(columnKey: React.Key) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
