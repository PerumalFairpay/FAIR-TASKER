"use client";

import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { Tooltip } from "@heroui/tooltip";
import {
    Plus, MoreVertical, Calendar as CalendarIcon,
    Paperclip, Clock, MoveRight, FileText, ChevronLeft, ChevronRight, Eye, Pencil,
    ChevronsUp, ChevronsDown, AlertCircle, Circle, Info
} from "lucide-react";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { AppState } from "@/store/rootReducer";
import { getTasksRequest, updateTaskRequest, getTaskRequest } from "@/store/task/action";
import { getProjectsSummaryRequest } from "@/store/project/action";
import { getEmployeesSummaryRequest } from "@/store/employee/action";
import clsx from "clsx";
// import AddEditTaskDrawer from "./AddEditTaskDrawer";
import EodReportDrawer from "./EodReportDrawer";
import AddEditTaskDrawer from "./AddEditTaskDrawer";
import TaskDetailModal from "./TaskDetailModal";
import TaskRulesDrawer from "./TaskRulesDrawer";



const TaskBoard = () => {
    const dispatch = useDispatch();
    const { tasks, currentTask, getTasksLoading } = useSelector((state: AppState) => state.Task);
    const { employees } = useSelector((state: AppState) => state.Employee);
    const { user } = useSelector((state: AppState) => state.Auth);
    const router = useRouter();

    const [enabled, setEnabled] = useState(false);
    const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEodDrawerOpen, setIsEodDrawerOpen] = useState(false);
    const [isRulesDrawerOpen, setIsRulesDrawerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [eodDrawerTasks, setEodDrawerTasks] = useState<any[]>([]);
    const [eodDrawerInitialReports, setEodDrawerInitialReports] = useState<Record<string, any>>({});

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    // Filters
    const [filterDate, setFilterDate] = useState(todayStr);
    const [filterEmployee, setFilterEmployee] = useState("");

    // Calculate dynamic label for Moved column
    const nextDayLabel = React.useMemo(() => {
        const currentStr = filterDate || todayStr;
        if (currentStr === todayStr) {
            return "Moved to Tomorrow";
        }

        try {
            const current = parseDate(currentStr);
            const next = current.add({ days: 1 });
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `Moved to ${months[next.month - 1]} ${next.day}`;
        } catch (e) {
            return "Moved to Tomorrow";
        }
    }, [filterDate, todayStr]);

    const columns = React.useMemo(() => {
        const hasOverdueTasks = tasks.some((t: any) => t.is_overdue);

        const cols = [
            { id: "Todo", title: "To Do", color: "bg-default-100", textColor: "text-default-600" },
            { id: "In Progress", title: "In Progress", color: "bg-primary-50", textColor: "text-primary-600" },
            { id: "Completed", title: "Completed", color: "bg-success-50", textColor: "text-success-600" },
            { id: "Moved", title: nextDayLabel, color: "bg-warning-50", textColor: "text-warning-600" },
        ];

        if (hasOverdueTasks) {
            cols.unshift({ id: "Overdue", title: "Overdue", color: "bg-danger-50", textColor: "text-danger-600" });
        }

        return cols;
    }, [nextDayLabel, tasks]);

    const isAdmin = user?.role?.toLowerCase() === "admin";

    useEffect(() => {
        // If not admin and user not loaded yet, skip
        if (!isAdmin && !user) return;

        dispatch(getTasksRequest({
            date: filterDate,
            assigned_to: isAdmin ? filterEmployee : user?.employee_id
        }));
        dispatch(getProjectsSummaryRequest());
        dispatch(getEmployeesSummaryRequest());

        setEnabled(true);
    }, [dispatch, filterDate, filterEmployee, user]);

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

        // Prevent moving tasks INTO Overdue column manually
        if (destination.droppableId === "Overdue") return;

        if (destination.droppableId === "Moved" || destination.droppableId === "Completed") {
            const task = tasks.find((t: any) => t.id === draggableId);
            if (task) {
                handleOpenEodForSingleTask(task, destination.droppableId);
            }
            return;
        }

        // Handle moving FROM Overdue -> Auto reschedule to Today (Filter Date)
        if (source.droppableId === "Overdue" && destination.droppableId !== "Overdue") {
            dispatch(updateTaskRequest(draggableId, {
                status: destination.droppableId,
                end_date: filterDate, // Reschedule to current view date
                is_overdue_moved: true // Flag as moved from overdue
            }));
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

        // Use filterDate if present, otherwise default to today logic
        const comparisonDate = filterDate || todayStr;

        return tasks.filter((task: any) => {
            const isRolloverForView = task.last_rollover_date === comparisonDate;

            // Filter out unwanted statuses
            if (["Milestone", "Backlog", "Roadmap"].includes(task.status)) return false;

            // 1. Handle "Overdue" column
            if (status === "Overdue") {
                return task.is_overdue;
            }

            // Exclude overdue tasks from other columns to avoid duplicates
            if (task.is_overdue) return false;

            // 2. Handle "Moved" column
            if (status === "Moved") {
                // Task appears here if it has status="Moved" OR is a rollover task for this date
                return task.status === "Moved" || isRolloverForView;
            }

            // 2. Handle other columns
            // If it IS a rollover task for this date, it should ONLY appear in Moved, not here.
            if (isRolloverForView) return false;

            // 3. Normal Status Matching
            if (task.status !== status) return false;

            // If explicit date filter is set, rely on backend or just simple match
            if (filterDate) {
                // Ensure we only display tasks relevant to this date (Start <= Filter <= End)
                // This prevents tasks created for "Today" (e.g. via drawer default) from appearing when viewing Future/Past dates
                const start = task.start_date;
                const end = task.end_date || task.start_date;

                if (!start) return false;

                return filterDate >= start && filterDate <= end;
            }

            // Default "Today" View Logic
            // Hide future tasks (tasks scheduled for tomorrow onwards)
            if (task.start_date && task.start_date > todayStr) {
                return false;
            }

            // Hide past 'Moved' or 'Completed' tasks (keep board fresh for today)
            // Note: We don't hide "Move" if it's the current rollover, but that's handled above.
            if ((status === "Moved" || status === "Completed") && task.start_date && task.start_date < todayStr) {
                return false;
            }

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
        if (task.status === "Completed" || filterDate > todayStr) return;
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
                    title="Task Management"
                    description="Manage your daily tasks and project progress"
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
                                <SelectItem key={emp.id} textValue={emp.name}>
                                    <div className="flex items-center gap-2">
                                        <Avatar size="sm" src={emp.profile_picture} name={emp.name} className="w-6 h-6" />
                                        <span>{emp.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>
                    )}

                    <Button
                        variant="flat"
                        color="secondary"
                        startContent={<FileText size={18} />}
                        onPress={() => window.location.href = "/task/reports"}
                    >
                        View Reports
                    </Button>
                    <Button
                        variant="flat"
                        color="warning"
                        startContent={<CalendarIcon size={18} />}
                        onPress={() => router.push("/task/board/calendar")}
                    >
                        Calendar View
                    </Button>

                    <Button
                        isIconOnly
                        variant="flat"
                        color="default"
                        className="min-w-10 w-10 h-10 border border-default-200"
                        onPress={() => setIsRulesDrawerOpen(true)}
                        aria-label="Task Rules"
                    >
                        <Info size={18} className="text-default-500" />
                    </Button>

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
                    {columns.map((column) => (
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
                                {/* <Button isIconOnly size="sm" variant="light" className="text-default-400">
                                    <MoreVertical size={16} />
                                </Button> */}
                            </div>

                            <Droppable droppableId={column.id} isDropDisabled={column.id === "Overdue"}>
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
                                            <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={task.status === "Completed" || filterDate > todayStr}>
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
                                                                "border-none hover:shadow-md transition-all duration-300 group",
                                                                task.status === "Completed" ? "cursor-default" : "cursor-pointer",
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
                                                                            {column.id !== "Moved" && column.id !== "Overdue" && column.id !== "Completed" && task.status !== "Moved" && filterDate <= todayStr && (
                                                                                <Button
                                                                                    isIconOnly
                                                                                    size="sm"
                                                                                    variant="light"
                                                                                    className="h-6 w-6 min-w-4 text-default-400 hover:text-primary z-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                    onPress={() => handleEditTask(task)}
                                                                                >
                                                                                    <Pencil size={14} />
                                                                                </Button>
                                                                            )}
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
                                                                                {task.start_date} - {task.end_date}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-default-400">
                                                                            <Paperclip size={14} />
                                                                            <span className="text-[10px] font-medium">
                                                                                {task.attachments?.length || 0}
                                                                            </span>
                                                                        </div>

                                                                        {task.is_overdue_moved && (
                                                                            <Tooltip content="Moved from Overdue" color="danger">
                                                                                <div className="flex items-center gap-1 text-danger-500 cursor-help">
                                                                                    <Clock size={14} />
                                                                                </div>
                                                                            </Tooltip>
                                                                        )}
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
                                                                            const emp = employees.find((e: any) => e.id === empId);
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
                    ))
                    }
                </div >
            </DragDropContext >

            <AddEditTaskDrawer
                isOpen={isTaskDrawerOpen}
                onClose={() => setIsTaskDrawerOpen(false)}
                task={currentTask && currentTask.id === selectedTask?.id ? currentTask : selectedTask}
                selectedDate={filterDate}
            />

            <EodReportDrawer
                isOpen={isEodDrawerOpen}
                onClose={() => setIsEodDrawerOpen(false)}
                tasks={eodDrawerTasks}
                initialReports={eodDrawerInitialReports}
            />

            <TaskDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                task={selectedTask}
            />

            <TaskRulesDrawer
                isOpen={isRulesDrawerOpen}
                onClose={() => setIsRulesDrawerOpen(false)}
            />
        </div >
    );
};

export default TaskBoard;
