"use client";

import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@heroui/modal";
import { Button } from "@heroui/button";
import {
    ClipboardList,
    PlayCircle,
    CheckCircle2,
    History,
    CalendarDays,
    AlertCircle,
    Info
} from "lucide-react";

interface TaskRulesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TaskRulesModal: React.FC<TaskRulesModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            size="3xl"
            scrollBehavior="inside"
            backdrop="blur"
            classNames={{
                base: "bg-background border border-divider",
                header: "border-b border-divider bg-default-50/50",
                footer: "border-t border-divider bg-default-50/50",
            }}
        >
            <ModalContent>
                {(onClose: () => void) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-primary">
                                <Info size={24} />
                                <h2 className="text-xl font-bold">Task Management Rules & Steps</h2>
                            </div>
                            <p className="text-xs text-default-500 font-normal">
                                Guidelines for effective task tracking and reporting
                            </p>
                        </ModalHeader>
                        <ModalBody className="py-6 px-8 flex flex-col gap-8">
                            {/* Section 1: Task Lifecycle */}
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-default-700">
                                    <ClipboardList size={20} className="text-blue-500" />
                                    1. Task Lifecycle
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-default-50 border border-default-200">
                                        <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                                            <PlayCircle size={16} />
                                            <span>Start</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Tasks are assigned by Admins. New tasks appear in the <span className="font-semibold text-default-900">To Do</span> column.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-primary-50 border border-primary-200">
                                        <div className="flex items-center gap-2 mb-2 text-primary-600 font-medium">
                                            <History size={16} />
                                            <span>Progress</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Drag tasks to <span className="font-semibold text-primary-600">In Progress</span> when you start working. Update progress regularly.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-success-50 border border-success-200">
                                        <div className="flex items-center gap-2 mb-2 text-success-600 font-medium">
                                            <CheckCircle2 size={16} />
                                            <span>Complete</span>
                                        </div>
                                        <p className="text-sm text-default-600">
                                            Move to <span className="font-semibold text-success-600">Completed</span> once finished. This triggers the final EOD report for the task.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: EOD Reporting */}
                            <section className="bg-default-50 p-6 rounded-2xl border border-default-100">
                                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-default-700">
                                    <History size={20} className="text-orange-500" />
                                    2. End-of-Day (EOD) Reporting
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                        <div>
                                            <p className="font-medium text-default-800">Submit Daily Progress</p>
                                            <p className="text-sm text-default-500">Every day, you must update your work status. Move tasks to <span className="text-success-600 font-medium">Completed</span> or <span className="text-warning-600 font-medium">Moved to Tomorrow</span>.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                        <div>
                                            <p className="font-medium text-default-800">Detail Your Work</p>
                                            <p className="text-sm text-default-500">Provide a clear summary of what was achieved. Mention specific progress details and any blockers encounterred.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                        <div>
                                            <p className="font-medium text-default-800">Rollover Logic</p>
                                            <p className="text-sm text-default-500">If a task isn't finished, use <span className="text-warning-600 font-medium">Move to Tomorrow</span>. A duplicate task will be created for the next business day.</p>
                                        </div>
                                    </li>
                                </ul>
                            </section>

                            {/* Section 3: Important Rules */}
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-default-700">
                                    <AlertCircle size={20} className="text-danger-500" />
                                    Important Rules & Tips
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex gap-3 items-start p-3">
                                        <div className="mt-1 text-danger">
                                            <CalendarDays size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Overdue Tasks</p>
                                            <p className="text-xs text-default-500">Tasks not completed or moved by their end date appear in <span className="text-danger-500 font-medium">Overdue</span>. Reschedule them promptly.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start p-3">
                                        <div className="mt-1 text-primary">
                                            <AlertCircle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Priority Matters</p>
                                            <p className="text-xs text-default-500">Always focus on <span className="text-danger-500 font-medium">Urgent</span> and <span className="text-danger-600 font-medium">High</span> priority tasks first.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="shadow" onPress={onClose}>
                                Got it
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default TaskRulesModal;
