"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Progress, CircularProgress } from "@heroui/progress";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
    Briefcase, Calendar, Clock, CheckCircle,
    LayoutDashboard, Bell, Search, Menu,
    MoreVertical, ArrowUpRight, Sun, Moon,
    ShieldCheck, AlertCircle, Target, ListTodo,
    Bug, Users, ClipboardList, LogOut,
    Award, RefreshCw, Ban, Baby, FileText, HeartPulse, Plane, Fingerprint, Activity, User as UserIcon
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import {
    clockInRequest,
    clockOutRequest,
    clearAttendanceStatus,
    getMyAttendanceHistoryRequest
} from "@/store/attendance/action";
import { addToast } from "@heroui/toast";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";

interface DashboardData {
    type: string;
    greeting: {
        greeting_text: string;
        message: string;
    };
    profile: {
        name: string;
        designation: string;
        department: string;
        profile_picture: string;
        employee_id: string;
        joining_date: string;
        status?: string;
    };
    work_hours: {
        today: number;
        this_week: number;
        this_month: number;
    };
    attendance_metrics: {
        present_days: number;
        on_time_days: number;
        absent_days: number;
        late_days: number;
        half_day_days: number;
        permission_days: number;
        holiday_days: number;
        leave_days: number;
        total_working_days: number;
    };

    projects: Array<{
        name: string;
        role: string;
        status: string;
        deadline: string;
        logo?: string;
    }>;
    task_metrics: {
        total_assigned: number;
        pending: number;
        in_progress: number;
        completed: number;
        overdue: number;
    };


    upcoming_holidays: Array<{
        name: string;
        date: string;
    }>;
    birthdays: Array<{
        name: string;
        date: string;
        profile_picture: string;
    }>;
    leave_insights: {
        total_allotted: number;
        total_used: number;
        total_pending: number;
        total_available: number;
        details: Array<{
            id: string;
            type: string;
            code: string;
            total: number;
            used: number;
            available: number;
            pending: number;
        }>;
    };
}

// --- Component ---

// --- Component ---

