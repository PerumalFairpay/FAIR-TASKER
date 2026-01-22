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
import { getEmployeesSummaryRequest } from "@/store/employee/action";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import ShowMoreText from "react-show-more-text";
import parse from "html-react-parser";
import EodReportDetailDrawer from "./EodReportDetailDrawer";

const EODReportsPage = () => {
    const dispatch = useDispatch();
    const { eodReports, getEodReportsLoading: loading } = useSelector((state: AppState) => state.Task);
    const { employees } = useSelector((state: AppState) => state.Employee);
    const { projects } = useSelector((state: AppState) => state.Project);
    const { user } = useSelector((state: AppState) => state.Auth);

    const [filterDate, setFilterDate] = useState<string>("");
    const [filterEmployee, setFilterEmployee] = useState<string>("");
    const [filterProject, setFilterProject] = useState<string>("");
    const [filterPriority, setFilterPriority] = useState<string>("");
    const [previewFile, setPreviewFile] = useState<{ url: string; type: string; name: string } | null>(null);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);

    const handleRowAction = (key: React.Key) => {
        const report = eodReports.find((item: any) => `${item.task_id}-${item.timestamp}` === key);
        if (report) {
            setSelectedReport(report);
        }
    };

    useEffect(() => {
        dispatch(getProjectsRequest());
        if (!employees || employees.length === 0) {
            dispatch(getEmployeesSummaryRequest());
        }
    }, [dispatch, employees]);

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
                selectionMode="single"
                onRowAction={handleRowAction}
                classNames={{
                    tr: "cursor-pointer active:scale-100"
                }}
            >
                <TableHeader>
                    <TableColumn>REFERENCE</TableColumn>
                    <TableColumn>TASK CONTEXT</TableColumn>
                    <TableColumn>COMPLETION</TableColumn>
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
                                <div className="flex items-center gap-3 min-w-[140px]">
                                    <Avatar size="sm" src={item.profile_picture} name={item.employee_name} className="w-8 h-8 flex-shrink-0" radius="lg" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-foreground text-xs truncate">{item.employee_name}</span>
                                        <div className="flex items-center gap-1.5 text-[10px] text-default-400 font-medium">
                                            <span>{item.date}</span>
                                            <span className="text-default-300">•</span>
                                            <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col min-w-[150px] max-w-[200px]">
                                    <span className="font-bold text-sm text-foreground leading-snug break-words mb-0.5">
                                        {item.task_name}
                                    </span>
                                    <span className="text-xs font-bold text-primary truncate">
                                        {item.project_name}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4 min-w-[160px]">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <div className="w-full h-1 bg-default-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-[9px] font-bold text-default-400 font-mono leading-none">
                                            {item.progress}% Complete
                                        </span>
                                    </div>
                                    <Chip
                                        startContent={getStatusIcon(item.status)}
                                        color={getStatusColor(item.status)}
                                        variant="flat"
                                        size="sm"
                                        className="h-5 text-[10px] font-black uppercase shrink-0"
                                    >
                                        {item.status}
                                    </Chip>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div
                                    className="text-xs text-default-600 max-w-[250px] prose prose-sm prose-p:my-0 prose-p:leading-relaxed break-words overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.summary ? (
                                        <ShowMoreText
                                            lines={2}
                                            more="Read more"
                                            less="Read less"
                                            className="content-css"
                                            anchorClass="text-primary cursor-pointer hover:underline text-[10px] font-bold block mt-1 uppercase tracking-tighter"
                                            expanded={false}
                                            width={250}
                                            truncatedEndingComponent={"... "}
                                        >
                                            {parse(item.summary)}
                                        </ShowMoreText>
                                    ) : (
                                        <span className="italic text-default-400 text-[10px]">No summary provided</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                {item.attachments && item.attachments.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.attachments.map((att: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="cursor-pointer active:opacity-50 hover:bg-default-100 p-1 rounded-md transition-all border border-divider/50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewFile({
                                                        url: att.file_url,
                                                        type: att.file_type,
                                                        name: att.file_name,
                                                    });
                                                }}
                                            >
                                                <FileTypeIcon
                                                    fileType={att.file_type}
                                                    fileName={att.file_name}
                                                    size={16}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-default-300 text-xs">-</span>
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

            <EodReportDetailDrawer
                isOpen={Boolean(selectedReport)}
                onClose={() => setSelectedReport(null)}
                report={selectedReport}
            />
        </div>
    );
};

export default EODReportsPage;
