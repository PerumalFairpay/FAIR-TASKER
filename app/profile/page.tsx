"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { getProfile, updateProfile, changePassword } from "@/store/profile/action";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Avatar } from "@heroui/avatar";
import { Select, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";
import { DatePicker } from "@heroui/date-picker";
import { Alert } from "@heroui/alert";
import { Skeleton } from "@heroui/skeleton";
import { parseDate } from "@internationalized/date";
import {
    Camera, Lock, User as UserIcon, Upload,
    FileText, Shield, Mail, Phone,
    Briefcase, CheckCircle2,
    BadgeCheck, ExternalLink, Eye, EyeOff, KeyRound
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { motion } from "framer-motion";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const { profile, loading, successMessage, error } = useSelector((state: AppState) => state.Profile);
    const { user } = useSelector((state: AppState) => state.Auth);

    // State for Profile Form
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        name: "",
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
    const [documentProof, setDocumentProof] = useState<File | null>(null); // For new uploads
    const [existingDocuments, setExistingDocuments] = useState<any[]>([]); // For legacy and new API list
    const [previewData, setPreviewData] = useState<{ url: string; type: string; name: string } | null>(null);

    // State for Password Form
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [isVisible, setIsVisible] = useState({
        current: false,
        new: false,
        confirm: false
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
                name: profile.name || `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
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
            if (profile.documents && profile.documents.length > 0) {
                setExistingDocuments(profile.documents);
            } else if (profile.document_proof) {
                // Fallback / legacy support if needed
                setExistingDocuments([{
                    document_name: "Document",
                    document_proof: profile.document_proof,
                    file_type: "application/pdf"
                }]);
            } else {
                setExistingDocuments([]);
            }
        } else if (user) {
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                name: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
                email: user.email || "",
                designation: user.role || ""
            }));
            setProfilePicPreview(user.profile_picture || null);
        }
    }, [profile, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === "first_name" || name === "last_name") {
                updated.name = `${updated.first_name} ${updated.last_name}`.trim();
            }
            return updated;
        });
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

    const handleProfileSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
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

    const toggleVisibility = (field: keyof typeof isVisible) => {
        setIsVisible(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const isLoadingInitial = loading && !profile;

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="p-4 md:p-8 mx-auto min-h-screen space-y-8">
            <PageHeader title="My Profile" description="Manage your personal information and security settings." />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Simplified Profile Header */}
                <Card className="border-none shadow-sm bg-background mb-8">
                    <CardBody className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative group shrink-0">
                                {isLoadingInitial ? (
                                    <Skeleton className="rounded-full w-24 h-24 md:w-32 md:h-32" />
                                ) : (
                                    <Avatar
                                        src={profilePicPreview || user?.profile_picture || ""}
                                        name={(formData.first_name || "").charAt(0).toUpperCase()}
                                        className="w-24 h-24 md:w-32 md:h-32 text-2xl"
                                        isBordered
                                        color="primary"
                                    />
                                )}
                                <Button
                                    isIconOnly
                                    className="absolute bottom-0 right-0 rounded-full bg-content1 text-default-600 shadow-lg border border-default-200 hover:text-primary"
                                    size="sm"
                                    onPress={() => fileInputRef.current?.click()}
                                >
                                    <Camera size={14} />
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "profile")}
                                />
                            </div>

                            {/* Name & Basic Info */}
                            <div className="flex-1 w-full pt-2">
                                {isLoadingInitial ? (
                                    <div className="space-y-3 flex flex-col items-center md:items-start">
                                        <Skeleton className="h-8 w-48 rounded-lg" />
                                        <Skeleton className="h-5 w-32 rounded-lg" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        <div className="text-center md:text-left">
                                            <h2 className="text-2xl font-bold text-foreground">
                                                {formData.name}
                                            </h2>
                                            {/* <div className="flex items-center justify-center md:justify-start gap-2 text-default-500 font-medium mt-1">
                                                <span>{formData.designation || "Employee"}</span>
                                                {formData.department && (
                                                    <>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-default-300"></span>
                                                        <span>{formData.department}</span>
                                                    </>
                                                )}
                                            </div> */}
                                        </div>

                                        <Divider className="opacity-50" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-default-50 hover:bg-default-100 transition-colors">
                                                <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                                    <Mail size={18} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs text-default-500 font-semibold uppercase">Email</p>
                                                    <p className="text-sm font-medium truncate" title={formData.email}>{formData.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-default-50 hover:bg-default-100 transition-colors">
                                                <div className="p-2 bg-secondary/10 text-secondary rounded-lg shrink-0">
                                                    <Phone size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-default-500 font-semibold uppercase">Phone</p>
                                                    <p className="text-sm font-medium">{formData.mobile || "N/A"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-default-50 hover:bg-default-100 transition-colors">
                                                <div className="p-2 bg-warning/10 text-warning rounded-lg shrink-0">
                                                    <Briefcase size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-default-500 font-semibold uppercase">Department</p>
                                                    <p className="text-sm font-medium">{formData.department || "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider mb-8",
                            cursor: "w-full bg-primary h-[3px]",
                            tab: "max-w-fit px-0 h-10 text-default-500 text-base font-medium data-[selected=true]:text-primary mb-2",
                            tabContent: "group-data-[selected=true]:text-primary"
                        }}
                    >
                        <Tab
                            key="personal"
                            title={
                                <div className="flex items-center gap-2">
                                    <UserIcon size={18} />
                                    <span>Personal Information</span>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Sidebar: Quick Overview & Docs */}
                                <div className="lg:col-span-4 space-y-6">
                                    <Card className="border-none shadow-sm bg-background">
                                        <CardHeader className="flex justify-between items-center px-6 pt-6">
                                            <h3 className="font-bold text-lg">Documents</h3>
                                            <Button
                                                size="sm"
                                                variant="light"
                                                color="primary"
                                                startContent={<Upload size={14} />}
                                                onPress={() => docInputRef.current?.click()}
                                                className="font-medium"
                                            >
                                                Upload
                                            </Button>
                                            <input
                                                type="file"
                                                ref={docInputRef}
                                                hidden
                                                onChange={(e) => handleFileChange(e, "document")}
                                            />
                                        </CardHeader>
                                        <CardBody className="px-6 pb-6 pt-2">
                                            <div className="space-y-3">
                                                {existingDocuments.map((doc, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3 p-3 rounded-xl border border-default-200 bg-default-50/50 hover:bg-default-100 transition-all cursor-pointer group"
                                                        onClick={() => setPreviewData({
                                                            url: doc.document_proof,
                                                            type: doc.file_type || 'application/pdf',
                                                            name: doc.document_name || `Document ${index + 1}`
                                                        })}
                                                    >
                                                        <div className="p-2 bg-white dark:bg-black rounded-lg shadow-sm">
                                                            <FileTypeIcon fileType={doc.file_type} fileName={doc.document_proof} size={18} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                                                {doc.document_name || "Document"}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-tiny text-default-400 uppercase">
                                                                    {doc.file_type ? doc.file_type.split('/')[1] : "FILE"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="p-2 rounded-full text-default-400 hover:text-primary hover:bg-primary/10 transition-colors">
                                                            <Eye size={16} />
                                                        </div>
                                                    </div>
                                                ))}
                                                {existingDocuments.length === 0 && !documentProof && (
                                                    <div className="text-center py-6 text-default-400">
                                                        <FileText size={32} className="mx-auto mb-2 opacity-50" />
                                                        <span className="text-sm">No documents found</span>
                                                    </div>
                                                )}
                                                {documentProof && (
                                                    <div className="flex items-center gap-3 p-3 rounded-xl border border-primary-200 bg-primary-50">
                                                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                                                            <Upload size={18} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">{documentProof.name}</p>
                                                            <p className="text-tiny text-primary font-medium">Ready to upload</p>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            isIconOnly
                                                            variant="light"
                                                            color="danger"
                                                            onPress={() => setDocumentProof(null)}
                                                        >
                                                            ×
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>

                                {/* Main Edit Form */}
                                <div className="lg:col-span-8">
                                    <Card className="border-none shadow-sm bg-background h-full">
                                        <CardHeader className="px-8 pt-8 pb-0">
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground">Edit Profile</h3>
                                                <p className="text-small text-default-500 mt-1">
                                                    Update your personal information to keep your profile fresh.
                                                </p>
                                            </div>
                                        </CardHeader>
                                        <CardBody className="p-8">
                                            {successMessage && (
                                                <Alert
                                                    color="success"
                                                    title="Profile Updated"
                                                    description="Your changes have been successfully saved."
                                                    className="mb-6"
                                                    variant="flat"
                                                />
                                            )}
                                            <form onSubmit={handleProfileSubmit} className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                    <Input
                                                        label="First Name"
                                                        placeholder="Enter first name"
                                                        name="first_name"
                                                        value={formData.first_name}
                                                        onChange={handleInputChange}
                                                        variant="bordered"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-50 border-1 group-data-[focus=true]:border-primary" }}
                                                    />
                                                    <Input
                                                        label="Last Name"
                                                        placeholder="Enter last name"
                                                        name="last_name"
                                                        value={formData.last_name}
                                                        onChange={handleInputChange}
                                                        variant="bordered"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-50 border-1 group-data-[focus=true]:border-primary" }}
                                                    />
                                                    <Input
                                                        label="Display Name"
                                                        placeholder="Enter display name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        variant="bordered"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-50 border-1 group-data-[focus=true]:border-primary" }}
                                                    />
                                                    <div className="space-y-2">
                                                        <DatePicker
                                                            label="Date of Birth"
                                                            labelPlacement="outside"
                                                            value={formData.date_of_birth ? parseDate(formData.date_of_birth) : null}
                                                            onChange={handleDateChange}
                                                            variant="bordered"
                                                            radius="sm"
                                                            showMonthAndYearPickers
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <Select
                                                        label="Gender"
                                                        placeholder="Select gender"
                                                        labelPlacement="outside"
                                                        selectedKeys={formData.gender ? [formData.gender] : []}
                                                        onChange={(e) => handleSelectChange("gender", e.target.value)}
                                                        variant="bordered"
                                                        radius="sm"
                                                        classNames={{ trigger: "bg-default-50 border-1" }}
                                                    >
                                                        <SelectItem key="Male">Male</SelectItem>
                                                        <SelectItem key="Female">Female</SelectItem>
                                                        <SelectItem key="Other">Other</SelectItem>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <h4 className="text-md font-bold text-foreground mb-6 flex items-center gap-2">
                                                        <Shield size={18} className="text-primary" />
                                                        Emergency Contact
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                        <Input
                                                            label="Contact Name"
                                                            placeholder="Contact person's name"
                                                            labelPlacement="outside"
                                                            name="emergency_contact_name"
                                                            value={formData.emergency_contact_name}
                                                            onChange={handleInputChange}
                                                            variant="bordered"
                                                            radius="sm"
                                                            startContent={<UserIcon size={16} className="text-default-400" />}
                                                            classNames={{ inputWrapper: "bg-default-50 border-1 group-data-[focus=true]:border-primary" }}
                                                        />
                                                        <Input
                                                            label="Contact Number"
                                                            placeholder="Contact phone number"
                                                            labelPlacement="outside"
                                                            name="emergency_contact_number"
                                                            value={formData.emergency_contact_number}
                                                            onChange={handleInputChange}
                                                            variant="bordered"
                                                            radius="sm"
                                                            startContent={<Phone size={16} className="text-default-400" />}
                                                            classNames={{ inputWrapper: "bg-default-50 border-1 group-data-[focus=true]:border-primary" }}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </CardBody>
                                        <CardFooter className="px-8 pb-8 pt-0 flex justify-end">
                                            <Button
                                                color="primary"
                                                variant="solid"
                                                onPress={() => handleProfileSubmit()}
                                                isLoading={loading}
                                                className="px-8 font-semibold shadow-lg shadow-primary/30"
                                            >
                                                Save Changes
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>
                        </Tab>

                        <Tab
                            key="security"
                            title={
                                <div className="flex items-center gap-2">
                                    <Lock size={18} />
                                    <span>Security & Privacy</span>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                                <div className="lg:col-span-5">
                                    <div className="sticky top-8">
                                        <Card className="border-none shadow-sm bg-gradient-to-br from-default-100 to-default-50 overflow-visible">
                                            <CardBody className="p-8">
                                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                                                    <Lock size={24} />
                                                </div>
                                                <h3 className="text-xl font-bold text-foreground">Password Security</h3>
                                                <p className="text-default-500 mt-3 leading-relaxed">
                                                    Ensure your account is using a long, random password to stay secure.
                                                </p>
                                                <Divider className="my-6" />
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 text-sm text-default-600">
                                                        <BadgeCheck size={18} className="text-success" />
                                                        <span>Min 8 characters</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-default-600">
                                                        <BadgeCheck size={18} className="text-success" />
                                                        <span>At least one number</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-default-600">
                                                        <BadgeCheck size={18} className="text-success" />
                                                        <span>Special characters (!@#$)</span>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>

                                <div className="lg:col-span-7">
                                    <Card className="border-none shadow-sm bg-background">
                                        <CardHeader className="px-8 pt-8 pb-0 flex-col items-start">
                                            <h3 className="text-xl font-bold text-foreground">Change Password</h3>
                                            <p className="text-small text-default-500 mt-1">
                                                Update your password regularly to keep your account safe.
                                            </p>
                                        </CardHeader>
                                        <CardBody className="p-8 space-y-6">
                                            {(successMessage || error) && (
                                                <Alert
                                                    color={error ? "danger" : "success"}
                                                    title={error ? "Error" : "Success"}
                                                    description={error || successMessage}
                                                    variant="flat"
                                                />
                                            )}
                                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                                <Input
                                                    type={isVisible.current ? "text" : "password"}
                                                    label="Current Password"
                                                    labelPlacement="outside"
                                                    placeholder="Enter your current password"
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                                                    variant="bordered"
                                                    radius="sm"
                                                    isRequired
                                                    startContent={<KeyRound size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
                                                    endContent={
                                                        <button className="focus:outline-none" type="button" onClick={() => toggleVisibility('current')}>
                                                            {isVisible.current ? (
                                                                <EyeOff className="text-2xl text-default-400 pointer-events-none" size={20} />
                                                            ) : (
                                                                <Eye className="text-2xl text-default-400 pointer-events-none" size={20} />
                                                            )}
                                                        </button>
                                                    }
                                                    classNames={{ inputWrapper: "bg-default-50 border-1 group-data-[focus=true]:border-primary" }}
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Input
                                                        type={isVisible.new ? "text" : "password"}
                                                        label="New Password"
                                                        labelPlacement="outside"
                                                        placeholder="Enter new password"
                                                        value={passwordData.new_password}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                                                        variant="bordered"
                                                        radius="sm"
                                                        isRequired
                                                        startContent={<Lock size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
                                                        endContent={
                                                            <button className="focus:outline-none" type="button" onClick={() => toggleVisibility('new')}>
                                                                {isVisible.new ? (
                                                                    <EyeOff className="text-2xl text-default-400 pointer-events-none" size={20} />
                                                                ) : (
                                                                    <Eye className="text-2xl text-default-400 pointer-events-none" size={20} />
                                                                )}
                                                            </button>
                                                        }
                                                        classNames={{ inputWrapper: "bg-default-50 border-1 group-data-[focus=true]:border-primary" }}
                                                    />
                                                    <Input
                                                        type={isVisible.confirm ? "text" : "password"}
                                                        label="Confirm Password"
                                                        labelPlacement="outside"
                                                        placeholder="Retype password"
                                                        value={passwordData.confirm_password}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                                                        variant="bordered"
                                                        radius="sm"
                                                        isInvalid={!!passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password}
                                                        errorMessage={!!passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password ? "Passwords do not match" : ""}
                                                        isRequired
                                                        startContent={<Lock size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
                                                        endContent={
                                                            <button className="focus:outline-none" type="button" onClick={() => toggleVisibility('confirm')}>
                                                                {isVisible.confirm ? (
                                                                    <EyeOff className="text-2xl text-default-400 pointer-events-none" size={20} />
                                                                ) : (
                                                                    <Eye className="text-2xl text-default-400 pointer-events-none" size={20} />
                                                                )}
                                                            </button>
                                                        }
                                                        classNames={{ inputWrapper: "bg-default-50 border-1 group-data-[focus=true]:border-primary" }}
                                                    />
                                                </div>
                                                <div className="flex justify-end pt-4">
                                                    <Button
                                                        type="submit"
                                                        color="primary"
                                                        variant="shadow"
                                                        isLoading={loading}
                                                        className="font-semibold px-8"
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
            </motion.div>

            {/* Document Preview Modal */}
            {previewData && (
                <FilePreviewModal
                    isOpen={Boolean(previewData)}
                    onClose={() => setPreviewData(null)}
                    fileUrl={previewData.url}
                    fileType={previewData.type}
                    fileName={previewData.name}
                />
            )}
        </div>
    );
}