export default function EmployeeDashboard({ data, blogs }: { data: DashboardData; blogs: any[] }) {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isClockOutPopoverOpen, setIsClockOutPopoverOpen] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            // If it matches mobile UA OR has touch points (most mobile browsers in desktop mode still report touch)
            setIsMobileDevice(mobileRegex.test(userAgent) || (isTouchDevice && window.innerWidth <= 1024));
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setCurrentDate(new Date());
        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const dispatch = useDispatch();
    const {
        attendanceHistory,
        clockInLoading,
        clockInSuccess,
        clockInError,
        clockOutLoading,
        clockOutSuccess,
        clockOutError,
        metrics: reduxMetrics
    } = useSelector((state: AppState) => state.Attendance);

    const displayMetrics = React.useMemo(() => {
        if (reduxMetrics && reduxMetrics.month) {
            const m = reduxMetrics.month;
            const totalPresent = (m.on_time || 0) + (m.late || 0) + (m.half_day || 0) + (m.permission || 0);
            const totalWorking = totalPresent + (m.absent || 0) + (m.leave || 0) + (m.holiday || 0);
            return {
                ...data.attendance_metrics,
                present_days: totalPresent,
                on_time_days: m.on_time || 0,
                absent_days: m.absent || 0,
                late_days: m.late || 0,
                half_day_days: m.half_day || 0,
                permission_days: m.permission || 0,
                leave_days: m.leave || 0,
                holiday_days: m.holiday || 0,
                total_working_days: totalWorking > 0 ? totalWorking : data.attendance_metrics.total_working_days
            };
        }
        return data.attendance_metrics;
    }, [reduxMetrics, data.attendance_metrics]);

    const { user } = useSelector((state: AppState) => state.Auth);

    useEffect(() => {
        // Attendance history is now dispatched at the page level (dashboard/page.tsx)
        // to synchronize with the loading skeleton.
    }, [dispatch]);

    // Handle Clock In/Out Toasts
    useEffect(() => {
        if (clockInSuccess) {
            addToast({
                title: "Success",
                description: "Clocked in successfully",
                color: "success"
            });
            dispatch(clearAttendanceStatus());
        }
        if (clockInError) {
            addToast({
                title: "Error",
                description: clockInError,
                color: "danger"
            });
            dispatch(clearAttendanceStatus());
        }
    }, [clockInSuccess, clockInError, dispatch]);

    useEffect(() => {
        if (clockOutSuccess) {
            addToast({
                title: "Success",
                description: "Clocked out successfully",
                color: "success"
            });
            dispatch(clearAttendanceStatus());
        }
        if (clockOutError) {
            addToast({
                title: "Error",
                description: clockOutError,
                color: "danger"
            });
            dispatch(clearAttendanceStatus());
        }
    }, [clockOutSuccess, clockOutError, dispatch]);

    const handleClockIn = () => {
        const now = new Date();
        const payload = {
            date: format(now, "yyyy-MM-dd"),
            clock_in: now.toISOString(),
            device_type: "Web",
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
    const relevantRecord = attendanceHistory?.find((record: any) =>
        record.date === format(new Date(), "yyyy-MM-dd")
    );

    const isTodayClockIn = !!relevantRecord && !!relevantRecord.clock_in;
    const isTodayClockOut = !!relevantRecord?.clock_out;

    // Timer Logic for Today's Work
    useEffect(() => {
        const calculateElapsed = () => {
            // 1. Start with base from props (converted to seconds)
            let totalSeconds = data.work_hours.today * 3600;

            // 2. If we have a local record for today, prioritize its data for the live session
            // Note: If the backend 'today' hours already include the COMPLETED part of today, we shouldn't add it again.
            // However, usually 'data' is a snapshot.
            // Let's assume 'data.work_hours.today' is the correct historical total.
            // We adding the current *active* session duration if applicable.

            if (relevantRecord && relevantRecord.clock_in && !relevantRecord.clock_out) {
                const clockInTime = new Date(relevantRecord.clock_in).getTime();
                const now = new Date().getTime();
                const diffSeconds = Math.floor((now - clockInTime) / 1000);
                totalSeconds += diffSeconds;
            }
            setElapsedSeconds(totalSeconds);
        };

        calculateElapsed(); // Initial calculation

        const timer = setInterval(calculateElapsed, 1000);

        return () => clearInterval(timer);
    }, [data.work_hours.today, relevantRecord]);


    // Helper to format seconds to HH:MM:SS
    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!data) return null;

    return (
        <div className="font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 px-1">
                <div className="flex-1">
                    <PageHeader
                        title={data.greeting.greeting_text}
                        description={data.greeting.message}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full md:w-auto">
                    {/* Buttons Section */}
                    {!isMobileDevice && (
                        <div className="hidden sm:flex items-center justify-between sm:justify-end gap-3 order-2 sm:order-1">
                            {relevantRecord?.status === 'Leave' && relevantRecord?.attendance_status !== 'Half Day' ? (
                                <Button
                                    className="cursor-default opacity-100 font-semibold w-full sm:w-auto"
                                    variant="flat"
                                    color="secondary"
                                    size="md"
                                    startContent={<Plane size={20} />}
                                    disableAnimation
                                >
                                    On Leave
                                </Button>
                            ) : !isTodayClockIn && (user?.work_mode === 'Remote' || user?.work_mode === 'Hybrid') ? (
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    {relevantRecord?.attendance_status === 'Half Day' && (
                                        <Chip color="primary" variant="flat" size="sm" className="font-semibold px-2 h-8">
                                            Half Day
                                        </Chip>
                                    )}
                                    <Button
                                        color="primary"
                                        size="md"
                                        startContent={clockInLoading ? null : <Clock size={20} />}
                                        onPress={handleClockIn}
                                        isLoading={clockInLoading}
                                        className="shadow-lg shadow-primary/40 font-semibold flex-1 sm:flex-none"
                                    >
                                        {clockInLoading ? "Clocking In..." : "Clock In"}
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
                                            startContent={clockOutLoading ? null : (relevantRecord?.device_type === 'Biometric' ? <Fingerprint size={20} /> : <LogOut size={20} />)}
                                            isLoading={clockOutLoading}
                                            className="font-semibold w-full sm:w-auto"
                                            isDisabled={relevantRecord?.device_type === 'Biometric'}
                                        >
                                            {relevantRecord?.device_type === 'Biometric' ? "Biometric Clocked" : (clockOutLoading ? "Getting Location..." : "Clock Out")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="px-1 py-2 w-56">
                                            <div className="text-small font-bold">Confirmation</div>
                                            <div className="text-tiny mt-1">Are you sure you want to clock out?</div>
                                            <div className="flex gap-2 mt-3 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => setIsClockOutPopoverOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
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
                                    className="cursor-default opacity-100 font-semibold w-full sm:w-auto"
                                    variant="flat"
                                    color="success"
                                    size="md"
                                    startContent={<CheckCircle size={20} />}
                                    disableAnimation
                                >
                                    Done for Today
                                </Button>
                            ) : null}
                        </div>
                    )}

                    {/* Clock Section */}
                    <div className="text-left sm:text-right border-l-0 sm:border-l sm:pl-6 border-slate-200 dark:border-white/10 order-1 sm:order-2">
                        <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            {currentDate ? format(currentDate, "hh:mm:ss a") : "--:--:-- --"}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-500">
                            {currentDate ? format(currentDate, "EEEE, MMM d, yyyy") : ""}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                {/* --- Column 1: Profile & Quick Stats (Span 4) --- */}
                <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
                    {/* Profile Card */}
                    <Card className="shadow-none border-none bg-transparent w-full h-[260px] relative overflow-hidden rounded-2xl group">
                        {/* Background Image or Placeholder */}
                        {data.profile.profile_picture ? (
                            <img
                                src={data.profile.profile_picture?.replace("host.docker.internal", "localhost")}
                                alt={data.profile.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-default-100 to-default-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center">
                                <UserIcon size={64} className="text-default-300 dark:text-neutral-700" />
                            </div>
                        )}

                        {/* Gradient Overlay - Smooth fade at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

                        {/* Status Chip - Top Left */}
                        <div className="absolute top-4 left-4 z-20">
                            <Chip
                                className="capitalize font-bold text-[10px] h-5"
                                color={data.profile.status === "Active" ? "success" : "warning"}
                                variant="solid"
                                size="sm"
                            >
                                {data.profile.status || "Active"}
                            </Chip>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{data.profile.name}</h2>
                                <p className="text-white/80 text-sm font-medium tracking-wide mt-1">
                                    {data.profile.designation}
                                </p>
                            </div>
                        </div>
                    </Card>


                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md rounded-2xl">
                        <CardHeader className="flex justify-between items-center px-6 pt-5 pb-0">
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Work Hours</h3>
                            </div>
                            <Clock size={16} className="text-slate-400" />
                        </CardHeader>
                        <CardBody className="px-6 py-6">
                            <div className="flex items-center gap-6">
                                {/* Circular Progress Gauge */}
                                <div className="relative flex-shrink-0">
                                    <CircularProgress
                                        aria-label="Daily Goal"
                                        size="lg"
                                        value={Math.min((elapsedSeconds / (9 * 3600)) * 100, 100)}
                                        color="primary"
                                        showValueLabel={false}
                                        classNames={{
                                            svg: "w-24 h-24 transform -rotate-90",
                                            indicator: "stroke-slate-800 dark:stroke-white",
                                            track: "stroke-slate-100 dark:stroke-white/10",
                                        }}
                                        strokeWidth={2.5}
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-lg font-bold text-slate-800 dark:text-white leading-none">
                                            {Math.round(Math.min((elapsedSeconds / (9 * 3600)) * 100, 100))}%
                                        </span>
                                    </div>
                                </div>

                                {/* Today Time */}
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tighter">
                                            {formatDuration(elapsedSeconds)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Today's Session</p>
                                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/10">
                                        <Target size={10} className="text-primary" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Goal: 9h</span>
                                    </div>
                                </div>
                            </div>

                            {/* Week/Month Stats Grid */}
                            <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-50 dark:border-white/5">
                                <div>
                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.work_hours.this_week}h</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">This Week</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.work_hours.this_month}h</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">This Month</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                     
                        <Card className="shadow-sm border-none bg-pink-50/50 dark:bg-pink-500/10 rounded-2xl">
                            <CardHeader className="px-5 pt-5 pb-0 flex gap-2 items-center">
                                <div className="p-1.5 bg-pink-100 dark:bg-pink-500/20 rounded-lg text-pink-500">
                                    <Bell size={16} />
                                </div>
                                <h3 className="font-bold text-pink-900 dark:text-pink-300 text-sm">Today's Birthdays</h3>
                            </CardHeader>
                            <CardBody className="px-5 py-4">
                                {(data.birthdays || []).length > 0 ? (
                                    (data.birthdays || []).map((b, i) => (
                                        <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                                            <User
                                                name={b.name}
                                                description={<span className="text-pink-600 dark:text-pink-400 text-xs font-medium">{b.date}</span>}
                                                avatarProps={{ src: b.profile_picture, size: "sm" }}
                                                classNames={{ name: "text-sm font-semibold text-slate-700 dark:text-slate-200" }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-2 text-center">
                                        <p className="text-xs text-pink-700/60 dark:text-pink-300/40 italic font-medium">No birthdays today</p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
            
                </div>


                {/* --- Column 2: Stats & Metrics (Span 5) --- */}
                <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-4">
                    {/* Attendance Overview Card (Premium Style) */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md overflow-visible rounded-2xl">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Monthly Attendance</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Total: {displayMetrics.total_working_days} Working Days
                                </p>
                            </div>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-500">
                                <CheckCircle size={20} />
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 py-4 space-y-6">
                            {/* Main Visual Row */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                                {/* Activity Rings Chart for Attendance (4 Rings) */}
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                                        {/* --- Ring 1: Present (Outer) --- */}
                                        <circle cx="64" cy="64" r="60" stroke="#d1fae5" strokeWidth="8" fill="none" className="opacity-30 dark:stroke-emerald-500/10" />
                                        <circle
                                            cx="64" cy="64" r="60"
                                            stroke="#10b981"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={377}
                                            strokeDashoffset={377 - (377 * (displayMetrics.present_days / (displayMetrics.total_working_days || 1)))}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />

                                        {/* --- Ring 2: On Time --- */}
                                        <circle cx="64" cy="64" r="48" stroke="#ccfbf1" strokeWidth="8" fill="none" className="opacity-30 dark:stroke-teal-500/10" />
                                        <circle
                                            cx="64" cy="64" r="48"
                                            stroke="#14b8a6"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={301}
                                            strokeDashoffset={301 - (301 * ((displayMetrics.on_time_days ?? (displayMetrics.present_days - displayMetrics.late_days)) / (displayMetrics.total_working_days || 1)))}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />

                                        {/* --- Ring 3: Late --- */}
                                        <circle cx="64" cy="64" r="36" stroke="#ffedd5" strokeWidth="8" fill="none" className="opacity-30 dark:stroke-orange-500/10" />
                                        <circle
                                            cx="64" cy="64" r="36"
                                            stroke="#f97316"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={226}
                                            strokeDashoffset={226 - (226 * (displayMetrics.late_days / (displayMetrics.total_working_days || 1)))}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />

                                        {/* --- Ring 4: Leave (Inner) --- */}
                                        <circle cx="64" cy="64" r="24" stroke="#fef3c7" strokeWidth="8" fill="none" className="opacity-30 dark:stroke-amber-500/10" />
                                        <circle
                                            cx="64" cy="64" r="24"
                                            stroke="#f59e0b"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={151}
                                            strokeDashoffset={151 - (151 * (displayMetrics.leave_days / (displayMetrics.total_working_days || 1)))}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>

                                    {/* Central Icon */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <div className="bg-white dark:bg-white/10 p-1.5 rounded-full shadow-sm text-emerald-500">
                                            <Fingerprint size={16} className="text-emerald-500 dark:text-emerald-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats List */}
                                <div className="flex-1 w-full flex flex-col gap-2.5 pl-0 sm:pl-2">

                                    {/* Present */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck size={10} className="text-emerald-500" />
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Present</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                                {displayMetrics.present_days}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full h-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 rounded-full" 
                                                    style={{ width: `${(displayMetrics.present_days / (displayMetrics.total_working_days || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 w-8 text-right">
                                                {Math.round((displayMetrics.present_days / (displayMetrics.total_working_days || 1)) * 100)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* On Time */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle size={10} className="text-teal-500" />
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">On Time</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                                {displayMetrics.on_time_days ?? (displayMetrics.present_days - displayMetrics.late_days)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full h-1 bg-teal-100 dark:bg-teal-500/20 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-teal-500 rounded-full" 
                                                    style={{ width: `${((displayMetrics.on_time_days ?? (displayMetrics.present_days - displayMetrics.late_days)) / (displayMetrics.total_working_days || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400 w-8 text-right">
                                                {Math.round(((displayMetrics.on_time_days ?? (displayMetrics.present_days - displayMetrics.late_days)) / (displayMetrics.total_working_days || 1)) * 100)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Late */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={10} className="text-orange-500" />
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Late</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{displayMetrics.late_days}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full h-1 bg-orange-100 dark:bg-orange-500/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500 rounded-full"
                                                    style={{ width: `${(displayMetrics.late_days / (displayMetrics.total_working_days || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 w-8 text-right">
                                                {Math.round((displayMetrics.late_days / (displayMetrics.total_working_days || 1)) * 100)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Leaves */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <Plane size={10} className="text-amber-500" />
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Leaves</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{displayMetrics.leave_days}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full h-1 bg-amber-100 dark:bg-amber-500/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-500 rounded-full"
                                                    style={{ width: `${(displayMetrics.leave_days / (displayMetrics.total_working_days || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 w-8 text-right">
                                                {Math.round((displayMetrics.leave_days / (displayMetrics.total_working_days || 1)) * 100)}%
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Leave, Holiday, Half Day & Permission Grid - Moved to new row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                                <div className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-100/50 dark:border-rose-500/20 text-center">
                                    <span className="block text-xs font-bold text-rose-700 dark:text-rose-400">{displayMetrics.absent_days}</span>
                                    <span className="text-[9px] text-rose-600/70 uppercase">Absent</span>
                                </div>
                                <div className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-100/50 dark:border-purple-500/20 text-center">
                                    <span className="block text-xs font-bold text-purple-700 dark:text-purple-400">{displayMetrics.holiday_days}</span>
                                    <span className="text-[9px] text-purple-600/70 uppercase">Holidays</span>
                                </div>
                                <div className="px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-100/50 dark:border-teal-500/20 text-center">
                                    <span className="block text-xs font-bold text-teal-700 dark:text-teal-400">{(displayMetrics as any).half_day_days ?? 0}</span>
                                    <span className="text-[9px] text-teal-600/70 uppercase">Half Day</span>
                                </div>
                                <div className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100/50 dark:border-indigo-500/20 text-center">
                                    <span className="block text-xs font-bold text-indigo-700 dark:text-indigo-400">{(displayMetrics as any).permission_days ?? 0}</span>
                                    <span className="text-[9px] text-indigo-600/70 uppercase">Permission</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Ultra-Compact Leave Insights Card */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md rounded-2xl">
                        <CardHeader className="flex justify-between items-center px-6 pt-5 pb-0 border-none">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary-50 dark:bg-primary-500/10 rounded-lg text-primary">
                                    <Plane size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Leave Credits</h3>
                            </div>
                            <Link href="/leave-management/request" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                                Manage
                                <ArrowUpRight size={12} />
                            </Link>
                        </CardHeader>
                        <CardBody className="px-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                                {data.leave_insights.details.map((leave, idx) => (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{leave.type}</span>
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900 dark:text-white">
                                                <span>{leave.available}</span>
                                                <span className="text-slate-300 dark:text-slate-600 font-normal">/</span>
                                                <span className="text-slate-400 dark:text-slate-500">{leave.total}</span>
                                            </div>
                                        </div>
                                        <div className="relative w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`absolute top-0 left-0 h-full rounded-full ${
                                                    leave.available === 0 ? 'bg-rose-500' : 'bg-primary'
                                                }`}
                                                style={{ width: `${(leave.used / (leave.total || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>









                </div>


                {/* --- Column 3: Stats & Lists (Span 3) --- */}
                <div className="md:col-span-12 lg:col-span-4 flex flex-col justify-between h-full min-h-full gap-8">

                    {/* Accordion Group for Task Overview and Active Projects */}
                    <Accordion 
                        variant="splitted"
                        className="px-0 gap-4"
                        selectionMode="multiple"
                        itemClasses={{
                            base: "bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md border border-slate-100 dark:border-white/5 shadow-sm rounded-2xl group",
                            title: "font-semibold text-slate-800 dark:text-slate-100",
                            // trigger: "px-6 py-4",
                            // content: "px-6 pb-6 pt-0",
                            indicator: "text-slate-400"
                        }}
                    >
                        {/* Task Overview Item */}
                        <AccordionItem
                            key="task-overview"
                            aria-label="Task Overview"
                            title="Task Overview"
                            subtitle={`${data.task_metrics.total_assigned} Assigned Tasks`}
                            startContent={
                                <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary">
                                    <ListTodo size={18} />
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-4 mt-2">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-bold">Metrics Overview</p>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                            {data.task_metrics.total_assigned}
                                        </span>
                                        <span className="text-slate-400 text-[10px] ml-1 uppercase font-bold">Tasks</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-around gap-2 mb-4">
                                    {/* Activity Rings Chart */}
                                    <div className="relative w-32 h-32 flex-shrink-0">
                                        <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                                            {/* --- Ring 1: Completed (Outer) --- */}
                                            <circle cx="64" cy="64" r="56" stroke="#d1fae5" strokeWidth="8" fill="none" className="opacity-30 dark:stroke-emerald-500/10" />
                                            <circle
                                                cx="64" cy="64" r="56"
                                                stroke="#10b981"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray={352}
                                                strokeDashoffset={352 - (352 * (data.task_metrics.completed / (data.task_metrics.total_assigned || 1)))}
                                                strokeLinecap="round"
                                            />

                                            {/* --- Ring 2: Pending (Middle) --- */}
                                            <circle cx="64" cy="64" r="42" stroke="#ffedd5" strokeWidth="8" fill="none" className="opacity-30 dark:stroke-orange-500/10" />
                                            <circle
                                                cx="64" cy="64" r="42"
                                                stroke="#f97316"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray={264}
                                                strokeDashoffset={264 - (264 * (data.task_metrics.pending / (data.task_metrics.total_assigned || 1)))}
                                                strokeLinecap="round"
                                            />

                                            {/* --- Ring 3: In Progress (Inner) --- */}
                                            <circle cx="64" cy="64" r="28" stroke="#dbeafe" strokeWidth="8" fill="none" className="opacity-30 dark:stroke-blue-500/10" />
                                            <circle
                                                cx="64" cy="64" r="28"
                                                stroke="#3b82f6"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray={176}
                                                strokeDashoffset={176 - (176 * (data.task_metrics.in_progress / (data.task_metrics.total_assigned || 1)))}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <div className="bg-white dark:bg-white/10 p-2 rounded-full shadow-sm text-primary">
                                                <ListTodo size={20} className="text-primary dark:text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legend Stats */}
                                    <div className="flex flex-col gap-2.5 min-w-[120px]">
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle size={10} className="text-emerald-500" />
                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completed</span>
                                                </div>
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{data.task_metrics.completed}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full h-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(data.task_metrics.completed / (data.task_metrics.total_assigned || 1)) * 100}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 w-8 text-right">{Math.round((data.task_metrics.completed / (data.task_metrics.total_assigned || 1)) * 100)}%</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={10} className="text-orange-500" />
                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pending</span>
                                                </div>
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{data.task_metrics.pending}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full h-1 bg-orange-100 dark:bg-orange-500/20 rounded-full overflow-hidden">
                                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(data.task_metrics.pending / (data.task_metrics.total_assigned || 1)) * 100}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 w-8 text-right">{Math.round((data.task_metrics.pending / (data.task_metrics.total_assigned || 1)) * 100)}%</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Activity size={10} className="text-blue-500" />
                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">In Progress</span>
                                                </div>
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{data.task_metrics.in_progress}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full h-1 bg-blue-100 dark:bg-blue-500/20 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(data.task_metrics.in_progress / (data.task_metrics.total_assigned || 1)) * 100}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 w-8 text-right">{Math.round((data.task_metrics.in_progress / (data.task_metrics.total_assigned || 1)) * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {data.task_metrics.overdue > 0 && (
                                    <div className="flex items-center justify-between bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-2 rounded-xl transition-none">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full">
                                                <AlertCircle size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-red-800 dark:text-red-300 uppercase tracking-wide">Attention Needed</p>
                                                <p className="text-[9px] text-red-600 dark:text-red-400 font-medium">{data.task_metrics.overdue} Tasks Overdue</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AccordionItem>

                        {/* Active Projects Item */}
                        <AccordionItem
                            key="active-projects"
                            aria-label="Active Projects"
                            title="Active Projects"
                            subtitle={`${(data.projects || []).length} Active Projects`}
                            startContent={
                                <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary">
                                    <Briefcase size={18} />
                                </div>
                            }
                        >
                            <div className="space-y-4 mt-2">
                                {(data.projects || []).map((project, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm border border-slate-100 dark:border-white/10">
                                                {project.logo ? (
                                                    <Image
                                                        removeWrapper
                                                        alt={project.name}
                                                        className="w-full h-full object-cover"
                                                        src={project.logo.replace("host.docker.internal", "localhost")}
                                                    />
                                                ) : (
                                                    project.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-none">{project.name}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{project.role}</p>
                                            </div>
                                        </div>
                                        <div className={`text-[10px] font-medium px-2 py-1 rounded-full ${project.status.toLowerCase().includes('progress') ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                            project.status.toLowerCase().includes('completed') ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                                            }`}>
                                            {project.status}
                                        </div>
                                    </div>
                                ))}
                                {(data.projects || []).length === 0 && <p className="text-sm text-slate-400 italic">No active projects.</p>}
                            </div>
                        </AccordionItem>

                        {/* Upcoming Holidays Item */}
                        <AccordionItem
                            key="upcoming-holidays"
                            aria-label="Upcoming Holidays"
                            title="Upcoming Holidays"
                            subtitle={`${(data.upcoming_holidays || []).length} Scheduled Holidays`}
                            startContent={
                                <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary">
                                    <Calendar size={18} />
                                </div>
                            }
                        >
                            <div className="space-y-4 mt-2">
                                {(data.upcoming_holidays || []).length > 0 ? (
                                    (data.upcoming_holidays || []).slice(0, 3).map((holiday, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group cursor-default">
                                            <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary border border-primary-100 dark:border-primary-500/20">
                                                <span className="text-[9px] font-bold uppercase leading-none tracking-wider">{new Date(holiday.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                <span className="text-lg font-bold leading-none mt-0.5">{new Date(holiday.date).getDate()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{holiday.name}</p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{new Date(holiday.date).toLocaleDateString(undefined, { weekday: 'long' })}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-2 text-center">
                                        <p className="text-sm text-slate-400 italic">No upcoming holidays</p>
                                    </div>
                                )}
                            </div>
                        </AccordionItem>

                    </Accordion>











                    {/* Blog / News Feed */}
                    {blogs && blogs.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">Blogs</h3>
                                <Link href="/feeds" className="text-xs font-bold text-primary hover:text-primary-600 transition-colors flex items-center gap-1">
                                    View All
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>

                            {blogs.slice(0, 1).map((blog, i) => (
                                <Link href={`/feeds/${blog.id}`} key={i} className="block group">
                                    <Card
                                        className="bg-white dark:bg-[#1a1a1a] border border-transparent p-2 group cursor-pointer rounded-2xl"
                                        style={{
                                            boxShadow: '0px 0.6px 0.6px 0px rgba(0,0,0,0.02), 0px 2px 2px 0px rgba(0,0,0,0.04), 0px 4px 10px 0px rgba(0,0,0,0.06)'
                                        }}
                                        isPressable={false}
                                    >
                                        {/* Card Image Area */}
                                        <div className="relative w-full aspect-[2/1] overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800">
                                            <Image
                                                removeWrapper
                                                alt={blog.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ease-out"
                                                src={blog.cover_image?.replace("host.docker.internal", "localhost") || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"}
                                            />
                                            {/* Status Only if needed, maybe skip for dashboard or keep minimal */}
                                        </div>

                                        <CardBody className="px-3 pt-3 pb-2 flex flex-col gap-1.5">
                                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2">
                                                {blog.title}
                                            </h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                                                {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').slice(0, 100) + "..." || "No description"}
                                            </p>
                                        </CardBody>

                                        <CardFooter className="px-3 pb-2 pt-0">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2">
                                                    <Avatar
                                                        src={blog.author?.avatar?.replace("host.docker.internal", "localhost")}
                                                        name={blog.author?.name || "Admin"}
                                                        className="w-5 h-5 text-[9px]"
                                                    />
                                                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[100px]">
                                                        {blog.author?.name || "Admin"}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-400">
                                                    {new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}


                </div>



            </div>
        </div>
    );
}
