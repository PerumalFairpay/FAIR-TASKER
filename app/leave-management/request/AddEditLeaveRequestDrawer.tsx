"use client";

import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getEmployeesRequest } from "@/store/employee/action";
import { getLeaveTypesRequest } from "@/store/leaveType/action";
import { Badge } from "@heroui/badge";
import { Upload } from "lucide-react";

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
    const [attachment, setAttachment] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            dispatch(getEmployeesRequest());
            dispatch(getLeaveTypesRequest());
        }
    }, [isOpen, dispatch]);

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
            setAttachment(null);
        }
    }, [mode, selectedRequest, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: any) => {
        const newData = { ...formData, [name]: value };

        // Auto calculate days if dates change
        if (name === "start_date" || name === "end_date" || name === "leave_duration_type") {
            if (newData.leave_duration_type === "Single") {
                newData.end_date = newData.start_date;
                newData.total_days = 1;
            } else if (newData.leave_duration_type === "Half Day") {
                newData.end_date = newData.start_date;
                newData.total_days = 0.5;
            } else {
                // Calculation logic for multiple days can be added here
                // For now, simplicity
            }
        }

        setFormData(newData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value.toString());
            }
        });
        if (attachment) {
            data.append("attachment", attachment);
        }
        onSubmit(data);
    };

    const durationTypes = ["Single", "Multiple", "Half Day"];
    const sessions = ["First Half", "Second Half"];

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Apply for Leave" : "Edit Leave Request"}
                        </DrawerHeader>
                        <DrawerBody className="gap-4 pb-8">
                            <Select
                                label="Employee"
                                placeholder="Select employee"
                                selectedKeys={formData.employee_id ? [formData.employee_id] : []}
                                onSelectionChange={(keys) => handleSelectChange("employee_id", Array.from(keys)[0])}
                                variant="bordered"
                                isRequired
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
                                {(leaveTypes || []).map((lt: any) => (
                                    <SelectItem key={lt.id} textValue={lt.name}>
                                        {lt.name} ({lt.code})
                                    </SelectItem>
                                ))}
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
                                <DatePicker
                                    label={formData.leave_duration_type === "Multiple" ? "Start Date" : "Date"}
                                    value={formData.start_date ? parseDate(formData.start_date) : null}
                                    onChange={(date) => handleSelectChange("start_date", date?.toString())}
                                    variant="bordered"
                                    isRequired
                                />
                                {formData.leave_duration_type === "Multiple" && (
                                    <DatePicker
                                        label="End Date"
                                        value={formData.end_date ? parseDate(formData.end_date) : null}
                                        onChange={(date) => handleSelectChange("end_date", date?.toString())}
                                        variant="bordered"
                                        isRequired
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
                                <div className="relative group">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="border-2 border-dashed border-default-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group-hover:border-primary transition-colors bg-default-50">
                                        <Upload className="text-default-400 group-hover:text-primary" size={24} />
                                        <span className="text-sm text-default-500">
                                            {attachment ? attachment.name : "Click or drag to upload"}
                                        </span>
                                    </div>
                                </div>
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
