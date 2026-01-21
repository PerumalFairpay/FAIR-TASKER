"use client";

import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker, DateRangePicker } from "@heroui/date-picker";
import { parseDate, getLocalTimeZone, today, DateValue } from "@internationalized/date";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getEmployeesSummaryRequest } from "@/store/employee/action";
import { getLeaveTypesRequest } from "@/store/leaveType/action";
import { getHolidaysRequest } from "@/store/holiday/action";
import { getUserRequest } from "@/store/auth/action";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip";
import { Upload } from "lucide-react";

import FileUpload from "@/components/common/FileUpload";

interface AddEditLeaveRequestDrawerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mode: "create" | "edit";
    selectedRequest: any;
    loading: boolean;
    onSubmit: (data: FormData) => void;
}

export default function AddEditLeaveRequestDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedRequest,
    loading,
    onSubmit,
}: AddEditLeaveRequestDrawerProps) {
    const dispatch = useDispatch();
    const { employees } = useSelector((state: RootState) => state.Employee);
    const { leaveTypes } = useSelector((state: RootState) => state.LeaveType);
    const { leaveMetrics } = useSelector((state: RootState) => state.LeaveRequest);
    const { holidays } = useSelector((state: RootState) => state.Holiday);
    const { user } = useSelector((state: RootState) => state.Auth);

    const [formData, setFormData] = useState({
        employee_id: "",
        leave_type_id: "",
        leave_duration_type: "Single",
        start_date: today(getLocalTimeZone()).toString(),
        end_date: today(getLocalTimeZone()).toString(),
        half_day_session: "",
        total_days: 1,
        reason: "",
    });
    const [files, setFiles] = useState<any[]>([]);
    const [lopWarning, setLopWarning] = useState<{ title: string; holidays: string[] } | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (!employees || employees.length === 0) {
                dispatch(getEmployeesSummaryRequest());
            }
            if (!leaveTypes || leaveTypes.length === 0) {
                dispatch(getLeaveTypesRequest());
            }
            if (!holidays || holidays.length === 0) {
                dispatch(getHolidaysRequest());
            }
            if (!user) {
                dispatch(getUserRequest());
            }
        }
    }, [isOpen, dispatch, user, employees, leaveTypes, holidays]);

    useEffect(() => {
        if (isOpen && user?.role === "employee" && employees?.length > 0) {
            const currentEmployee = employees.find(
                (emp: any) => emp.id === user.employee_id || emp.email === user.email || emp.id === user.id
            );
            if (currentEmployee) {
                setFormData((prev) => ({ ...prev, employee_id: currentEmployee.id }));
            }
        }
    }, [isOpen, user, employees]);

    useEffect(() => {
        if (mode === "edit" && selectedRequest) {
            setFormData({
                employee_id: selectedRequest.employee_id || "",
                leave_type_id: selectedRequest.leave_type_id || "",
                leave_duration_type: selectedRequest.leave_duration_type || "Single",
                start_date: selectedRequest.start_date || today(getLocalTimeZone()).toString(),
                end_date: selectedRequest.end_date || today(getLocalTimeZone()).toString(),
                half_day_session: selectedRequest.half_day_session || "",
                total_days: selectedRequest.total_days || 1,
                reason: selectedRequest.reason || "",
            });
            setFiles([]); // Reset files on edit open, as we don't pre-fill existing files in FilePond usually
            setLopWarning(null);
        } else {
            setFormData({
                employee_id: "",
                leave_type_id: "",
                leave_duration_type: "Single",
                start_date: today(getLocalTimeZone()).toString(),
                end_date: today(getLocalTimeZone()).toString(),
                half_day_session: "",
                total_days: 1,
                reason: "",
            });
            setFiles([]);
            setLopWarning(null);
        }
    }, [mode, selectedRequest, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: any) => {
        let newData = { ...formData };

        if (name === "date_range") {
            if (value) {
                if (value.start.toString() === value.end.toString()) {
                    newData.start_date = "";
                    newData.end_date = "";
                } else {
                    newData.start_date = value.start.toString();
                    newData.end_date = value.end.toString();
                }
            }
        } else {
            newData = { ...newData, [name]: value };
        }

        // Auto calculate days if dates or type change
        if (name === "start_date" || name === "end_date" || name === "leave_duration_type" || name === "date_range") {
            setLopWarning(null);
            if (newData.leave_duration_type === "Single") {
                newData.end_date = newData.start_date;
                newData.total_days = 1;
            } else if (newData.leave_duration_type === "Half Day") {
                newData.end_date = newData.start_date;
                newData.total_days = 0.5;
            } else if (newData.leave_duration_type === "Multiple") {
                try {
                    const start = parseDate(newData.start_date);
                    const end = parseDate(newData.end_date);
                    const d1 = new Date(start.year, start.month - 1, start.day);
                    const d2 = new Date(end.year, end.month - 1, end.day);

                    // Count every day in the range regardless of holidays
                    const diffTime = d2.getTime() - d1.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    newData.total_days = diffDays > 0 ? diffDays : 0;
                } catch (e) {
                    console.error("Error calculating days:", e);
                }
            }

            // Check if start or end date is adjacent to a holiday
            try {
                const start = parseDate(newData.start_date);
                const end = parseDate(newData.end_date);

                const d1 = new Date(start.year, start.month - 1, start.day);
                const d2 = new Date(end.year, end.month - 1, end.day);

                const prevDay = new Date(d1);
                prevDay.setDate(d1.getDate() - 1);

                const nextDay = new Date(d2);
                nextDay.setDate(d2.getDate() + 1);

                const formatDate = (d: Date) => {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                const prevDateStr = formatDate(prevDay);
                const nextDateStr = formatDate(nextDay);

                const prevHoliday = holidays.find((h: any) => h.date === prevDateStr && h.status === "Active");
                const nextHoliday = holidays.find((h: any) => h.date === nextDateStr && h.status === "Active");

                const interiorHolidays: any[] = [];
                if (newData.leave_duration_type === "Multiple") {
                    for (let d = new Date(d1); d <= d2; d.setDate(d.getDate() + 1)) {
                        const dateStr = formatDate(d);
                        const holiday = holidays.find((h: any) => h.date === dateStr && h.status === "Active");
                        if (holiday) {
                            interiorHolidays.push(holiday);
                        }
                    }
                }

                if (prevHoliday || nextHoliday || interiorHolidays.length > 0) {
                    const lopType = leaveTypes?.find((lt: any) => lt.name.toLowerCase().includes("loss of pay") || lt.code === "LOP");
                    if (lopType) {
                        newData.leave_type_id = lopType.id;
                        if (newData.leave_duration_type === "Single") {
                            newData.leave_duration_type = "Multiple";
                            // Expand the date range to include the triggering adjacent holidays
                            if (prevHoliday) {
                                newData.start_date = prevHoliday.date;
                            }
                            if (nextHoliday) {
                                newData.end_date = nextHoliday.date;
                            }
                        }
                        let extraDays = 0;
                        const holidayDetails: string[] = [];

                        if (prevHoliday) {
                            extraDays += 1;
                            holidayDetails.push(`${prevHoliday.name} (${prevHoliday.date})`);
                        }

                        interiorHolidays.forEach((h) => {
                            holidayDetails.push(`${h.name} (${h.date})`);
                        });

                        if (nextHoliday) {
                            extraDays += 1;
                            holidayDetails.push(`${nextHoliday.name} (${nextHoliday.date})`);
                        }

                        newData.total_days += extraDays;
                        const uniqueHolidays = Array.from(new Set(holidayDetails));
                        setLopWarning({
                            title: "Sandwich Rule Applied (Loss of Pay)",
                            holidays: uniqueHolidays
                        });
                    }
                }
            } catch (e) {
                // Ignore date parsing errors
            }
        }

        setFormData(newData);
    };

    const handleSubmit = () => {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value.toString());
            }
        });
        if (files.length > 0) {
            data.append("attachment", files[0].file);
        }
        onSubmit(data);
    };

    const durationTypes = ["Single", "Multiple", "Half Day"];
    const sessions = ["First Half", "Second Half"];

    const isDateUnavailable = (date: DateValue) => {
        return holidays.some(
            (holiday: any) => holiday.date === date.toString() && holiday.status === "Active"
        );
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Apply for Leave" : "Edit Leave Request"}
                        </DrawerHeader>
                        <DrawerBody className="gap-4 pb-8">
                            {mode === "edit" && selectedRequest?.status === "Rejected" && selectedRequest?.rejection_reason && (
                                <Alert color="danger" title="Validation Error">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-danger-600">Request Rejected</span>
                                        <span className="text-sm">{selectedRequest.rejection_reason}</span>
                                    </div>
                                </Alert>
                            )}
                            {lopWarning && (
                                <Alert color="warning" title={lopWarning.title}>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm">
                                            The following holidays are included in your leave duration:
                                        </span>
                                        <ul className="list-disc list-inside text-sm ml-2">
                                            {lopWarning.holidays.map((h, i) => (
                                                <li key={i}>{h}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </Alert>
                            )}
                            <Select
                                label="Employee"
                                placeholder="Select employee"
                                selectedKeys={formData.employee_id ? [formData.employee_id] : []}
                                onSelectionChange={(keys) => handleSelectChange("employee_id", Array.from(keys)[0])}
                                variant="bordered"
                                isRequired
                                isDisabled={user?.role === "employee"}
                            >
                                {(employees || []).map((emp: any) => (
                                    <SelectItem key={emp.id} textValue={emp.name}>
                                        <div className="flex gap-2 items-center">
                                            {emp.profile_picture ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={emp.profile_picture}
                                                    alt={emp.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-default-200 flex items-center justify-center text-sm font-semibold text-default-500">
                                                    {emp.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-small">{emp.name}</span>
                                                <span className="text-tiny text-default-400">{emp.email}</span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </Select>

                            <Select
                                label="Leave Type"
                                placeholder="Select type"
                                selectedKeys={formData.leave_type_id ? [formData.leave_type_id] : []}
                                onSelectionChange={(keys) => handleSelectChange("leave_type_id", Array.from(keys)[0])}
                                variant="bordered"
                                isRequired
                                isDisabled={!!lopWarning}
                            >
                                {(leaveTypes || []).map((lt: any) => {
                                    const metric = leaveMetrics?.find((m: any) => m.leave_type === lt.name);
                                    return (
                                        <SelectItem key={lt.id} textValue={lt.name}>
                                            <div className="flex items-center justify-between gap-2">
                                                <span>{lt.name} ({lt.code})</span>
                                                {metric && (
                                                    <Chip
                                                        size="sm"
                                                        variant="flat"
                                                        className="h-5 px-1 min-h-5 text-tiny"
                                                        color={metric.available > 0 ? "success" : "danger"}
                                                    >
                                                        {metric.available} Left
                                                    </Chip>
                                                )}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </Select>

                            <Select
                                label="Duration"
                                selectedKeys={[formData.leave_duration_type]}
                                onSelectionChange={(keys) => handleSelectChange("leave_duration_type", Array.from(keys)[0])}
                                variant="bordered"
                            >
                                {durationTypes.map((t) => (
                                    <SelectItem key={t}>{t}</SelectItem>
                                ))}
                            </Select>

                            <div className="grid grid-cols-2 gap-4">
                                {formData.leave_duration_type === "Multiple" ? (
                                    <DateRangePicker
                                        label="Date Range"
                                        value={formData.start_date && formData.end_date ? {
                                            start: parseDate(formData.start_date),
                                            end: parseDate(formData.end_date),
                                        } : null}
                                        onChange={(value) => handleSelectChange("date_range", value)}
                                        variant="bordered"
                                        isRequired
                                        className="col-span-2"
                                        isDateUnavailable={isDateUnavailable}
                                        minValue={today(getLocalTimeZone())}
                                        allowsNonContiguousRanges
                                        isInvalid={!!lopWarning}
                                        errorMessage={lopWarning ? "Sandwich Rule Applied: Holidays are included in your leave." : undefined}
                                        calendarProps={{
                                            className: "[&_td:nth-child(1)_button]:!text-green-600 [&_td:nth-child(1)_span]:!text-green-600 [&_[data-unavailable=true]_span]:!text-red-500 [&_[data-unavailable=true]_button]:!text-red-500"
                                        }}
                                    />
                                ) : (
                                    <DatePicker
                                        label="Date"
                                        value={formData.start_date ? parseDate(formData.start_date) : null}
                                        onChange={(date) => handleSelectChange("start_date", date?.toString())}
                                        variant="bordered"
                                        isRequired
                                        isDateUnavailable={isDateUnavailable}
                                        className="col-span-2"
                                        minValue={today(getLocalTimeZone())}
                                        calendarProps={{
                                            className: "[&_td:nth-child(1)_button]:!text-green-600 [&_td:nth-child(1)_span]:!text-green-600 [&_[data-unavailable=true]_span]:!text-red-500 [&_[data-unavailable=true]_button]:!text-red-500"
                                        }}
                                    />
                                )}
                            </div>

                            {formData.leave_duration_type === "Half Day" && (
                                <Select
                                    label="Session"
                                    placeholder="Select session"
                                    selectedKeys={formData.half_day_session ? [formData.half_day_session] : []}
                                    onSelectionChange={(keys) => handleSelectChange("half_day_session", Array.from(keys)[0])}
                                    variant="bordered"
                                    isRequired
                                >
                                    {sessions.map((s) => (
                                        <SelectItem key={s}>{s}</SelectItem>
                                    ))}
                                </Select>
                            )}

                            <Input
                                label="Total Days"
                                type="number"
                                name="total_days"
                                value={formData.total_days.toString()}
                                onChange={handleInputChange}
                                variant="bordered"
                                isRequired
                                isDisabled
                            />

                            <Textarea
                                label="Reason"
                                placeholder="Enter reason for leave"
                                name="reason"
                                value={formData.reason}
                                onChange={handleInputChange}
                                variant="bordered"
                                isRequired
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-default-700">Attachment (Optional)</label>
                                <FileUpload
                                    files={files}
                                    setFiles={setFiles}
                                    name="attachment"
                                    allowMultiple={false}
                                    labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
                                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp', 'application/pdf']}
                                />

                            </div>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                                {mode === "create" ? "Submit Request" : "Update Request"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
