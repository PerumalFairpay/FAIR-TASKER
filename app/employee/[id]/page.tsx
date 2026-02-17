"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { getEmployeeSummaryDetailsRequest } from "@/store/employee/action";
import { RootState } from "@/store/store";
import { PageHeader } from "@/components/PageHeader"; // Assuming this exists as used in list page
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { PermissionGuard } from "@/components/PermissionGuard";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";

export default function EmployeeSummaryPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        employeeSummaryData,
        employeeSummaryLoading,
        employeeSummaryError,
    } = useSelector((state: RootState) => state.Employee);

    const [selectedPeriod, setSelectedPeriod] = React.useState<"month" | "year" | "today">("month");

    useEffect(() => {
        if (id) {
            dispatch(getEmployeeSummaryDetailsRequest(id as string));
        }
    }, [dispatch, id]);

    if (employeeSummaryLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" label="Loading Employee Details..." />
            </div>
        );
    }

    if (employeeSummaryError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <div className="text-danger text-lg font-semibold">Error: {typeof employeeSummaryError === 'string' ? employeeSummaryError : "Failed to load data"}</div>
                <Button color="primary" onPress={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    if (!employeeSummaryData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" label="Initializing..." />
            </div>
        );
    }

    const { employee, leave_balance, attendance_stats, task_stats } = employeeSummaryData;

    return (
        <PermissionGuard permission="employee:view" fallback={<div className="p-6 text-center text-red-500">Access Denied</div>}>
            <div className="p-6">
                <div className="mb-6">
                    <Button
                        variant="light"
                        startContent={<ArrowLeft size={16} />}
                        onPress={() => router.back()}
                        className="mb-2"
                    >
                        Back to List
                    </Button>
                    <PageHeader title="Employee Summary" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Profile Card */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="p-4">
                            <CardBody className="flex flex-col items-center gap-4">
                                <Avatar
                                    src={employee?.profile_picture}
                                    className="w-24 h-24 text-large"
                                    isBordered
                                    color="primary"
                                />
                                <div className="text-center">
                                    <h2 className="text-xl font-bold">{employee?.name || "N/A"}</h2>
                                    <p className="text-default-500">{employee?.designation || "N/A"}</p>
                                    <Chip className="mt-2 capitalize" color={employee?.status === "Active" ? "success" : "danger"} variant="flat" size="sm">
                                        {employee?.status || "Unknown"}
                                    </Chip>
                                </div>

                                <Divider className="my-2" />

                                <div className="w-full space-y-3">
                                    <div className="flex items-center gap-3 text-default-600">
                                        <Mail size={18} />
                                        <span className="text-sm">{employee?.email || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-default-600">
                                        <Phone size={18} />
                                        <span className="text-sm">{employee?.mobile || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-default-600">
                                        <Briefcase size={18} />
                                        <div className="flex flex-col">
                                            <span className="text-sm">{employee?.department || "N/A"}</span>
                                            <span className="text-xs text-default-400 capitalize">{employee?.role}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-default-600">
                                        <MapPin size={18} />
                                        <span className="text-sm capitalize">{employee?.work_mode || "N/A"}</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column: Stats & Metrics */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Attendance Stats */}
                        <Card>
                            <CardHeader className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Clock size={20} /> Attendance Overview
                                </h3>
                                <Tabs
                                    size="sm"
                                    selectedKey={selectedPeriod}
                                    onSelectionChange={(key) => setSelectedPeriod(key as "month" | "year" | "today")}
                                >
                                    <Tab key="today" title="Today" />
                                    <Tab key="month" title="Month" />
                                    <Tab key="year" title="Year" />
                                </Tabs>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="flex flex-col items-center p-3 bg-success-50 rounded-lg">
                                        <span className="text-2xl font-bold text-success">
                                            {attendance_stats?.[selectedPeriod]?.total_present || 0}
                                        </span>
                                        <span className="text-xs text-default-500">Present</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-warning-50 rounded-lg">
                                        <span className="text-2xl font-bold text-warning">
                                            {attendance_stats?.[selectedPeriod]?.late || 0}
                                        </span>
                                        <span className="text-xs text-default-500">Late</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-danger-50 rounded-lg">
                                        <span className="text-2xl font-bold text-danger">
                                            {attendance_stats?.[selectedPeriod]?.absent || 0}
                                        </span>
                                        <span className="text-xs text-default-500">Absent</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-primary-50 rounded-lg">
                                        <span className="text-2xl font-bold text-primary">
                                            {attendance_stats?.[selectedPeriod]?.leave || 0}
                                        </span>
                                        <span className="text-xs text-default-500">Leaves Taken</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Leave Balance */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar size={20} /> Leave Balance
                                </h3>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {Object.entries(leave_balance || {}).map(([key, value]: [string, any]) => (
                                        <div key={key} className="flex justify-between items-center p-3 border border-default-200 rounded-lg">
                                            <span className="capitalize text-sm font-medium">{key.replace(/_/g, " ")}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-primary">{value?.remaining ?? value}</span>
                                                <span className="text-xs text-default-400">/ {value?.total ?? "N/A"}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!leave_balance || Object.keys(leave_balance).length === 0) && (
                                        <div className="col-span-3 text-center text-default-400 py-2">No leave balance data available</div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Task Metrics */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <CheckCircle size={20} /> Task Metrics
                                </h3>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="flex flex-col items-center p-3 border border-default-200 rounded-lg">
                                        <span className="text-2xl font-bold">{task_stats?.total || 0}</span>
                                        <span className="text-xs text-default-500">Total Tasks</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 border border-default-200 rounded-lg">
                                        <span className="text-2xl font-bold text-success">{task_stats?.completed || 0}</span>
                                        <span className="text-xs text-default-500">Completed</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 border border-default-200 rounded-lg">
                                        <span className="text-2xl font-bold text-warning">{task_stats?.in_progress || 0}</span>
                                        <span className="text-xs text-default-500">In Progress</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 border border-default-200 rounded-lg">
                                        <span className="text-2xl font-bold text-danger">{task_stats?.overdue || 0}</span>
                                        <span className="text-xs text-default-500">Overdue</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                    </div>
                </div>
            </div>
        </PermissionGuard>
    );
}
