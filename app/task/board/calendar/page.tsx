"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer"; // Adapted import
import { getTasksRequest } from "@/store/task/action"; // Adapted action
import { getEmployeesRequest } from "@/store/employee/action";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { ChevronLeft, ChevronRight, Search, Video, Phone, CloudSun, Sun, CloudRain, Calendar as CalendarIcon, Clock, User, Mail, Link as LinkIcon, ExternalLink, FileText } from "lucide-react";
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

export default function CalendarPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const calendarRef = useRef<any>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedTask, setSelectedTask] = useState<any>(null);
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



    const { tasks, loading: getTasksLoading } = useSelector(
        (state: AppState) => state.Task
    );
    const { employees } = useSelector((state: AppState) => state.Employee);

    const [filterEmployee, setFilterEmployee] = useState("");

    useEffect(() => {
        dispatch(getEmployeesRequest());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getTasksRequest({
            assigned_to: filterEmployee
        }));
    }, [dispatch, filterEmployee]);

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
        const { colorPalette, priority, assigned_to } = eventInfo.event.extendedProps;
        const displayName = eventInfo.event.title;

        // map IDs to employee objects
        const assignedEmployees = Array.isArray(assigned_to) && employees.length > 0
            ? employees.filter((emp: any) => assigned_to.includes(emp.employee_no_id))
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

                <div className="flex items-center justify-between">
                    {/* Priority Badge */}
                    {priority && (
                        <div
                            className="text-[10px] px-1.5 py-[2px] rounded-full bg-white/60 dark:bg-black/20 font-medium uppercase tracking-wider"
                            style={{ color: colorPalette.border }} // Use border color for text to ensure contrast
                        >
                            {priority}
                        </div>
                    )}

                    {/* Avatars */}
                    {assignedEmployees.length > 0 && (
                        <div className="flex -space-x-1.5 overflow-hidden">
                            {assignedEmployees.slice(0, 3).map((emp: any) => (
                                <Avatar
                                    key={emp.employee_no_id}
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
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-semibold text-[#1f1f1f] dark:text-[#E3E3E3]">Task Details</h2>
                            </DrawerHeader>
                            <DrawerBody className="pt-6">
                                {selectedTask && (
                                    <div className="flex flex-col gap-6">

                                        {/* Header Info */}
                                        <div className="flex flex-col gap-6">
                                            {/* Title & Badges */}
                                            <div>
                                                <h3 className="text-2xl font-bold text-[#1f1f1f] dark:text-[#E3E3E3] leading-snug mb-3">
                                                    {selectedTask.task_name}
                                                </h3>
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5
                                                        ${selectedTask.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                                                            selectedTask.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' :
                                                                'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'}`}>
                                                        Priority: {selectedTask.priority}
                                                    </div>
                                                    <div className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 flex items-center gap-1.5">
                                                        Status: {selectedTask.status}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Assigned Users & Tags */}
                                            <div className="flex flex-col gap-4">
                                                {/* Assignees */}
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assigned To</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTask.assigned_to && selectedTask.assigned_to.map((id: string) => {
                                                            const emp = employees.find((e: any) => e.employee_no_id === id);
                                                            return emp ? (
                                                                <div key={id} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50 dark:bg-[#1e1f21] border border-gray-100 dark:border-gray-800">
                                                                    <Avatar src={emp.profile_picture} name={emp.name} className="w-5 h-5 text-[10px]" />
                                                                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{emp.name}</span>
                                                                </div>
                                                            ) : null;
                                                        })}
                                                        {(!selectedTask.assigned_to || selectedTask.assigned_to.length === 0) && (
                                                            <span className="text-xs text-gray-400 italic">No one assigned</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                {selectedTask.tags && selectedTask.tags.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {selectedTask.tags.map((tag: string) => (
                                                                <span key={tag} className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Schedule Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1e1f21] border border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-[#252628]">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CalendarIcon size={14} className="text-gray-400" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                        {selectedTask.start_date}
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1e1f21] border border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-[#252628]">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CalendarIcon size={14} className="text-gray-400" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">End Date</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                        {selectedTask.end_date}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Description Block */}
                                            {selectedTask.description && (
                                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1e1f21] border border-gray-100 dark:border-gray-800">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                        Description
                                                    </p>
                                                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal pl-3.5 border-l-2 border-gray-200 dark:border-gray-700" dangerouslySetInnerHTML={{ __html: selectedTask.description }} />
                                                </div>
                                            )}

                                            {/* Attachments (Placeholder count) */}
                                            {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1e1f21] border border-gray-100 dark:border-gray-800">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                        <LinkIcon size={12} />
                                                        Attachments ({selectedTask.attachments.length})
                                                    </p>
                                                    <div className="flex flex-col gap-2">
                                                        {selectedTask.attachments.map((att: any, idx: number) => (
                                                            <div key={idx} className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                                                <FileText size={12} />
                                                                {att.name || `Attachment ${idx + 1}`}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </DrawerBody>
                            <DrawerFooter className="border-t border-gray-100 dark:border-gray-800 pt-1 pb-2 px-6 bg-white/50 dark:bg-[#1e1f21]/50 backdrop-blur-md">
                                <Button
                                    color="secondary"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
