"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { getSettingsRequest, updateSettingsRequest } from "@/store/settings/action";
import { AppState } from "@/store/rootReducer";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { addToast } from "@heroui/toast";
import { Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
    const dispatch = useDispatch();
    const { settings, settingsLoading, updateSettingsLoading, updateSettingsSuccess, updateSettingsError } = useSelector((state: AppState) => state.Settings);

    // Local state for form values
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [activeTab, setActiveTab] = useState<any>(null);

    // Initial Fetch
    useEffect(() => {
        dispatch(getSettingsRequest());
    }, [dispatch]);

    // Populate local state when settings are loaded
    useEffect(() => {
        if (settings) {
            const initialData: Record<string, any> = {};
            // Flatten grouped settings to populate generic form data
            Object.keys(settings).forEach(group => {
                settings[group].forEach((setting: any) => {
                    initialData[setting.key] = setting.value;
                });
            });
            setFormData(initialData);

            // Set initial active tab if not set
            if (!activeTab && Object.keys(settings).length > 0) {
                // Sort keys to ensure General is first usually, or just pick first
                const groups = Object.keys(settings).sort();
                setActiveTab(groups.find(g => g === "General") || groups[0]);
            }
        }
    }, [settings]);

    // Handle Success/Error Toasts
    useEffect(() => {
        if (updateSettingsSuccess) {
            addToast({
                title: "Success",
                description: "Settings updated successfully",
                color: "success"
            });
        }
        if (updateSettingsError) {
            addToast({
                title: "Error",
                description: updateSettingsError,
                color: "danger"
            });
        }
    }, [updateSettingsSuccess, updateSettingsError]);

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        dispatch(updateSettingsRequest(formData));
    };

    const renderInput = (setting: any) => {
        const { key, label, input_type, options, value } = setting;
        const currentValue = formData[key] !== undefined ? formData[key] : value;

        switch (input_type) {
            case "text":
            case "number":
            case "email":
            case "time":
            case "date":
                return (
                    <Input
                        key={key}
                        label={label}
                        type={input_type}
                        placeholder={`Enter ${label}`}
                        value={currentValue?.toString() || ""}
                        onChange={(e) => handleInputChange(key, input_type === "number" ? Number(e.target.value) : e.target.value)}
                        variant="bordered"
                        className="mb-4"
                    />
                );
            case "boolean":
                return (
                    <div key={key} className="flex items-center justify-between mb-4 border p-3 rounded-lg border-default-200">
                        <span className="text-small font-medium">{label}</span>
                        <Switch
                            isSelected={!!currentValue}
                            onValueChange={(isSelected) => handleInputChange(key, isSelected)}
                        />
                    </div>
                );
            case "select":
                return (
                    <Select
                        key={key}
                        label={label}
                        variant="bordered"
                        placeholder={`Select ${label}`}
                        selectedKeys={currentValue ? [currentValue] : []}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="mb-4"
                    >
                        {(options || []).map((opt: string) => (
                            <SelectItem key={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </Select>
                );
            case "multiselect":
                return (
                    <Select
                        key={key}
                        label={label}
                        variant="bordered"
                        placeholder={`Select ${label}`}
                        selectionMode="multiple"
                        selectedKeys={new Set(Array.isArray(currentValue) ? currentValue : [])}
                        onSelectionChange={(keys) => handleInputChange(key, Array.from(keys))}
                        className="mb-4"
                    >
                        {(options || []).map((opt: string) => (
                            <SelectItem key={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </Select>
                );
            default:
                return null;
        }
    };

    if (settingsLoading && !settings) {
        return <div className="p-8 flex justify-center">Loading settings...</div>;
    }

    if (!settings && !settingsLoading) {
        return <div className="p-8 flex justify-center">No settings found.</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Global Settings" />
                <Button
                    color="primary"
                    startContent={<Save size={18} />}
                    onPress={handleSave}
                    isLoading={updateSettingsLoading}
                >
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                {settings && Object.keys(settings).map(group => (
                    <Card key={group}>
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-md font-bold">{group} Settings</p>
                                <p className="text-small text-default-500">Configure {group.toLowerCase()} parameters</p>
                            </div>
                        </CardHeader>
                        <div className="h-px bg-default-200" />
                        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            {settings[group].map((setting: any) => renderInput(setting))}
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
