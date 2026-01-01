import React from "react";
import { format, getDaysInMonth, startOfMonth, endOfMonth, isSameDay, parseISO } from "date-fns";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Avatar } from "@heroui/avatar";
import { Tooltip } from "@heroui/tooltip"; // Assuming this exists or similar
import { X, Check } from "lucide-react"; // Icons for Present/Absent

interface AttendanceCalendarProps {
    employees: any[];
    attendance: any[];
    holidays: any[];
    currentMonth: Date;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
    employees,
    attendance,
    holidays,
    currentMonth,
}) => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const startDate = startOfMonth(currentMonth);

    // Generate array of days [1, 2, ..., n]
    // But we need actual Date objects for comparison
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(currentMonth);
        d.setDate(i + 1);
        return d;
    });

    // Helper to get status for a specific employee and date
    const getStatus = (employeeId: string, date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");

        // 1. Check Holiday
        const holiday = holidays.find((h) => {
            // Assuming holiday.date is "YYYY-MM-DD" string
            return h.date === dateStr;
        });

        if (holiday) {
            return { type: "Holiday", label: "H", color: "bg-orange-400 text-white", name: holiday.name };
        }

        // 2. Check Attendance
        const record = attendance.find((a) => {
            const empIdMatch = a.employee_id === employeeId || a.employee_details?.id === employeeId || a.employee_details?.employee_no_id === employeeId;
            return empIdMatch && a.date === dateStr;
        });

        if (record) {
            if (record.status === "Present") {
                return { type: "Present", label: "P", color: "text-success", icon: <Check size={16} /> };
            } else if (record.status === "Absent") {
                return { type: "Absent", label: "A", color: "text-danger", icon: <X size={16} /> };
            }
            // Fallback for other statuses
            return { type: record.status, label: record.status[0], color: "text-primary" };
        }

        // 3. Default/Unknown
        // If date is in future, return empty? 
        // If date is past and weekend?
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sun OR Sat
            return { type: "Weekend", label: "-", color: "text-default-300" };
        }

        // If past date and no record, assume absent? Or just "-" as originally requested/shown
        // The image shows "-" for empty cells.
        return { type: "None", label: "-", color: "text-default-300" };
    };

    return (
        <div className="overflow-x-auto pb-4">
            <table className="w-full border-collapse min-w-[1000px]">
                <thead>
                    <tr>
                        <th className="p-2 text-left sticky left-0 bg-background z-10 border-b border-divider min-w-[200px]">
                            Employee
                        </th>
                        {days.map((day) => (
                            <th key={day.toISOString()} className="p-2 text-center border-b border-divider min-w-[30px]">
                                <div className="text-xs font-semibold text-default-500">{format(day, "d")}</div>
                                <div className="text-[10px] text-default-400 uppercase">{format(day, "EEE")[0]}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id || emp.employee_no_id} className="hover:bg-default-50 transition-colors border-b border-divider/50">
                            <td className="p-3 sticky left-0 bg-background z-10 border-r border-divider">
                                <div className="flex items-center gap-3">
                                    <Avatar src={emp.profile_picture} name={emp.name} size="sm" />
                                    <div>
                                        <p className="text-sm font-medium text-default-900 line-clamp-1">{emp.name}</p>
                                        <p className="text-xs text-primary">{emp.employee_no_id}</p>
                                    </div>
                                </div>
                            </td>
                            {days.map((day) => {
                                const status = getStatus(emp.employee_no_id, day);
                                return (
                                    <td key={day.toISOString()} className="p-1 text-center">
                                        <div className="flex justify-center items-center h-full">
                                            {status.type === "Holiday" ? (
                                                <Tooltip content={status.name}>
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${status.color} shadow-sm cursor-help`}>
                                                        {status.label}
                                                    </div>
                                                </Tooltip>
                                            ) : status.type === "Present" || status.type === "Absent" ? (
                                                <div className={`font-bold ${status.color}`}>
                                                    {/* Using icons for present/absent as per image X */}
                                                    {status.type === "Absent" ? <X size={14} strokeWidth={3} /> : (status.label === "P" ? <div className="w-2 h-2 rounded-full bg-success" /> : status.label)}
                                                </div>
                                            ) : (
                                                <span className={`text-sm ${status.color}`}>{status.label}</span>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    {employees.length === 0 && (
                        <tr>
                            <td colSpan={days.length + 1} className="text-center p-8 text-default-500">
                                No employees found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceCalendar;
