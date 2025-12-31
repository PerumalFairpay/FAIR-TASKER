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
    Paperclip, Clock, MoveRight
} from "lucide-react";
import { AppState } from "@/store/rootReducer";
import { getTasksRequest, updateTaskRequest } from "@/store/task/action";
import { getProjectsRequest } from "@/store/project/action";
import { getEmployeesRequest } from "@/store/employee/action";
import clsx from "clsx";
import AddEditTaskDrawer from "./AddEditTaskDrawer";
import EodReportDrawer from "./EodReportDrawer";

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

    useEffect(() => {
        dispatch(getTasksRequest());
        dispatch(getProjectsRequest());
        dispatch(getEmployeesRequest());
        setEnabled(true);
    }, [dispatch]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Update status in backend
        dispatch(updateTaskRequest(draggableId, { status: destination.droppableId }));
    };

    if (!enabled) return null;

    const getTasksByStatus = (status: string) => {
        return tasks.filter((task: any) => task.status === status);
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
                        variant="bordered"
                        startContent={<MoveRight size={18} />}
                        onPress={() => setIsEodDrawerOpen(true)}
                    >
                        EOD Report
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
                                                                    <p className="text-xs text-default-500 line-clamp-2">
                                                                        {task.description}
                                                                    </p>
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
                tasks={tasks.filter((t: any) => t.status !== "Completed" && t.status !== "Moved")}
            />
        </div>
    );
};

export default TaskBoard;
