"use client";

import React, { useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Calendar, Clock, CheckCircle2, AlertCircle, FileText, Briefcase, User, ArrowRightCircle } from "lucide-react";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import parse from "html-react-parser";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import { useDispatch, useSelector } from "react-redux";
import { getTaskRequest } from "@/store/task/action";
import { AppState } from "@/store/rootReducer";
import { Spinner } from "@heroui/spinner";

interface EodReportDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    report: any;
}

const EodReportDetailDrawer = ({ isOpen, onClose, report }: EodReportDetailDrawerProps) => {
    const dispatch = useDispatch();
    const { currentTask, getTaskLoading } = useSelector((state: AppState) => state.Task);
    const [previewFile, setPreviewFile] = React.useState<{ url: string; type: string; name: string } | null>(null);
    const [displayReport, setDisplayReport] = React.useState<any>(report);

    useEffect(() => {
        if (isOpen && report?.task_id) {
            dispatch(getTaskRequest(report.task_id));
        }
    }, [isOpen, report, dispatch]);

    useEffect(() => {
        if (currentTask && report && currentTask.id === report.task_id) {
            // Find the specific report entry from history that matches the timestamp
            // If the report prop has a specific timestamp we match it.
            // Note: The backend 'get_eod_reports' flattens history. We need to match it back.
            const match = currentTask.eod_history?.find((h: any) => h.timestamp === report.timestamp);
            if (match) {
                // Merge to keep context like project/employee names if they aren't in history
                setDisplayReport({ ...report, ...match });
            }
        } else {
            setDisplayReport(report);
        }
    }, [currentTask, report]);

    if (!displayReport) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "success";
            case "In Progress": return "primary";
            case "Todo": return "default";
            case "Blocked": return "danger";
            case "Moved": return "warning";
            default: return "default";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Completed": return <CheckCircle2 size={16} />;
            case "In Progress": return <Clock size={16} />;
            case "Todo": return <Calendar size={16} />;
            case "Blocked": return <AlertCircle size={16} />;
            case "Moved": return <ArrowRightCircle size={16} />;
            default: return null;
        }
    };

    return (
        <>
            <Drawer isOpen={isOpen} onClose={onClose} size="lg">
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-divider">
                                <span className="text-xl font-bold">EOD Report Details</span>
                                <div className="flex items-center gap-2 text-default-500 text-sm">
                                    <Calendar size={14} />
                                    <span>{displayReport.date}</span>
                                    <span className="text-default-300">•</span>
                                    <Clock size={14} />
                                    <span>{new Date(displayReport.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </DrawerHeader>
                            <DrawerBody className="py-6 overflow-y-auto">
                                {getTaskLoading && !currentTask ? (
                                    <div className="flex justify-center items-center h-40">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        {/* Employee & Project Info */}
                                        <div className="flex flex-col md:flex-row gap-4 p-4 bg-default-50 rounded-xl border border-default-100">
                                            <div className="flex-1 flex items-start gap-3">
                                                <Avatar
                                                    src={displayReport.profile_picture}
                                                    name={displayReport.employee_name}
                                                    className="w-10 h-10"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-default-500 uppercase font-semibold">Employee</span>
                                                    <span className="font-medium">{displayReport.employee_name}</span>
                                                </div>
                                            </div>
                                            <Divider orientation="vertical" className="hidden md:block h-10" />
                                            <div className="flex-1 flex items-start gap-3">
                                                <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                                    <Briefcase size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-default-500 uppercase font-semibold">Project</span>
                                                    <span className="font-medium">{displayReport.project_name}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Task Status */}
                                        <div className="space-y-3">
                                            <span className="text-sm font-semibold text-default-600">Task Information</span>
                                            <div className="p-4 border border-default-200 rounded-xl space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-xs text-default-400">Task Name</span>
                                                        <h3 className="text-lg font-semibold">{displayReport.task_name}</h3>
                                                    </div>
                                                    <Chip
                                                        startContent={getStatusIcon(displayReport.status)}
                                                        color={getStatusColor(displayReport.status)}
                                                        variant="flat"
                                                    >
                                                        {displayReport.status}
                                                    </Chip>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-default-500">Progress</span>
                                                        <span className="font-semibold">{displayReport.progress}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-default-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${displayReport.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                                                            style={{ width: `${displayReport.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div className="space-y-3">
                                            <span className="text-sm font-semibold text-default-600">Work Summary</span>
                                            <div className="p-4 bg-default-50 rounded-xl border border-default-100 prose prose-sm max-w-none">
                                                {displayReport.summary ? parse(displayReport.summary) : <span className="italic text-default-400">No summary provided</span>}
                                            </div>
                                        </div>

                                        {/* Attachments */}
                                        {displayReport.attachments && displayReport.attachments.length > 0 && (
                                            <div className="space-y-3">
                                                <span className="text-sm font-semibold text-default-600">Attachments ({displayReport.attachments.length})</span>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {displayReport.attachments.map((att: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-3 p-3 border border-default-200 rounded-lg hover:border-primary cursor-pointer transition-colors group bg-background"
                                                            onClick={() => setPreviewFile({
                                                                url: att.file_url,
                                                                type: att.file_type,
                                                                name: att.file_name,
                                                            })}
                                                        >
                                                            <FileTypeIcon fileType={att.file_type} fileName={att.file_name} />
                                                            <div className="flex flex-col min-w-0 flex-1">
                                                                <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                                                    {att.file_name}
                                                                </span>
                                                                <span className="text-xs text-default-400">Click to preview</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="primary" onPress={onClose}>
                                    Close
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>


            {previewFile && (
                <FilePreviewModal
                    isOpen={Boolean(previewFile)}
                    onClose={() => setPreviewFile(null)}
                    fileUrl={previewFile.url}
                    fileType={previewFile.type}
                    fileName={previewFile.name}
                />
            )}
        </>
    );
};

export default EodReportDetailDrawer;
