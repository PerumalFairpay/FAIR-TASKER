"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { User } from "@heroui/user";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import {
    Users, Briefcase, Calendar, CheckCircle, Clock, AlertCircle,
    Building, TrendingUp, TrendingDown, UserPlus, UserMinus, UserCheck, Gift, Activity, LayoutDashboard, ArrowUpRight, Bell
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogsRequest } from "@/store/blog/action";

interface AdminDashboardData {
    employee_analytics: {
        overview: {
            total_count: number;
            active_count: number;
            inactive_count: number;
            new_hires_this_month: number;
            new_hires_last_month: number;
            growth_rate_percentage: number;
            attrition_this_month: number;
            attrition_rate_percentage: number;
        };
        work_mode_distribution: {
            office: number;
            remote: number;
            hybrid: number;
            office_percentage: number;
            remote_percentage: number;
            hybrid_percentage: number;
        };
        recent_hires: Array<{
            id: string;
            name: string;
            email: string;
            profile_picture?: string;
            department: string;
            designation: string;
            date_of_joining: string;
        }>;
        upcoming_confirmations: Array<any>;
        upcoming_exits: Array<any>;
    };
    attendance_analytics: {
        today: {
            date: string;
            total_employees: number;
            present: number;
            absent: number;
            on_leave: number;
            late: number;
            present_percentage: number;
            avg_work_hours: number;
        };
        this_week: {
            avg_attendance_percentage: number;
            total_late_instances: number;
            avg_work_hours_per_day: number;
        };
        this_month: {
            total_late_instances: number;
            total_absences: number;
            avg_work_hours_per_day: number;
        };
        attendance_concerns: Array<{
            employee_id: string;
            name: string;
            profile_picture?: string;
            late_count: number;
            absent_days: number;
            concern_level: 'high' | 'medium';
        }>;
    };
    leave_analytics: {
        overview: {
            pending_requests: number;
            approved_today: number;
            total_leaves_this_month: number;
        };
        pending_requests: Array<{
            id: string;
            employee_name: string;
            leave_type: string;
            start_date: string;
            end_date: string;
            total_days: number;
            reason: string;
            applied_on: string;
        }>;
    };
    project_analytics: {
        overview: {
            total_projects: number;
            active_projects: number;
            completed_projects: number;
            on_hold_projects: number;
        };
    };
    task_analytics: {
        overview: {
            total_assigned: number;
            completed: number;
            in_progress: number;
            pending: number;
            overdue: number;
            completion_rate_percentage: number;
        };
        status_distribution: {
            todo: number;
            in_progress: number;
            in_review: number;
            completed: number;
            created: number;
        };
        priority_breakdown: {
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
        productivity_trends: {
            labels: string[];
            completed: number[];
            created: number[];
        };
        top_contributors: Array<{
            name: string;
            role: string;
            completed: number;
            efficiency: number;
        }>;
        recent_overdue_tasks: Array<{
            id: string;
            title: string;
            assigned_to: string;
            due_date: string;
            priority: string;
        }>;
    };
    alerts: {
        critical: Array<any>;
        warnings: Array<any>;
        info: Array<any>;
    };
    recent_activities: Array<{
        type: string;
        icon: string;
        message: string;
        timestamp: string;
        priority: string;
    }>;
    upcoming_events: {
        holidays: Array<{ name: string; date: string; days_until: number; type: string }>;
        birthdays: Array<{ name: string; date: string; days_until: number; profile_picture?: string }>;
        anniversaries: Array<{ name: string; date: string; days_until: number; years_completed: number; profile_picture?: string }>;
    };
}

const LegendItem = ({ label, color, value, percent }: { label: string, color: string, value: number, percent: number }) => (
    <div className="flex justify-between items-center group">
        <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${color} ring-4 ring-slate-100 group-hover:ring-slate-200 transition-all`}></span>
            <span className="text-sm text-slate-600 font-medium">{label}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800">{value}</span>
            <span className="text-[10px] text-slate-400">{percent}%</span>
        </div>
    </div>
);

export default function AdminDashboard({ data }: { data: AdminDashboardData }) {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const dispatch = useDispatch();
    // @ts-ignore
    const { blogs, getBlogsLoading } = useSelector((state: any) => state.Blog);

    useEffect(() => {
        // @ts-ignore
        dispatch(getBlogsRequest(1, 10));

        setCurrentDate(new Date());
        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, [dispatch]);

    if (!data) return null;

    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
                        Welcome back, here's your organization overview.
                    </p>
                </div>

                <div className="text-right hidden sm:block">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                        {currentDate ? format(currentDate, "hh:mm:ss a") : "--:--:-- --"}
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        {currentDate ? format(currentDate, "EEEE, MMMM do yyyy") : ""}
                    </div>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="flex flex-col lg:flex-row gap-6">

                <div className="w-full lg:w-5/12 flex flex-col gap-6">



                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Attendance Overview</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Daily Tracking & Insights</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                    {data.attendance_analytics.today.total_employees} Total Staff
                                </span>
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-500">
                                    <CheckCircle size={20} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 py-4 space-y-6">
                            {/* Today's Stats Row - Visual Graph */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-50">
                                {/* Rings Chart */}
                                <div className="relative w-40 h-40 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        {/* Present - Outer */}
                                        <circle cx="80" cy="80" r="70" stroke="#ecfdf5" strokeWidth="10" fill="none" className="dark:stroke-emerald-500/10" />
                                        <circle cx="80" cy="80" r="70" stroke="#10b981" strokeWidth="10" fill="none"
                                            strokeDasharray={440}
                                            strokeDashoffset={440 - (440 * (data.attendance_analytics.today.present_percentage / 100))}
                                            strokeLinecap="round"
                                        />
                                        {/* Absent - Middle */}
                                        <circle cx="80" cy="80" r="54" stroke="#fff1f2" strokeWidth="10" fill="none" className="dark:stroke-rose-500/10" />
                                        <circle cx="80" cy="80" r="54" stroke="#f43f5e" strokeWidth="10" fill="none"
                                            strokeDasharray={339}
                                            strokeDashoffset={339 - (339 * ((data.attendance_analytics.today.absent / data.attendance_analytics.today.total_employees) || 0))}
                                            strokeLinecap="round"
                                        />
                                        {/* Late - Inner */}
                                        <circle cx="80" cy="80" r="38" stroke="#fff7ed" strokeWidth="10" fill="none" className="dark:stroke-orange-500/10" />
                                        <circle cx="80" cy="80" r="38" stroke="#f97316" strokeWidth="10" fill="none"
                                            strokeDasharray={239}
                                            strokeDashoffset={239 - (239 * ((data.attendance_analytics.today.late / data.attendance_analytics.today.total_employees) || 0))}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{Math.round(data.attendance_analytics.today.present_percentage)}%</span>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Present</span>
                                    </div>
                                </div>

                                {/* Legend/Stats List */}
                                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100/60 dark:border-white/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Present</span>
                                        </div>
                                        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.attendance_analytics.today.present}</span>
                                    </div>
                                    <div className="flex flex-col p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100/60 dark:border-white/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Absent</span>
                                        </div>
                                        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.attendance_analytics.today.absent}</span>
                                    </div>
                                    <div className="flex flex-col p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100/60 dark:border-white/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Late</span>
                                        </div>
                                        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.attendance_analytics.today.late}</span>
                                    </div>
                                    <div className="flex flex-col p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100/60 dark:border-white/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">On Leave</span>
                                        </div>
                                        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.attendance_analytics.today.on_leave}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Work Hours Config */}
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock size={16} className="text-blue-500" />
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">Avg Work Hours</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{data.attendance_analytics.today.avg_work_hours}</span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">Today</span>
                                        </div>
                                        <div className="text-right flex flex-col gap-0.5">
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                W: <span className="font-bold text-slate-700 dark:text-slate-300">{data.attendance_analytics.this_week.avg_work_hours_per_day}h</span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                M: <span className="font-bold text-slate-700 dark:text-slate-300">{data.attendance_analytics.this_month.avg_work_hours_per_day}h</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Late Trends */}
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp size={16} className="text-orange-500" />
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">Late Trends</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{data.attendance_analytics.this_week.total_late_instances}</span>
                                            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase">This Week</span>
                                        </div>
                                        <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/10"></div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{data.attendance_analytics.this_month.total_late_instances}</span>
                                            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase">This Month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            {/* Attendance Concerns Area */}
                            {data.attendance_analytics.attendance_concerns && data.attendance_analytics.attendance_concerns.length > 0 && (
                                <div className="mt-2 pt-4 border-t border-slate-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Attention Required</p>
                                    <div className="space-y-2">
                                        {data.attendance_analytics.attendance_concerns.slice(0, 3).map((concern, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 bg-rose-50/30 dark:bg-rose-500/5 rounded-lg border border-rose-50 dark:border-rose-500/10">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{concern.name}</span>
                                                </div>
                                                <div className="flex gap-2 text-[9px]">
                                                    <span className="text-rose-600 dark:text-rose-400 font-medium">{concern.late_count} Late</span>
                                                    <span className="text-rose-600 dark:text-rose-400 font-medium">{concern.absent_days} Absent</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* HR Summary Card (Redesigned) */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Workforce Overview</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Headcount & Movements</p>
                            </div>
                            <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-full text-primary">
                                <Users size={20} />
                            </div>
                        </CardHeader>
                        <CardBody className="p-6 space-y-8">
                            {/* Main Count */}
                            <div className="flex items-end justify-between">
                                <div>
                                    <h3 className="text-5xl font-black tracking-tighter text-slate-800 dark:text-slate-100">{data.employee_analytics.overview.total_count}</h3>
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1">Total Employees</p>
                                </div>
                                <div className="mb-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100/50 dark:border-emerald-500/20">
                                        <TrendingUp size={14} className="stroke-[3px]" />
                                        <span className="text-xs font-bold">+{data.employee_analytics.overview.growth_rate_percentage}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-2">
                                {/* Active Status */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="font-bold text-slate-700">Active</span>
                                                <span className="font-bold text-slate-400">{data.employee_analytics.overview.active_count}</span>
                                            </div>
                                            <div className="w-full bg-slate-50 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${(data.employee_analytics.overview.active_count / data.employee_analytics.overview.total_count) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="font-bold text-slate-700">Inactive</span>
                                                <span className="font-bold text-slate-400">{data.employee_analytics.overview.inactive_count}</span>
                                            </div>
                                            <div className="w-full bg-slate-50 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full bg-slate-300" style={{ width: `${(data.employee_analytics.overview.inactive_count / data.employee_analytics.overview.total_count) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Movement */}
                                <div className="space-y-3 pl-4 border-l border-slate-50">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Month</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                                                    <UserPlus size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">Joined</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">{data.employee_analytics.overview.new_hires_this_month}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-md bg-rose-50 text-rose-600">
                                                    <UserMinus size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">Left</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">{data.employee_analytics.overview.attrition_this_month}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Task Analytics & Productivity Card */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Productivity & Tasks</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Task Completion & Efficiency</p>
                            </div>
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full text-indigo-500">
                                <CheckCircle size={20} />
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 py-4 space-y-8">
                            {/* Overview Row */}
                            <div className="flex items-center justify-between gap-6 pb-6 border-b border-slate-50 dark:border-white/5">
                                <div className="space-y-1">
                                    <h4 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{data.task_analytics.overview.completion_rate_percentage}%</h4>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Completion Rate</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{data.task_analytics.overview.completed} <span className="text-sm font-medium text-slate-400 dark:text-slate-600">/ {data.task_analytics.overview.total_assigned}</span></h4>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Tasks Completed</p>
                                </div>
                            </div>

                            {/* Status & Priority Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {/* Status */}
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status Breakdown</p>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                <span>In Progress</span>
                                                <span>{data.task_analytics.status_distribution.in_progress}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${(data.task_analytics.status_distribution.in_progress / data.task_analytics.overview.total_assigned) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                <span>Pending</span>
                                                <span>{data.task_analytics.status_distribution.todo}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full bg-slate-400" style={{ width: `${(data.task_analytics.status_distribution.todo / data.task_analytics.overview.total_assigned) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                <span>Review</span>
                                                <span>{data.task_analytics.status_distribution.in_review}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${(data.task_analytics.status_distribution.in_review / data.task_analytics.overview.total_assigned) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Priority */}
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Priority</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/20 text-center">
                                            <span className="block text-xl font-bold text-rose-600 dark:text-rose-400">{data.task_analytics.priority_breakdown.critical}</span>
                                            <span className="text-[9px] font-bold text-rose-400 uppercase">Critical</span>
                                        </div>
                                        <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20 text-center">
                                            <span className="block text-xl font-bold text-orange-600 dark:text-orange-400">{data.task_analytics.priority_breakdown.high}</span>
                                            <span className="text-[9px] font-bold text-orange-400 uppercase">High</span>
                                        </div>
                                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20 text-center">
                                            <span className="block text-xl font-bold text-blue-600 dark:text-blue-400">{data.task_analytics.priority_breakdown.medium}</span>
                                            <span className="text-[9px] font-bold text-blue-400 uppercase">Medium</span>
                                        </div>
                                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 text-center">
                                            <span className="block text-xl font-bold text-emerald-600 dark:text-emerald-400">{data.task_analytics.priority_breakdown.low}</span>
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase">Low</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* {data.task_analytics.top_contributors && data.task_analytics.top_contributors.length > 0 && (
                                <div className="pt-4 border-t border-slate-50">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Top Performers</p>
                                    <div className="space-y-3">
                                        {data.task_analytics.top_contributors.map((c, i) => (
                                            <div key={i} className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700">{c.name}</p>
                                                        <p className="text-[9px] text-slate-400">{c.role}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-800">{c.completed} Tasks</p>
                                                    <p className="text-[9px] text-emerald-500 font-medium">{c.efficiency}% Eff.</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                        </CardBody>
                    </Card>


                </div>

                {/* --- Column 3: Sidebar (Span 4) --- */}
                <div className="w-full lg:flex-1 flex flex-col gap-6">

                    {/* Birthdays (Standalone Card) - Top of Column */}
                    {data.upcoming_events.birthdays.length > 0 && (
                        <Card className="shadow-sm border-none bg-pink-50/50 dark:bg-pink-500/10">
                            <CardHeader className="px-5 pt-5 pb-0 flex gap-2 items-center">
                                <div className="p-1.5 bg-pink-100 dark:bg-pink-500/20 rounded-lg text-pink-500">
                                    <Bell size={16} />
                                </div>
                                <h3 className="font-bold text-pink-900 dark:text-pink-300 text-sm">Today's Birthdays</h3>
                            </CardHeader>
                            <CardBody className="px-5 py-4">
                                {data.upcoming_events.birthdays.map((b, i) => (
                                    <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                                        <User
                                            name={b.name}
                                            description={<span className="text-pink-600 text-xs font-medium">{b.date}</span>}
                                            avatarProps={{ src: b.profile_picture, size: "sm" }}
                                            classNames={{ name: "text-sm font-semibold text-slate-700" }}
                                        />
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    )}

                    {/* Alerts Section */}
                    {(data.alerts.critical.length > 0 || data.alerts.warnings.length > 0) && (
                        <Card className="shadow-sm border-none bg-rose-50/50 dark:bg-rose-500/10 border-l-4 border-rose-500">
                            <CardHeader className="px-5 pt-5 pb-0 flex gap-2 items-center">
                                <div className="p-1.5 bg-rose-100 dark:bg-rose-500/20 rounded-lg text-rose-500">
                                    <AlertCircle size={16} />
                                </div>
                                <h3 className="font-bold text-rose-900 dark:text-rose-300 text-sm">Action Required</h3>
                            </CardHeader>
                            <CardBody className="px-5 py-4 space-y-3">
                                {data.alerts.critical.map((alert, idx) => (
                                    <div key={idx} className="flex gap-3 items-start bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-rose-100/50 dark:border-rose-500/20">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                                        <div>
                                            <p className="text-sm font-bold text-rose-900 dark:text-rose-200">{alert.message}</p>
                                            <p className="text-[10px] text-rose-500/80 font-medium mt-0.5">Critical Priority</p>
                                        </div>
                                    </div>
                                ))}
                                {data.alerts.warnings.map((alert, idx) => (
                                    <div key={idx} className="flex gap-3 items-start bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-amber-100/50 dark:border-amber-500/20">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{alert.message}</p>
                                            <p className="text-[10px] text-amber-600 font-medium mt-0.5">Warning</p>
                                        </div>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    )}

                    {/* Pending Leaves Table - Sidebar Version */}
                    {/* Pending Leaves Table - Sidebar Version */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                        <CardHeader className="flex justify-between items-center px-5 pt-5 pb-2">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Leave Approvals</h3>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{data.leave_analytics.overview.pending_requests} pending requests</p>
                            </div>
                            <div className="p-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-lg relative">
                                <Clock size={16} />
                                {data.leave_analytics.overview.pending_requests > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <CardBody className="px-5 py-2">
                            <Table aria-label="Leave Approvals" removeWrapper shadow="none" hideHeader classNames={{
                                td: "py-2"
                            }}>
                                <TableHeader>
                                    <TableColumn>EMPLOYEE</TableColumn>
                                    <TableColumn align="end">TYPE</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent={<div className="text-center py-4 text-xs text-slate-400">No pending requests</div>}>
                                    {data.leave_analytics.pending_requests.slice(0, 5).map((l) => (
                                        <TableRow key={l.id} className="border-b border-slate-50 last:border-none group">
                                            <TableCell>
                                                <div className="font-bold text-xs text-slate-700">{l.employee_name}</div>
                                                <div className="text-[9px] text-slate-400 truncate max-w-[100px]">{l.reason}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-semibold text-slate-600">{l.leave_type}</span>
                                                    <span className="text-[9px] text-slate-400 font-bold">{l.total_days} Days</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>



                    {/* Upcoming Holidays */}
                    {data.upcoming_events.holidays.length > 0 && (
                        <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                            <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                                <div className="flex gap-3 items-center">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                                        <Calendar size={18} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Upcoming Holidays</h3>
                                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Public & Optional Holidays</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="px-6 py-4 space-y-4">
                                <div className="space-y-3">
                                    {data.upcoming_events.holidays.map((h, idx) => {
                                        const date = new Date(h.date);
                                        return (
                                            <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/50 dark:border-white/10 shadow-sm shrink-0">
                                                    <span className="text-[9px] font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">{format(date, 'MMM')}</span>
                                                    <span className="text-lg font-black text-slate-800 dark:text-slate-100 leading-none mt-0.5">{format(date, 'dd')}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{h.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{format(date, 'EEEE')}</span>
                                                        <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                                        <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400">{h.type}</span>
                                                    </div>
                                                </div>
                                                <div className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${h.days_until <= 7
                                                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                    }`}>
                                                    {h.days_until === 0 ? 'Today' : `${h.days_until}d`}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    <Card className="shadow-none border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md min-h-[300px] flex flex-col">
                        <CardHeader className="px-6 pt-6 pb-2 flex justify-between items-center bg-white dark:bg-transparent border-b border-slate-50 dark:border-white/5">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide flex items-center gap-2">
                                <Activity size={16} className="text-slate-400 dark:text-primary" />
                                System Activity
                            </h3>
                        </CardHeader>
                        <CardBody className="px-6 py-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-0">
                                {data.recent_activities.map((act, i) => {
                                    const dateObj = new Date(act.timestamp);
                                    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

                                    return (
                                        <div key={i} className="flex gap-4 group relative">
                                            {/* Timeline Line */}
                                            {i !== data.recent_activities.length - 1 && (
                                                <div className="absolute left-[15px] top-8 bottom-[-8px] w-[2px] bg-slate-100 dark:bg-slate-800"></div>
                                            )}

                                            {/* Icon */}
                                            <div className="relative z-10 flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border ${act.priority === 'high' ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-500' :
                                                    act.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-500' :
                                                        'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-500'
                                                    }`}>
                                                    <Activity size={14} strokeWidth={2.5} />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="pb-6 pt-0.5 flex-1 min-w-0">
                                                <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-snug">
                                                    {act.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold bg-slate-100/50 dark:bg-white/5 px-1.5 py-0.5 rounded">
                                                        {dateStr}
                                                    </span>
                                                    <span className="text-[9px] text-slate-300 dark:text-slate-700">•</span>
                                                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                                                        {timeStr}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>



                </div>

                {/* --- Column 1: Overview & Distribution (Span 3) --- */}
                <div className="w-full lg:flex-1 flex flex-col gap-6">

                    {/* HR Summary Card */}




                    {/* Recent Hires List */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                        <CardHeader className="flex justify-between items-center px-5 pt-5 pb-2">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Joiners</h3>
                            <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg">
                                <UserPlus size={16} />
                            </div>
                        </CardHeader>
                        <CardBody className="px-5 py-2">
                            <div className="space-y-4 mb-2">
                                {data.employee_analytics.recent_hires.length > 0 ? data.employee_analytics.recent_hires.slice(0, 3).map((hire, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <User
                                            name={hire.name}
                                            description={
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 font-medium">{hire.designation}</span>
                                                    <span className="text-[9px] text-slate-300">Joined {new Date(hire.date_of_joining).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            }
                                            avatarProps={{
                                                src: hire.profile_picture,
                                                size: "sm",
                                                radius: "lg",
                                                classNames: { base: "shrink-0" } // Enforce fix size
                                            }}
                                            classNames={{
                                                name: "text-xs font-bold text-slate-700 dark:text-slate-200"
                                            }}
                                        />
                                    </div>
                                )) : (
                                    <p className="text-xs text-slate-400 italic">No recent hires.</p>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Upcoming Confirmations */}
                    {(data.employee_analytics.upcoming_confirmations.length > 0 || data.employee_analytics.upcoming_exits.length > 0) && (
                        <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                            <CardHeader className="flex justify-between items-center px-5 pt-5 pb-2">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Key Movements</h3>
                                <div className="p-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-lg">
                                    <UserCheck size={16} />
                                </div>
                            </CardHeader>
                            <CardBody className="px-5 py-2">
                                <div className="space-y-3 mb-2">
                                    {data.employee_analytics.upcoming_confirmations.map((conf, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 bg-purple-50/50 dark:bg-purple-500/10 rounded-xl border border-purple-50 dark:border-purple-500/20">
                                            <User
                                                name={conf.name}
                                                description={<span className="text-[10px] text-purple-600 font-medium">Probation ends in {conf.days_until_confirmation} days</span>}
                                                avatarProps={{
                                                    src: conf.profile_picture,
                                                    size: "sm",
                                                    isBordered: false
                                                }}
                                                classNames={{
                                                    name: "text-xs font-bold text-slate-700"
                                                }}
                                            />
                                        </div>
                                    ))}
                                    {data.employee_analytics.upcoming_exits.map((exit, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 bg-rose-50/50 rounded-xl border border-rose-50">
                                            <User
                                                name={exit.name}
                                                description={<span className="text-[10px] text-rose-600 font-medium">Exit on {exit.exit_date}</span>}
                                                avatarProps={{
                                                    size: "sm",
                                                    isBordered: false
                                                }}
                                                classNames={{
                                                    name: "text-xs font-bold text-slate-700"
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {/* Work Mode Distribution (Linear) */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Work Mode</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Employee Distribution</p>
                            </div>
                            <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-full text-primary">
                                <Building size={20} />
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 py-4 space-y-5">
                            {/* Office */}
                            <div>
                                <div className="flex justify-between items-end mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Office</span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-400">{data.employee_analytics.work_mode_distribution.office} Staff</span>
                                </div>
                                <Progress
                                    value={data.employee_analytics.work_mode_distribution.office_percentage}
                                    size="sm" radius="full"
                                    classNames={{ track: "bg-slate-100 h-1.5", indicator: "bg-primary h-1.5" }}
                                />
                            </div>
                            {/* Remote */}
                            <div>
                                <div className="flex justify-between items-end mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Remote</span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-400">{data.employee_analytics.work_mode_distribution.remote} Staff</span>
                                </div>
                                <Progress
                                    value={data.employee_analytics.work_mode_distribution.remote_percentage}
                                    size="sm" radius="full"
                                    classNames={{ track: "bg-slate-100 h-1.5", indicator: "bg-secondary h-1.5" }}
                                />
                            </div>
                            {/* Hybrid */}
                            <div>
                                <div className="flex justify-between items-end mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Hybrid</span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-400">{data.employee_analytics.work_mode_distribution.hybrid} Staff</span>
                                </div>
                                <Progress
                                    value={data.employee_analytics.work_mode_distribution.hybrid_percentage}
                                    size="sm" radius="full"
                                    classNames={{ track: "bg-slate-100 h-1.5", indicator: "bg-warning h-1.5" }}
                                />
                            </div>
                        </CardBody>
                    </Card>

                    {blogs && blogs.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Blogs</h3>
                                <Link href="/feeds" className="text-xs font-bold text-primary hover:text-primary-600 transition-colors flex items-center gap-1">
                                    View All
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>

                            {blogs.slice(0, 3).map((blog: any, i: number) => (
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
                                        </div>

                                        <CardBody className="px-3 pt-3 pb-2 flex flex-col gap-1.5">
                                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2">
                                                {blog.title}
                                            </h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                                                {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').slice(0, 100) + "..." || "No description"}
                                            </p>
                                        </CardBody>

                                        {/* Footer with Author and Date */}
                                        <div className="px-3 pb-2 pt-0 flex items-center justify-between w-full">
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
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

