"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer"; // Adapted import
import { getTasksRequest } from "@/store/task/action"; // Adapted action
import { getEmployeesSummaryRequest } from "@/store/employee/action";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { ChevronLeft, ChevronRight, Search, Video, Phone, CloudSun, Sun, CloudRain, Calendar as CalendarIcon, Clock, User, Mail, Link as LinkIcon, ExternalLink, FileText, CheckCircle2, AlertCircle, Timer, Eye, Download, ChevronsUp, ChevronsDown, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { useDisclosure } from "@heroui/use-disclosure";
import { Image } from "@heroui/image";
import { PageHeader } from "@/components/PageHeader";
// import GoogleMeetIcon from "../../../../assets/google_meet.svg"; // Removed
// import ZoomIcon from "../../../../assets/zoom.svg"; // Removed
import "./calendar.css";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";

// Color palettes similar to the image
const EVENT_COLORS = [
    { border: "#0ea5e9", bg: "#e0f2fe", text: "#0369a1" }, // Light Blue
    { border: "#3b82f6", bg: "#eff6ff", text: "#1e40af" }, // Blue
    { border: "#a855f7", bg: "#f3e8ff", text: "#7e22ce" }, // Purple
    { border: "#f97316", bg: "#ffedd5", text: "#c2410c" }, // Orange
    { border: "#ef4444", bg: "#fee2e2", text: "#b91c1c" }, // Red
    { border: "#22c55e", bg: "#dcfce7", text: "#15803d" }, // Green
    { border: "#eab308", bg: "#fef9c3", text: "#a16207" }, // Yellow
];

const getEventColor = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % EVENT_COLORS.length;
    return EVENT_COLORS[index];
};

const getPriorityIcon = (priority: string, colorPalette: any) => {
    const iconColor = colorPalette.border;
    const iconSize = 12;

    switch (priority?.toLowerCase()) {
        case "urgent":
            return <AlertCircle size={iconSize} style={{ color: iconColor }} />;
        case "high":
            return <ChevronsUp size={iconSize} style={{ color: iconColor }} />;
        case "medium":
            return <ChevronsUp size={iconSize} style={{ color: iconColor }} />;
        case "low":
            return <ChevronsDown size={iconSize} style={{ color: iconColor }} />;
        default:
            return <Circle size={iconSize} style={{ color: iconColor }} />;
    }
};

