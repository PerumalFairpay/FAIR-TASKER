import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Fingerprint, Clock, CheckCircle, Calendar, ShieldCheck, Activity, TrendingUp, UserCheck, AlertCircle, Gift } from "lucide-react";

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
    elapsedSeconds: number;
    isBiometric?: boolean;
}

const AttendanceMetrics: React.FC<AttendanceMetricsProps> = ({
    isAdmin,
    todayStats,
    monthStats,
    elapsedSeconds,
    isBiometric
}) => {

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

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

    const statusConfig: Record<string, { label: string; color: string; subtext: string; dot: string; icon: any; bgColor: string; borderColor: string; glow: string }> = {
        OnTime: { label: "On Time", color: "text-emerald-500", subtext: "You're on time today", dot: "bg-emerald-500", icon: CheckCircle, bgColor: "bg-emerald-50/50 dark:bg-emerald-500/10", borderColor: "border-emerald-100 dark:border-emerald-500/20", glow: "rgba(16, 185, 129, 0.4)" },
        Late: { label: "Late Arrival", color: "text-orange-500", subtext: "You arrived late today", dot: "bg-orange-500", icon: Clock, bgColor: "bg-orange-50/50 dark:bg-orange-500/10", borderColor: "border-orange-100 dark:border-orange-500/20", glow: "rgba(249, 115, 22, 0.4)" },
        Permission: { label: "Permission", color: "text-violet-500", subtext: "Approved leave of absence", dot: "bg-violet-500", icon: ShieldCheck, bgColor: "bg-violet-50/50 dark:bg-violet-500/10", borderColor: "border-violet-100 dark:border-violet-500/20", glow: "rgba(139, 92, 246, 0.4)" },
        HalfDay: { label: "Half Day", color: "text-sky-500", subtext: "Half day attendance recorded", dot: "bg-sky-500", icon: Activity, bgColor: "bg-sky-50/50 dark:bg-sky-500/10", borderColor: "border-sky-100 dark:border-sky-500/20", glow: "rgba(14, 165, 233, 0.4)" },
        Leave: { label: "On Leave", color: "text-rose-500", subtext: "You're on leave today", dot: "bg-rose-500", icon: Calendar, bgColor: "bg-rose-50/50 dark:bg-rose-500/10", borderColor: "border-rose-100 dark:border-rose-500/20", glow: "rgba(244, 63, 94, 0.4)" },
        Holiday: { label: "Holiday", color: "text-indigo-500", subtext: "Public holiday / Day off", dot: "bg-indigo-500", icon: Gift, bgColor: "bg-indigo-50/50 dark:bg-indigo-500/10", borderColor: "border-indigo-100 dark:border-indigo-500/20", glow: "rgba(99, 102, 241, 0.4)" },
        Absent: { label: "Absent", color: "text-red-500", subtext: "No attendance recorded", dot: "bg-red-500", icon: AlertCircle, bgColor: "bg-red-50/50 dark:bg-red-500/10", borderColor: "border-red-100 dark:border-red-500/20", glow: "rgba(239, 68, 68, 0.4)" },
        None: { label: "No Record", color: "text-slate-400", subtext: "Waiting for clock in...", dot: "bg-slate-300", icon: Clock, bgColor: "bg-slate-50 dark:bg-white/5", borderColor: "border-slate-100 dark:border-white/5", glow: "rgba(148, 163, 184, 0.4)" },
    };

    const currentStatus = statusConfig[userStatus];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">

            {/* ── CARD 1: TODAY ─────────────────────────────────────────── */}
            <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md overflow-hidden">
                <CardHeader className="flex justify-between items-center px-4 pt-3 pb-1">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                            {isAdmin ? "Today's Insights" : "Primary Status"}
                        </h3>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {isAdmin ? "Daily Tracking Overview" : "Your current attendance state"}
                        </p>
                    </div>
                    <div className={`p-1.5 ${currentStatus.bgColor} rounded-md ${currentStatus.color}`}>
                        {React.createElement(currentStatus.icon, { size: 14 })}
                    </div>
                </CardHeader>
                <CardBody className="px-4 py-2">
                    {isAdmin ? (
                        <div className="space-y-3">
                            {/* Visual Gauge and Main Stat */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-50 dark:border-white/5">
                                <div className="relative w-24 h-24 flex-shrink-0 group">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <defs>
                                            <linearGradient id="todayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#059669" />
                                            </linearGradient>
                                        </defs>

                                        {/* Background Ring */}
                                        <circle cx="48" cy="48" r="42" strokeWidth="8" fill="none" className="stroke-slate-100 dark:stroke-white/5" />

                                        {/* Progress Ring */}
                                        <circle
                                            cx="48" cy="48" r="42" strokeWidth="8" fill="none"
                                            stroke="url(#todayGrad)"
                                            className="transition-all duration-1500 ease-out"
                                            strokeDasharray={264}
                                            strokeDashoffset={(() => {
                                                const total = (todayStats.on_time || 0) + (todayStats.late || 0) + (todayStats.permission || 0) + (todayStats.half_day || 0) + (todayStats.leave || 0) + (todayStats.absent || 0) + (todayStats.holiday || 0);
                                                const present = (todayStats.on_time || 0) + (todayStats.late || 0) + (todayStats.permission || 0) + (todayStats.half_day || 0);
                                                if (total === 0) return 264;
                                                return 264 - (264 * (present / total));
                                            })()}
                                            strokeLinecap="round"
                                            style={{ filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))" }}
                                        />
                                    </svg>

                                    {/* Center Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/80 dark:bg-zinc-800/60 backdrop-blur-md shadow-sm border border-white/50 dark:border-white/5">
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                    {(todayStats.on_time || 0) + (todayStats.late || 0) + (todayStats.permission || 0) + (todayStats.half_day || 0)}
                                                </span>
                                            </div>
                                            <span className="text-[7px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-0.5">Present</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Distribution Bars */}
                                <div className="flex-1 w-full flex flex-col gap-2">
                                    {[
                                        { label: "On Time", val: todayStats.on_time, color: "bg-emerald-500", track: "bg-emerald-50 dark:bg-emerald-500/10", txt: "text-emerald-600 dark:text-emerald-400" },
                                        { label: "Late Arrival", val: todayStats.late, color: "bg-orange-500", track: "bg-orange-50 dark:bg-orange-500/10", txt: "text-orange-600 dark:text-orange-400" },
                                        { label: "Absent", val: todayStats.absent, color: "bg-rose-500", track: "bg-rose-50 dark:bg-rose-500/10", txt: "text-rose-600 dark:text-rose-400" },
                                    ].map((item, idx) => {
                                        const totalCases = (todayStats.on_time || 0) + (todayStats.late || 0) + (todayStats.absent || 0);
                                        const pct = totalCases > 0 ? (item.val / totalCases) * 100 : 0;
                                        return (
                                            <div key={idx} className="flex flex-col gap-0.5">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide">{item.label}</span>
                                                    <span className={`text-[10px] font-bold ${item.txt}`}>{item.val || 0}</span>
                                                </div>
                                                <Progress
                                                    size="sm"
                                                    radius="sm"
                                                    classNames={{ base: "h-1", track: item.track, indicator: item.color }}
                                                    value={pct}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Additional Status Highlights */}
                            <div className="grid grid-cols-4 gap-1.5">
                                {[
                                    { label: "Perm.", val: todayStats.permission, color: "bg-violet-500", txt: "text-violet-600 dark:text-violet-400", bgColor: "bg-violet-50 dark:bg-violet-500/10" },
                                    { label: "Half D.", val: todayStats.half_day, color: "bg-sky-500", txt: "text-sky-600 dark:text-sky-400", bgColor: "bg-sky-50 dark:bg-sky-500/10" },
                                    { label: "Leave", val: todayStats.leave, color: "bg-rose-500", txt: "text-rose-600 dark:text-rose-400", bgColor: "bg-rose-50 dark:bg-rose-500/10" },
                                    { label: "Holiday", val: todayStats.holiday, color: "bg-indigo-500", txt: "text-indigo-600 dark:text-indigo-400", bgColor: "bg-indigo-50 dark:bg-indigo-500/10" }
                                ].map((stat, i) => (
                                    <div key={i} className={`p-1 rounded-md ${stat.bgColor} border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center`}>
                                        <span className={`text-[11px] font-black ${stat.txt}`}>{stat.val || 0}</span>
                                        <span className="text-[6px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
                            {/* Employee Focus Card */}
                            <div className="flex-1 w-full space-y-3">
                                <div className={`p-3 rounded-2xl ${currentStatus.bgColor} ${currentStatus.borderColor} border w-full relative overflow-hidden group`}>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-2 h-2 rounded-full ${currentStatus.dot} animate-pulse`} style={{ boxShadow: `0 0 6px ${currentStatus.glow}` }} />
                                            <span className={`text-base font-black tracking-tight ${currentStatus.color}`}>
                                                {currentStatus.label}
                                            </span>
                                        </div>
                                        <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 mb-3">{currentStatus.subtext}</p>

                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none">Logged via</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <div className="p-1 bg-white dark:bg-white/10 rounded-md shadow-sm border border-slate-100 dark:border-white/5">
                                                        {isBiometric ? <Fingerprint size={10} className="text-blue-500" /> : <Clock size={10} className="text-emerald-500" />}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{isBiometric ? "Biometric" : "Portal"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Background decorative icon */}
                                    <div className="absolute -right-2 -bottom-2 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none">
                                        {React.createElement(currentStatus.icon, { size: 60 })}
                                    </div>
                                </div>
                            </div>

                            {/* Circular Live Timer */}
                            <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <defs>
                                        <linearGradient id="liveTimerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor={userStatus === 'Late' ? '#f97316' : '#10b981'} />
                                            <stop offset="100%" stopColor={userStatus === 'Late' ? '#ea580c' : '#059669'} />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="48" cy="48" r="42" strokeWidth="8" fill="none" className="stroke-slate-100 dark:stroke-white/5" />
                                    <circle cx="48" cy="48" r="42" strokeWidth="8" fill="none"
                                        stroke="url(#liveTimerGrad)"
                                        strokeDasharray={264}
                                        strokeDashoffset={264 - (264 * (Math.min(elapsedSeconds / 32400, 1)))}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-linear"
                                        style={{ filter: `drop-shadow(0 0 3px ${currentStatus.glow})` }}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className={`text-base font-black tabular-nums tracking-tighter text-slate-800 dark:text-white`}>
                                        {formatDuration(elapsedSeconds)}
                                    </span>
                                    <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Duration</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* ── CARD 2: MONTHLY ─────────────────────────────────────── */}
            <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md overflow-hidden">
                <CardHeader className="flex justify-between items-center px-4 pt-3 pb-1">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Monthly Recap</h3>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Aggregate Performance</p>
                    </div>
                    <div className="p-1.5 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-md text-indigo-500">
                        <TrendingUp size={14} />
                    </div>
                </CardHeader>
                <CardBody className="px-4 py-2">
                    <div className="space-y-3">
                        {/* Summary Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-50 dark:border-white/5">
                            {/* Comparison Ring */}
                            <div className="relative w-24 h-24 flex-shrink-0 group">
                                <svg className="w-full h-full transform -rotate-90">
                                    <defs>
                                        <linearGradient id="monthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#4f46e5" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="48" cy="48" r="42" strokeWidth="8" fill="none" className="stroke-slate-100 dark:stroke-white/5" />
                                    <circle
                                        cx="48" cy="48" r="42" strokeWidth="8" fill="none"
                                        stroke="url(#monthGrad)"
                                        className="transition-all duration-1500 ease-out"
                                        strokeDasharray={264}
                                        strokeDashoffset={(() => {
                                            const total = (monthStats.total_present || 0) + (monthStats.absent || 0) + (monthStats.leave || 0) + (monthStats.holiday || 0);
                                            if (total === 0) return 264;
                                            return 264 - (264 * (monthStats.total_present / total));
                                        })()}
                                        strokeLinecap="round"
                                        style={{ filter: "drop-shadow(0 0 4px rgba(99, 102, 241, 0.4))" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/80 dark:bg-zinc-800/60 backdrop-blur-md shadow-sm border border-white/50 dark:border-white/5">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{monthStats.total_present || 0}</h4>
                                        <span className="text-[7px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">Present</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Breakdown */}
                            <div className="flex-1 w-full flex flex-col gap-2">
                                {[
                                    { label: "On Time", val: monthStats.on_time, color: "bg-emerald-500", track: "bg-emerald-50 dark:bg-emerald-500/10", txt: "text-emerald-600 dark:text-emerald-400" },
                                    { label: "Late Days", val: monthStats.late, color: "bg-orange-500", track: "bg-orange-50 dark:bg-orange-500/10", txt: "text-orange-600 dark:text-orange-400" },
                                    { label: "Absent Days", val: monthStats.absent, color: "bg-rose-500", track: "bg-rose-50 dark:bg-rose-500/10", txt: "text-rose-600 dark:text-rose-400" },
                                ].map((item, idx) => {
                                    const total = (monthStats.total_present || 0) + (monthStats.absent || 0);
                                    const pct = total > 0 ? (item.val / total) * 100 : 0;
                                    return (
                                        <div key={idx} className="flex flex-col gap-0.5">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide">{item.label}</span>
                                                <span className={`text-[10px] font-bold ${item.txt}`}>{item.val || 0}</span>
                                            </div>
                                            <Progress
                                                size="sm"
                                                radius="sm"
                                                classNames={{ base: "h-1", track: item.track, indicator: item.color }}
                                                value={pct}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Summary Grid */}
                        <div className="grid grid-cols-4 gap-1.5">
                            {[
                                { label: "Leave", val: monthStats.leave, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-500/10", icon: Calendar },
                                { label: "Perm.", val: monthStats.permission, color: "text-violet-600 dark:text-violet-400", bgColor: "bg-violet-50 dark:bg-violet-500/10", icon: ShieldCheck },
                                { label: "Half D.", val: monthStats.half_day, color: "text-sky-600 dark:text-sky-400", bgColor: "bg-sky-50 dark:bg-sky-500/10", icon: Activity },
                                { label: "Holiday", val: monthStats.holiday, color: "text-indigo-600 dark:text-indigo-400", bgColor: "bg-indigo-50 dark:bg-indigo-500/10", icon: UserCheck }
                            ].map((stat, i) => (
                                <div key={i} className={`px-1 py-1.5 rounded-md ${stat.bgColor} border border-slate-50 dark:border-white/5 flex flex-col items-center justify-center`}>
                                    <span className={`text-[11px] font-black ${stat.color}`}>{stat.val || 0}</span>
                                    <span className="text-[6px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardBody>
            </Card>

        </div>
    );
};

export default AttendanceMetrics;
