"use client";

import React, { useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Calendar, Clock, CheckCircle2, AlertCircle, Briefcase, User, ArrowRightCircle, FileText, History, Paperclip, Eye } from "lucide-react";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import parse from "html-react-parser";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import { useDispatch, useSelector } from "react-redux";
import { getTaskRequest } from "@/store/task/action";
import { AppState } from "@/store/rootReducer";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Progress } from "@heroui/progress";

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
            const match = currentTask.eod_history?.find((h: any) => h.timestamp === report.timestamp);
            if (match) {
                // Merge report info (which contains enriched fields like employee_name) with matches from history
                setDisplayReport({ ...report, ...match, task_details: currentTask });
            } else {
                setDisplayReport({ ...report, task_details: currentTask });
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
            case "Completed": return <CheckCircle2 size={12} />;
            case "In Progress": return <Clock size={12} />;
            case "Todo": return <Calendar size={12} />;
            case "Blocked": return <AlertCircle size={12} />;
            case "Moved": return <ArrowRightCircle size={12} />;
            default: return null;
        }
    };

    const history = currentTask?.eod_history ? [...currentTask.eod_history].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];

    return (
        <>
            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                size="md"
                backdrop="blur"
                classNames={{
                    base: "max-w-md bg-background border-l border-divider",
                    header: "border-b border-divider bg-background/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6",
                    body: "p-0",
                    footer: "border-t border-divider bg-background py-4 px-6"
                }}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-bold text-foreground">Report Details</h2>
                                        <div className="flex items-center gap-1 text-[10px] uppercase font-black text-default-400 tracking-wider">
                                            <History size={10} className="text-primary" /> Task Audit Trail
                                        </div>
                                    </div>
                                    <Chip
                                        startContent={getStatusIcon(currentTask?.status || displayReport.status)}
                                        color={getStatusColor(currentTask?.status || displayReport.status)}
                                        variant="flat"
                                        size="sm"
                                        className="capitalize font-bold h-7"
                                    >
                                        {currentTask?.status || displayReport.status}
                                    </Chip>
                                </div>
                            </DrawerHeader>

                            <DrawerBody>
                                <ScrollShadow className="h-full" hideScrollBar>
                                    {getTaskLoading && !currentTask ? (
                                        <div className="flex flex-col justify-center items-center h-64 gap-2">
                                            <Spinner color="primary" size="sm" />
                                            <p className="text-xs font-semibold text-default-400">Fetching task details...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col px-6 py-6 gap-8">

                                            {/* Task & User Context Section */}
                                            <section>
                                                <div className="bg-default-50 border border-divider rounded-2xl p-5 shadow-sm">
                                                    <div className="flex items-center gap-4 mb-5">
                                                        <Avatar
                                                            src={displayReport.profile_picture}
                                                            name={displayReport.employee_name}
                                                            className="w-14 h-14 rounded-xl border-2 border-background shadow-md"
                                                            radius="sm"
                                                            isBordered
                                                            color="primary"
                                                        />
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/5 px-2 py-0.5 rounded">Owner</span>
                                                                <span className="text-xs font-bold text-default-500 truncate">{displayReport.employee_name}</span>
                                                            </div>
                                                            <h3 className="font-bold text-base text-foreground truncate break-all leading-tight">
                                                                {currentTask?.task_name || displayReport.task_name}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-[10px] font-bold text-default-400 flex items-center gap-1">
                                                                    <Briefcase size={10} className="text-secondary" /> {displayReport.project_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 pt-2 border-t border-divider/50">
                                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                            <span className="text-default-400">Total Completion</span>
                                                            <span className="text-primary font-mono text-xs">{(currentTask?.progress || displayReport.progress)}%</span>
                                                        </div>
                                                        <Progress
                                                            value={currentTask?.progress || displayReport.progress}
                                                            color={(currentTask?.progress || displayReport.progress) === 100 ? "success" : "primary"}
                                                            className="h-2"
                                                            radius="full"
                                                        />
                                                    </div>
                                                </div>
                                            </section>

                                            {/* History Timeline */}
                                            <section className="space-y-6">
                                                <div className="flex items-center justify-between bg-default-100/30 p-2.5 rounded-xl border border-divider/50">
                                                    <h3 className="text-[10px] font-black text-default-500 uppercase tracking-widest px-2">Checkpoint History</h3>
                                                    <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                                        {history.length} Logs
                                                    </span>
                                                </div>

                                                <div className="relative space-y-0.5">
                                                    {history.length === 0 && (
                                                        <div className="py-12 flex flex-col items-center justify-center gap-2 text-default-300">
                                                            <History size={32} strokeWidth={1} />
                                                            <p className="text-xs font-bold tracking-widest">NO HISTORY FOUND</p>
                                                        </div>
                                                    )}

                                                    {history.map((item: any, idx: number) => {
                                                        const isSelected = item.timestamp === report.timestamp;
                                                        const isLast = idx === history.length - 1;

                                                        return (
                                                            <div key={idx} className="flex gap-4">
                                                                {/* Central Axis */}
                                                                <div className="flex flex-col items-center flex-shrink-0">
                                                                    <div className={`mt-6 w-3 h-3 rounded-full border-2 bg-background z-10
                                                                        ${isSelected ? 'border-primary ring-4 ring-primary/10' : 'border-default-300'}`} />
                                                                    {!isLast && <div className="w-[1.5px] h-full bg-default-100" />}
                                                                </div>

                                                                {/* Content Card */}
                                                                <div className="flex-1 pb-8">
                                                                    <div className={`relative p-5 rounded-2xl border transition-colors ${isSelected
                                                                        ? 'bg-background border-primary shadow-sm ring-1 ring-primary/5'
                                                                        : 'bg-white border-divider hover:border-default-400'
                                                                        }`}>
                                                                        {isSelected && (
                                                                            <Chip
                                                                                size="sm"
                                                                                color="primary"
                                                                                className="absolute -top-2.5 right-4 h-5 text-[8px] font-black uppercase tracking-widest shadow-md"
                                                                            >
                                                                                Viewing
                                                                            </Chip>
                                                                        )}

                                                                        <header className="flex justify-between items-start mb-4">
                                                                            <div className="flex flex-col gap-0.5">
                                                                                <h4 className={`text-sm font-black tracking-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                                                                    {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                                                </h4>
                                                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                                                    <Clock size={10} className="text-default-400" />
                                                                                    <span className="text-[9px] font-bold text-default-400 uppercase">
                                                                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col items-end gap-1.5">
                                                                                <Chip
                                                                                    size="sm"
                                                                                    variant="flat"
                                                                                    color={getStatusColor(item.status)}
                                                                                    className="h-5 text-[9px] font-black uppercase rounded-lg"
                                                                                >
                                                                                    {item.status}
                                                                                </Chip>
                                                                                <span className="text-[10px] font-bold text-default-400">{item.progress}% Prog.</span>
                                                                            </div>
                                                                        </header>

                                                                        <Divider className="mb-4 opacity-50" />

                                                                        <div className="text-sm text-foreground/80 leading-relaxed font-medium mb-5">
                                                                            <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-foreground prose-strong:font-black">
                                                                                {item.summary ? parse(item.summary) : <span className="text-xs italic text-default-300">No summary.</span>}
                                                                            </div>
                                                                        </div>

                                                                        {item.attachments && item.attachments.length > 0 && (
                                                                            <div className="flex flex-col gap-2.5 pt-4 border-t border-divider/50">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Paperclip size={12} className="text-primary" />
                                                                                    <span className="text-[9px] font-black text-default-400 uppercase tracking-widest">Files ({item.attachments.length})</span>
                                                                                </div>
                                                                                <div className="flex flex-col gap-2">
                                                                                    {item.attachments.map((att: any, aIdx: number) => (
                                                                                        <button
                                                                                            key={aIdx}
                                                                                            onClick={() => setPreviewFile({
                                                                                                url: att.file_url,
                                                                                                type: att.file_type,
                                                                                                name: att.file_name,
                                                                                            })}
                                                                                            className="flex items-center justify-between p-2.5 bg-default-50/50 border border-divider hover:border-primary/40 rounded-xl transition-colors group"
                                                                                        >
                                                                                            <div className="flex items-center gap-3 min-w-0">
                                                                                                <div className="p-1.5 bg-background rounded-lg border border-divider shadow-sm group-hover:border-primary/20 transition-colors">
                                                                                                    <FileTypeIcon fileType={att.file_type} fileName={att.file_name} size={14} />
                                                                                                </div>
                                                                                                <span className="text-[11px] font-bold text-foreground truncate max-w-[150px] group-hover:text-primary transition-colors">{att.file_name}</span>
                                                                                            </div>
                                                                                            <Eye size={12} className="text-default-300 group-hover:text-primary transition-colors" />
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </section>
                                        </div>
                                    )}
                                </ScrollShadow>
                            </DrawerBody>

                            <DrawerFooter>
                                <Button
                                    className="w-full font-black text-xs uppercase tracking-widest h-12"
                                    color="primary"
                                    onPress={onClose}
                                    variant="solid"
                                    radius="lg"
                                >
                                    Close Report
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
