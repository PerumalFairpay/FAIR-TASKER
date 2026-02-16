"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import {
    Briefcase, Calendar, Clock, CheckCircle,
    LayoutDashboard, Bell, Search, Menu,
    MoreVertical, ArrowUpRight, Sun, Moon,
    Activity, ShieldCheck, AlertCircle, Target, ListTodo,
    Bug, Users, ClipboardList, LogOut,
    Award, RefreshCw, Ban, Baby, FileText, HeartPulse
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
        holiday_days: number;
        leave_days: number;
        total_working_days: number;
    };
    leave_details: {
        summary: {
            total_allowed: number;
            total_taken: number;
            total_remaining: number;
            pending_requests: number;
        };
        balance: Array<{
            type: string;
            balance: number;
            total: number;
            used: number;
        }>;
        recent_requests_status: Array<{
            type: string;
            status: string;
            date: string;
        }>;
    };
    projects: Array<{
        name: string;
        role: string;
        status: string;
        deadline: string;
    }>;
    task_metrics: {
        total_assigned: number;
        pending: number;
        in_progress: number;
        completed: number;
        overdue: number;
    };
    recent_tasks: Array<{
        task_name: string;
        priority: string;
        status: string;
        due_date: string;
    }>;
    recent_activity: Array<{
        type: string;
        message: string;
        time: string;
    }>;
    upcoming_holidays: Array<{
        name: string;
        date: string;
    }>;
    birthdays: Array<{
        name: string;
        date: string;
        profile_picture: string;
    }>;
}

// --- Component ---

// --- Component ---

