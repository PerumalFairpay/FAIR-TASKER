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
    overtime: number;
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
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
                            <div className="grid grid-cols-5 gap-2 text-center mb-3">
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-success">{todayStats.on_time || 0}</span>
                                    <span className="text-[10px] text-default-400 uppercase">On Time</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-warning">{todayStats.late || 0}</span>
                                    <span className="text-[10px] text-default-400 uppercase">Late</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-danger">{todayStats.absent || 0}</span>
                                    <span className="text-[10px] text-default-400 uppercase">Absent</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-secondary">{todayStats.leave || 0}</span>
                                    <span className="text-[10px] text-default-400 uppercase">Leave</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-primary">{todayStats.holiday || 0}</span>
                                    <span className="text-[10px] text-default-400 uppercase">Holiday</span>
                                </div>
                            </div>
                            <div className="relative h-6 bg-default-100 rounded-full overflow-hidden shadow-inner flex">
                                {(() => {
                                    const total = (todayStats.on_time || 0) + (todayStats.late || 0) + (todayStats.absent || 0) + (todayStats.leave || 0) + (todayStats.holiday || 0);
                                    if (total === 0) return <div className="w-full bg-default-200"></div>;

                                    const onTimePercent = ((todayStats.on_time || 0) / total) * 100;
                                    const latePercent = ((todayStats.late || 0) / total) * 100;
                                    const absentPercent = ((todayStats.absent || 0) / total) * 100;
                                    const leavePercent = ((todayStats.leave || 0) / total) * 100;
                                    const holidayPercent = ((todayStats.holiday || 0) / total) * 100;

                                    return (
                                        <>
                                            {onTimePercent > 0 && (
                                                <div
                                                    className="h-full bg-success transition-all duration-700 ease-out flex items-center justify-center relative"
                                                    style={{ width: `${onTimePercent}%` }}
                                                >
                                                    {onTimePercent > 8 && (
                                                        <span className="text-[10px] font-semibold text-white absolute">
                                                            {Math.round(onTimePercent)}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {latePercent > 0 && (
                                                <div
                                                    className="h-full bg-warning transition-all duration-700 ease-out flex items-center justify-center relative"
                                                    style={{ width: `${latePercent}%` }}
                                                >
                                                    {latePercent > 8 && (
                                                        <span className="text-[10px] font-semibold text-white absolute">
                                                            {Math.round(latePercent)}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {absentPercent > 0 && (
                                                <div
                                                    className="h-full bg-danger transition-all duration-700 ease-out flex items-center justify-center relative"
                                                    style={{ width: `${absentPercent}%` }}
                                                >
                                                    {absentPercent > 8 && (
                                                        <span className="text-[10px] font-semibold text-white absolute">
                                                            {Math.round(absentPercent)}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {leavePercent > 0 && (
                                                <div
                                                    className="h-full bg-secondary transition-all duration-700 ease-out flex items-center justify-center relative"
                                                    style={{ width: `${leavePercent}%` }}
                                                >
                                                    {leavePercent > 8 && (
                                                        <span className="text-[10px] font-semibold text-white absolute">
                                                            {Math.round(leavePercent)}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {holidayPercent > 0 && (
                                                <div
                                                    className="h-full bg-primary transition-all duration-700 ease-out flex items-center justify-center relative"
                                                    style={{ width: `${holidayPercent}%` }}
                                                >
                                                    {holidayPercent > 8 && (
                                                        <span className="text-[10px] font-semibold text-white absolute">
                                                            {Math.round(holidayPercent)}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </>
                    ) : (
                        // User View - Show personal status
                        <div className="flex flex-col items-center justify-center py-4">
                            {todayStats.on_time > 0 ? (
                                <div className="flex items-center justify-between w-full px-4 py-1">
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                                            <span className="text-lg font-bold text-success">On Time</span>
                                        </div>
                                        <p className="text-[10px] text-default-400">You're on time today</p>
                                    </div>
                                    <div className="relative flex items-center justify-center w-14 h-14">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="none" className="text-success-100 dark:text-success-900/20" />
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="none"
                                                strokeDasharray={351}
                                                strokeDashoffset={351 - (351 * (Math.min(elapsedSeconds / 32400, 1)))}
                                                strokeLinecap="round"
                                                className="text-success transition-all duration-1000 ease-linear"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-success tabular-nums tracking-tight leading-none">
                                                {formatDuration(elapsedSeconds)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : todayStats.late > 0 ? (
                                <div className="flex items-center justify-between w-full px-4 py-1">
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
                                            <span className="text-lg font-bold text-warning">Late</span>
                                        </div>
                                        <p className="text-[10px] text-default-400">You arrived late today</p>
                                    </div>
                                    <div className="relative flex items-center justify-center w-14 h-14">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="none" className="text-warning-100 dark:text-warning-900/20" />
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="none"
                                                strokeDasharray={351}
                                                strokeDashoffset={351 - (351 * (Math.min(elapsedSeconds / 32400, 1)))}
                                                strokeLinecap="round"
                                                className="text-warning transition-all duration-1000 ease-linear"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-warning tabular-nums tracking-tight leading-none">
                                                {formatDuration(elapsedSeconds)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : todayStats.absent > 0 ? (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-danger"></div>
                                        <span className="text-2xl font-bold text-danger">Absent</span>
                                    </div>
                                    <p className="text-xs text-default-400">Marked as absent</p>
                                </>
                            ) : todayStats.leave > 0 ? (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                        <span className="text-2xl font-bold text-secondary">On Leave</span>
                                    </div>
                                    <p className="text-xs text-default-400">You're on leave today</p>
                                </>
                            ) : todayStats.holiday > 0 ? (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        <span className="text-2xl font-bold text-primary">Holiday</span>
                                    </div>
                                    <p className="text-xs text-default-400">It's a holiday today</p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-default-300"></div>
                                        <span className="text-2xl font-bold text-default-400">No Record</span>
                                    </div>
                                    <p className="text-xs text-default-400">No attendance recorded yet</p>
                                </>
                            )}
                        </div>
                    )}

                    {todayStats.overtime > 0 && (
                        <div className="mt-2 pt-2 border-t border-divider animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between bg-warning-50/50 dark:bg-warning-950/20 rounded-lg px-2 py-1">
                                <span className="text-xs text-default-400">Overtime</span>
                                <span className="text-sm font-semibold text-warning">{todayStats.overtime} hrs</span>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>


            {/* This Month - Compact with Progress */}
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
                                    style={{ width: `${Math.min(((monthStats.total_present || 0) / Math.max(monthStats.total_present + monthStats.absent + monthStats.leave, 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                        {/* Leave & Absent */}
                        <div className="grid grid-cols-3 gap-2 text-center pt-1">
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

            {/* Year Summary - Compact */}
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
                                <span className="text-xs text-default-400">Absent</span>
                                <span className="text-sm font-semibold text-danger">{yearStats.absent || 0}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-default-400">Leave</span>
                                <span className="text-sm font-semibold text-secondary">{yearStats.leave || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-default-400">Holiday</span>
                                <span className="text-sm font-semibold text-primary">{yearStats.holiday || 0}</span>
                            </div>
                            {yearStats.overtime > 0 && (
                                <div className="flex justify-between items-center bg-warning-50/50 dark:bg-warning-950/20 rounded px-1.5 py-0.5 animate-in fade-in slide-in-from-right-2 duration-500">
                                    <span className="text-xs text-default-400">Overtime</span>
                                    <span className="text-sm font-semibold text-warning">{yearStats.overtime}h</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default AttendanceMetrics;
