"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import {
    Plus, MoreVertical, Calendar as CalendarIcon,
    Paperclip, Clock, MoveRight, FileText
} from "lucide-react";
import { AppState } from "@/store/rootReducer";
import { getTasksRequest, updateTaskRequest } from "@/store/task/action";
import { getProjectsRequest } from "@/store/project/action";
import { getEmployeesRequest } from "@/store/employee/action";
import clsx from "clsx";
// import AddEditTaskDrawer from "./AddEditTaskDrawer";
import EodReportDrawer from "./EodReportDrawer";
import AddEditTaskDrawer from "./AddEditTaskDrawer";

const COLUMNS = [
    { id: "Todo", title: "To Do", color: "bg-default-100", textColor: "text-default-600" },
    { id: "In Progress", title: "In Progress", color: "bg-primary-50", textColor: "text-primary-600" },
    { id: "Completed", title: "Completed", color: "bg-success-50", textColor: "text-success-600" },
    { id: "Moved", title: "Moved/Rollover", color: "bg-warning-50", textColor: "text-warning-600" },
];

const TaskBoard = () => {
    const dispatch = useDispatch();
    const { tasks, loading } = useSelector((state: AppState) => state.Task);
    const { employees } = useSelector((state: AppState) => state.Employee);

    const [enabled, setEnabled] = useState(false);
    const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
    const [isEodDrawerOpen, setIsEodDrawerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [eodDrawerTasks, setEodDrawerTasks] = useState<any[]>([]);
    const [eodDrawerInitialReports, setEodDrawerInitialReports] = useState<Record<string, any>>({});

    useEffect(() => {
        dispatch(getTasksRequest());
        dispatch(getProjectsRequest());
        dispatch(getEmployeesRequest());
        setEnabled(true);
    }, [dispatch]);

    const handleOpenEodForSingleTask = (task: any, targetStatus: string) => {
        setEodDrawerTasks([task]);

        let initialReport: any = {
            task_id: task.id,
            eod_summary: "",
            progress: task.progress || 0,
            status: task.status,
            move_to_tomorrow: false
        };

        if (targetStatus === "Moved") {
            // If moved to rollover column, we assume it's "In Progress" but moving to tomorrow
            initialReport.status = "In Progress";
            initialReport.move_to_tomorrow = true;
        } else if (targetStatus === "Completed") {
            initialReport.status = "Completed";
            initialReport.progress = 100;
            initialReport.move_to_tomorrow = false;
        }

        setEodDrawerInitialReports({
            [task.id]: initialReport
        });
        setIsEodDrawerOpen(true);
    };



    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (destination.droppableId === "Moved" || destination.droppableId === "Completed") {
            const task = tasks.find((t: any) => t.id === draggableId);
            if (task) {
                handleOpenEodForSingleTask(task, destination.droppableId);
            }
            return;
        }

        // Update status in backend
        dispatch(updateTaskRequest(draggableId, { status: destination.droppableId }));
    };

    if (!enabled) return null;

    const getTasksByStatus = (status: string) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const todayStr = `${year}-${month}-${day}`;

        return tasks.filter((task: any) => {
            if (task.status !== status) return false;
            // Hide future tasks (tasks scheduled for tomorrow onwards)
            if (task.start_date && task.start_date > todayStr) {
                return false;
            }
            return true;
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "high": return "danger";
            case "medium": return "warning";
            case "low": return "success";
            default: return "default";
        }
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsTaskDrawerOpen(true);
    };

    const handleEditTask = (task: any) => {
        setSelectedTask(task);
        setIsTaskDrawerOpen(true);
    };

    return (
        <div className="h-full flex flex-col gap-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Task Management</h1>
                    <p className="text-default-500">Manage your daily tasks and project progress</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        startContent={<Plus size={18} />}
                        variant="shadow"
                        onPress={handleCreateTask}
                    >
                        Create Task
                    </Button>
                    <Button
                        variant="flat"
                        color="secondary"
                        startContent={<FileText size={18} />}
                        onPress={() => window.location.href = "/task/reports"}
                    >
                        View Reports
                    </Button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide min-h-[calc(100vh-250px)]">
                    {COLUMNS.map((column) => (
                        <div key={column.id} className="flex flex-col min-w-[300px] w-[300px] gap-4">
                            <div className={clsx(
                                "flex items-center justify-between p-3 rounded-xl border border-divider shadow-sm",
                                column.color
                            )}>
                                <div className="flex items-center gap-2">
                                    <div className={clsx("w-2 h-2 rounded-full", column.textColor.replace("text", "bg"))} />
                                    <h3 className={clsx("font-semibold text-sm uppercase tracking-wider", column.textColor)}>
                                        {column.title}
                                    </h3>
                                    <Chip size="sm" variant="flat" className={column.textColor}>
                                        {getTasksByStatus(column.id).length}
                                    </Chip>
                                </div>
                                <Button isIconOnly size="sm" variant="light" className="text-default-400">
                                    <MoreVertical size={16} />
                                </Button>
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={clsx(
                                            "flex-1 flex flex-col gap-3 p-2 rounded-2xl transition-colors duration-200",
                                            snapshot.isDraggingOver ? "bg-default-50/50" : "bg-transparent"
                                        )}
                                    >
                                        {getTasksByStatus(column.id).map((task: any, index: number) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => handleEditTask(task)}
                                                    >
                                                        <Card
                                                            shadow="sm"
                                                            className={clsx(
                                                                "border-none hover:shadow-md transition-all duration-300 group cursor-pointer",
                                                                snapshot.isDragging ? "shadow-xl ring-2 ring-primary scale-105" : ""
                                                            )}
                                                        >
                                                            <CardBody className="p-4 gap-3">
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <h4 className="font-semibold text-sm line-clamp-2 flex-1">
                                                                        {task.task_name}
                                                                    </h4>
                                                                    <Chip
                                                                        size="sm"
                                                                        color={getPriorityColor(task.priority)}
                                                                        variant="flat"
                                                                        className="capitalize text-[10px] h-5"
                                                                    >
                                                                        {task.priority || "Medium"}
                                                                    </Chip>
                                                                </div>

                                                                {task.description && (
                                                                    <div
                                                                        className="text-xs text-default-500 line-clamp-5 [&>p]:mb-0 [&>p]:inline [&>ol]:list-decimal [&>ol]:ml-4 [&>ul]:list-disc [&>ul]:ml-4 [&>li]:ml-2"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: task.description || ""
                                                                        }}
                                                                    />
                                                                )}

                                                                <div className="flex flex-wrap gap-1">
                                                                    {task.tags?.map((tag: string) => (
                                                                        <Chip key={tag} size="sm" variant="dot" color="primary" className="h-5 text-[10px]">
                                                                            {tag}
                                                                        </Chip>
                                                                    ))}
                                                                </div>

                                                                <div className="pt-3 border-t border-divider flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex items-center gap-1 text-default-400">
                                                                            <CalendarIcon size={14} />
                                                                            <span className="text-[10px] font-medium">
                                                                                {task.end_date}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-default-400">
                                                                            <Paperclip size={14} />
                                                                            <span className="text-[10px] font-medium">
                                                                                {task.attachments?.length || 0}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <AvatarGroup
                                                                        isBordered
                                                                        size="sm"
                                                                        max={3}
                                                                        renderCount={(count) => (
                                                                            <p className="text-tiny text-default-400 font-medium ml-1">
                                                                                +{count}
                                                                            </p>
                                                                        )}
                                                                    >
                                                                        {task.assigned_to?.map((empId: string) => {
                                                                            const emp = employees.find((e: any) => e.employee_no_id === empId);
                                                                            return (
                                                                                <Avatar
                                                                                    key={empId}
                                                                                    src={emp?.profile_picture}
                                                                                    name={emp?.name || "?"}
                                                                                    className="w-6 h-6 text-[10px]"
                                                                                />
                                                                            );
                                                                        })}
                                                                    </AvatarGroup>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {getTasksByStatus(column.id).length === 0 && !snapshot.isDraggingOver && (
                                            <div className="flex flex-col items-center justify-center py-10 opacity-30 border-2 border-dashed border-divider rounded-2xl">
                                                <Clock size={32} />
                                                <span className="text-xs mt-2">No tasks</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            <AddEditTaskDrawer
                isOpen={isTaskDrawerOpen}
                onClose={() => setIsTaskDrawerOpen(false)}
                task={selectedTask}
            />

            <EodReportDrawer
                isOpen={isEodDrawerOpen}
                onClose={() => setIsEodDrawerOpen(false)}
                tasks={eodDrawerTasks}
                initialReports={eodDrawerInitialReports}
            />
        </div>
    );
};

export default TaskBoard;
