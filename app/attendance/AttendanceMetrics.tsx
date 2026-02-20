import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

interface DetailedStats {
    total_present: number;
    on_time: number;
    late: number;
    absent: number;
    leave: number;
    holiday: number;
    permission: number;
    half_day: number;
}

interface AttendanceMetricsProps {
    isAdmin: boolean;
    todayStats: DetailedStats;
    monthStats: DetailedStats;
    yearStats: DetailedStats;
    elapsedSeconds: number;
}

const AttendanceMetrics: React.FC<AttendanceMetricsProps> = ({
    isAdmin,
    todayStats,
    monthStats,
    yearStats,
    elapsedSeconds
}) => {

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    /** Derive the user's single today status from priority: Permission > HalfDay > OnTime > Late > Leave > Holiday > Absent */
    const getUserTodayStatus = () => {
        if (todayStats.permission > 0) return "Permission";
        if (todayStats.half_day > 0) return "HalfDay";
        if (todayStats.on_time > 0) return "OnTime";
        if (todayStats.late > 0) return "Late";
        if (todayStats.leave > 0) return "Leave";
        if (todayStats.holiday > 0) return "Holiday";
        if (todayStats.absent > 0) return "Absent";
        return "None";
    };

    const userStatus = getUserTodayStatus();

    const statusConfig: Record<string, { label: string; color: string; subtext: string; dot: string }> = {
        OnTime: { label: "On Time", color: "text-success", subtext: "You're on time today", dot: "bg-success" },
        Late: { label: "Late", color: "text-warning", subtext: "You arrived late today", dot: "bg-warning" },
        Permission: { label: "Permission", color: "text-violet-500", subtext: "You have approved permission", dot: "bg-violet-500" },
        HalfDay: { label: "Half Day", color: "text-sky-500", subtext: "You're on a half day today", dot: "bg-sky-500" },
        Leave: { label: "On Leave", color: "text-secondary", subtext: "You're on leave today", dot: "bg-secondary" },
        Holiday: { label: "Holiday", color: "text-primary", subtext: "It's a holiday today", dot: "bg-primary" },
        Absent: { label: "Absent", color: "text-danger", subtext: "Marked as absent", dot: "bg-danger" },
        None: { label: "No Record", color: "text-default-400", subtext: "No attendance recorded yet", dot: "bg-default-300" },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

            {/* ── Card 1: Today ─────────────────────────────────────────── */}
            <Card className="shadow-md transition-all duration-300 border border-primary/20 bg-gradient-to-br from-primary-50/50 via-background to-background dark:from-primary-950/20 dark:via-background dark:to-background">
                <CardBody className="py-3 px-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-default-500 uppercase font-semibold tracking-wide">
                            {isAdmin ? "Today's Overview" : "Today's Status"}
                        </p>
                        {isAdmin && (
                            <Chip size="sm" variant="shadow" color="primary" className="h-5 font-semibold">
                                {todayStats.total_present || 0} Present
                            </Chip>
                        )}
                    </div>

                    {isAdmin ? (
                        <>
                            {/* Admin: 7-column grid */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-3">
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-success">{todayStats.on_time || 0}</span>
                                    <span className="text-[9px] text-default-400 uppercase leading-tight">On Time</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-warning">{todayStats.late || 0}</span>
                                    <span className="text-[9px] text-default-400 uppercase leading-tight">Late</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-violet-500">{todayStats.permission || 0}</span>
                                    <span className="text-[9px] text-default-400 uppercase leading-tight">Perm.</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-sky-500">{todayStats.half_day || 0}</span>
                                    <span className="text-[9px] text-default-400 uppercase leading-tight">Half</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-danger">{todayStats.absent || 0}</span>
                                    <span className="text-[9px] text-default-400 uppercase leading-tight">Absent</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-secondary">{todayStats.leave || 0}</span>
                                    <span className="text-[9px] text-default-400 uppercase leading-tight">Leave</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-primary">{todayStats.holiday || 0}</span>
                                    <span className="text-[9px] text-default-400 uppercase leading-tight">Holi.</span>
                                </div>
                            </div>

                            {/* 7-segment stacked bar */}
                            <div className="relative h-6 bg-default-100 rounded-full overflow-hidden shadow-inner flex">
                                {(() => {
                                    const segments = [
                                        { val: todayStats.on_time || 0, cls: "bg-success" },
                                        { val: todayStats.late || 0, cls: "bg-warning" },
                                        { val: todayStats.permission || 0, cls: "bg-violet-500" },
                                        { val: todayStats.half_day || 0, cls: "bg-sky-500" },
                                        { val: todayStats.absent || 0, cls: "bg-danger" },
                                        { val: todayStats.leave || 0, cls: "bg-secondary" },
                                        { val: todayStats.holiday || 0, cls: "bg-primary" },
                                    ];
                                    const total = segments.reduce((s, x) => s + x.val, 0);
                                    if (total === 0) return <div className="w-full bg-default-200" />;
                                    return segments.map((seg, i) => {
                                        if (seg.val === 0) return null;
                                        const pct = (seg.val / total) * 100;
                                        return (
                                            <div
                                                key={i}
                                                className={`h-full ${seg.cls} transition-all duration-700 ease-out flex items-center justify-center relative`}
                                                style={{ width: `${pct}%` }}
                                            >
                                                {pct > 8 && (
                                                    <span className="text-[9px] font-semibold text-white absolute">
                                                        {Math.round(pct)}%
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </>
                    ) : (
                        // Employee: single-status card
                        <div className="flex flex-col items-center justify-center py-2">
                            {userStatus !== "None" && (userStatus === "OnTime" || userStatus === "Late" || userStatus === "Permission" || userStatus === "HalfDay") ? (
                                <div className="flex items-center justify-between w-full px-4 py-1">
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className={`w-2 h-2 rounded-full ${statusConfig[userStatus].dot} animate-pulse`} />
                                            <span className={`text-lg font-bold ${statusConfig[userStatus].color}`}>
                                                {statusConfig[userStatus].label}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-default-400">{statusConfig[userStatus].subtext}</p>
                                    </div>
                                    {/* Circular work timer */}
                                    <div className="relative flex items-center justify-center w-14 h-14">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="none"
                                                className={userStatus === "OnTime" ? "text-success-100 dark:text-success-900/20"
                                                    : userStatus === "Late" ? "text-warning-100 dark:text-warning-900/20"
                                                        : "text-violet-100 dark:text-violet-900/20"} />
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="none"
                                                strokeDasharray={351}
                                                strokeDashoffset={351 - (351 * (Math.min(elapsedSeconds / 32400, 1)))}
                                                strokeLinecap="round"
                                                className={
                                                    userStatus === "OnTime" ? "text-success transition-all duration-1000 ease-linear"
                                                        : userStatus === "Late" ? "text-warning transition-all duration-1000 ease-linear"
                                                            : userStatus === "Permission" ? "text-violet-500 transition-all duration-1000 ease-linear"
                                                                : "text-sky-500 transition-all duration-1000 ease-linear"
                                                }
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className={`text-[10px] font-bold tabular-nums tracking-tight leading-none ${statusConfig[userStatus].color}`}>
                                                {formatDuration(elapsedSeconds)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-3 h-3 rounded-full ${statusConfig[userStatus].dot}`} />
                                    <span className={`text-2xl font-bold ${statusConfig[userStatus].color}`}>
                                        {statusConfig[userStatus].label}
                                    </span>
                                </div>
                            )}
                            {(userStatus === "Absent" || userStatus === "Leave" || userStatus === "Holiday" || userStatus === "None") && (
                                <p className="text-xs text-default-400 mt-1">{statusConfig[userStatus].subtext}</p>
                            )}
                        </div>
                    )}
                </CardBody>
            </Card>


            {/* ── Card 2: This Month ───────────────────────────────────── */}
            <Card className="shadow-md transition-all duration-300 border border-secondary/20 bg-gradient-to-br from-secondary-50/50 via-background to-background dark:from-secondary-950/20 dark:via-background dark:to-background">
                <CardBody className="py-3 px-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-default-500 uppercase font-semibold tracking-wide">This Month</p>
                        <Chip size="sm" variant="shadow" color="secondary" className="h-5 font-semibold">
                            {monthStats.total_present || 0} Days
                        </Chip>
                    </div>
                    <div className="space-y-2">
                        {/* Present Progress */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-default-500 font-medium">Present</span>
                                <span className="text-xs font-semibold">{monthStats.total_present || 0}</span>
                            </div>
                            <div className="h-2 bg-default-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-success-400 to-success-600 rounded-full transition-all duration-700 ease-out shadow-sm"
                                    style={{ width: `${Math.min(((monthStats.total_present || 0) / Math.max((monthStats.total_present || 0) + (monthStats.absent || 0) + (monthStats.leave || 0), 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Present sub-breakdown */}
                        <div className="grid grid-cols-4 gap-1 text-center pt-1">
                            <div className="flex flex-col bg-success-50/40 dark:bg-success-950/10 rounded-lg py-1.5">
                                <span className="text-sm font-semibold text-success">{monthStats.on_time || 0}</span>
                                <span className="text-[9px] text-default-400">On Time</span>
                            </div>
                            <div className="flex flex-col bg-warning-50/40 dark:bg-warning-950/10 rounded-lg py-1.5">
                                <span className="text-sm font-semibold text-warning">{monthStats.late || 0}</span>
                                <span className="text-[9px] text-default-400">Late</span>
                            </div>
                            <div className="flex flex-col rounded-lg py-1.5" style={{ background: "rgba(139,92,246,0.07)" }}>
                                <span className="text-sm font-semibold text-violet-500">{monthStats.permission || 0}</span>
                                <span className="text-[9px] text-default-400">Perm.</span>
                            </div>
                            <div className="flex flex-col rounded-lg py-1.5" style={{ background: "rgba(14,165,233,0.07)" }}>
                                <span className="text-sm font-semibold text-sky-500">{monthStats.half_day || 0}</span>
                                <span className="text-[9px] text-default-400">Half</span>
                            </div>
                        </div>

                        {/* Leave / Absent / Holiday */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="flex flex-col bg-warning-50/30 dark:bg-warning-950/10 rounded-lg py-1.5">
                                <span className="text-sm font-semibold text-warning">{monthStats.leave || 0}</span>
                                <span className="text-[10px] text-default-400">Leave</span>
                            </div>
                            <div className="flex flex-col bg-danger-50/30 dark:bg-danger-950/10 rounded-lg py-1.5">
                                <span className="text-sm font-semibold text-danger">{monthStats.absent || 0}</span>
                                <span className="text-[10px] text-default-400">Absent</span>
                            </div>
                            <div className="flex flex-col bg-primary-50/30 dark:bg-primary-950/10 rounded-lg py-1.5">
                                <span className="text-sm font-semibold text-primary">{monthStats.holiday || 0}</span>
                                <span className="text-[10px] text-default-400">Holiday</span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>


            {/* ── Card 3: Year ─────────────────────────────────────────── */}
            <Card className="shadow-md transition-all duration-300 border border-success/20 bg-gradient-to-br from-success-50/50 via-background to-background dark:from-success-950/20 dark:via-background dark:to-background">
                <CardBody className="py-3 px-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-default-500 uppercase font-semibold tracking-wide">Year {new Date().getFullYear()}</p>
                        <Chip size="sm" variant="shadow" color="success" className="h-5 font-semibold">
                            {yearStats.total_present || 0} Days
                        </Chip>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-default-400">On Time</span>
                                <span className="text-sm font-semibold text-success">{yearStats.on_time || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-default-400">Late</span>
                                <span className="text-sm font-semibold text-warning">{yearStats.late || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-default-400">Permission</span>
                                <span className="text-sm font-semibold text-violet-500">{yearStats.permission || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-default-400">Half Day</span>
                                <span className="text-sm font-semibold text-sky-500">{yearStats.half_day || 0}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-default-400">Absent</span>
                                <span className="text-sm font-semibold text-danger">{yearStats.absent || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-default-400">Leave</span>
                                <span className="text-sm font-semibold text-secondary">{yearStats.leave || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-default-400">Holiday</span>
                                <span className="text-sm font-semibold text-primary">{yearStats.holiday || 0}</span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

        </div>
    );
};

export default AttendanceMetrics;
