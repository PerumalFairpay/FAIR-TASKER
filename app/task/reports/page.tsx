"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEodReportsRequest } from "@/store/task/action";
import { AppState } from "@/store/rootReducer";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Search, Calendar, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Spinner } from "@heroui/spinner";

const EODReportsPage = () => {
    const dispatch = useDispatch();
    const { eodReports, loading } = useSelector((state: AppState) => state.Task);

    useEffect(() => {
        dispatch(getEodReportsRequest());
    }, [dispatch]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "success";
            case "In Progress":
                return "primary";
            case "Todo":
                return "default";
            case "Blocked":
                return "danger";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Completed":
                return <CheckCircle2 size={16} />;
            case "In Progress":
                return <Clock size={16} />;
            case "Todo":
                return <Calendar size={16} />;
            case "Blocked":
                return <AlertCircle size={16} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="text-primary" />
                    Submitted EOD Reports
                </h1>
                <p className="text-default-500">
                    Track daily progress and task summaries across all projects.
                </p>
            </div>

            <Card className="shadow-sm border-divider">
                <CardHeader className="flex justify-between items-center px-6 py-4">
                    <div className="flex items-center gap-4 w-full max-w-md">
                        <Input
                            placeholder="Search by task or summary..."
                            startContent={<Search size={18} className="text-default-400" />}
                            size="sm"
                        />
                    </div>
                </CardHeader>
                <CardBody className="px-0 py-0">
                    <Table
                        aria-label="EOD Reports Table"
                        shadow="none"
                        classNames={{
                            wrapper: "rounded-none border-none",
                            th: "bg-default-50 text-default-600 font-semibold",
                        }}
                    >
                        <TableHeader>
                            <TableColumn>DATE</TableColumn>
                            <TableColumn>PROJECT</TableColumn>
                            <TableColumn>TASK NAME</TableColumn>
                            <TableColumn>EMPLOYEE</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>PROGRESS</TableColumn>
                            <TableColumn>SUMMARY</TableColumn>
                        </TableHeader>
                        <TableBody
                            emptyContent={loading ? <Spinner /> : "No EOD reports found."}
                            items={eodReports || []}
                        >
                            {(item: any) => (
                                <TableRow key={`${item.task_id}-${item.timestamp}`}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium whitespace-nowrap">{item.date}</span>
                                            <span className="text-xs text-default-400">
                                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-primary">
                                            {item.project_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px] font-medium">
                                            {item.task_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.employee_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            startContent={getStatusIcon(item.status)}
                                            color={getStatusColor(item.status)}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {item.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-1.5 bg-default-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${item.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold">{item.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-default-600 max-w-[300px]">
                                            {item.summary || <span className="italic text-default-400">No summary provided</span>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
};

export default EODReportsPage;