export default function CalendarPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const calendarRef = useRef<any>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [previewFile, setPreviewFile] = useState<{ url: string; type: string; name: string } | null>(null);
    const [currentView, setCurrentView] = useState("dayGridMonth"); // Default to month view for tasks
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 768) {
                const calendarApi = calendarRef.current?.getApi();
                calendarApi?.changeView("listWeek");
                setCurrentView("listWeek");
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);


    const handleEventClick = (info: any) => {
        const props = info.event.extendedProps;
        // const startTime = new Date(info.event.start);
        // const endTime = new Date(info.event.end);

        setSelectedTask({
            ...props,
            // startTime,
            // endTime,
            title: info.event.title
        });
        onOpen();
    };



    const { tasks, getTasksLoading } = useSelector(
        (state: AppState) => state.Task
    );
    const { employees } = useSelector((state: AppState) => state.Employee);
    const { user } = useSelector((state: AppState) => state.Auth);

    const [filterEmployee, setFilterEmployee] = useState("");

    const isAdmin = user?.role?.toLowerCase() === "admin";

    useEffect(() => {
        if (!employees || employees.length === 0) {
            dispatch(getEmployeesSummaryRequest());
        }
    }, [dispatch, employees]);

    useEffect(() => {
        // If not admin and user not loaded yet, skip
        if (!isAdmin && !user) return;

        dispatch(getTasksRequest({
            assigned_to: isAdmin ? filterEmployee : user?.employee_id
        }));
    }, [dispatch, filterEmployee, user]);

    // Calendar Navigation Handlers
    const handlePrev = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.prev();
        const newDate = calendarApi?.getDate();
        setCurrentDate(newDate);

    };

    const handleNext = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.next();
        const newDate = calendarApi?.getDate();
        setCurrentDate(newDate);

    };

    const handleToday = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.today();
        const newDate = calendarApi?.getDate();
        setCurrentDate(newDate);

    };

    const handleViewChange = (view: string) => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.changeView(view);
        setCurrentView(view);
    };

    // Transform tasks data
    const tasksList = Array.isArray(tasks) ? tasks : (tasks ? [tasks] : []);

    const events = tasksList.map((task: any) => {
        const color = getEventColor(task.id || "default");

        // Default to today string if missing
        const startDateStr = task.start_date || new Date().toISOString().split('T')[0];
        const endDateStr = task.end_date || startDateStr;

        // Default times
        const startTimeStr = task.start_time || "00:00";
        const endTimeStr = task.end_time || "23:59";

        // Full ISO strings combining date and time
        // Note: We need to ensure these are treated as local time or consistently. 
        // FullCalendar without 'Z' treats as local time.
        const start = `${startDateStr}T${startTimeStr}:00`;
        const end = `${endDateStr}T${endTimeStr}:00`;

        return {
            id: task.id,
            title: task.task_name,
            start: start,
            end: end,
            allDay: false,
            extendedProps: {
                ...task,
                colorPalette: color
            }
        };
    });






    const renderEventContent = (eventInfo: any) => {
        const { colorPalette, priority, assigned_to, status } = eventInfo.event.extendedProps;
        const displayName = eventInfo.event.title;

        // map IDs to employee objects
        const assignedEmployees = Array.isArray(assigned_to) && employees.length > 0
            ? employees.filter((emp: any) => assigned_to.includes(emp.id))
            : [];

        return (
            <div
                className="custom-calendar-event p-1.5 flex flex-col gap-1.5 rounded-md border-l-4 shadow-sm transition-all hover:scale-[1.01] hover:brightness-95 h-auto min-h-[50px] justify-between cursor-pointer"
                style={{
                    borderLeftColor: colorPalette.border,
                    backgroundColor: colorPalette.bg,
                    color: colorPalette.text
                }}
            >
                <div className="font-semibold text-xs leading-tight line-clamp-2">
                    {eventInfo.timeText && <span className="mr-1 opacity-75">{eventInfo.timeText}</span>}
                    {displayName}
                </div>

                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                        {/* Status Badge */}
                        {status && (
                            <div
                                className="text-[9px] px-1.5 py-[2px] rounded-full bg-white/70 dark:bg-black/30 font-medium uppercase tracking-wider"
                                style={{ color: colorPalette.border }}
                            >
                                {status === 'In Progress' ? 'In Prog' : status === 'Todo' ? 'To Do' : status}
                            </div>
                        )}

                        {/* Priority Icon */}
                        {priority && (
                            <div className="flex items-center justify-center">
                                {getPriorityIcon(priority, colorPalette)}
                            </div>
                        )}
                    </div>

                    {/* Avatars */}
                    {assignedEmployees.length > 0 && (
                        <div className="flex -space-x-1.5 overflow-hidden">
                            {assignedEmployees.slice(0, 3).map((emp: any) => (
                                <Avatar
                                    key={emp.id}
                                    src={emp.profile_picture}
                                    name={emp.name}
                                    className="w-4 h-4 min-w-4 min-h-4 text-[8px] border-[1.5px] border-white dark:border-gray-900"
                                />
                            ))}
                            {assignedEmployees.length > 3 && (
                                <div className="w-4 h-4 min-w-4 min-h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-[8px] flex items-center justify-center border-[1.5px] border-white dark:border-gray-900 text-gray-500 dark:text-gray-300 font-bold">
                                    +{assignedEmployees.length - 3}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderDayHeader = (args: any) => {
        const date = args.date;
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const dayNumber = date.getDate();

        return (
            <div className="flex flex-col items-start pl-2">
                <span className="fc-day-header-weekday">{dayName}</span>
                <span className="fc-day-header-day text-[#1f1f1f] dark:text-[#E3E3E3]">{dayNumber}</span>
            </div>
        );
    };



    return (
        <div className="calendar-page-container">


            {/* Main Calendar Content */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#131314] overflow-hidden">
                {/* Custom Header */}
                <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white dark:bg-[#131314] border-b border-gray-200 dark:border-gray-800 gap-4">
                    {/* Left Section: Date Title */}
                    <div className="flex items-center w-full md:w-auto">
                        <PageHeader
                            title={currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        />
                    </div>

                    {/* Right Section: Navigation & View Switcher */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto">
                        {/* Date Navigation */}
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-0.5 shrink-0">
                            <Button
                                isIconOnly
                                size="sm"
                                radius="full"
                                variant="light"
                                onPress={handlePrev}
                                className="w-7 h-7 min-w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button
                                isIconOnly
                                size="sm"
                                radius="full"
                                variant="light"
                                onPress={handleToday}
                                className="h-7 px-3 min-w-16 text-xs font-semibold text-gray-600 dark:text-gray-300"
                            >
                                Today
                            </Button>
                            <Button
                                isIconOnly
                                size="sm"
                                radius="full"
                                variant="light"
                                onPress={handleNext}
                                className="w-7 h-7 min-w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>



                        {isAdmin && (
                            <>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

                                {/* Employee Filter */}
                                <Select
                                    size="sm"
                                    variant="flat"
                                    placeholder="Employee"
                                    className="w-40"
                                    classNames={{
                                        trigger: "bg-gray-100 dark:bg-gray-800",
                                    }}
                                    selectedKeys={filterEmployee ? [filterEmployee] : []}
                                    onChange={(e) => setFilterEmployee(e.target.value)}
                                >
                                    {employees.map((emp: any) => (
                                        <SelectItem key={emp.employee_no_id} textValue={emp.name}>
                                            <div className="flex items-center gap-2">
                                                <Avatar size="sm" src={emp.profile_picture} name={emp.name} className="w-5 h-5" />
                                                <span className="text-xs">{emp.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </Select>

                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>
                            </>
                        )}


                        {/* View Switcher */}
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shrink-0">
                            {['timeGridDay', 'timeGridWeek', 'dayGridMonth', 'listWeek'].map((view) => (
                                <button
                                    key={view}
                                    onClick={() => handleViewChange(view)}
                                    className={`
                                        px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                                        ${currentView === view
                                            ? 'bg-white dark:bg-[#131314] text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
                                    `}
                                >
                                    {view === 'timeGridDay' && 'Day'}
                                    {view === 'timeGridWeek' && 'Week'}
                                    {view === 'dayGridMonth' && 'Month'}
                                    {view === 'listWeek' && 'List'}
                                </button>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

                        <Button
                            color="primary"
                            variant="flat"
                            size="sm"
                            startContent={<FileText size={16} />}
                            onPress={() => router.push('/task/board')}
                            className="bg-primary/10 text-primary font-medium shrink-0"
                        >
                            Board
                        </Button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-y-auto p-4 calendar-container bg-white dark:bg-[#131314]">
                    {getTasksLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={false}
                            events={events}
                            eventContent={renderEventContent}
                            dayHeaderContent={renderDayHeader}
                            eventClick={handleEventClick}
                            height="100%"
                            // allDaySlot={true}
                            // slotMinTime="06:00:00"
                            // slotMaxTime="22:00:00"
                            // slotDuration="01:00:00"
                            slotLabelFormat={{
                                hour: 'numeric',
                                minute: '2-digit',
                                meridiem: 'short'
                            }}
                            dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
                            nowIndicator={true}
                            expandRows={true}
                            stickyHeaderDates={true}
                        />
                    )}
                </div>
            </div>

            {/* Task Details Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={{
                base: "data-[placement=right]:sm:m-2 data-[placement=right]:sm:rounded-medium",
                backdrop: "bg-gradient-to-t from-zinc-900/50 to-zinc-900/10 backdrop-opacity-20"
            }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="absolute top-0 inset-x-0 z-50 bg-white/80 dark:bg-[#1f1f1f]/80 backdrop-blur-md border-b border-default-100 px-6 py-4">
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-tiny text-default-500 font-bold uppercase tracking-wider">
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon size={12} />
                                                Task Details
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selectedTask && (
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    color={
                                                        selectedTask.status === 'Completed' ? "success" :
                                                            selectedTask.status === 'In Progress' ? "primary" :
                                                                selectedTask.status === 'Pending' ? "warning" : "default"
                                                    }
                                                    className="capitalize"
                                                >
                                                    {selectedTask.status || "Unknown Status"}
                                                </Chip>
                                            )}
                                        </div>
                                    </div>
                                    {selectedTask && (
                                        <h2 className="text-xl font-bold text-foreground leading-tight pr-6">
                                            {selectedTask.task_name}
                                        </h2>
                                    )}
                                </div>
                            </DrawerHeader>

                            <DrawerBody className="pt-24 pb-6 px-6 overflow-y-auto scrollbar-hide">
                                {selectedTask && (
                                    <div className="flex flex-col gap-6">

                                        {/* Priority & Tags Row */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Chip
                                                size="sm"
                                                variant="dot"
                                                color={
                                                    selectedTask.priority === 'High' || selectedTask.priority === 'Urgent' ? "danger" :
                                                        selectedTask.priority === 'Medium' ? "warning" : "success"
                                                }
                                                className="border-none pl-1"
                                            >
                                                {selectedTask.priority || "Normal"} Priority
                                            </Chip>

                                            {selectedTask.tags?.map((tag: string) => (
                                                <Chip key={tag} size="sm" variant="flat" className="bg-default-100 text-default-600">
                                                    #{tag}
                                                </Chip>
                                            ))}
                                        </div>

                                        <Divider className="my-1" />

                                        {/* Time & Duration Card */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2 p-3 rounded-xl bg-default-50 border border-default-100 dark:bg-default-50/50">
                                                <span className="text-tiny font-semibold text-default-500 uppercase flex items-center gap-1.5">
                                                    <CheckCircle2 size={12} className="text-success" /> Start
                                                </span>
                                                <div>
                                                    <div className="text-sm font-semibold">{selectedTask.start_date}</div>
                                                    <div className="text-xs text-default-500">{selectedTask.start_time || "09:00"}</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 p-3 rounded-xl bg-default-50 border border-default-100 dark:bg-default-50/50">
                                                <span className="text-tiny font-semibold text-default-500 uppercase flex items-center gap-1.5">
                                                    <Timer size={12} className="text-danger" /> Due
                                                </span>
                                                <div>
                                                    <div className="text-sm font-semibold">{selectedTask.end_date}</div>
                                                    <div className="text-xs text-default-500">{selectedTask.end_time || "18:00"}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assignees Section */}
                                        <div className="flex flex-col gap-3">
                                            <h3 className="text-sm font-semibold text-default-700">Assigned Team</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedTask.assigned_to && selectedTask.assigned_to.length > 0 ? (
                                                    selectedTask.assigned_to.map((id: string) => {
                                                        const emp = employees.find((e: any) => e.id === id);
                                                        if (!emp) return null;
                                                        return (
                                                            <div key={id} className="flex items-center gap-3 p-2 pr-4 rounded-full bg-default-50 border border-default-100">
                                                                <Avatar
                                                                    src={emp.profile_picture}
                                                                    name={emp.name}
                                                                    size="sm"
                                                                    isBordered
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-medium text-foreground">{emp.name}</span>
                                                                    {emp.designation && <span className="text-[10px] text-default-400">{emp.designation}</span>}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-sm text-default-400 italic flex items-center gap-2">
                                                        <User size={16} /> No team members assigned
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description Section */}
                                        {selectedTask.description && (
                                            <div className="flex flex-col gap-3">
                                                <h3 className="text-sm font-semibold text-default-700">Description</h3>
                                                <div
                                                    className="text-sm text-default-600 leading-relaxed font-normal p-4 rounded-xl bg-default-50/50 border border-default-100 prose prose-sm dark:prose-invert max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: selectedTask.description.replace(/&nbsp;/g, " ") }}
                                                />
                                            </div>
                                        )}

                                        {/* Attachments Section */}
                                        {/* Attachments Section */}
                                        {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                                            <div className="flex flex-col gap-3">
                                                <h3 className="text-sm font-semibold text-default-700 flex items-center gap-2">
                                                    Attachments <Chip size="sm" variant="flat">{selectedTask.attachments.length}</Chip>
                                                </h3>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {selectedTask.attachments.map((att: string | any, index: number) => {
                                                        let url = "";
                                                        let fileName = "";
                                                        let fileType = "";

                                                        if (typeof att === 'string') {
                                                            url = att;
                                                            fileName = url.split("/").pop() || `Attachment ${index + 1}`;
                                                        } else {
                                                            url = att.file_url;
                                                            fileName = att.file_name;
                                                            fileType = att.file_type;
                                                        }

                                                        return (
                                                            <div key={index} className="border border-default-200 rounded-lg p-3 flex items-center justify-between hover:bg-default-50 transition-colors">
                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                    <FileTypeIcon fileType={fileType} fileName={fileName} />
                                                                    <div className="flex flex-col min-w-0">
                                                                        <span className="text-small font-medium truncate" title={fileName}>
                                                                            {fileName}
                                                                        </span>
                                                                        {fileType && (
                                                                            <span className="text-tiny text-default-400 capitalize">
                                                                                {fileType.split('/')[1] || fileType}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        isIconOnly
                                                                        size="sm"
                                                                        variant="light"
                                                                        onPress={() => setPreviewFile({
                                                                            url: url,
                                                                            type: fileType,
                                                                            name: fileName,
                                                                        })}
                                                                    >
                                                                        <Eye size={18} className="text-default-500" />
                                                                    </Button>
                                                                    <a href={url} download target="_blank" rel="noopener noreferrer">
                                                                        <Button isIconOnly size="sm" variant="light">
                                                                            <Download size={18} className="text-default-500" />
                                                                        </Button>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="h-4"></div>
                                    </div>
                                )}
                            </DrawerBody>
                            <DrawerFooter className="border-t border-default-100 px-6 py-4">
                                <Button
                                    fullWidth
                                    variant="flat"
                                    color="default"
                                    onPress={onClose}
                                >
                                    Close Details
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
        </div>
    );
}
