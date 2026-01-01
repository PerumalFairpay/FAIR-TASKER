"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer"; // Adapted import
import { getTasksRequest } from "@/store/task/action"; // Adapted action
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Button } from "@heroui/button";
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

    // Mini Calendar State
    const [miniCalDate, setMiniCalDate] = useState(new Date());

    const { tasks, loading: getTasksLoading } = useSelector(
        (state: AppState) => state.Task
    );

    useEffect(() => {
        dispatch(getTasksRequest({})); // Fetch all tasks
    }, [dispatch]);

    // Calendar Navigation Handlers
    const handlePrev = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.prev();
        const newDate = calendarApi?.getDate();
        setCurrentDate(newDate);
        setMiniCalDate(newDate); // Sync mini cal
    };

    const handleNext = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.next();
        const newDate = calendarApi?.getDate();
        setCurrentDate(newDate);
        setMiniCalDate(newDate); // Sync mini cal
    };

    const handleToday = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.today();
        const newDate = calendarApi?.getDate();
        setCurrentDate(newDate);
        setMiniCalDate(newDate);
    };

    const handleViewChange = (view: string) => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.changeView(view);
        setCurrentView(view);
    };

    // Transform tasks data
    const tasksList = Array.isArray(tasks) ? tasks : (tasks ? [tasks] : []);

    const events = tasksList.map((task: any) => {
        const startTime = task.start_date ? new Date(task.start_date) : new Date(); // Default to today if missing

        // If end_date is present, use it. Otherwise same as start.
        const endTime = task.end_date ? new Date(task.end_date) : startTime;

        // Add 1 day to end time to make it inclusive for fullCalendar if it's all day
        const isAllDay = true; // Assuming tasks are by date, not time

        const color = getEventColor(task.id || "default");

        return {
            id: task.id,
            title: task.task_name,
            start: startTime.toISOString().split('T')[0], // YYYY-MM-DD
            end: endTime ? endTime.toISOString().split('T')[0] : undefined,
            allDay: true,
            extendedProps: {
                ...task,
                colorPalette: color
            }
        };
    });

    // Helper functions for Sidebar Agenda
    const getFormattedDateGroup = (dateStr: string) => {
        if (!dateStr) return "NO DATE";
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return "TODAY";
        if (date.toDateString() === tomorrow.toDateString()) return "TOMORROW";

        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' }).toUpperCase();
    };

    const sortedTasks = [...tasksList].sort((a: any, b: any) =>
        new Date(a.start_date || 0).getTime() - new Date(b.start_date || 0).getTime()
    ).filter((m: any) => new Date(m.start_date) >= new Date(new Date().setHours(0, 0, 0, 0)));

    const groupedTasks = sortedTasks.slice(0, 5).reduce((acc: any, task: any) => {
        const group = getFormattedDateGroup(task.start_date);
        if (!acc[group]) acc[group] = [];
        acc[group].push(task);
        return acc;
    }, {});


    // Mini Calendar Generation
    const generateMiniCalendar = () => {
        const year = miniCalDate.getFullYear();
        const month = miniCalDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];
        const startPadding = firstDay.getDay(); // 0 = Sunday

        // Prev month padding
        for (let i = 0; i < startPadding; i++) {
            days.push(<div key={`prev-${i}`} className="mini-day-cell other-month"></div>);
        }

        // Current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const currentDayDate = new Date(year, month, i);
            const isToday = currentDayDate.toDateString() === new Date().toDateString();
            const isSelected = currentDayDate.toDateString() === currentDate.toDateString();
            const hasEvent = tasksList.some((m: any) => m.start_date && new Date(m.start_date).toDateString() === currentDayDate.toDateString());

            days.push(
                <div
                    key={i}
                    className={`mini-day-cell current-month ${isSelected ? 'selected' : ''} ${hasEvent ? 'has-events' : ''}`}
                    onClick={() => {
                        const calendarApi = calendarRef.current?.getApi();
                        calendarApi?.gotoDate(currentDayDate);
                        setCurrentDate(currentDayDate);
                        setMiniCalDate(currentDayDate);
                    }}
                >
                    {i}
                </div>
            );
        }
        return days;
    };

    const renderEventContent = (eventInfo: any) => {
        const { colorPalette } = eventInfo.event.extendedProps;
        const displayName = eventInfo.event.title;

        return (
            <div
                className="custom-calendar-event p-1 text-xs truncate rounded"
                style={{
                    borderLeftColor: colorPalette.border,
                    backgroundColor: colorPalette.bg,
                    color: colorPalette.text
                }}
            >
                {displayName}
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
            {/* Sidebar */}
            <div className="calendar-sidebar">


                <div className="mini-calendar-header">
                    <div className="mini-calendar-title">
                        {miniCalDate.toLocaleString('default', { month: 'long' })}
                        <span className="mini-calendar-year ml-2">{miniCalDate.getFullYear()}</span>
                    </div>
                    <div className="flex gap-1 text-gray-400">
                        <ChevronLeft
                            size={20}
                            className="cursor-pointer hover:text-white"
                            onClick={() => setMiniCalDate(new Date(miniCalDate.getFullYear(), miniCalDate.getMonth() - 1, 1))}
                        />
                        <ChevronRight
                            size={20}
                            className="cursor-pointer hover:text-white"
                            onClick={() => setMiniCalDate(new Date(miniCalDate.getFullYear(), miniCalDate.getMonth() + 1, 1))}
                        />
                    </div>
                </div>

                <div className="mini-calendar-grid">
                    <span className="mini-day-header">S</span>
                    <span className="mini-day-header">M</span>
                    <span className="mini-day-header">T</span>
                    <span className="mini-day-header">W</span>
                    <span className="mini-day-header">T</span>
                    <span className="mini-day-header">F</span>
                    <span className="mini-day-header">S</span>
                    {generateMiniCalendar()}
                </div>

                {/* Highlight Card for demo purpose based on image */}
                {/* <div className="agenda-highlight-card">
                    <h3 className="font-semibold text-sm mb-1">Upcoming Highlight</h3>
                </div> */}

                {/* Agenda List */}
                <div className="flex-1 overflow-y-auto">
                    {Object.entries(groupedTasks).map(([group, groupTasks]: [string, any]) => (
                        <div key={group} className="agenda-item">
                            <div className="agenda-header">
                                <span>{group}</span>
                            </div>
                            {groupTasks.map((task: any) => {
                                const color = getEventColor(task.id || "default");

                                return (
                                    <div key={task.id} className="agenda-card">
                                        <div
                                            className="absolute left-0 top-[6px] w-[8px] h-[8px] rounded-full"
                                            style={{ backgroundColor: color.border }}
                                        />
                                        <div className="agenda-time">
                                            {task.start_date}
                                        </div>
                                        <div className="agenda-title">{task.task_name}</div>
                                        {task.description && (
                                            <div className="text-[10px] text-gray-400 mt-1 truncate" dangerouslySetInnerHTML={{ __html: task.description.replace(/<[^>]*>?/gm, '') }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    {Object.keys(groupedTasks).length === 0 && (
                        <div className="text-sm text-gray-500 text-center mt-4">No upcoming tasks</div>
                    )}
                </div>
            </div>

            {/* Main Calendar Content */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#131314] overflow-hidden">
                {/* Custom Header */}
                <div className="h-auto md:h-16 py-4 md:py-0 border-b border-[#e5e7eb] dark:border-[#2d2e30] flex flex-col md:flex-row items-center justify-between px-4 md:px-6 shrink-0 bg-white dark:bg-[#131314] gap-4 md:gap-0">
                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <div className="flex items-center bg-[#f3f4f6] dark:bg-[#2d2e30] rounded-lg p-1">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={handlePrev}
                                className="text-[#4b5563] dark:text-[#9ca3af]"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button
                                size="sm"
                                variant="light"
                                onPress={handleToday}
                                className="font-medium text-[#4b5563] dark:text-[#9ca3af] px-3"
                            >
                                Today
                            </Button>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={handleNext}
                                className="text-[#4b5563] dark:text-[#9ca3af]"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {['timeGridDay', 'timeGridWeek', 'dayGridMonth', 'listWeek'].map((view) => (
                            <button
                                key={view}
                                onClick={() => handleViewChange(view)}
                                className={`view-btn ${currentView === view ? 'active' : ''}`}
                            >
                                {view === 'timeGridDay' && 'Day'}
                                {view === 'timeGridWeek' && 'Week'}
                                {view === 'dayGridMonth' && 'Month'}
                                {view === 'listWeek' && 'List'}
                            </button>
                        ))}
                        <Button
                            color="primary"
                            variant="flat"
                            startContent={<FileText size={18} />}
                            onPress={() => router.push('/task/board')}
                            className="bg-primary/10 text-primary"
                        >
                            Board View
                        </Button>
                    </div>

                    <div className="text-lg md:text-xl font-semibold text-[#1f1f1f] dark:text-[#E3E3E3] order-first md:order-none">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
                                                    <div className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 flex items-center gap-1.5">
                                                        Priority: {selectedTask.priority}
                                                    </div>
                                                    <div className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 flex items-center gap-1.5">
                                                        Status: {selectedTask.status}
                                                    </div>
                                                </div>
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