export default function EmployeeDashboard({ data, blogs, isViewOnly = false }: { data: DashboardData; blogs: any[]; isViewOnly?: boolean }) {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isClockOutPopoverOpen, setIsClockOutPopoverOpen] = useState(false);

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
        clockOutError
    } = useSelector((state: AppState) => state.Attendance);

    const { user } = useSelector((state: AppState) => state.Auth);

    useEffect(() => {
        if (!isViewOnly) {
            dispatch(getMyAttendanceHistoryRequest());
        }
    }, [dispatch, isViewOnly]);

    // Handle Clock In/Out Toasts
    useEffect(() => {
        if (clockInSuccess) {
            addToast({
                title: "Success",
                description: "Clocked in successfully",
                color: "success"
            });
            dispatch(clearAttendanceStatus());
            dispatch(getMyAttendanceHistoryRequest());
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
            dispatch(getMyAttendanceHistoryRequest());
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
            location: "Web Portal",
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
    const relevantRecord = !isViewOnly ? attendanceHistory?.find((record: any) =>
        record.date === format(new Date(), "yyyy-MM-dd")
    ) : null;

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
        <div className="min-h-screen  font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {data.greeting.greeting_text}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
                        {data.greeting.message}
                    </p>
                </div>

                <div className="hidden sm:flex items-center gap-6">
                    {/* Buttons Section */}
                    {!isViewOnly && (
                        <div>
                            {relevantRecord?.status === 'Leave' ? (
                                <Button
                                    className="cursor-default opacity-100 font-semibold"
                                    variant="flat"
                                    color="warning"
                                    size="lg"
                                    startContent={<Calendar size={20} />}
                                    disableAnimation
                                >
                                    On Leave
                                </Button>
                            ) : !isTodayClockIn && user?.work_mode === 'Remote' ? (
                                <Button
                                    color="primary"
                                    size="lg"
                                    startContent={<Clock size={20} />}
                                    onPress={handleClockIn}
                                    isLoading={clockInLoading}
                                    className="shadow-lg shadow-primary/40 font-semibold"
                                >
                                    Clock In
                                </Button>
                            ) : !isTodayClockOut && user?.work_mode === 'Remote' ? (
                                <Popover
                                    isOpen={isClockOutPopoverOpen}
                                    onOpenChange={setIsClockOutPopoverOpen}
                                    placement="bottom"
                                    showArrow
                                >
                                    <PopoverTrigger>
                                        <Button
                                            color="warning"
                                            size="lg"
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
                                    className="cursor-default opacity-100 font-semibold"
                                    variant="flat"
                                    color="success"
                                    size="lg"
                                    startContent={<CheckCircle size={20} />}
                                    disableAnimation
                                >
                                    Done for Today
                                </Button>
                            ) : null}
                        </div>
                    )}

                    {/* Clock Section */}
                    <div className="text-right border-l pl-6 border-slate-200 dark:border-white/10">
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            {currentDate ? format(currentDate, "hh:mm:ss a") : "--:--:-- --"}
                        </div>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                            {currentDate ? format(currentDate, "EEEE, MMMM do yyyy") : ""}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* --- Column 1: Profile & Quick Stats (Span 4) --- */}
                <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
                    {/* Profile Card */}
                    <Card className="shadow-none border-none bg-transparent w-full h-[320px] relative overflow-hidden rounded-[40px] group">
                        {/* Background Image */}
                        <img
                            src={data.profile.profile_picture?.replace("host.docker.internal", "localhost")}
                            alt={data.profile.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Gradient Overlay - Smooth fade at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end z-10">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-3xl font-medium text-white tracking-wide">{data.profile.name}</h3>
                                <p className="text-white/90 text-sm font-light tracking-wide">{data.profile.designation} • {data.profile.department}</p>
                            </div>
                        </div>
                    </Card>


                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md h-auto">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Time Tracker</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Work efficiency metrics</p>
                            </div>
                            <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-full text-primary">
                                <Clock size={20} />
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 py-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
                                    {/* Circular Progress Placeholder - CSS based or SVG */}
                                    {/* Circular Progress Premium */}
                                    <svg className="w-full h-full transform -rotate-90 group-hover:scale-105 transition-transform duration-500">
                                        <defs>
                                            <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#2563eb" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="64" cy="64" r="56" strokeWidth="12" fill="none" className="stroke-slate-100 dark:stroke-white/5" />
                                        <circle cx="64" cy="64" r="56" strokeWidth="12" fill="none"
                                            stroke="url(#timeGradient)"
                                            strokeDasharray={351}
                                            strokeDashoffset={351 - (351 * (Math.min(elapsedSeconds / 3600, 9) / 9))}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                            style={{ filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))" }}
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-xl font-bold text-slate-800 dark:text-white tabular-nums tracking-tight">
                                            {formatDuration(elapsedSeconds)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase mt-1">Today</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-center">
                                    <span className="block text-xl font-bold text-slate-700 dark:text-slate-200">{data.work_hours.this_week}h</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">This Week</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-center">
                                    <span className="block text-xl font-bold text-slate-700 dark:text-slate-200">{data.work_hours.this_month}h</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">This Month</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Projects List */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                        <CardHeader className="flex gap-3 px-5 pt-5 pb-2">
                            <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-lg text-primary">
                                <Briefcase size={18} />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 pt-1">Active Projects</h3>
                        </CardHeader>
                        <CardBody className="px-5 py-4">
                            <div className="space-y-4">
                                {(data.projects || []).map((project, i) => (
                                    <div key={i} className="flex items-center justify-between">

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm">
                                                {project.name.charAt(0)}
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
                        </CardBody>
                    </Card>

                    {/* Upcoming Holidays */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                        <CardHeader className="flex justify-between items-center px-5 pt-5 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary">
                                    <Calendar size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">Upcoming Holidays</h3>
                            </div>
                        </CardHeader>
                        <CardBody className="px-5 pb-5 pt-2 space-y-4">
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
                        </CardBody>
                    </Card>


                </div>


                {/* --- Column 2: Stats & Metrics (Span 5) --- */}
                <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
                    {/* Attendance Overview Card (Premium Style) */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md overflow-visible">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Monthly Attendance</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Total: {data.attendance_metrics.total_working_days} Working Days
                                </p>
                            </div>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-500">
                                <CheckCircle size={20} />
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 py-4 space-y-6">
                            {/* Main Visual Row */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pb-4 border-b border-slate-50 dark:border-white/5">
                                {/* Premium Gauge */}
                                <div className="relative w-48 h-48 flex-shrink-0 group">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <defs>
                                            <linearGradient id="monthPresentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#059669" />
                                            </linearGradient>
                                        </defs>

                                        {/* Background Ring */}
                                        <circle
                                            cx="96" cy="96" r="88"
                                            strokeWidth="12" fill="none"
                                            className="stroke-slate-100 dark:stroke-white/5"
                                        />

                                        {/* Present Ring */}
                                        <circle
                                            cx="96" cy="96" r="88"
                                            strokeWidth="12" fill="none"
                                            stroke="url(#monthPresentGradient)"
                                            className="transition-all duration-1500 ease-out"
                                            strokeDasharray={552}
                                            strokeDashoffset={552 - (552 * ((data.attendance_metrics.present_days / (data.attendance_metrics.total_working_days || 1)) || 0))}
                                            strokeLinecap="round"
                                            style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))" }}
                                        />
                                    </svg>

                                    {/* Central Info */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="relative flex flex-col items-center justify-center w-32 h-32 rounded-full bg-white/80 dark:bg-zinc-800/60 backdrop-blur-md shadow-lg border border-white/50 dark:border-white/5">
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                    {Math.round((data.attendance_metrics.present_days / (data.attendance_metrics.total_working_days || 1)) * 100)}
                                                </span>
                                                <span className="text-sm font-bold text-emerald-500">%</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Attendance</span>
                                        </div>
                                    </div>

                                    {/* Animated Marker Dot on the progress edge */}
                                    <div
                                        className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 transition-all duration-1500 ease-out z-10 pointer-events-none"
                                        style={{
                                            transform: `rotate(${(3.6 * ((data.attendance_metrics.present_days / (data.attendance_metrics.total_working_days || 1)) * 100)) - 90}deg) translate(88px) rotate(${90 - (3.6 * ((data.attendance_metrics.present_days / (data.attendance_metrics.total_working_days || 1)) * 100))}deg)`
                                        }}
                                    >
                                        <div className="w-full h-full bg-white dark:bg-emerald-500 border border-emerald-500 dark:border-white rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                                    </div>
                                </div>

                                {/* Stats List */}
                                <div className="flex-1 w-full flex flex-col gap-3 pl-0 sm:pl-2">
                                    {/* Present */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Present</span>
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{data.attendance_metrics.present_days} Days</span>
                                        </div>
                                        <Progress
                                            size="sm" radius="sm"
                                            classNames={{ base: "h-1.5", track: "bg-emerald-50 dark:bg-emerald-500/10", indicator: "bg-emerald-500" }}
                                            value={(data.attendance_metrics.present_days / (data.attendance_metrics.total_working_days || 1)) * 100}
                                        />
                                    </div>

                                    {/* On Time (Subset of Present) */}
                                    <div className="flex flex-col gap-1 pl-2 border-l-2 border-slate-100 dark:border-white/5">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">On Time</span>
                                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{data.attendance_metrics.on_time_days || (data.attendance_metrics.present_days - data.attendance_metrics.late_days)} Days</span>
                                        </div>
                                    </div>

                                    {/* Late */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Late</span>
                                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{data.attendance_metrics.late_days} Days</span>
                                        </div>
                                        <Progress
                                            size="sm" radius="sm"
                                            classNames={{ base: "h-1.5", track: "bg-orange-50 dark:bg-orange-500/10", indicator: "bg-orange-500" }}
                                            value={(data.attendance_metrics.late_days / (data.attendance_metrics.total_working_days || 1)) * 100}
                                        />
                                    </div>

                                    {/* Absent */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Absent</span>
                                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">{data.attendance_metrics.absent_days} Days</span>
                                        </div>
                                        <Progress
                                            size="sm" radius="sm"
                                            classNames={{ base: "h-1.5", track: "bg-rose-50 dark:bg-rose-500/10", indicator: "bg-rose-500" }}
                                            value={(data.attendance_metrics.absent_days / (data.attendance_metrics.total_working_days || 1)) * 100}
                                        />
                                    </div>

                                    {/* Leave & Holiday Row */}
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <div className="px-2 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-100/50 dark:border-amber-500/20 text-center">
                                            <span className="block text-xs font-bold text-amber-700 dark:text-amber-400">{data.attendance_metrics.leave_days}</span>
                                            <span className="text-[9px] text-amber-600/70 uppercase">Leaves</span>
                                        </div>
                                        <div className="px-2 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-100/50 dark:border-purple-500/20 text-center">
                                            <span className="block text-xs font-bold text-purple-700 dark:text-purple-400">{data.attendance_metrics.holiday_days}</span>
                                            <span className="text-[9px] text-purple-600/70 uppercase">Holidays</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Tasks Widget - Integrated with Data */}
                    <Card className="shadow-sm border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md relative overflow-visible min-h-[620px] rounded-[24px] flex flex-col">
                        {/* Top Section: Overview */}
                        <div className="px-8 pt-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 tracking-tight">Task Overview</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Completion Status</p>
                                </div>
                                <div className="p-2 bg-white dark:bg-white/5 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
                                    <span className="text-slate-800 dark:text-slate-100 font-bold px-1">{data.task_metrics.total_assigned} Total</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-around gap-2 mb-8 mt-2">
                                {/* Activity Rings Chart */}
                                <div className="relative w-44 h-44 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                                        {/* --- Ring 1: Completed (Outer) --- */}
                                        {/* Background */}
                                        <circle cx="88" cy="88" r="80" stroke="#d1fae5" strokeWidth="10" fill="none" className="opacity-30 dark:stroke-emerald-500/10" />
                                        {/* Progress */}
                                        <circle
                                            cx="88" cy="88" r="80"
                                            stroke="#10b981"
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray={502} // 2 * pi * 80
                                            strokeDashoffset={502 - (502 * (data.task_metrics.completed / (data.task_metrics.total_assigned || 1)))}
                                            strokeLinecap="round"
                                            className=""
                                        />

                                        {/* --- Ring 2: Pending (Middle) --- */}
                                        {/* Background */}
                                        <circle cx="88" cy="88" r="60" stroke="#ffedd5" strokeWidth="10" fill="none" className="opacity-30 dark:stroke-orange-500/10" />
                                        {/* Progress */}
                                        <circle
                                            cx="88" cy="88" r="60"
                                            stroke="#f97316" // Orange for visibility
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray={377} // 2 * pi * 60
                                            strokeDashoffset={377 - (377 * (data.task_metrics.pending / (data.task_metrics.total_assigned || 1)))}
                                            strokeLinecap="round"
                                            className=""
                                        />

                                        {/* --- Ring 3: In Progress (Inner) --- */}
                                        {/* Background */}
                                        <circle cx="88" cy="88" r="40" stroke="#dbeafe" strokeWidth="10" fill="none" className="opacity-30 dark:stroke-blue-500/10" />
                                        {/* Progress */}
                                        <circle
                                            cx="88" cy="88" r="40"
                                            stroke="#3b82f6"
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray={251} // 2 * pi * 40
                                            strokeDashoffset={251 - (251 * (data.task_metrics.in_progress / (data.task_metrics.total_assigned || 1)))}
                                            strokeLinecap="round"
                                            className=""
                                        />
                                    </svg>

                                    {/* Central Icon */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <div className="bg-white dark:bg-white/10 p-3 rounded-full shadow-sm text-primary">
                                            <ListTodo size={24} className="text-primary dark:text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Legend Stats */}
                                <div className="flex flex-col gap-4 min-w-[140px]">
                                    {/* Completed (Outer) */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completed</span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{data.task_metrics.completed}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full h-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(data.task_metrics.completed / (data.task_metrics.total_assigned || 1)) * 100}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 w-8 text-right">{Math.round((data.task_metrics.completed / (data.task_metrics.total_assigned || 1)) * 100)}%</span>
                                        </div>
                                    </div>

                                    {/* Pending (Middle) */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pending</span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{data.task_metrics.pending}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full h-1.5 bg-orange-100 dark:bg-orange-500/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(data.task_metrics.pending / (data.task_metrics.total_assigned || 1)) * 100}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 w-8 text-right">{Math.round((data.task_metrics.pending / (data.task_metrics.total_assigned || 1)) * 100)}%</span>
                                        </div>
                                    </div>

                                    {/* In Progress (Inner) */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">In Progress</span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{data.task_metrics.in_progress}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full h-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(data.task_metrics.in_progress / (data.task_metrics.total_assigned || 1)) * 100}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 w-8 text-right">{Math.round((data.task_metrics.in_progress / (data.task_metrics.total_assigned || 1)) * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Overdue Alert Banner */}
                            {data.task_metrics.overdue > 0 && (
                                <div className="flex items-center justify-between bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-3 rounded-2xl mb-2 transition-none">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full">
                                            <AlertCircle size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wide">Attention Needed</p>
                                            <p className="text-[10px] text-red-600 dark:text-red-400 font-medium">{data.task_metrics.overdue} Tasks Overdue</p>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* Bottom Section: Dark Task Card */}
                        <div className="bg-gradient-to-br from-[#18181b] to-black border border-white/10 rounded-[28px] p-7 text-white flex flex-col mx-1 mb-2 flex-1 mt-auto relative overflow-hidden">
                            {/* Decorative Background Glow */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

                            {/* Header */}
                            <div className="relative flex justify-between items-end mb-8 mt-1 px-1 z-10">
                                <div>
                                    <h3 className="text-xl font-light text-slate-200 tracking-wide">My Tasks</h3>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1 font-medium">Pending Priorities</p>
                                </div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-4xl font-extralight text-white tracking-tight">
                                        {data.task_metrics.completed}
                                    </span>
                                    <span className="text-lg font-light text-slate-500">
                                        /{data.task_metrics.total_assigned}
                                    </span>
                                </div>
                            </div>

                            {/* Task List */}
                            <div className="relative space-y-3 pr-1 z-10 mt-2">
                                {data.recent_tasks.slice(0, 5).map((task, idx) => {
                                    const isCompleted = task.status.toLowerCase() === 'completed';
                                    const isInProgress = task.status.toLowerCase() === 'in progress';
                                    const isBug = task.task_name.toLowerCase().includes('bug');
                                    const isMeeting = task.task_name.toLowerCase().includes('meeting');

                                    return (
                                        <div key={idx} className="group flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:shadow-lg hover:shadow-black/20 cursor-default">
                                            {/* Icon Circle */}
                                            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCompleted
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : isInProgress
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-zinc-800 text-zinc-400'
                                                }`}>

                                                {/* Icons with dynamic stroke */}
                                                {isBug ? <Bug size={18} strokeWidth={isCompleted ? 2.5 : 2} /> :
                                                    isMeeting ? <Users size={18} strokeWidth={isCompleted ? 2.5 : 2} /> :
                                                        <ClipboardList size={18} strokeWidth={isCompleted ? 2.5 : 2} />}
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <p className={`text-sm font-medium truncate ${isCompleted ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-100 group-hover:text-white'
                                                        }`}>
                                                        {task.task_name}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                                                        <Calendar size={12} className={isCompleted ? "opacity-50" : "text-zinc-400"} />
                                                        <span className={isCompleted ? "opacity-50" : ""}>
                                                            {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>

                                                    <div className={`h-1 w-1 rounded-full bg-zinc-700`}></div>

                                                    <div className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border ${task.priority.toLowerCase() === 'high'
                                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'
                                                        }`}>
                                                        {task.priority}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Indicator (Right Side) */}
                                            <div className="pl-2">
                                                {isCompleted ? (
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                                        <CheckCircle size={14} className="text-emerald-400" />
                                                    </div>
                                                ) : isInProgress ? (
                                                    <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center relative shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border-2 border-zinc-700/50 group-hover:border-zinc-500"></div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>

                    {/* Recent Activity Feed (Redesigned) */}
                    <Card className="shadow-none border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md min-h-[300px] flex flex-col">
                        <CardHeader className="px-6 pt-6 pb-2 flex justify-between items-center bg-white dark:bg-transparent border-b border-slate-50 dark:border-white/5">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide flex items-center gap-2">
                                <Activity size={16} className="text-slate-400 dark:text-slate-500" />
                                Activity Feed
                            </h3>

                        </CardHeader>
                        <CardBody className="px-6 py-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-0">
                                {data.recent_activity.map((act, i) => {
                                    const isTask = act.type === 'task';
                                    const dateObj = new Date(act.time);
                                    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

                                    return (
                                        <div key={i} className="flex gap-4 group relative">
                                            {/* Timeline Line */}
                                            {i !== data.recent_activity.length - 1 && (
                                                <div className="absolute left-[15px] top-8 bottom-[-8px] w-[2px] bg-slate-100 dark:bg-slate-800"></div>
                                            )}

                                            {/* Icon */}
                                            <div className="relative z-10 flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border ${isTask
                                                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-500'
                                                    : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-500'
                                                    }`}>
                                                    {isTask ? <CheckCircle size={14} strokeWidth={2.5} /> : <Calendar size={14} strokeWidth={2.5} />}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="pb-6 pt-0.5 flex-1 min-w-0">
                                                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-snug">
                                                    {act.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold bg-slate-100/50 dark:bg-white/5 px-1.5 py-0.5 rounded">
                                                        {dateStr}
                                                    </span>
                                                    <span className="text-[10px] text-slate-300 dark:text-slate-700">•</span>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                                        {timeStr}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {data.recent_activity.length === 0 && (
                                    <div className="text-center py-8 text-slate-400 text-sm">No recent activity</div>
                                )}
                            </div>
                        </CardBody>
                    </Card>



                </div>


                {/* --- Column 3: Stats & Lists (Span 3) --- */}
                <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">

                    {/* Birthdays */}
                    {data.birthdays.length > 0 && (
                        <Card className="shadow-sm border-none bg-pink-50/50 dark:bg-pink-500/10">
                            <CardHeader className="px-5 pt-5 pb-0 flex gap-2 items-center">
                                <div className="p-1.5 bg-pink-100 dark:bg-pink-500/20 rounded-lg text-pink-500">
                                    <Bell size={16} />
                                </div>
                                <h3 className="font-bold text-pink-900 dark:text-pink-300 text-sm">Today's Birthdays</h3>
                            </CardHeader>
                            <CardBody className="px-5 py-4">
                                {data.birthdays.map((b, i) => (
                                    <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                                        <User
                                            name={b.name}
                                            description={<span className="text-pink-600 dark:text-pink-400 text-xs font-medium">{b.date}</span>}
                                            avatarProps={{ src: b.profile_picture, size: "sm" }}
                                            classNames={{ name: "text-sm font-semibold text-slate-700 dark:text-slate-200" }}
                                        />
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    )}

                    {/* Leave Balance Section */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                        <CardHeader className="flex justify-between px-6 pt-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Leave Balance</h3>
                        </CardHeader>
                        <CardBody className="px-6 py-4 space-y-5">
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="text-center px-2">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{data.leave_details.summary.total_allowed}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total</p>
                                </div>
                                <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/10"></div>
                                <div className="text-center px-2">
                                    <p className="text-2xl font-bold text-primary">{data.leave_details.summary.total_remaining}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Left</p>
                                </div>
                                <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/10"></div>
                                <div className="text-center px-2">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{data.leave_details.summary.total_taken}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Used</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {data.leave_details.balance.map((item, idx) => {
                                    const typeName = item.type.toLowerCase();

                                    let config = {
                                        icon: <Briefcase size={18} strokeWidth={2.5} />,
                                        bg: "bg-primary-50 dark:bg-primary-500/10",
                                        text: "text-primary",
                                        progressFrom: "from-primary-400",
                                        progressTo: "to-primary-600",
                                        shadow: "shadow-primary/25"
                                    };

                                    if (typeName.includes("sick")) {
                                        config = {
                                            icon: <HeartPulse size={18} strokeWidth={2.5} />, // Changed to HeartPulse for Sick
                                            bg: "bg-rose-50 dark:bg-rose-500/10",
                                            text: "text-rose-500",
                                            progressFrom: "from-rose-400",
                                            progressTo: "to-rose-600",
                                            shadow: "shadow-rose-200"
                                        };
                                    } else if (typeName.includes("casual")) {
                                        config = {
                                            icon: <Sun size={18} strokeWidth={2.5} />,
                                            bg: "bg-orange-50 dark:bg-orange-500/10",
                                            text: "text-orange-500",
                                            progressFrom: "from-orange-400",
                                            progressTo: "to-orange-600",
                                            shadow: "shadow-orange-200"
                                        };
                                    } else if (typeName.includes("earned") || typeName.includes("privilege")) {
                                        config = {
                                            icon: <Award size={18} strokeWidth={2.5} />,
                                            bg: "bg-emerald-50 dark:bg-emerald-500/10",
                                            text: "text-emerald-500",
                                            progressFrom: "from-emerald-400",
                                            progressTo: "to-emerald-600",
                                            shadow: "shadow-emerald-200"
                                        };
                                    } else if (typeName.includes("compensatory") || typeName.includes("comp")) {
                                        config = {
                                            icon: <RefreshCw size={18} strokeWidth={2.5} />,
                                            bg: "bg-cyan-50 dark:bg-cyan-500/10",
                                            text: "text-cyan-500",
                                            progressFrom: "from-cyan-400",
                                            progressTo: "to-cyan-600",
                                            shadow: "shadow-cyan-200"
                                        };
                                    } else if (typeName.includes("loss of pay") || typeName.includes("lop")) {
                                        config = {
                                            icon: <Ban size={18} strokeWidth={2.5} />,
                                            bg: "bg-slate-100 dark:bg-slate-700/30",
                                            text: "text-slate-500",
                                            progressFrom: "from-slate-400",
                                            progressTo: "to-slate-600",
                                            shadow: "shadow-slate-200"
                                        };
                                    } else if (typeName.includes("maternity") || typeName.includes("paternity")) {
                                        config = {
                                            icon: <Baby size={18} strokeWidth={2.5} />,
                                            bg: "bg-pink-50 dark:bg-pink-500/10",
                                            text: "text-pink-500",
                                            progressFrom: "from-pink-400",
                                            progressTo: "to-pink-600",
                                            shadow: "shadow-pink-200"
                                        };
                                    } else if (typeName.includes("permission")) {
                                        config = {
                                            icon: <FileText size={18} strokeWidth={2.5} />,
                                            bg: "bg-violet-50 dark:bg-violet-500/10",
                                            text: "text-violet-500",
                                            progressFrom: "from-violet-400",
                                            progressTo: "to-violet-600",
                                            shadow: "shadow-violet-200"
                                        };
                                    }

                                    return (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} ${config.text}`}>
                                                {config.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-end mb-1.5">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">{item.type}</span>
                                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{item.balance}/{item.total} Days</span>
                                                </div>
                                                <Progress
                                                    value={(item.balance / item.total) * 100}
                                                    size="sm"
                                                    radius="full"
                                                    classNames={{
                                                        track: "bg-slate-100 dark:bg-white/10 h-1.5",
                                                        indicator: `bg-gradient-to-r ${config.progressFrom} ${config.progressTo} ${config.shadow} h-1.5 shadow-sm`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Recent Leave Request Status */}
                            {data.leave_details.recent_requests_status.length > 0 && (
                                <div className="mt-6 pt-5 border-t border-slate-100/80 dark:border-white/10">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Recent Activity</p>
                                    </div>
                                    <div className="space-y-1">
                                        {data.leave_details.recent_requests_status.slice(0, 3).map((req, i) => {
                                            const isApproved = req.status.toLowerCase() === 'approved';
                                            const isPending = req.status.toLowerCase() === 'pending';
                                            const isRejected = req.status.toLowerCase() === 'rejected';

                                            return (
                                                <div key={i} className="group flex items-center gap-3 p-2 rounded-xl cursor-default border border-transparent hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-sm ${isApproved ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' :
                                                        isPending ? 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' :
                                                            'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'
                                                        }`}>
                                                        {isApproved ? <CheckCircle size={15} strokeWidth={2.5} /> :
                                                            isPending ? <Clock size={15} strokeWidth={2.5} /> :
                                                                <AlertCircle size={15} strokeWidth={2.5} />}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-0.5">
                                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{req.type}</p>
                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' :
                                                                isPending ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' :
                                                                    'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'
                                                                }`}>
                                                                {req.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                                            {new Date(req.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>





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

                            {blogs.slice(0, 3).map((blog, i) => (
                                <Link href={`/feeds/${blog.id}`} key={i} className="block group">
                                    <Card
                                        className="bg-white dark:bg-[#1a1a1a] border border-transparent p-2 group cursor-pointer"
                                        style={{
                                            borderRadius: "24px",
                                            boxShadow: '0px 0.6px 0.6px 0px rgba(0,0,0,0.02), 0px 2px 2px 0px rgba(0,0,0,0.04), 0px 4px 10px 0px rgba(0,0,0,0.06)'
                                        }}
                                        isPressable={false}
                                    >
                                        {/* Card Image Area */}
                                        <div className="relative w-full aspect-[2/1] overflow-hidden rounded-[16px] bg-slate-100 dark:bg-zinc-800">
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
