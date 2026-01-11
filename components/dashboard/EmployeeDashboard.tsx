"use client";

import React from "react";
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
    Activity, ShieldCheck, AlertCircle
} from "lucide-react";

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
        absent_days: number;
        late_days: number;
        half_days: number;
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

export default function EmployeeDashboard({ data, blogs }: { data: DashboardData; blogs: any[] }) {
    if (!data) return null;

    return (
        <div className="min-h-screen bg-default-50/50 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                        {data.greeting.greeting_text}
                    </h1>
                    <p className="text-slate-500 mt-1 text-lg">
                        {data.greeting.message}
                    </p>
                </div>
                {/* Optional: Add Date picker or filter buttons here if needed later */}
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* --- Column 1: Profile & Quick Stats (Span 4) --- */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    {/* Profile Card */}
                    <Card className="shadow-none border-none bg-transparent w-full h-[320px] relative overflow-hidden rounded-[40px] group">
                        {/* Background Image */}
                        <img
                            src={data.profile.profile_picture}
                            alt={data.profile.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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

                    {/* Work Hours Widget */}
                    <Card className="shadow-sm border border-default-100 bg-white h-auto">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Time Tracker</h3>
                                <p className="text-xs text-slate-400">Work efficiency metrics</p>
                            </div>
                            <div className="p-2 bg-primary-50 rounded-full text-primary">
                                <Clock size={20} />
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 py-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
                                    {/* Circular Progress Placeholder - CSS based or SVG */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none"
                                            strokeDasharray={351}
                                            strokeDashoffset={351 - (351 * (data.work_hours.today / 9))} /* Assuming 9h workday */
                                            className="transition-all duration-1000 ease-out text-primary"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-2xl font-bold text-slate-800">{data.work_hours.today}h</span>
                                        <span className="text-[10px] text-slate-400 uppercase">Today</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-slate-50 text-center">
                                    <span className="block text-xl font-bold text-slate-700">{data.work_hours.this_week}h</span>
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold">This Week</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 text-center">
                                    <span className="block text-xl font-bold text-slate-700">{data.work_hours.this_month}h</span>
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold">This Month</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Leave Balance Section */}
                    <Card className="shadow-sm border border-default-100 bg-white">
                        <CardHeader className="flex justify-between px-6 pt-6">
                            <h3 className="text-lg font-bold text-slate-800">Leave Balance</h3>
                            <Button size="sm" variant="light" className="text-primary font-medium p-0 h-auto">View All</Button>
                        </CardHeader>
                        <CardBody className="px-6 py-4 space-y-5">
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="text-center px-2">
                                    <p className="text-2xl font-bold text-slate-800">{data.leave_details.summary.total_allowed}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Total</p>
                                </div>
                                <div className="w-[1px] h-8 bg-slate-200"></div>
                                <div className="text-center px-2">
                                    <p className="text-2xl font-bold text-primary">{data.leave_details.summary.total_remaining}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Left</p>
                                </div>
                                <div className="w-[1px] h-8 bg-slate-200"></div>
                                <div className="text-center px-2">
                                    <p className="text-2xl font-bold text-slate-800">{data.leave_details.summary.total_taken}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Used</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {data.leave_details.balance.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-sm font-semibold text-slate-700">{item.type}</span>
                                            <span className="text-xs text-slate-500">{item.balance}/{item.total} Remaining</span>
                                        </div>
                                        <Progress
                                            value={(item.balance / item.total) * 100}
                                            color="primary"
                                            size="sm"
                                            className="h-2"
                                            classNames={{
                                                indicator: "bg-primary"
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Recent Leave Request Status */}
                            {data.leave_details.recent_requests_status.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Recent Requests</p>
                                    <div className="space-y-2">
                                        {data.leave_details.recent_requests_status.slice(0, 3).map((req, i) => (
                                            <div key={i} className="flex justify-between items-center bg-primary-50 p-2 rounded-lg">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-700">{req.type}</span>
                                                    <span className="text-[10px] text-slate-500">{new Date(req.date).toLocaleDateString()}</span>
                                                </div>
                                                <Chip size="sm" variant="flat" className="bg-white text-primary font-bold shadow-sm h-6">
                                                    {req.status}
                                                </Chip>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>


                </div>


                {/* --- Column 2: Stats & Metrics (Span 5) --- */}
                <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
                    {/* Attendance Overview Card (Compact) */}
                    <Card className="shadow-sm border border-default-100 bg-white">
                        <CardBody className="p-5">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Attendance</h3>
                                <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-semibold text-slate-500">
                                    Total: {data.attendance_metrics.total_working_days} Days
                                </div>
                            </div>

                            {/* Primary Stats */}
                            <div className="flex justify-between items-center divide-x divide-slate-100 mb-6">
                                <div className="flex flex-col items-center w-1/3 px-2">
                                    <span className="text-2xl font-bold text-emerald-500 leading-none">{data.attendance_metrics.present_days}</span>
                                    <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">Present</span>
                                </div>
                                <div className="flex flex-col items-center w-1/3 px-2">
                                    <span className="text-2xl font-bold text-rose-500 leading-none">{data.attendance_metrics.absent_days}</span>
                                    <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">Absent</span>
                                </div>
                                <div className="flex flex-col items-center w-1/3 px-2">
                                    <span className="text-2xl font-bold text-amber-500 leading-none">{data.attendance_metrics.leave_days}</span>
                                    <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">Leave</span>
                                </div>
                            </div>

                            {/* Secondary Stats Pills */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-orange-50 border border-orange-100/80">
                                    <Clock size={14} className="text-orange-500" />
                                    <span className="text-xs font-bold text-orange-700">{data.attendance_metrics.late_days} <span className="font-medium text-orange-600/70 text-[10px]">Late</span></span>
                                </div>
                                <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-violet-50 border border-violet-100/80">
                                    <Activity size={14} className="text-violet-500" />
                                    <span className="text-xs font-bold text-violet-700">{data.attendance_metrics.half_days} <span className="font-medium text-violet-600/70 text-[10px]">Half</span></span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Tasks Widget - Integrated with Data */}
                    <Card className="shadow-none border-none bg-primary-50 relative overflow-visible min-h-[620px] rounded-[40px] flex flex-col">
                        {/* Top Section: Overview */}
                        <div className="px-8 pt-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-medium text-slate-800 tracking-tight">Task Overview</h3>
                                    <p className="text-slate-500 text-xs mt-1">Completion Status</p>
                                </div>
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <span className="text-slate-800 font-bold px-1">{data.task_metrics.total_assigned} Total</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 mb-6">
                                {/* Circular Chart (SVG) */}
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        {/* Background Track */}
                                        <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="12" fill="none" />

                                        {/* Completed Segment */}
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none"
                                            strokeDasharray={351}
                                            strokeDashoffset={351 - (351 * (data.task_metrics.completed / (data.task_metrics.total_assigned || 1)))}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out text-primary"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-slate-800">
                                            {Math.round((data.task_metrics.completed / (data.task_metrics.total_assigned || 1)) * 100)}%
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Done</span>
                                    </div>
                                </div>

                                {/* Legend / Stats */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-medium text-slate-600">In Progress</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-800">{data.task_metrics.in_progress}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(data.task_metrics.in_progress / (data.task_metrics.total_assigned || 1)) * 100}%` }}></div>
                                    </div>

                                    <div className="flex justify-between items-center pt-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                            <span className="text-sm font-medium text-slate-600">Pending</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-800">{data.task_metrics.pending}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-400 rounded-full" style={{ width: `${(data.task_metrics.pending / (data.task_metrics.total_assigned || 1)) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Overdue Alert Banner */}
                            {data.task_metrics.overdue > 0 && (
                                <div className="flex items-center justify-between bg-red-50 border border-red-100 p-3 rounded-2xl mb-2 animate-pulse transition-none">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-red-100 text-red-600 rounded-full">
                                            <AlertCircle size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-red-800 uppercase tracking-wide">Attention Needed</p>
                                            <p className="text-[10px] text-red-600 font-medium">{data.task_metrics.overdue} Tasks Overdue</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="flat" className="bg-white text-red-600 text-[10px] font-bold h-7 min-w-[60px] shadow-sm">Review</Button>
                                </div>
                            )}
                        </div>

                        {/* Bottom Section: Dark Task Card */}
                        <div className="bg-[#1c1c1e] rounded-[36px] p-6 text-white flex flex-col shadow-2xl mx-2 mb-2 flex-1 mt-auto">
                            {/* Header */}
                            <div className="flex justify-between items-end mb-6 mt-1 px-1">
                                <h3 className="text-xl font-light text-slate-200">My Tasks</h3>
                                <span className="text-3xl font-light text-white tracking-widest">
                                    {data.task_metrics.completed}/{data.task_metrics.total_assigned}
                                </span>
                            </div>

                            {/* Task List */}
                            <div className="space-y-5 pr-1">
                                {data.recent_tasks.slice(0, 5).map((task, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group cursor-default">
                                        {/* Icon Circle */}
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${task.status.toLowerCase() === 'completed' ? 'bg-white text-black' :
                                            task.status.toLowerCase() === 'in progress' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-[#2c2c2e] text-slate-400'
                                            }`}>
                                            {task.task_name.toLowerCase().includes('bug') ? <Activity size={18} /> :
                                                task.task_name.toLowerCase().includes('meeting') ? <Briefcase size={18} /> :
                                                    <LayoutDashboard size={18} />}
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate transition-colors ${task.status.toLowerCase() === 'completed' ? 'text-slate-200' : 'text-slate-400'
                                                }`}>{task.task_name}</p>
                                            <div className="flex justify-between items-center pr-2 mt-0.5">
                                                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">
                                                    {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                                <p className={`text-[10px] font-bold uppercase tracking-wider ${task.priority.toLowerCase() === 'high' ? 'text-red-400' : 'text-slate-600'
                                                    }`}>{task.priority}</p>
                                            </div>
                                        </div>

                                        {/* Status Check */}
                                        <div>
                                            {task.status.toLowerCase() === 'completed' ? (
                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]">
                                                    <CheckCircle size={12} className="text-[#1c1c1e] fill-current" />
                                                </div>
                                            ) : task.status.toLowerCase() === 'in progress' ? (
                                                <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-[#3f3f46]"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>



                </div>


                {/* --- Column 3: Stats & Lists (Span 3) --- */}
                <div className="md:col-span-12 lg:col-span-3 flex flex-col gap-6">

                    {/* Projects List */}

                    <Card className="shadow-sm border border-default-100 bg-white">
                        <CardHeader className="flex gap-3 px-5 pt-5 pb-2">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                <Briefcase size={18} />
                            </div>
                            <h3 className="font-bold text-slate-800 pt-1">Active Projects</h3>
                        </CardHeader>
                        <CardBody className="px-5 py-4">
                            <div className="space-y-4">
                                {data.projects.map((project, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 font-bold text-sm">
                                                {project.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800 leading-none">{project.name}</p>
                                                <p className="text-xs text-slate-400 mt-1">{project.role}</p>
                                            </div>
                                        </div>
                                        <div className={`text-[10px] font-medium px-2 py-1 rounded-full ${project.status.toLowerCase().includes('progress') ? 'bg-blue-50 text-blue-600' :
                                            project.status.toLowerCase().includes('completed') ? 'bg-emerald-50 text-emerald-600' :
                                                'bg-slate-50 text-slate-500'
                                            }`}>
                                            {project.status}
                                        </div>
                                    </div>
                                ))}
                                {data.projects.length === 0 && <p className="text-sm text-slate-400 italic">No active projects.</p>}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Birthdays */}
                    <Card className="shadow-sm border-none bg-pink-50/50">
                        <CardHeader className="px-5 pt-5 pb-0 flex gap-2 items-center">
                            <div className="p-1.5 bg-pink-100 rounded-lg text-pink-500">
                                <Bell size={16} />
                            </div>
                            <h3 className="font-bold text-pink-900 text-sm">Birthdays</h3>
                        </CardHeader>
                        <CardBody className="px-5 py-4">
                            {data.birthdays.map((b, i) => (
                                <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                                    <User
                                        name={b.name}
                                        description={<span className="text-pink-600 text-xs font-medium">{b.date}</span>}
                                        avatarProps={{ src: b.profile_picture, size: "sm" }}
                                        classNames={{ name: "text-sm font-semibold text-slate-700" }}
                                    />
                                </div>
                            ))}
                            {data.birthdays.length === 0 && <p className="text-xs text-slate-500 italic">No upcoming birthdays.</p>}
                        </CardBody>
                    </Card>

                    {/* Upcoming Holidays (List) */}
                    {/* Upcoming Holidays */}
                    <Card className="shadow-sm border border-default-100 bg-white">
                        <CardHeader className="flex justify-between items-center px-5 pt-5 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-50 rounded-xl text-primary">
                                    <Calendar size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Upcoming Holidays</h3>
                            </div>
                        </CardHeader>
                        <CardBody className="px-5 pb-5 pt-2 space-y-4">
                            {data.upcoming_holidays.length > 0 ? (
                                data.upcoming_holidays.slice(0, 3).map((holiday, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group cursor-default">
                                        <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary border border-primary-100 group-hover:bg-primary group-hover:text-white group-hover:shadow-md transition-all duration-300">
                                            <span className="text-[9px] font-bold uppercase leading-none tracking-wider">{new Date(holiday.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                            <span className="text-lg font-bold leading-none mt-0.5">{new Date(holiday.date).getDate()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-700 truncate group-hover:text-primary transition-colors">{holiday.name}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">{new Date(holiday.date).toLocaleDateString(undefined, { weekday: 'long' })}</p>
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

                    {/* Blog / News Feed */}
                    {blogs && blogs.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Company News</h3>
                                <Button size="sm" variant="light" className="text-primary font-bold text-[10px] h-6 p-0 min-w-0">View All</Button>
                            </div>

                            {blogs.slice(0, 3).map((blog, i) => (
                                <Card
                                    key={i}
                                    className="bg-white dark:bg-[#1a1a1a] border border-transparent hover:border-default-200 p-2 transition-all duration-300 group"
                                    style={{
                                        borderRadius: "24px",
                                        boxShadow: '0px 0.6px 0.6px 0px rgba(0,0,0,0.02), 0px 2px 2px 0px rgba(0,0,0,0.04), 0px 4px 10px 0px rgba(0,0,0,0.06)'
                                    }}
                                >
                                    {/* Card Image Area */}
                                    <div className="relative w-full aspect-[2/1] overflow-hidden rounded-[16px] bg-slate-100 dark:bg-zinc-800">
                                        <Image
                                            removeWrapper
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out"
                                            src={blog.cover_image?.replace("host.docker.internal", "localhost") || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"}
                                        />
                                        {/* Status Only if needed, maybe skip for dashboard or keep minimal */}
                                    </div>

                                    <CardBody className="px-3 pt-3 pb-2 flex flex-col gap-1.5">
                                        <h2 className="text-base font-bold text-slate-800 leading-tight line-clamp-2">
                                            {blog.title}
                                        </h2>
                                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                                            {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').slice(0, 100) + "..." || "No description"}
                                        </p>
                                    </CardBody>

                                    <CardFooter className="px-3 pb-2 pt-0">
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                src={blog.author?.avatar?.replace("host.docker.internal", "localhost")}
                                                name={blog.author?.name || "Admin"}
                                                className="w-5 h-5 text-[9px]"
                                            />
                                            <span className="text-[10px] font-medium text-slate-400">
                                                {new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Recent Activity Feed (Redesigned) */}
                    <Card className="shadow-none border border-slate-100 bg-white min-h-[300px] flex flex-col">
                        <CardHeader className="px-6 pt-6 pb-2 flex justify-between items-center bg-white border-b border-slate-50">
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                                <Activity size={16} className="text-slate-400" />
                                Activity Feed
                            </h3>
                            <Button size="sm" variant="light" className="text-[10px] font-bold text-primary px-2 h-6 min-w-0">View All</Button>
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
                                                <div className="absolute left-[15px] top-8 bottom-[-8px] w-[2px] bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
                                            )}

                                            {/* Icon */}
                                            <div className="relative z-10 flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border transaction-all duration-300 group-hover:scale-110 ${isTask
                                                    ? 'bg-blue-50 border-blue-100 text-blue-500'
                                                    : 'bg-emerald-50 border-emerald-100 text-emerald-500'
                                                    }`}>
                                                    {isTask ? <CheckCircle size={14} strokeWidth={2.5} /> : <Calendar size={14} strokeWidth={2.5} />}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="pb-6 pt-0.5 flex-1 min-w-0">
                                                <p className="text-sm text-slate-700 font-medium leading-snug group-hover:text-slate-900 transition-colors">
                                                    {act.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-100/50 px-1.5 py-0.5 rounded">
                                                        {dateStr}
                                                    </span>
                                                    <span className="text-[10px] text-slate-300">•</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">
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



            </div>
        </div>
    );
}
