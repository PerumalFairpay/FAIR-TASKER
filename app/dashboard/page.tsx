
"use client";

import React, { useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getDashboardData } from "@/store/dashboard/action";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import { Spinner } from "@heroui/spinner";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { dashboardData, loading, error } = useSelector((state: RootState) => state.Dashboard);

    useEffect(() => {
        dispatch(getDashboardData());
    }, [dispatch]);

    return (
        <div className="p-6 min-h-screen">
            {/* <div className="mb-6">
                <PageHeader title="Dashboard" />
            </div> */}

            {loading ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <Spinner size="lg" label="Loading dashboard..." />
                </div>
            ) : error ? (
                <div className="flex h-[50vh] items-center justify-center text-danger">
                    Error loading dashboard: {error}
                </div>
            ) : dashboardData ? (
                <>
                    {dashboardData.type === "admin" ? (
                        <AdminDashboard data={dashboardData} />
                    ) : (
                        <EmployeeDashboard data={dashboardData} />
                    )}
                </>
            ) : null}
        </div>
    );
}
