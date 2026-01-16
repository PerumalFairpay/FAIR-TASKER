"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
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
import { Search, Calendar, FileText, CheckCircle2, Clock, AlertCircle, Eye, Download } from "lucide-react";
import { Spinner } from "@heroui/spinner";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getProjectsRequest } from "@/store/project/action";
import { getEmployeesRequest } from "@/store/employee/action";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";

const EODReportsPage = () => {
    const dispatch = useDispatch();
    const { eodReports, loading } = useSelector((state: AppState) => state.Task);
    const { employees } = useSelector((state: AppState) => state.Employee);
    const { projects } = useSelector((state: AppState) => state.Project);
    const { user } = useSelector((state: AppState) => state.Auth);

    const [filterDate, setFilterDate] = useState<string>("");
    const [filterEmployee, setFilterEmployee] = useState<string>("");
    const [filterProject, setFilterProject] = useState<string>("");
    const [filterPriority, setFilterPriority] = useState<string>("");
    const [previewFile, setPreviewFile] = useState<{ url: string; type: string; name: string } | null>(null);

    useEffect(() => {
        dispatch(getProjectsRequest());
        dispatch(getEmployeesRequest());
    }, [dispatch]);

    useEffect(() => {
        const payload: any = {};
        if (filterDate) payload.date = filterDate;
        if (filterProject) payload.project_id = filterProject;
        if (filterPriority) payload.priority = filterPriority;

        const isAdmin = user?.role?.toLowerCase() === "admin";
        if (isAdmin) {
            if (filterEmployee) payload.assigned_to = filterEmployee;
        } else {
            if (user?.employee_id) payload.assigned_to = user.employee_id;
        }

        dispatch(getEodReportsRequest(payload));
    }, [dispatch, filterDate, filterProject, filterPriority, filterEmployee, user]);

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
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex flex-col gap-1">
                    <PageHeader
                        title="EOD Reports"
                        description="Track daily progress and task summaries."
                    />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center bg-default-50 rounded-lg border border-default-200 p-0.5">
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => {
                                try {
                                    const current = filterDate ? parseDate(filterDate) : parseDate(new Date().toISOString().split('T')[0]);
                                    const newDate = current.add({ days: -1 });
                                    setFilterDate(newDate.toString());
                                } catch (e) { console.error(e); }
                            }}
                            size="sm"
                            className="min-w-8 w-8 h-8 text-default-600 hover:text-primary"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <DatePicker
                            size="sm"
                            variant="flat"
                            className="w-32"
                            classNames={{
                                inputWrapper: "bg-transparent shadow-none hover:bg-transparent data-[hover=true]:bg-transparent",
                            }}
                            value={filterDate ? parseDate(filterDate) : undefined}
                            onChange={(date) => setFilterDate(date ? date.toString() : "")}
                            aria-label="Select Date"
                            showMonthAndYearPickers
                        />
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => {
                                try {
                                    const current = filterDate ? parseDate(filterDate) : parseDate(new Date().toISOString().split('T')[0]);
                                    const newDate = current.add({ days: 1 });
                                    setFilterDate(newDate.toString());
                                } catch (e) { console.error(e); }
                            }}
                            size="sm"
                            className="min-w-8 w-8 h-8 text-default-600 hover:text-primary"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>

                    {user?.role?.toLowerCase() === "admin" && (
                        <Select
                            className="w-40"
                            placeholder="Employee"
                            variant="bordered"
                            size="sm"
                            selectedKeys={filterEmployee ? [filterEmployee] : []}
                            onChange={(e) => setFilterEmployee(e.target.value)}
                        >
                            {employees.map((emp: any) => (
                                <SelectItem key={emp.employee_no_id} textValue={emp.name}>
                                    <div className="flex items-center gap-2">
                                        <Avatar size="sm" src={emp.profile_picture} name={emp.name} className="w-6 h-6" />
                                        <span>{emp.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>
                    )}

                    <Select
                        className="w-40"
                        placeholder="Project"
                        variant="bordered"
                        size="sm"
                        selectedKeys={filterProject ? [filterProject] : []}
                        onChange={(e) => setFilterProject(e.target.value)}
                    >
                        {projects.map((proj: any) => (
                            <SelectItem key={proj.id} textValue={proj.name}>
                                {proj.name}
                            </SelectItem>
                        ))}
                    </Select>

                    <Select
                        className="w-32"
                        placeholder="Priority"
                        variant="bordered"
                        size="sm"
                        selectedKeys={filterPriority ? [filterPriority] : []}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        {["Low", "Medium", "High"].map((p) => (
                            <SelectItem key={p}>
                                {p}
                            </SelectItem>
                        ))}
                    </Select>

                    {(filterDate || filterEmployee || filterProject || filterPriority) && (
                        <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            onPress={() => {
                                setFilterDate("");
                                setFilterEmployee("");
                                setFilterProject("");
                                setFilterPriority("");
                            }}
                        >
                            <X size={18} />
                        </Button>
                    )}
                </div>
            </div>


            <Table
                aria-label="EOD Reports Table"
                removeWrapper
                isHeaderSticky
            >
                <TableHeader>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>PROJECT</TableColumn>
                    <TableColumn>TASK NAME</TableColumn>
                    <TableColumn>EMPLOYEE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>PROGRESS</TableColumn>
                    <TableColumn>SUMMARY</TableColumn>
                    <TableColumn>ATTACHMENTS</TableColumn>
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
                                <div
                                    className="text-sm text-default-600 max-w-[300px] prose prose-sm prose-p:my-0 prose-p:leading-relaxed break-words overflow-wrap-anywhere"
                                    dangerouslySetInnerHTML={{
                                        __html: item.summary || '<span class="italic text-default-400">No summary provided</span>'
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                {item.attachments && item.attachments.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {item.attachments.map((att: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="cursor-pointer active:opacity-50 hover:opacity-80 transition-opacity"
                                                onClick={() => setPreviewFile({
                                                    url: att.file_url,
                                                    type: att.file_type,
                                                    name: att.file_name,
                                                })}
                                            >
                                                <FileTypeIcon
                                                    fileType={att.file_type}
                                                    fileName={att.file_name}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-default-300 text-sm">-</span>
                                )}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {previewFile && (
                <FilePreviewModal
                    isOpen={Boolean(previewFile)}
                    onClose={() => setPreviewFile(null)}
                    fileUrl={previewFile.url}
                    fileType={previewFile.type}
                    fileName={previewFile.name}
                />
            )}
        </div>
    );
};

export default EODReportsPage;
