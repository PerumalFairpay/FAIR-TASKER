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
import { getEmployeesRequest } from "@/store/employee/action";
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

    useEffect(() => {
        if (isOpen) {
            dispatch(getEmployeesRequest());
            dispatch(getLeaveTypesRequest());
            dispatch(getHolidaysRequest());
            if (!user) {
                dispatch(getUserRequest());
            }
        }
    }, [isOpen, dispatch, user]);

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
                newData.start_date = value.start.toString();
                newData.end_date = value.end.toString();
            }
        } else {
            newData = { ...newData, [name]: value };
        }

        // Auto calculate days if dates or type change
        if (name === "start_date" || name === "end_date" || name === "leave_duration_type" || name === "date_range") {
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
                                        <div className="flex flex-col">
                                            <span>{emp.name}</span>
                                            <span className="text-tiny text-default-400">{emp.employee_no_id}</span>
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
                                    <DateRangePicker
                                        label="Date Range"
                                        value={{
                                            start: parseDate(formData.start_date),
                                            end: parseDate(formData.end_date),
                                        }}
                                        onChange={(value) => handleSelectChange("date_range", value)}
                                        variant="bordered"
                                        isRequired
                                        className="col-span-2"
                                        isDateUnavailable={isDateUnavailable}
                                        minValue={today(getLocalTimeZone())}
                                        allowsNonContiguousRanges
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
