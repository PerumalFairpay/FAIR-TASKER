import React from "react";
import { format, getDaysInMonth, startOfMonth, endOfMonth, isSameDay, parseISO } from "date-fns";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Avatar } from "@heroui/avatar";
import { Tooltip } from "@heroui/tooltip";
import { X, Check, Calendar, Coffee, AlertCircle, Clock, Plane } from "lucide-react";

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
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(currentMonth);
        d.setDate(i + 1);
        return d;
    });
    const getStatus = (emp: any, date: Date): any => {
        const dateStr = format(date, "yyyy-MM-dd");

        const holiday = holidays.find((h) => h.date === dateStr);
        if (holiday) {
            return { type: "Holiday", label: <Coffee size={14} />, color: "bg-orange-400 text-white", name: holiday.name };
        }
        const record = attendance.find((a) => {
            const empIds = [emp.id, emp._id, emp.employee_id, emp.employee_no_id].filter(Boolean);
            let isMatch = empIds.includes(a.employee_id);
            if (!isMatch && a.employee_details) {
                if (a.employee_details.id && empIds.includes(a.employee_details.id)) isMatch = true;
                if (a.employee_details.employee_no_id && empIds.includes(a.employee_details.employee_no_id)) isMatch = true;
            }

            return isMatch && a.date === dateStr;
        });

        if (record) {
            if (record.status === "Present") {
                return { type: "Present", label: <Check size={14} strokeWidth={3} />, color: "bg-success text-white" };
            } else if (record.status === "Late") {
                return { type: "Late", label: <Clock size={14} />, color: "bg-amber-500 text-white" };
            } else if (record.status === "Absent") {
                return { type: "Absent", label: <X size={14} strokeWidth={3} />, color: "bg-danger text-white" };
            } else if (record.status === "Leave") {
                return { type: "Leave", label: <Plane size={14} />, color: "bg-purple-500 text-white" };
            }
            return { type: record.status, label: <AlertCircle size={14} />, color: "bg-primary text-white" };
        }

        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return { type: "Weekend", label: "-", color: "text-default-300" };
        }

        return { type: "None", label: "-", color: "text-default-300" };
    };

    const headerColumns = [
        { uid: "employee", label: "Employee", subLabel: "" },
        ...days.map((day) => ({
            uid: format(day, "yyyy-MM-dd"),
            date: day,
            label: format(day, "d"),
            subLabel: format(day, "EEE")[0]
        }))
    ];

    return (
        <Table
            aria-label="Attendance Calendar"
            isHeaderSticky
            shadow="none"
            classNames={{
                wrapper: "p-0 bg-transparent border-none shadow-none",
                base: "max-h-[600px]",
                table: "min-w-[1000px]",
                th: "bg-default-100 text-default-600 font-medium",
                td: "p-1",
            }}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "employee" ? "start" : "center"}
                        className={column.uid === "employee"
                            ? "sticky left-0 z-20 bg-background/90 backdrop-blur-md shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]"
                            : "min-w-[30px] px-0"
                        }
                    >
                        {column.uid === "employee" ? (
                            column.label
                        ) : (
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold text-default-700">{column.label}</span>
                                <span className="text-[10px] text-default-400 uppercase">{column.subLabel}</span>
                            </div>
                        )}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent="No employees found." items={employees}>
                {(emp) => (
                    <TableRow key={emp.employee_id || emp.id}>
                        {(columnKey) => {
                            if (columnKey === "employee") {
                                return (
                                    <TableCell className="sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        <div className="flex items-center gap-3 py-1">
                                            <Avatar src={emp.profile_picture} name={emp.name} size="sm" />
                                            <div>
                                                <p className="text-sm font-semibold text-default-900 line-clamp-1">{emp.name}</p>
                                                <p className="text-xs text-primary font-mono">{emp.email || emp.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                );
                            }

                            // Date Column
                            const date = parseISO(columnKey as string);
                            const status = getStatus(emp, date);

                            return (
                                <TableCell>
                                    <div className="flex justify-center items-center h-full">
                                        {status.type !== "None" && status.type !== "Weekend" ? (
                                            <Tooltip content={status.name || status.type} closeDelay={0}>
                                                <div className={`w-6 h-6 rounded-sm flex items-center justify-center shadow-sm cursor-help transition-transform hover:scale-110 ${status.color}`}>
                                                    {status.label}
                                                </div>
                                            </Tooltip>
                                        ) : (
                                            <span className={`text-xs ${status.color}`}>{status.label}</span>
                                        )}
                                    </div>
                                </TableCell>
                            );
                        }}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default AttendanceCalendar;
