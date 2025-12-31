"use client";

import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Textarea, Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Progress } from "@heroui/progress";
import { useDispatch } from "react-redux";
import { submitEodReportRequest } from "@/store/task/action";
import { Card, CardBody } from "@heroui/card";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface EodReportDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: any[];
}

const EodReportDrawer = ({ isOpen, onClose, tasks }: EodReportDrawerProps) => {
    const dispatch = useDispatch();
    const [reports, setReports] = useState<Record<string, any>>({});

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const reportArray = Object.values(reports);
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
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm">{task.task_name}</h4>
                                                    <p className="text-xs text-default-500">{task.description}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Select
                                                        label="Status"
                                                        size="sm"
                                                        className="w-40"
                                                        selectedKeys={[report.status]}
                                                        onChange={(e) => handleUpdateReport(task.id, "status", e.target.value)}
                                                    >
                                                        <SelectItem key="Todo">To Do</SelectItem>
                                                        <SelectItem key="In Progress">In Progress</SelectItem>
                                                        <SelectItem key="Completed">Completed</SelectItem>
                                                    </Select>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-default-500">Move to Tomorrow?</span>
                                                        <Switch
                                                            size="sm"
                                                            isSelected={report.move_to_tomorrow}
                                                            onValueChange={(val) => handleUpdateReport(task.id, "move_to_tomorrow", val)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span>Today's Progress</span>
                                                    <span className="text-primary">{report.progress}%</span>
                                                </div>
                                                <Progress
                                                    size="sm"
                                                    color={report.status === "Completed" ? "success" : "primary"}
                                                    value={report.progress}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={report.progress}
                                                    onChange={(e) => handleUpdateReport(task.id, "progress", parseInt(e.target.value))}
                                                    className="w-full h-1 bg-default-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                            </div>

                                            <Textarea
                                                label="Work Summary"
                                                placeholder="What did you achieve today?"
                                                size="sm"
                                                value={report.eod_summary}
                                                onChange={(e) => handleUpdateReport(task.id, "eod_summary", e.target.value)}
                                            />
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
        </Drawer>
    );
};

export default EodReportDrawer;
