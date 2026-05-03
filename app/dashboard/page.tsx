
"use client";

import React, { useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getDashboardData } from "@/store/dashboard/action";
import { getBlogsRequest } from "@/store/blog/action";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { dashboardData, loading, error } = useSelector((state: RootState) => state.Dashboard);
    const { blogs } = useSelector((state: RootState) => state.Blog);
    const { user } = useSelector((state: RootState) => state.Auth);

    useEffect(() => {
        dispatch(getDashboardData());
        dispatch(getBlogsRequest());
    }, [dispatch]);

    return (
        <div className="p-4 sm:p-6 min-h-screen">
            {/* <div className="mb-6">
                <PageHeader title="Dashboard" />
            </div> */}

            {loading ? (
                <DashboardSkeleton type={user?.role} />
            ) : error ? (
                <div className="flex h-[50vh] items-center justify-center text-danger">
                    Error loading dashboard: {error}
                </div>
            ) : dashboardData ? (
                <>
                    {dashboardData.type === "admin" ? (
                        <AdminDashboard data={dashboardData} />
                    ) : (
                        <EmployeeDashboard data={dashboardData} blogs={blogs || []} />
                    )}
                </>
            ) : null}
        </div>
    );
}
