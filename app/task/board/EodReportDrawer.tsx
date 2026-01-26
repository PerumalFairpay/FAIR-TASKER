"use client";

import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Slider } from "@heroui/slider";
import { useDispatch } from "react-redux";
import { submitEodReportRequest } from "@/store/task/action";
import { Card, CardBody } from "@heroui/card";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import FileUpload from "@/components/common/FileUpload";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface EodReportDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: any[];
    initialReports?: Record<string, any>;
}

const EodReportDrawer = ({ isOpen, onClose, tasks, initialReports }: EodReportDrawerProps) => {
    const dispatch = useDispatch();
    const [reports, setReports] = useState<Record<string, any>>({});

    React.useEffect(() => {
        if (isOpen) {
            setReports(initialReports || {});
        }
    }, [isOpen, initialReports]);

    const handleUpdateReport = (taskId: string, field: string, value: any) => {
        setReports(prev => ({
            ...prev,
            [taskId]: {
                ...(prev[taskId] || {
                    task_id: taskId,
                    status: "In Progress",
                    progress: 0,
                    eod_summary: "",
                    move_to_tomorrow: false,
                }),
                [field]: value
            }
        }));
    };

    const handleFilePondUpdate = (taskId: string, fileItems: any[]) => {
        setReports(prev => ({
            ...prev,
            [taskId]: {
                ...(prev[taskId] || {
                    task_id: taskId,
                    status: "In Progress",
                    progress: 0,
                    eod_summary: "",
                    move_to_tomorrow: false,
                }),
                files: fileItems
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Extract native File objects from FilePond items for submission
        const reportArray = Object.values(reports).map((report: any) => ({
            ...report,
            files: report.files ? report.files.map((f: any) => f.file) : []
        }));

        if (reportArray.length > 0) {
            dispatch(submitEodReportRequest({ reports: reportArray }));
            onClose();
            setReports({});
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} size="xl">
            <DrawerContent>
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    <DrawerHeader className="flex flex-col gap-1">
                        End of Day Report
                        <p className="text-xs font-normal text-default-500">
                            Update status for all your active tasks today
                        </p>
                    </DrawerHeader>
                    <DrawerBody className="gap-6 overflow-y-auto">
                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-default-400">
                                <CheckCircle2 size={48} className="mb-4 text-success" />
                                <p>All tasks completed! Nothing to report.</p>
                            </div>
                        ) : (
                            tasks.map((task) => {
                                const report = reports[task.id] || {
                                    status: task.status,
                                    progress: task.progress || 0,
                                    move_to_tomorrow: false,
                                    eod_summary: ""
                                };

                                return (
                                    <Card key={task.id} shadow="sm" className="border-divider border-1">
                                        <CardBody className="gap-4">
                                            <div>
                                                <h4 className="font-semibold text-sm">{task.task_name}</h4>
                                                <div
                                                    className="text-xs text-default-500 line-clamp-1 [&>p]:mb-0 [&>p]:inline"
                                                    dangerouslySetInnerHTML={{ __html: (task.description || "").replace(/&nbsp;/g, " ") }}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="space-y-2">
                                                    <Slider
                                                        label="Today's Progress"
                                                        size="md"
                                                        step={5}
                                                        minValue={0}
                                                        maxValue={report.move_to_tomorrow ? 99 : 100}
                                                        showSteps={true}
                                                        color={report.status === "Completed" ? "success" : (report.progress < 30 ? "danger" : report.progress < 70 ? "warning" : "success")}
                                                        value={report.progress}
                                                        isDisabled={report.status === "Completed"}
                                                        onChange={(value) => {
                                                            let val = typeof value === 'number' ? value : value[0];
                                                            if (report.move_to_tomorrow && val > 99) val = 99;
                                                            handleUpdateReport(task.id, "progress", val);
                                                        }}
                                                        className="max-w-md w-full"
                                                        getValue={(v) => `${v}%`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-small font-medium text-foreground">
                                                    Work Summary
                                                </label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={report.eod_summary}
                                                    onChange={(value) => handleUpdateReport(task.id, "eod_summary", value)}
                                                    className="rounded-xl mb-4"
                                                    style={{ height: "150px", marginBottom: "50px" }}
                                                />
                                            </div>

                                            <style jsx global>{`
                                                .ql-toolbar.ql-snow {
                                                    border-color: var(--heroui-default-200) !important;
                                                    border-top-left-radius: 0.75rem;
                                                    border-top-right-radius: 0.75rem;
                                                }
                                                .ql-container.ql-snow {
                                                    border-color: var(--heroui-default-200) !important;
                                                    border-bottom-left-radius: 0.75rem;
                                                    border-bottom-right-radius: 0.75rem;
                                                    min-height: 100px;
                                                }
                                                .dark .ql-editor { color: #E3E3E3; }
                                                .dark .ql-stroke { stroke: #E3E3E3 !important; }
                                                .dark .ql-fill { fill: #E3E3E3 !important; }
                                                .dark .ql-picker { color: #E3E3E3 !important; }
                                            `}</style>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-small font-medium text-foreground">
                                                    Attachments
                                                </label>
                                                <FileUpload
                                                    files={report.files || []}
                                                    setFiles={(fileItems) => handleFilePondUpdate(task.id, fileItems)}
                                                    allowMultiple={true}
                                                    maxFiles={5}
                                                    name={`attachments_${task.id}`}
                                                    labelIdle='Drag & Drop files or <span class="filepond--label-action">Browse</span>'
                                                />
                                            </div>
                                        </CardBody>
                                    </Card>
                                );
                            })
                        )}
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="light" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            type="submit"
                            isDisabled={tasks.length === 0}
                        >
                            Submit Daily Report
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer >
    );
};

export default EodReportDrawer;
