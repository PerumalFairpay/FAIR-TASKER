"use client";

import React from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import {
    ClipboardList,
    PlayCircle,
    CheckCircle2,
    History,
    CalendarDays,
    AlertCircle,
    Info,
    X
} from "lucide-react";

interface TaskRulesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const TaskRulesDrawer: React.FC<TaskRulesDrawerProps> = ({ isOpen, onClose }) => {
    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onClose}
            size="md"
            backdrop="blur"
            placement="right"
            classNames={{
                base: "bg-background border-l border-divider",
                header: "border-b border-divider bg-default-50/50",
                footer: "border-t border-divider bg-default-50/50",
            }}
        >
            <DrawerContent>
                {(onClose: () => void) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primary">
                                    <Info size={24} />
                                    <h2 className="text-xl font-bold">Task Rules & Steps</h2>
                                </div>
                           
                            </div>
                            <p className="text-xs text-default-500 font-normal">
                                Guidelines for effective task tracking and reporting
                            </p>
                        </DrawerHeader>
                        <DrawerBody className="py-6 px-6 flex flex-col gap-8">
                            {/* Section 1: Task Lifecycle */}
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-default-700">
                                    <ClipboardList size={20} className="text-blue-500" />
                                    1. Task Lifecycle
                                </h3>
                                <div className="flex flex-col gap-4">
                                    <div className="p-4 rounded-xl bg-default-50 border border-default-200">
                                        <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                                            <PlayCircle size={16} />
                                            <span>Start (To Do)</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Any team member can <span className="font-semibold text-default-900">create</span> and <span className="font-semibold text-default-900">assign</span> tasks to others. New tasks appear in <span className="font-semibold text-default-900">To Do</span>.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-primary-50 border border-primary-200">
                                        <div className="flex items-center gap-2 mb-2 text-primary-600 font-medium">
                                            <History size={16} />
                                            <span>Work (In Progress)</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Drag tasks to <span className="font-semibold text-primary-600">In Progress</span> when you start. Update progress daily.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-warning-50 border border-warning-200">
                                        <div className="flex items-center gap-2 mb-2 text-warning-600 font-medium">
                                            <CalendarDays size={16} />
                                            <span>Rollover (Moved)</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Tasks not finished today are <span className="font-semibold text-warning-600">Moved to Tomorrow</span>. This creates a fresh task for the next day.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-success-50 border border-success-200">
                                        <div className="flex items-center gap-2 mb-2 text-success-600 font-medium">
                                            <CheckCircle2 size={16} />
                                            <span>Finish (Completed)</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Move to <span className="font-semibold text-success-600">Completed</span> once done. Finalize with an EOD report.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: EOD Reporting */}
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-default-700">
                                    <History size={20} className="text-orange-500" />
                                    2. EOD Reporting
                                </h3>
                                <div className="flex flex-col gap-4">
                                    <div className="p-4 rounded-xl bg-default-50 border border-default-200">
                                        <div className="flex items-center gap-2 mb-2 text-orange-600 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold">1</div>
                                            <span>Trigger Report</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Drag any task to the <span className="font-semibold text-success-600">Completed</span> or <span className="font-semibold text-warning-600">Moved</span> column. This automatically opens the reporting drawer for that task.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-default-50 border border-default-200">
                                        <div className="flex items-center gap-2 mb-2 text-orange-600 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold">2</div>
                                            <span>Update Progress</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Adjust the <span className="font-semibold text-default-900">Progress Slider</span> and update the task status. Mark as <span className="text-success-600 font-semibold">Completed</span> if finished.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-default-50 border border-default-200">
                                        <div className="flex items-center gap-2 mb-2 text-orange-600 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold">3</div>
                                            <span>Submit Summary</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Write your work summary. Check <span className="text-warning-600 font-semibold">Move to Tomorrow</span> for tasks that need rollover, then submit.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Critical Rules */}
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-default-700">
                                    <AlertCircle size={20} className="text-danger-500" />
                                    Critical Rules
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-start p-3 bg-danger-50 rounded-xl border border-danger-100">
                                        <div className="mt-1 text-danger">
                                            <CalendarDays size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-danger-700">Overdue Tasks</p>
                                            <p className="text-xs text-danger-600">Past-due tasks move to <span className="font-bold">Overdue</span>. Reschedule them immediately to Today.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="primary" fullWidth variant="shadow" onPress={onClose}>
                                Got it
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default TaskRulesDrawer;
