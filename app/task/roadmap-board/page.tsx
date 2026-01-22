"use client";

import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { Tooltip } from "@heroui/tooltip";
import {
    Plus, Clock, ChevronLeft, ChevronRight, FileText, Calendar as CalendarIcon, Pencil, Paperclip,
    ChevronsUp, ChevronsDown, AlertCircle, Circle
} from "lucide-react";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { AppState } from "@/store/rootReducer";
import { getTasksRequest, updateTaskRequest, getTaskRequest } from "@/store/task/action";
import { getProjectsRequest } from "@/store/project/action";
import { getEmployeesRequest } from "@/store/employee/action";
import clsx from "clsx";
import AddEditTaskDrawer from "../board/AddEditTaskDrawer";
import TaskDetailModal from "../board/TaskDetailModal";

const COLUMNS = [
    { id: "Backlog", title: "Backlog", color: "bg-warning-50", textColor: "text-warning-600" },
    { id: "Milestone", title: "Milestone", color: "bg-primary-50", textColor: "text-primary-600" },
    { id: "Roadmap", title: "Roadmap", color: "bg-success-50", textColor: "text-success-600" },
];

const ALLOWED_STATUSES = ["Backlog", "Milestone", "Roadmap"];

const RoadmapBoard = () => {
    const dispatch = useDispatch();
    const { tasks, currentTask } = useSelector((state: AppState) => state.Task);
    const { employees } = useSelector((state: AppState) => state.Employee);
    const { user } = useSelector((state: AppState) => state.Auth);
    const router = useRouter();

    const [enabled, setEnabled] = useState(false);
    const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    // Filters
    const [filterDate, setFilterDate] = useState(todayStr);
    const [filterEmployee, setFilterEmployee] = useState("");

    const isAdmin = user?.role?.toLowerCase() === "admin";

    useEffect(() => {
        if (!isAdmin && !user) return;

        dispatch(getTasksRequest({
            date: filterDate,
            assigned_to: isAdmin ? filterEmployee : user?.employee_id
        }));
        dispatch(getProjectsRequest());
        dispatch(getEmployeesRequest());
        setEnabled(true);
    }, [dispatch, filterDate, filterEmployee, user]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        dispatch(updateTaskRequest(draggableId, { status: destination.droppableId }));
    };

    if (!enabled) return null;

    const getTasksByStatus = (status: string) => {
        return tasks.filter((task: any) => {
            if (task.status !== status) return false;
            // Additional filtering (e.g. date) can be kept or removed depending on requirement.
            // Keeping it consistent with data being fetched which is for `filterDate`.
            return true;
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "urgent": return "danger";
            case "high": return "danger";
            case "medium": return "warning";
            case "low": return "success";
            default: return "default";
        }
    };

    const getPriorityIcon = (priority: string) => {
        const color = getPriorityColor(priority);
        const colorMap: Record<string, string> = {
            danger: "text-danger",
            warning: "text-warning",
            success: "text-success",
            default: "text-default-400"
        };

        switch (priority?.toLowerCase()) {
            case "urgent":
                return <AlertCircle size={16} className={colorMap[color]} />;
            case "high":
                return <ChevronsUp size={16} className={colorMap[color]} />;
            case "medium":
                return <ChevronsUp size={16} className={colorMap[color]} />;
            case "low":
                return <ChevronsDown size={16} className={colorMap[color]} />;
            default:
                return <Circle size={16} className={colorMap[color]} />;
        }
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsTaskDrawerOpen(true);
    };

    const handleEditTask = (task: any) => {
        // Allow editing for any status here
        setSelectedTask(task);
        dispatch(getTaskRequest(task.id));
        setIsTaskDrawerOpen(true);
    };

    const handleViewTask = (task: any) => {
        setSelectedTask(task);
        setIsDetailModalOpen(true);
    };

    const changeDate = (days: number) => {
        try {
            const current = filterDate ? parseDate(filterDate) : parseDate(todayStr);
            const newDate = current.add({ days });
            setFilterDate(newDate.toString());
        } catch (e) {
            console.error("Invalid date or operation", e);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="Milestone & Backlog"
                    description="Manage milestones, backlog items, and roadmap"
                />

                <div className="flex gap-2 items-center">
                    <div className="flex items-center bg-default-50 rounded-lg border border-default-200 p-0.5">
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => changeDate(-1)}
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
                            onPress={() => changeDate(1)}
                            size="sm"
                            className="min-w-8 w-8 h-8 text-default-600 hover:text-primary"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>

                    {isAdmin && (
                        <Select
                            size="sm"
                            variant="bordered"
                            placeholder="Employee"
                            className="w-40"
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

                    <Button
                        color="primary"
                        startContent={<Plus size={18} />}
                        variant="shadow"
                        onPress={handleCreateTask}
                    >
                        Create Task
                    </Button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-4 min-h-[calc(100vh-250px)]">
                    {COLUMNS.map((column) => (
                        <div key={column.id} className="flex flex-col flex-1 min-w-[260px] gap-4">
                            <div className={clsx(
                                "flex items-center justify-between p-3 rounded-xl border border-divider shadow-sm",
                                column.color
                            )}>
                                <div className="flex items-center gap-2">
                                    <div className={clsx("w-2 h-2 rounded-full", column.textColor.replace("text", "bg"))} />
                                    <h3 className={clsx("font-semibold text-sm uppercase tracking-wider", column.textColor)}>
                                        {column.title}
                                    </h3>
                                </div>
                                <Chip size="sm" variant="flat" className={column.textColor}>
                                    {getTasksByStatus(column.id).length}
                                </Chip>
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
                                                        onClick={() => handleViewTask(task)}
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
                                                                    <div className="flex items-center gap-1">
                                                                        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                                                                            <Button
                                                                                isIconOnly
                                                                                size="sm"
                                                                                variant="light"
                                                                                className="h-6 w-6 min-w-4 text-default-400 hover:text-primary z-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                onPress={() => handleEditTask(task)}
                                                                            >
                                                                                <Pencil size={14} />
                                                                            </Button>
                                                                        </div>
                                                                        <Tooltip content={task.priority || "Medium"} size="sm">
                                                                            <div className="flex items-center justify-center">
                                                                                {getPriorityIcon(task.priority)}
                                                                            </div>
                                                                        </Tooltip>
                                                                    </div>
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
                                                                                {task.end_date} {task.end_time}
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
                task={currentTask && currentTask.id === selectedTask?.id ? currentTask : selectedTask}
                selectedDate={filterDate}
                allowedStatuses={ALLOWED_STATUSES}
            />

            <TaskDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                task={selectedTask}
            />
        </div>
    );
};

export default RoadmapBoard;
