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
    yearStats: DetailedStats;
    elapsedSeconds: number;
    isBiometric?: boolean;
}

const AttendanceMetrics: React.FC<AttendanceMetricsProps> = ({
    isAdmin,
    todayStats,
    monthStats,
    yearStats,
    elapsedSeconds,
    isBiometric
}) => {
    const [selectedTab, setSelectedTab] = React.useState<"month" | "year">("month");
    const activeStats = selectedTab === "month" ? monthStats : yearStats;

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">

            {/* ── CARD 1: PRIMARY STATUS (Today) ─────────────────────────── */}
            <Card className="md:col-span-5 lg:col-span-4 shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md overflow-hidden min-h-[160px]">
                <CardHeader className="flex justify-between items-center px-4 pt-3 pb-0">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                            {isAdmin ? "System Pulse" : "My Attendance"}
                        </h3>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Live</span>
                        </div>
                    )}
                </CardHeader>

                <CardBody className="px-4 py-3 flex flex-col justify-center">
                    {isAdmin ? (
                        <div className="flex items-center gap-5">
                            {/* Compact Radial for Admin */}
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="34" strokeWidth="6" fill="none" className="stroke-slate-100 dark:stroke-white/5" />
                                    <circle
                                        cx="40" cy="40" r="34" strokeWidth="6" fill="none"
                                        stroke="currentColor"
                                        className="text-emerald-500 transition-all duration-1000 ease-out"
                                        strokeDasharray={213}
                                        strokeDashoffset={(() => {
                                            const total = (todayStats.on_time || 0) + (todayStats.late || 0) + (todayStats.absent || 0) + (todayStats.leave || 0) + (todayStats.holiday || 0);
                                            const present = (todayStats.on_time || 0) + (todayStats.late || 0) + (todayStats.permission || 0) + (todayStats.half_day || 0);
                                            if (total === 0) return 213;
                                            return 213 - (213 * (present / total));
                                        })()}
                                        strokeLinecap="round"
                                        style={{ filter: "drop-shadow(0 0 3px rgba(16, 185, 129, 0.3))" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                        {(todayStats.on_time || 0) + (todayStats.late || 0) + (todayStats.permission || 0) + (todayStats.half_day || 0)}
                                    </span>
                                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Present</span>
                                </div>
                            </div>

                            {/* Stat Distribution */}
                            <div className="flex-1 space-y-2">
                                {[
                                    { label: "On Time", val: todayStats.on_time, color: "bg-emerald-500" },
                                    { label: "Late", val: todayStats.late, color: "bg-orange-500" },
                                    { label: "Absent", val: todayStats.absent, color: "bg-rose-500" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex-1">{item.label}</span>
                                        <span className="text-[10px] font-bold text-slate-900 dark:text-white">{item.val || 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`p-1.5 rounded-lg ${currentStatus.bgColor} ${currentStatus.color}`}>
                                        {React.createElement(currentStatus.icon, { size: 16 })}
                                    </div>
                                    <h4 className={`text-lg font-black tracking-tight ${currentStatus.color}`}>
                                        {currentStatus.label}
                                    </h4>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                    {currentStatus.subtext}
                                </p>
                                
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="px-2 py-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-md flex items-center gap-1.5">
                                        {isBiometric ? <Fingerprint size={12} className="text-blue-500" /> : <Clock size={12} className="text-emerald-500" />}
                                        <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">{isBiometric ? "Biometric" : "Portal"}</span>
                                    </div>
                                    <div className="px-2 py-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-md flex items-center gap-1.5">
                                        <Activity size={12} className="text-violet-500" />
                                        <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Live Timer Gauge */}
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" strokeWidth="8" fill="none" className="stroke-slate-100 dark:stroke-white/5" />
                                    <circle
                                        cx="48" cy="48" r="40" strokeWidth="8" fill="none"
                                        stroke="url(#timerGrad)"
                                        strokeDasharray={251}
                                        strokeDashoffset={251 - (251 * (Math.min(elapsedSeconds / 32400, 1)))}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-linear"
                                    />
                                    <defs>
                                        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor={userStatus === 'Late' ? '#f97316' : '#10b981'} />
                                            <stop offset="100%" stopColor={userStatus === 'Late' ? '#ea580c' : '#059669'} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-sm font-black tabular-nums text-slate-800 dark:text-white leading-none">
                                        {formatDuration(elapsedSeconds)}
                                    </span>
                                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Duration</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* ── CARD 2: ANALYTICS RECAP ───────────────────────────────── */}
            <Card className="md:col-span-7 lg:col-span-8 shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-md overflow-hidden">
                <CardHeader className="flex justify-between items-center px-4 pt-3 pb-0">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Performance Recap</h3>
                        <div className="flex bg-slate-100/80 dark:bg-white/5 p-0.5 rounded-full">
                            <button
                                onClick={() => setSelectedTab("month")}
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase transition-all ${selectedTab === "month" ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-400 dark:text-slate-500"}`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setSelectedTab("year")}
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase transition-all ${selectedTab === "year" ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-400 dark:text-slate-500"}`}
                            >
                                Year
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-500">
                        <TrendingUp size={12} />
                        <span className="text-[9px] font-bold uppercase">Trend</span>
                    </div>
                </CardHeader>

                <CardBody className="px-4 py-3">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Summary Rings Group */}
                        <div className="lg:col-span-4 flex justify-around lg:justify-start gap-4">
                            <div className="relative w-24 h-24">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="42" strokeWidth="6" fill="none" className="stroke-slate-100 dark:stroke-white/5" />
                                    <circle
                                        cx="48" cy="48" r="42" strokeWidth="6" fill="none"
                                        stroke="currentColor"
                                        className="text-indigo-500 transition-all duration-1500 ease-out"
                                        strokeDasharray={264}
                                        strokeDashoffset={(() => {
                                            const total = (activeStats.total_present || 0) + (activeStats.absent || 0) + (activeStats.leave || 0) + (activeStats.holiday || 0);
                                            if (total === 0) return 264;
                                            return 264 - (264 * (activeStats.total_present / total));
                                        })()}
                                        strokeLinecap="round"
                                        style={{ filter: "drop-shadow(0 0 4px rgba(99, 102, 241, 0.3))" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                        {activeStats.total_present || 0}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">Days</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col justify-center">
                                <div className="mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Present</span>
                                    <span className="text-lg font-black text-slate-800 dark:text-white">
                                        {Math.round(((activeStats.total_present || 0) / ((activeStats.total_present || 0) + (activeStats.absent || 1) + (activeStats.leave || 0))) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown Bars & Details */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {[
                                    { label: "On Time", val: activeStats.on_time, color: "bg-emerald-500", text: "text-emerald-500" },
                                    { label: "Late Arrivals", val: activeStats.late, color: "bg-orange-500", text: "text-orange-500" },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">{item.label}</span>
                                            <span className={`text-xs font-black ${item.text}`}>{item.val || 0}</span>
                                        </div>
                                        <Progress 
                                            value={((item.val || 0) / (activeStats.total_present || 1)) * 100} 
                                            size="sm" 
                                            radius="full"
                                            classNames={{ indicator: item.color, track: "h-1 bg-slate-200 dark:bg-white/10" }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: "Absent", val: activeStats.absent, color: "text-rose-500", bg: "bg-rose-500/10" },
                                    { label: "Leave", val: activeStats.leave, color: "text-amber-500", bg: "bg-amber-500/10" },
                                    { label: "Perm.", val: activeStats.permission, color: "text-violet-500", bg: "bg-violet-500/10" },
                                    { label: "Half D.", val: activeStats.half_day, color: "text-sky-500", bg: "bg-sky-500/10" },
                                ].map((stat, i) => (
                                    <div key={i} className={`flex flex-col items-center py-1.5 rounded-lg ${stat.bg}`}>
                                        <span className={`text-[11px] font-black ${stat.color}`}>{stat.val || 0}</span>
                                        <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default AttendanceMetrics;

