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
import { TimeInput } from "@heroui/date-input";
import { parseDate, getLocalTimeZone, today, DateValue, Time, parseTime } from "@internationalized/date";
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
        start_session: "Full Day",
        end_session: "Full Day",
        start_time: "",
        end_time: "",
        total_days: 1,
        reason: "",
    });
    const [files, setFiles] = useState<any[]>([]);


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
    }, [isOpen, dispatch]);

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
                start_session: selectedRequest.start_session || "Full Day",
                end_session: selectedRequest.end_session || "Full Day",
                start_time: selectedRequest.start_time || "",
                end_time: selectedRequest.end_time || "",
                total_days: selectedRequest.total_days !== undefined ? selectedRequest.total_days : 1,
                reason: selectedRequest.reason || "",
            });
            setFiles([]);

        } else {
            setFormData({
                employee_id: "",
                leave_type_id: "",
                leave_duration_type: "Single",
                start_date: today(getLocalTimeZone()).toString(),
                end_date: today(getLocalTimeZone()).toString(),
                half_day_session: "",
                start_session: "Full Day",
                end_session: "Full Day",
                start_time: "",
                end_time: "",
                total_days: 1,
                reason: "",
            });
            setFiles([]);

        }
    }, [mode, selectedRequest, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newData = { ...formData, [name]: value };

        // Auto-calculate End Time for Permission based on allowed_hours
        if (name === "start_time" && formData.leave_duration_type === "Permission" && formData.leave_type_id) {
            const selectedType = leaveTypes?.find((lt: any) => lt.id === formData.leave_type_id);
            if (selectedType && selectedType.allowed_hours) {
                try {
                    const [hours, minutes] = value.split(':').map(Number);
                    if (!isNaN(hours) && !isNaN(minutes)) {
                        const allowedMinutes = selectedType.allowed_hours * 60;
                        const totalMinutes = (hours * 60) + minutes + allowedMinutes;

                        const endHours = Math.floor(totalMinutes / 60) % 24;
                        const endMinutes = totalMinutes % 60;

                        const formattedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                        newData.end_time = formattedEndTime;
                    }
                } catch (error) {
                    console.error("Error calculating end time:", error);
                }
            }
        }

        setFormData(newData);
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

        // Handle Permission constraints
        if (name === "leave_type_id") {
            const selectedType = leaveTypes?.find((lt: any) => lt.id === value);
            if (selectedType?.name === "Permission") {
                newData.leave_duration_type = "Permission";
            } else if (newData.leave_duration_type === "Permission") {
                // If switching away from Permission type, reset duration from Permission
                newData.leave_duration_type = "Single";
            }
        }

        if (name === "leave_duration_type") {
            // Reset fields specific to other duration types when type changes
            if (value !== "Half Day") {
                newData.half_day_session = "";
            }
            if (value !== "Permission") {
                newData.start_time = "";
                newData.end_time = "";
            }
            if (value !== "Multiple") {
                newData.start_session = "Full Day";
                newData.end_session = "Full Day";
            }

            if (value === "Permission") {
                const permissionType = leaveTypes?.find((lt: any) => lt.name === "Permission");
                if (permissionType) {
                    newData.leave_type_id = permissionType.id;
                }
            } else {
                // If switching away from Permission duration, reset leave type if it was Permission
                const currentType = leaveTypes?.find((lt: any) => lt.id === newData.leave_type_id);
                if (currentType?.name === "Permission") {
                    newData.leave_type_id = "";
                }
            }
        }

        // Auto calculate days if dates or type change
        if (name === "start_date" || name === "end_date" || name === "leave_duration_type" || name === "date_range" || name === "leave_type_id" || name === "start_session" || name === "end_session") {

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

                    // Simple calendar day count
                    const diffTime = d2.getTime() - d1.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    let total = diffDays > 0 ? diffDays : 0;

                    // Adjust for start/end sessions
                    if (newData.start_session === "Second Half") total -= 0.5;
                    if (newData.end_session === "First Half") total -= 0.5;

                    newData.total_days = Math.max(0, total);
                } catch (e) {
                    console.error("Error calculating days:", e);
                }
            } else if (newData.leave_duration_type === "Permission") {
                newData.end_date = newData.start_date;
                newData.total_days = 0;
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


    // Updated duration types to include Permission
    const durationTypes = ["Single", "Multiple", "Half Day", "Permission"];
    const sessions = ["First Half", "Second Half"];
    const startSessions = ["Full Day", "Second Half"];
    const endSessions = ["Full Day", "First Half"];

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
                                    <>
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
                                            minValue={today(getLocalTimeZone())}
                                            allowsNonContiguousRanges
                                        />
                                        <div className="col-span-1">
                                            <Select
                                                label="Start Session"
                                                selectedKeys={[formData.start_session]}
                                                onSelectionChange={(keys) => handleSelectChange("start_session", Array.from(keys)[0])}
                                                variant="bordered"
                                            >
                                                {startSessions.map((s) => (
                                                    <SelectItem key={s}>{s}</SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="col-span-1">
                                            <Select
                                                label="End Session"
                                                selectedKeys={[formData.end_session]}
                                                onSelectionChange={(keys) => handleSelectChange("end_session", Array.from(keys)[0])}
                                                variant="bordered"
                                            >
                                                {endSessions.map((s) => (
                                                    <SelectItem key={s}>{s}</SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </>
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

                            {formData.leave_duration_type === "Permission" && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <TimeInput
                                            label="Start Time"
                                            name="start_time"
                                            value={formData.start_time ? parseTime(formData.start_time) : null}
                                            onChange={(time) => {
                                                if (time) {
                                                    const timeString = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
                                                    handleInputChange({
                                                        target: { name: 'start_time', value: timeString }
                                                    } as React.ChangeEvent<HTMLInputElement>);
                                                }
                                            }}
                                            variant="bordered"
                                            isRequired
                                            hourCycle={12}
                                        />
                                        <TimeInput
                                            label="End Time"
                                            name="end_time"
                                            value={formData.end_time ? parseTime(formData.end_time) : null}
                                            onChange={(time) => {
                                                if (time && formData.start_time) {
                                                    const timeString = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;

                                                    // Validate duration
                                                    const selectedType = leaveTypes?.find((lt: any) => lt.id === formData.leave_type_id);
                                                    if (selectedType?.allowed_hours) {
                                                        const [startHours, startMinutes] = formData.start_time.split(':').map(Number);
                                                        const [endHours, endMinutes] = timeString.split(':').map(Number);

                                                        const startTotalMinutes = (startHours * 60) + startMinutes;
                                                        const endTotalMinutes = (endHours * 60) + endMinutes;
                                                        const durationMinutes = endTotalMinutes - startTotalMinutes;
                                                        const allowedMinutes = selectedType.allowed_hours * 60;

                                                        // Only update if within allowed duration and end is after start
                                                        if (durationMinutes > 0 && durationMinutes <= allowedMinutes) {
                                                            setFormData(prev => ({ ...prev, end_time: timeString }));
                                                        }
                                                    } else {
                                                        setFormData(prev => ({ ...prev, end_time: timeString }));
                                                    }
                                                }
                                            }}
                                            variant="bordered"
                                            isRequired
                                            hourCycle={12}
                                            description={(() => {
                                                if (formData.start_time && formData.end_time) {
                                                    const selectedType = leaveTypes?.find((lt: any) => lt.id === formData.leave_type_id);
                                                    if (selectedType?.allowed_hours) {
                                                        const [startHours, startMinutes] = formData.start_time.split(':').map(Number);
                                                        const [endHours, endMinutes] = formData.end_time.split(':').map(Number);

                                                        const startTotalMinutes = (startHours * 60) + startMinutes;
                                                        const endTotalMinutes = (endHours * 60) + endMinutes;
                                                        const durationMinutes = endTotalMinutes - startTotalMinutes;
                                                        const allowedMinutes = selectedType.allowed_hours * 60;

                                                        const hours = Math.floor(durationMinutes / 60);
                                                        const minutes = durationMinutes % 60;

                                                        if (durationMinutes <= 0) {
                                                            return "End time must be after start time";
                                                        } else if (durationMinutes > allowedMinutes) {
                                                            return `Exceeds allowed duration of ${selectedType.allowed_hours} hours`;
                                                        } else {
                                                            return `Duration: ${hours}h ${minutes}m`;
                                                        }
                                                    }
                                                }
                                                return "Auto-calculated based on start time";
                                            })()}
                                            isInvalid={(() => {
                                                if (formData.start_time && formData.end_time) {
                                                    const selectedType = leaveTypes?.find((lt: any) => lt.id === formData.leave_type_id);
                                                    if (selectedType?.allowed_hours) {
                                                        const [startHours, startMinutes] = formData.start_time.split(':').map(Number);
                                                        const [endHours, endMinutes] = formData.end_time.split(':').map(Number);

                                                        const startTotalMinutes = (startHours * 60) + startMinutes;
                                                        const endTotalMinutes = (endHours * 60) + endMinutes;
                                                        const durationMinutes = endTotalMinutes - startTotalMinutes;
                                                        const allowedMinutes = selectedType.allowed_hours * 60;

                                                        return durationMinutes <= 0 || durationMinutes > allowedMinutes;
                                                    }
                                                }
                                                return false;
                                            })()}
                                        />
                                    </div>
                                    {formData.leave_type_id && (() => {
                                        const selectedType = leaveTypes?.find((lt: any) => lt.id === formData.leave_type_id);
                                        if (selectedType?.allowed_hours) {
                                            return (
                                                <div className="flex items-start gap-2 p-3 bg-primary-50 dark:bg-primary-950/30 rounded-lg border border-primary-200 dark:border-primary-800">
                                                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                                                            Allowed Duration: {selectedType.allowed_hours} {selectedType.allowed_hours === 1 ? 'hour' : 'hours'}
                                                            {formData.start_time && formData.end_time && (() => {
                                                                const [startHours, startMinutes] = formData.start_time.split(':').map(Number);
                                                                const [endHours, endMinutes] = formData.end_time.split(':').map(Number);

                                                                const startTotalMinutes = (startHours * 60) + startMinutes;
                                                                const endTotalMinutes = (endHours * 60) + endMinutes;
                                                                const durationMinutes = endTotalMinutes - startTotalMinutes;

                                                                if (durationMinutes > 0) {
                                                                    const hours = Math.floor(durationMinutes / 60);
                                                                    const minutes = durationMinutes % 60;
                                                                    return ` • Current: ${hours}h ${minutes}m`;
                                                                }
                                                                return '';
                                                            })()}
                                                        </p>
                                                        <p className="text-xs text-primary-700 dark:text-primary-300 mt-0.5">
                                                            End time can be edited but must not exceed the allowed duration
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </>
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
