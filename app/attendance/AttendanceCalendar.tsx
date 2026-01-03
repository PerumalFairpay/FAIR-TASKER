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
    const getStatus = (emp: any, date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const empId = emp.employee_no_id || emp.id || emp.employee_id;

        // 1. Check Holiday (from the separate holiday list)
        const holiday = holidays.find((h) => h.date === dateStr);
        if (holiday) {
            return { type: "Holiday", label: "H", color: "bg-orange-400 text-white", name: holiday.name };
        }

        // 2. Check Attendance Records (Present, Absent, Leave)
        const record = attendance.find((a) => {
            const recordEmpId = a.employee_id || a.employee_details?.employee_no_id || a.employee_details?.id;
            return recordEmpId === empId && a.date === dateStr;
        });

        if (record) {
            if (record.status === "Present") {
                return { type: "Present", label: "P", color: "bg-success text-white" };
            } else if (record.status === "Absent") {
                return { type: "Absent", label: "A", color: "bg-danger text-white" };
            } else if (record.status === "Leave") {
                return { type: "Leave", label: "L", color: "bg-warning text-white" };
            }
            // Fallback for other statuses
            return { type: record.status, label: record.status[0], color: "bg-primary text-white" };
        }

        // 3. Weekend/Default
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return { type: "Weekend", label: "-", color: "text-default-300" };
        }

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
                        <tr key={emp.employee_no_id || emp.id} className="hover:bg-default-50 transition-colors border-b border-divider/50">
                            <td className="p-3 sticky left-0 bg-background z-10 border-r border-divider">
                                <div className="flex items-center gap-3">
                                    <Avatar src={emp.profile_picture} name={emp.name} size="sm" />
                                    <div>
                                        <p className="text-sm font-medium text-default-900 line-clamp-1">{emp.name}</p>
                                        <p className="text-xs text-primary">{emp.employee_no_id || emp.id}</p>
                                    </div>
                                </div>
                            </td>
                            {days.map((day) => {
                                const status = getStatus(emp, day);
                                return (
                                    <td key={day.toISOString()} className="p-1 text-center">
                                        <div className="flex justify-center items-center h-full">
                                            {status.type !== "None" && status.type !== "Weekend" ? (
                                                <Tooltip content={status.name || status.type}>
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${status.color} shadow-sm cursor-help`}>
                                                        {status.label}
                                                    </div>
                                                </Tooltip>
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
