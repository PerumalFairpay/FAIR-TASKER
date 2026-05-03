"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { format } from "date-fns";

export function EmployeeDashboardSkeleton() {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentDate(new Date());
        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 px-1">
                <div className="flex-1 space-y-3">
                    <Skeleton className="w-56 h-8 rounded-lg" />
                    <Skeleton className="w-64 h-4 rounded-lg" />
                </div>
                <div className="flex items-center gap-6">
                    <Skeleton className="w-32 h-10 rounded-xl" />
                    <div className="text-right border-l pl-6 border-slate-200 dark:border-white/10">
                        <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            {currentDate ? format(currentDate, "hh:mm:ss a") : "--:--:-- --"}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-500">
                            {currentDate ? format(currentDate, "EEEE, MMM d, yyyy") : ""}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Column 1: Profile & Work Hours (Left) */}
                <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
                    {/* Profile Card */}
                    <Card className="shadow-none border-none bg-default-100 dark:bg-zinc-900/50 w-full h-[260px] rounded-2xl overflow-hidden relative">
                        <Skeleton className="w-full h-full" />
                        <div className="absolute top-4 left-4 z-20">
                            <Skeleton className="w-16 h-5 rounded-full" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                            <Skeleton className="w-32 h-6 rounded-lg" />
                            <Skeleton className="w-24 h-4 rounded-lg" />
                        </div>
                    </Card>

                    {/* Work Hours Card */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl">
                        <CardHeader className="flex justify-between items-center px-5 pt-4">
                            <Skeleton className="w-24 h-4 rounded-lg" />
                            <Skeleton className="w-4 h-4 rounded-full" />
                        </CardHeader>
                        <CardBody className="px-5 pb-6 pt-2 space-y-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-20 h-20 rounded-full shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="w-full h-8 rounded-lg" />
                                    <Skeleton className="w-24 h-3 rounded-lg" />
                                    <Skeleton className="w-16 h-5 rounded-full" />
                                </div>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-default-50">
                                <div className="space-y-1"><Skeleton className="w-10 h-5 rounded-lg" /><Skeleton className="w-16 h-2 rounded-lg" /></div>
                                <div className="space-y-1 text-right"><Skeleton className="w-10 h-5 rounded-lg ml-auto" /><Skeleton className="w-16 h-2 rounded-lg ml-auto" /></div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Today's Birthdays Card */}
                    <Card className="shadow-sm border-none bg-pink-50/50 dark:bg-pink-500/10 rounded-2xl">
                        <CardHeader className="px-5 pt-4 pb-0 flex gap-2">
                            <Skeleton className="w-5 h-5 rounded-lg" />
                            <Skeleton className="w-32 h-4 rounded-lg" />
                        </CardHeader>
                        <CardBody className="px-5 py-8 flex flex-col items-center">
                            <Skeleton className="w-40 h-3 rounded-full" />
                        </CardBody>
                    </Card>
                </div>

                {/* Column 2: Attendance & Leave Credits (Center) */}
                <div className="md:col-span-8 lg:col-span-5 flex flex-col gap-4">
                    {/* Monthly Attendance Card */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div className="space-y-2"><Skeleton className="w-44 h-6 rounded-lg" /><Skeleton className="w-32 h-3 rounded-lg" /></div>
                            <Skeleton className="w-6 h-6 rounded-full" />
                        </CardHeader>
                        <CardBody className="px-6 py-6 space-y-8">
                            <div className="flex items-center justify-between gap-8">
                                <Skeleton className="w-36 h-36 rounded-full shrink-0" />
                                <div className="flex-1 space-y-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><Skeleton className="w-3 h-3 rounded-full" /><Skeleton className="w-16 h-2 rounded-lg" /></div><Skeleton className="w-8 h-3 rounded-lg" /></div>
                                            <Skeleton className="w-full h-1 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-14 rounded-xl border border-default-100 dark:border-white/5 bg-default-50/50 flex flex-col items-center justify-center space-y-1.5"><Skeleton className="w-6 h-4 rounded-lg" /><Skeleton className="w-10 h-2 rounded-lg" /></div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Leave Credits Card */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl">
                        <CardHeader className="flex justify-between items-center px-6 pt-5 pb-2">
                            <div className="flex gap-2 items-center"><Skeleton className="w-5 h-5 rounded-lg" /><Skeleton className="w-32 h-4 rounded-lg" /></div>
                            <Skeleton className="w-12 h-3 rounded-lg" />
                        </CardHeader>
                        <CardBody className="px-6 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b border-default-50 last:border-0"><Skeleton className="w-28 h-2.5 rounded-lg" /><Skeleton className="w-10 h-2.5 rounded-lg" /></div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Column 3: Accordions & Blogs (Right) */}
                <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="shadow-sm border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl overflow-hidden">
                                <CardBody className="p-0">
                                    <div className="flex items-center justify-between px-5 py-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                                            <div className="flex-1 space-y-2"><Skeleton className="w-32 h-4 rounded-lg" /><Skeleton className="w-24 h-3 rounded-lg" /></div>
                                        </div>
                                        <Skeleton className="w-4 h-4 rounded-md shrink-0 ml-4" />
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <Skeleton className="w-20 h-5 rounded-lg" />
                            <Skeleton className="w-16 h-3 rounded-lg" />
                        </div>
                        <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl overflow-hidden">
                            <Skeleton className="w-full h-48" />
                            <CardBody className="p-4 space-y-4">
                                <Skeleton className="w-full h-5 rounded-lg" />
                                <div className="space-y-2"><Skeleton className="w-full h-2.5 rounded-lg" /><Skeleton className="w-2/3 h-2.5 rounded-lg" /></div>
                                <div className="flex items-center gap-2 pt-2"><Skeleton className="w-7 h-7 rounded-full" /><Skeleton className="w-24 h-3 rounded-lg" /></div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AdminDashboardSkeleton() {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentDate(new Date());
        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 px-1">
                <div className="flex-1 space-y-3">
                    <Skeleton className="w-56 h-8 rounded-lg" />
                    <Skeleton className="w-72 h-4 rounded-lg" />
                </div>
                <div className="w-full md:w-auto text-left md:text-right border-l-0 md:border-l md:pl-6 border-slate-200 dark:border-white/10">
                    <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                        {currentDate ? format(currentDate, "hh:mm:ss a") : "--:--:-- --"}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-500">
                        {currentDate ? format(currentDate, "EEEE, MMM d, yyyy") : ""}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Column 1: Left (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Attendance Overview Card */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div className="space-y-2"><Skeleton className="w-44 h-6 rounded-lg" /><Skeleton className="w-36 h-3 rounded-lg" /></div>
                            <div className="flex gap-2 items-center"><Skeleton className="w-24 h-6 rounded-lg" /><Skeleton className="w-6 h-6 rounded-full" /></div>
                        </CardHeader>
                        <CardBody className="px-6 py-6 space-y-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                                <Skeleton className="w-44 h-44 rounded-full shrink-0" />
                                <div className="flex-1 w-full space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center"><Skeleton className="w-16 h-2 rounded-lg" /><Skeleton className="w-10 h-2 rounded-lg" /></div>
                                            <Skeleton className="w-full h-1.5 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-16 rounded-xl" />
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Small Row Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center gap-2"><Skeleton className="w-4 h-4 rounded-full" /><Skeleton className="w-24 h-3 rounded-lg" /></div>
                            <Skeleton className="w-16 h-8 rounded-lg" />
                            <div className="flex justify-between"><Skeleton className="w-8 h-2 rounded-lg" /><Skeleton className="w-8 h-2 rounded-lg" /></div>
                        </Card>
                        <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center gap-2"><Skeleton className="w-4 h-4 rounded-full" /><Skeleton className="w-24 h-3 rounded-lg" /></div>
                            <Skeleton className="w-16 h-8 rounded-lg" />
                            <div className="flex justify-between"><Skeleton className="w-8 h-2 rounded-lg" /><Skeleton className="w-8 h-2 rounded-lg" /></div>
                        </Card>
                    </div>

                    {/* Workforce Overview */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl h-48">
                        <CardHeader className="px-6 pt-6 flex justify-between"><Skeleton className="w-44 h-6 rounded-lg" /><Skeleton className="w-8 h-8 rounded-lg" /></CardHeader>
                        <CardBody className="px-6 flex justify-center"><Skeleton className="w-full h-20 rounded-xl" /></CardBody>
                    </Card>
                </div>

                {/* Column 2: Center (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Leave Approvals */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl h-80">
                        <CardHeader className="flex justify-between px-6 pt-6">
                            <div className="space-y-2"><Skeleton className="w-36 h-5 rounded-lg" /><Skeleton className="w-24 h-3 rounded-lg" /></div>
                            <Skeleton className="w-6 h-6 rounded-full" />
                        </CardHeader>
                        <CardBody className="flex flex-col items-center justify-center space-y-3">
                            <Skeleton className="w-40 h-3 rounded-lg" />
                        </CardBody>
                    </Card>

                    {/* Upcoming Holidays */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl">
                        <CardHeader className="flex gap-2 px-6 pt-6"><Skeleton className="w-6 h-6 rounded-lg" /><Skeleton className="w-40 h-5 rounded-lg" /></CardHeader>
                        <CardBody className="px-6 py-4 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Skeleton className="w-10 h-10 rounded-xl" />
                                    <div className="flex-1 space-y-2"><Skeleton className="w-32 h-4 rounded-lg" /><Skeleton className="w-24 h-2 rounded-lg" /></div>
                                    <Skeleton className="w-10 h-6 rounded-lg" />
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>

                {/* Column 3: Right (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Recent Joiners */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl">
                        <CardHeader className="flex justify-between px-6 pt-6">
                            <Skeleton className="w-32 h-5 rounded-lg" />
                            <Skeleton className="w-8 h-8 rounded-lg" />
                        </CardHeader>
                        <CardBody className="py-8 flex justify-center"><Skeleton className="w-32 h-3 rounded-lg" /></CardBody>
                    </Card>

                    {/* Work Mode */}
                    <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl">
                        <CardHeader className="flex justify-between px-6 pt-6">
                            <div className="space-y-2"><Skeleton className="w-32 h-5 rounded-lg" /><Skeleton className="w-40 h-3 rounded-lg" /></div>
                            <Skeleton className="w-8 h-8 rounded-lg" />
                        </CardHeader>
                        <CardBody className="px-6 py-6 space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center"><Skeleton className="w-20 h-3 rounded-lg" /><Skeleton className="w-12 h-3 rounded-lg" /></div>
                                    <Skeleton className="w-full h-2 rounded-full" />
                                </div>
                            ))}
                        </CardBody>
                    </Card>

                    {/* Blogs */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <Skeleton className="w-20 h-5 rounded-lg" />
                            <Skeleton className="w-16 h-3 rounded-lg" />
                        </div>
                        <Card className="shadow-sm border border-default-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl overflow-hidden">
                            <Skeleton className="w-full h-44" />
                            <CardBody className="p-4 space-y-4">
                                <Skeleton className="w-full h-5 rounded-lg" />
                                <div className="flex items-center gap-2"><Skeleton className="w-6 h-6 rounded-full" /><Skeleton className="w-24 h-3 rounded-lg" /></div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardSkeleton({ type }: { type?: "admin" | "employee" }) {
    return (
        <div className="min-h-screen">
            {type === "admin" ? <AdminDashboardSkeleton /> : <EmployeeDashboardSkeleton />}
        </div>
    );
}
