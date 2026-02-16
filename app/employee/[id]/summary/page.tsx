"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { getEmployeeDashboardSummaryRequest } from "@/store/employee/action";
import { RootState } from "@/store/store";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import { PermissionGuard } from "@/components/PermissionGuard";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmployeeSummaryPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { employeeDashboard, dashboardLoading, dashboardError } = useSelector(
        (state: RootState) => state.Employee
    );

    // We can also fetch blogs if needed, or pass empty array
    const { blogs } = useSelector((state: RootState) => state.Blog);

    useEffect(() => {
        if (id) {
            dispatch(getEmployeeDashboardSummaryRequest(id));
        }
    }, [dispatch, id]);

    return (
        <PermissionGuard permission="employee:view" fallback={<div className="p-6 text-center text-red-500">Access Denied</div>}>
            <div className="p-6 min-h-screen">
                <div className="mb-6 flex items-center gap-4">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <h1 className="text-2xl font-bold">Employee Summary</h1>
                </div>

                {dashboardLoading ? (
                    <div className="flex h-[80vh] items-center justify-center">
                        <Spinner size="lg" label="Loading summary..." />
                    </div>
                ) : dashboardError ? (
                    <div className="flex h-[50vh] items-center justify-center text-danger flex-col gap-4">
                        <p>Error loading summary: {typeof dashboardError === 'string' ? dashboardError : 'Unknown error'}</p>
                        <Button color="primary" onPress={() => dispatch(getEmployeeDashboardSummaryRequest(id))}>
                            Retry
                        </Button>
                    </div>
                ) : employeeDashboard ? (
                    <EmployeeDashboard
                        data={employeeDashboard}
                        blogs={blogs || []}
                        isViewOnly={true}
                    />
                ) : (
                    <div className="text-center p-10 text-default-400">
                        No data available for this employee.
                    </div>
                )}
            </div>
        </PermissionGuard>
    );
}
