"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { getProfile, updateProfile, changePassword } from "@/store/profile/action";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Avatar } from "@heroui/avatar";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { DatePicker } from "@heroui/date-picker";
import { Alert } from "@heroui/alert";
import { Skeleton } from "@heroui/skeleton";
import { parseDate } from "@internationalized/date";
import {
    Camera, Lock, User as UserIcon, Upload,
    FileText, Shield, Mail, Phone,
    Briefcase, Building2, CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const { profile, loading, successMessage, error } = useSelector((state: AppState) => state.Profile);
    const { user } = useSelector((state: AppState) => state.Auth);

    // State for Profile Form
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        date_of_birth: "",
        gender: "",
        emergency_contact_name: "",
        emergency_contact_number: "",
        marital_status: "",
        department: "",
        designation: ""
    });

    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
    const [documentProof, setDocumentProof] = useState<File | null>(null);

    // State for Password Form
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                email: profile.email || "",
                mobile: profile.mobile || "",
                date_of_birth: profile.date_of_birth || "",
                gender: profile.gender || "",
                emergency_contact_name: profile.emergency_contact_name || "",
                emergency_contact_number: profile.emergency_contact_number || "",
                marital_status: profile.marital_status || "",
                department: profile.department || "",
                designation: profile.designation || user?.role || ""
            });
            setProfilePicPreview(profile.profile_picture || null);
        } else if (user) {
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                designation: user.role || ""
            }));
            setProfilePicPreview(user.profile_picture || null);
        }
    }, [profile, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: any) => {
        setFormData(prev => ({ ...prev, date_of_birth: date ? date.toString() : "" }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "document") => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (type === "profile") {
                setProfilePic(file);
                // Create a local URL for preview
                setProfilePicPreview(URL.createObjectURL(file));
            } else {
                setDocumentProof(file);
            }
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });
        if (profilePic) data.append("profile_picture", profilePic);
        if (documentProof) data.append("document_proof", documentProof);

        dispatch(updateProfile(data));
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) return;

        dispatch(changePassword({
            current_password: passwordData.current_password,
            new_password: passwordData.new_password
        }));
        setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    };

    const isLoadingInitial = loading && !profile;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
            <PageHeader title="My Profile" description="Manage your personal information and security settings." />

            <div className="mt-8">
                {/* Profile Header Card */}
                <Card className="border-none shadow-sm bg-background mb-8 overflow-visible">
                    <CardBody className="p-0">
                        <div className="flex flex-col md:flex-row p-6 items-start md:items-center gap-6">
                            <div className="relative group shrink-0">
                                {isLoadingInitial ? (
                                    <Skeleton className="rounded-full w-24 h-24 md:w-32 md:h-32" />
                                ) : (
                                    <Avatar
                                        src={profilePicPreview || user?.profile_picture || ""}
                                        name={(formData.first_name || "").charAt(0).toUpperCase()}
                                        className="w-24 h-24 md:w-32 md:h-32 text-2xl"
                                        isBordered
                                        radius="full"
                                        showFallback
                                    />
                                )}
                                <button
                                    className="absolute bottom-1 right-1 p-2 bg-secondary text-white rounded-full shadow-lg hover:bg-primary-600 transition-all transform hover:scale-105 active:scale-95 border-2 border-background z-10"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera size={16} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "profile")}
                                />
                            </div>

                            <div className="flex-1 min-w-0 space-y-3 w-full">
                                {isLoadingInitial ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-64 rounded-lg" />
                                        <Skeleton className="h-4 w-48 rounded-lg" />
                                        <div className="flex gap-2 pt-2">
                                            <Skeleton className="h-6 w-24 rounded-full" />
                                            <Skeleton className="h-6 w-24 rounded-full" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-foreground">{formData.first_name} {formData.last_name}</h2>
                                                <p className="text-default-500 font-medium">{formData.email}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="flat"
                                                    color="default"
                                                    className="font-medium"
                                                    startContent={<Upload size={18} />}
                                                    onPress={() => docInputRef.current?.click()}
                                                >
                                                    {documentProof ? "Update Proof" : "Upload Proof"}
                                                </Button>
                                                <input
                                                    type="file"
                                                    ref={docInputRef}
                                                    hidden
                                                    onChange={(e) => handleFileChange(e, "document")}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {formData.designation && (
                                                <Chip startContent={<Briefcase size={14} />} variant="flat" color="primary">{formData.designation}</Chip>
                                            )}
                                            {formData.department && (
                                                <Chip startContent={<Building2 size={14} />} variant="flat" color="secondary">{formData.department}</Chip>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <div className="flex w-full flex-col">
                    <Tabs
                        aria-label="Profile Sections"
                        color="primary"
                        variant="underlined"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-primary",
                            tab: "max-w-fit px-0 h-12 text-default-500",
                            tabContent: "group-data-[selected=true]:text-primary font-medium text-base"
                        }}
                    >
                        <Tab
                            key="personal"
                            title={
                                <div className="flex items-center gap-2">
                                    <UserIcon size={18} />
                                    <span>Overview & Edit</span>
                                </div>
                            }
                        >
                            <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Contact & Quick Info */}
                                <div className="lg:col-span-1 space-y-6">
                                    <Card className="border-none shadow-sm bg-background">
                                        <CardHeader className="font-semibold px-6 pt-6 text-foreground">Contact Details</CardHeader>
                                        <Divider />
                                        <CardBody className="px-6 py-6 space-y-5">
                                            <div className="group flex items-center gap-4">
                                                <div className="p-2 bg-default-100 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Mail size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-default-500 font-semibold uppercase tracking-wider">Email</p>
                                                    <p className="text-sm font-medium text-default-900 truncate max-w-[200px]" title={formData.email}>{formData.email}</p>
                                                </div>
                                            </div>
                                            <div className="group flex items-center gap-4">
                                                <div className="p-2 bg-default-100 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Phone size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-default-500 font-semibold uppercase tracking-wider">Mobile</p>
                                                    <p className="text-sm font-medium text-default-900">{formData.mobile || "Not set"}</p>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card className="border-none shadow-sm bg-background">
                                        <CardHeader className="font-semibold px-6 pt-6 text-foreground">Documents</CardHeader>
                                        <Divider />
                                        <CardBody className="px-6 py-6">
                                            {documentProof ? (
                                                <div className="flex items-start gap-3 p-3 rounded-medium border border-divider bg-default-50">
                                                    <FileText size={20} className="text-primary mt-0.5" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{documentProof.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-tiny text-default-400">{(documentProof.size / 1024).toFixed(1)} KB</span>
                                                            <span className="w-1 h-1 rounded-full bg-default-300"></span>
                                                            <span className="text-tiny text-success font-medium">Uploaded</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-default-500 italic text-center p-4">No documents uploaded yet.</div>
                                            )}
                                        </CardBody>
                                    </Card>
                                </div>

                                {/* Right Column: Edit Form */}
                                <div className="lg:col-span-2">
                                    <Card className="border-none shadow-sm h-full bg-background">
                                        <CardHeader className="px-8 pt-6 pb-4 flex justify-between items-center bg-transparent">
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">Profile Information</h3>
                                                <p className="text-sm text-default-500">Update your account details</p>
                                            </div>
                                            {successMessage && (
                                                <Chip color="success" variant="flat" size="sm" startContent={<CheckCircle2 size={12} />}>Saved</Chip>
                                            )}
                                        </CardHeader>
                                        <Divider className="opacity-50" />
                                        <CardBody className="p-8">
                                            <form onSubmit={handleProfileSubmit} className="space-y-8">

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Input
                                                        label="First Name"
                                                        labelPlacement="outside"
                                                        placeholder="e.g. John"
                                                        name="first_name"
                                                        value={formData.first_name}
                                                        onChange={handleInputChange}
                                                        variant="bordered"
                                                        radius="sm"
                                                    />
                                                    <Input
                                                        label="Last Name"
                                                        labelPlacement="outside"
                                                        placeholder="e.g. Doe"
                                                        name="last_name"
                                                        value={formData.last_name}
                                                        onChange={handleInputChange}
                                                        variant="bordered"
                                                        radius="sm"
                                                    />
                                                    <DatePicker
                                                        label="Date of Birth"
                                                        labelPlacement="outside"
                                                        value={formData.date_of_birth ? parseDate(formData.date_of_birth) : null}
                                                        onChange={handleDateChange}
                                                        variant="bordered"
                                                        radius="sm"
                                                        showMonthAndYearPickers
                                                    />
                                                    <Select
                                                        label="Gender"
                                                        labelPlacement="outside"
                                                        placeholder="Select gender"
                                                        selectedKeys={formData.gender ? [formData.gender] : []}
                                                        onChange={(e) => handleSelectChange("gender", e.target.value)}
                                                        variant="bordered"
                                                        radius="sm"
                                                    >
                                                        <SelectItem key="Male">Male</SelectItem>
                                                        <SelectItem key="Female">Female</SelectItem>
                                                        <SelectItem key="Other">Other</SelectItem>
                                                    </Select>
                                                </div>

                                                <div className="pt-2">
                                                    <h4 className="text-sm font-bold text-default-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                                                        <Divider className="w-8" /> Emergency Contact
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <Input
                                                            label="Contact Name"
                                                            labelPlacement="outside"
                                                            placeholder="Name of contact person"
                                                            name="emergency_contact_name"
                                                            value={formData.emergency_contact_name}
                                                            onChange={handleInputChange}
                                                            variant="bordered"
                                                            radius="sm"
                                                        />
                                                        <Input
                                                            label="Contact Number"
                                                            labelPlacement="outside"
                                                            placeholder="Phone number"
                                                            name="emergency_contact_number"
                                                            value={formData.emergency_contact_number}
                                                            onChange={handleInputChange}
                                                            variant="bordered"
                                                            radius="sm"
                                                        />
                                                    </div>
                                                </div>

                                                <Divider className="my-2" />

                                                <div className="flex justify-end pt-2">
                                                    <Button
                                                        color="primary"
                                                        type="submit"
                                                        isLoading={loading}
                                                        className="font-semibold px-8"
                                                        radius="sm"
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </Tab>

                        <Tab
                            key="security"
                            title={
                                <div className="flex items-center gap-2">
                                    <Shield size={18} />
                                    <span>Security</span>
                                </div>
                            }
                        >
                            <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <Card className="border-none shadow-sm bg-default-50 h-full">
                                        <CardBody className="p-6">
                                            <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl w-fit shadow-sm mb-4">
                                                <Lock size={24} className="text-default-700" />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground">Password & Security</h3>
                                            <p className="text-sm text-default-500 mt-2 leading-relaxed">
                                                A strong password helps prevent unauthorized access to your account.
                                            </p>
                                            <ul className="mt-4 space-y-2 text-sm text-default-500 list-disc list-inside">
                                                <li>Use at least 8 characters</li>
                                                <li>Include at least one uppercase letter</li>
                                                <li>Include at least one number</li>
                                                <li>Include at least one special symbol</li>
                                            </ul>
                                        </CardBody>
                                    </Card>
                                </div>

                                <div className="lg:col-span-2">
                                    <Card className="border-none shadow-sm bg-background">
                                        <CardHeader className="px-8 pt-8 pb-4 border-b border-divider bg-transparent">
                                            <h3 className="text-lg font-bold text-foreground">Change Password</h3>
                                        </CardHeader>
                                        <CardBody className="p-8">
                                            {(successMessage || error) && (
                                                <Alert
                                                    color={error ? "danger" : "success"}
                                                    title={error ? "Error Updating Password" : "Password Updated"}
                                                    description={error || successMessage}
                                                    className="mb-6"
                                                />
                                            )}

                                            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                                                <label htmlFor="current_password">Current Password</label>
                                                <Input
                                                    type="password"
                                                    // label="Current Password"
                                                    labelPlacement="outside"
                                                    placeholder="Enter current password"
                                                    name="current_password"
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                                                    variant="bordered"
                                                    radius="sm"
                                                    isRequired
                                                />
                                                <div className="space-y-6">
                                                    <label htmlFor="new_password">New Password</label>
                                                    <Input
                                                        type="password"
                                                        // label="New Password"
                                                        labelPlacement="outside"
                                                        placeholder="Enter new password"
                                                        name="new_password"
                                                        value={passwordData.new_password}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                                                        variant="bordered"
                                                        radius="sm"
                                                        isRequired
                                                    />
                                                    <label htmlFor="confirm_password">Confirm Password</label>
                                                    <Input
                                                        type="password"
                                                        // label="Confirm Password"
                                                        labelPlacement="outside"
                                                        placeholder="Confirm new password"
                                                        name="confirm_password"
                                                        value={passwordData.confirm_password}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                                                        variant="bordered"
                                                        radius="sm"
                                                        isInvalid={!!passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password}
                                                        color={!!passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password ? "danger" : "default"}
                                                        errorMessage={!!passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password ? "Passwords do not match" : ""}
                                                        isRequired
                                                    />
                                                </div>

                                                <div className="pt-4">
                                                    <Button
                                                        color="primary"
                                                        type="submit"
                                                        isLoading={loading}
                                                        className="font-medium px-8"
                                                        radius="sm"
                                                    >
                                                        Update Password
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
