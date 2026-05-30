"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { getProfile, updateProfile, changePassword, resetProfileMessages } from "@/store/profile/action";
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
    BadgeCheck, ExternalLink, Eye, EyeOff, KeyRound, RefreshCw,
    MapPin, Calendar, CheckCircle, X, CreditCard, Landmark
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { motion } from "framer-motion";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";
import { Chip } from "@heroui/chip";
import FileUpload from "@/components/common/FileUpload";
import { ProfileJoyride } from "@/components/profile-joyride";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const { profile, loading, profileLoading, passwordLoading, profileSuccess, profileError, passwordSuccess, passwordError } = useSelector((state: AppState) => state.Profile);
    const { user } = useSelector((state: AppState) => state.Auth);
    const isAdmin = user?.role === "admin" || user?.role === "super_admin";

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
        designation: "",
        address: "",
        account_name: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        pf_account_number: "",
        esic_number: "",
        pan_number: ""
    });

    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
    const [documentProof, setDocumentProof] = useState<File | null>(null);
    
    // FilePond states
    const [documentFiles, setDocumentFiles] = useState<any[]>([]);
    const [profileFiles, setProfileFiles] = useState<any[]>([]); // For new uploads
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

    // Sync FilePond files with state
    useEffect(() => {
        if (documentFiles.length > 0) {
            setDocumentProof(documentFiles[0].file);
        } else {
            setDocumentProof(null);
        }
    }, [documentFiles]);

    useEffect(() => {
        if (profileFiles.length > 0) {
            setProfilePic(profileFiles[0].file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result as string);
            };
            reader.readAsDataURL(profileFiles[0].file);
        } else {
            setProfilePic(null);
        }
    }, [profileFiles]);

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
                designation: profile.designation || user?.role || "",
                address: profile.address || "",
                account_name: profile.account_name || "",
                bank_name: profile.bank_name || "",
                account_number: profile.account_number || "",
                ifsc_code: profile.ifsc_code || "",
                pf_account_number: profile.pf_account_number || "",
                esic_number: profile.esic_number || "",
                pan_number: profile.pan_number || ""
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

    useEffect(() => {
        if (profileSuccess) {
            setDocumentProof(null);
            setProfilePic(null);
            if (docInputRef.current) {
                docInputRef.current.value = "";
            }
        }
    }, [profileSuccess]);

    useEffect(() => {
        if (profileSuccess || profileError || passwordSuccess || passwordError) {
            const timer = setTimeout(() => {
                dispatch(resetProfileMessages());
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [profileSuccess, profileError, passwordSuccess, passwordError, dispatch]);

    const toTitleCase = (str: string) => {
        return str.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value } = e.target;
        
        if (name === "first_name" || name === "last_name" || name === "name") {
            value = toTitleCase(value);
        }

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
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <ProfileJoyride />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <PageHeader title="My Profile" description="Manage your personal information and security settings." />

            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Left Column: Profile Card & Quick Info */}
                <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6 self-start">
                    {/* Profile Card - Premium Style */}
                    <Card className="shadow-none border-none w-full h-[320px] relative overflow-hidden rounded-2xl group">
                        {/* Background Image or Placeholder */}
                        {profilePicPreview || profile?.profile_picture || user?.profile_picture ? (
                            <img
                                src={profilePicPreview || profile?.profile_picture || user?.profile_picture}
                                alt={formData.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-default-100 to-default-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center">
                                <UserIcon size={80} className="text-default-300 dark:text-neutral-700" />
                            </div>
                        )}

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        
                        {/* Camera Action Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                             <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                                <Camera size={32} className="text-white" />
                             </div>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Chip
                                        className="capitalize font-bold text-[10px] h-5"
                                        color={profile?.status === "Active" ? "success" : "warning"}
                                        variant="solid"
                                        size="sm"
                                    >
                                        {profile?.status || "Active"}
                                    </Chip>
                                    <Chip
                                        className="capitalize font-bold text-[10px] h-5 bg-white/20 backdrop-blur-md text-white border-none"
                                        variant="flat"
                                        size="sm"
                                    >
                                        {profile?.employee_type || "Full-Time"}
                                    </Chip>
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{formData.name || "N/A"}</h2>
                                <p className="text-white/80 text-sm font-medium tracking-wide mt-1">
                                    {formData.designation || "N/A"} • {formData.department || "N/A"}
                                </p>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "profile")}
                        />
                        <button 
                            className="absolute inset-0 w-full h-full cursor-pointer z-20" 
                            onClick={() => fileInputRef.current?.click()}
                            title="Change Profile Picture"
                        />
                    </Card>

                    {/* Photo Actions if changed */}
                    {profilePic && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2 p-2 bg-primary-50 dark:bg-primary/5 rounded-2xl border border-primary-100 dark:border-primary/20"
                        >
                            <Button
                                color="primary"
                                variant="solid"
                                fullWidth
                                onPress={() => handleProfileSubmit()}
                                isLoading={profileLoading}
                                startContent={!profileLoading && <Upload size={16} />}
                                className="font-bold h-10 rounded-xl"
                            >
                                Update Photo
                            </Button>
                            <Button
                                color="danger"
                                variant="flat"
                                isIconOnly
                                onPress={() => {
                                    setProfilePic(null);
                                    setProfilePicPreview(profile?.profile_picture || user?.profile_picture || null);
                                }}
                                className="h-10 w-10 rounded-xl"
                            >
                                <X size={20} />
                            </Button>
                        </motion.div>
                    )}

                    {/* Quick Info Card */}
                    <Card className="border-none shadow-sm bg-content1 p-2 dark:bg-[#0D0D0D] dark:border dark:border-white/5">
                        <CardBody className="p-4 space-y-4">
                            <div className="w-full space-y-4 px-2">
                                {[
                                    { icon: <Mail size={18} className="text-primary" />, label: "Email", text: formData.email },
                                    { icon: <Phone size={18} className="text-success" />, label: "Mobile", text: formData.mobile },
                                    { icon: <Briefcase size={18} className="text-secondary" />, label: "Department", text: formData.department, subtext: formData.designation },
                                    { icon: <MapPin size={18} className="text-warning" />, label: "Address", text: formData.address }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="mt-1 p-2 bg-default-100/50 rounded-lg shrink-0">
                                            {item.icon}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] font-bold text-default-400 uppercase tracking-wider">{item.label}</span>
                                            <span className="text-sm font-semibold text-default-700 truncate">{item.text || "N/A"}</span>
                                            {item.subtext && <span className="text-xs text-default-400 capitalize">{item.subtext}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Form Tabs */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Detailed Information Tabs */}
                    <Card className="border-none shadow-sm overflow-hidden min-h-[500px] bg-content1 dark:bg-[#0D0D0D] dark:border dark:border-white/5">
                        <CardBody className="p-0">
                            <Tabs
                                aria-label="Profile Sections"
                                color="primary"
                                variant="solid"
                                radius="lg"
                                size="sm"
                                classNames={{
                                    base: "w-full p-4 pb-0",
                                    tabList: "bg-default-100/80 dark:bg-white/5 backdrop-blur-md p-1 border border-default-200/50 dark:border-white/10 gap-1",
                                    cursor: "bg-white dark:bg-primary shadow-sm border border-default-100 dark:border-white/10",
                                    tab: "h-8 px-6",
                                    tabContent: "group-data-[selected=true]:text-primary dark:group-data-[selected=true]:text-white text-default-500 font-bold"
                                }}
                            >
                                <Tab
                                    key="personal"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <UserIcon size={18} />
                                            <span>Personal Info</span>
                                        </div>
                                    }
                                >
                                    <div className="p-6">

                                        
                                        {(profileSuccess || profileError) && (
                                            <Alert
                                                color={profileError ? "danger" : "success"}
                                                title={profileError ? "Error" : "Profile Updated"}
                                                description={profileError || profileSuccess}
                                                className="mb-6"
                                                variant="flat"
                                            />
                                        )}

                                        <form onSubmit={handleProfileSubmit} className="space-y-8">
                                            <div className="mb-10">
                                                <h4 className="text-md font-bold text-foreground flex items-center gap-2">
                                                    <UserIcon size={18} className="text-primary" />
                                                    Personal Information
                                                </h4>
                                            </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                <Input
                                                    label="First Name"
                                                    placeholder="Enter first name"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleInputChange}
                                                    variant="flat"
                                                    labelPlacement="outside"
                                                    radius="sm"
                                                    isRequired={!isAdmin}
                                                    classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                />
                                                <Input
                                                    label="Last Name"
                                                    placeholder="Enter last name"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleInputChange}
                                                    variant="flat"
                                                    labelPlacement="outside"
                                                    radius="sm"
                                                    isRequired={!isAdmin}
                                                    classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                />
                                                <Input
                                                    label="Display Name"
                                                    placeholder="Enter display name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    variant="flat"
                                                    labelPlacement="outside"
                                                    radius="sm"
                                                    isRequired={!isAdmin}
                                                    classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                />
                                                <div className="space-y-2">
                                                    <DatePicker
                                                        label="Date of Birth"
                                                        labelPlacement="outside"
                                                        value={formData.date_of_birth ? parseDate(formData.date_of_birth) : null}
                                                        onChange={handleDateChange}
                                                        variant="flat"
                                                        radius="sm"
                                                        showMonthAndYearPickers
                                                        className="w-full"
                                                        isRequired={!isAdmin}
                                                    />
                                                </div>
                                                <Select
                                                    label="Gender"
                                                    placeholder="Select gender"
                                                    labelPlacement="outside"
                                                    selectedKeys={formData.gender ? [formData.gender] : []}
                                                    onChange={(e) => handleSelectChange("gender", e.target.value)}
                                                    variant="flat"
                                                    radius="sm"
                                                    isRequired={!isAdmin}
                                                    classNames={{ trigger: "bg-default-100 dark:bg-white/5" }}
                                                >
                                                    <SelectItem key="Male">Male</SelectItem>
                                                    <SelectItem key="Female">Female</SelectItem>
                                                    <SelectItem key="Other">Other</SelectItem>
                                                </Select>
                                                <Select
                                                    label="Marital Status"
                                                    placeholder="Select marital status"
                                                    labelPlacement="outside"
                                                    selectedKeys={formData.marital_status ? [formData.marital_status] : []}
                                                    onChange={(e) => handleSelectChange("marital_status", e.target.value)}
                                                    variant="flat"
                                                    radius="sm"
                                                    isRequired={!isAdmin}
                                                    classNames={{ trigger: "bg-default-100 dark:bg-white/5" }}
                                                >
                                                    <SelectItem key="Single">Single</SelectItem>
                                                    <SelectItem key="Married">Married</SelectItem>
                                                </Select>
                                                <Input
                                                    label="Address"
                                                    placeholder="Enter your address"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    variant="flat"
                                                    labelPlacement="outside"
                                                    radius="sm"
                                                    className="md:col-span-2"
                                                    isRequired={!isAdmin}
                                                    classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                />
                                            </div>

                                            <Divider className="opacity-50" />

                                            <div className="mb-10">
                                                <h4 className="text-md font-bold text-foreground flex items-center gap-2">
                                                    <Phone size={18} className="text-secondary" />
                                                    Emergency Contact Information
                                                </h4>
                                            </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                    <Input
                                                        label="Contact Name"
                                                        placeholder="Contact person's name"
                                                        labelPlacement="outside"
                                                        name="emergency_contact_name"
                                                        value={formData.emergency_contact_name}
                                                        onChange={handleInputChange}
                                                        variant="flat"
                                                        radius="sm"
                                                        startContent={<UserIcon size={16} className="text-default-400" />}
                                                        classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                    />
                                                    <Input
                                                        label="Contact Number"
                                                        placeholder="Contact phone number"
                                                        labelPlacement="outside"
                                                        name="emergency_contact_number"
                                                        value={formData.emergency_contact_number}
                                                        onChange={handleInputChange}
                                                        variant="flat"
                                                        radius="sm"
                                                        startContent={<Phone size={16} className="text-default-400" />}
                                                        classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                    />
                                                </div>
                                            <div className="flex justify-end pt-4">
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                    variant="solid"
                                                    isLoading={profileLoading}
                                                    onPress={() => handleProfileSubmit()}
                                                    className="font-bold px-8"
                                                    startContent={!profileLoading && <CheckCircle size={18} />}
                                                >
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </Tab>



                                <Tab
                                    key="documents"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <FileText size={18} />
                                            <span>Documents</span>
                                        </div>
                                    }
                                >
                                    <div className="p-6">
                                        {(profileSuccess || profileError) && (
                                            <Alert
                                                color={profileError ? "danger" : "success"}
                                                title={profileError ? "Error" : "Documents Updated"}
                                                description={profileError || profileSuccess}
                                                className="mb-6"
                                                variant="flat"
                                            />
                                        )}
                                        <div className="mb-10">
                                            <h4 className="text-md font-bold text-foreground flex items-center gap-2">
                                                <FileText size={18} className="text-primary" />
                                                My Documents
                                            </h4>
                                        </div>

                                            <FileUpload
                                                files={documentFiles}
                                                setFiles={setDocumentFiles}
                                                allowMultiple={false}
                                                acceptedFileTypes={['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                                                labelIdle='Drag & Drop document or <span class="filepond--label-action">Browse</span>'
                                                className="mb-6"
                                            />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {existingDocuments.map((doc, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 rounded-2xl border border-default-200 dark:border-white/10 bg-default-50/30 dark:bg-white/5 hover:border-primary/30 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer group shadow-sm"
                                                    onClick={() => setPreviewData({
                                                        url: doc.document_proof,
                                                        type: doc.file_type || 'application/pdf',
                                                        name: doc.document_name || `Document ${index + 1}`
                                                    })}
                                                >
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-default-100 dark:border-white/10 group-hover:text-primary transition-colors">
                                                            <FileTypeIcon fileType={doc.file_type} fileName={doc.document_proof} size={20} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                                                                {doc.document_name || "Document"}
                                                            </p>
                                                            <span className="text-tiny text-default-400 font-bold uppercase tracking-wider">
                                                                {doc.file_type ? doc.file_type.split('/')[1] : "FILE"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-2 rounded-full text-default-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                                        <Eye size={18} />
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {existingDocuments.length === 0 && documentFiles.length === 0 && (
                                                <div className="md:col-span-2 flex flex-col items-center justify-center py-12 text-default-400">
                                                    <FileText size={48} className="mb-4 opacity-20" />
                                                    <p className="text-sm font-bold uppercase tracking-widest">No documents found</p>
                                                </div>
                                            )}
                                        </div>

                                        {documentFiles.length > 0 && (
                                            <div className="flex justify-end mt-8 pt-4 border-t border-default-100">
                                                <Button
                                                    color="primary"
                                                    variant="solid"
                                                    isLoading={profileLoading}
                                                    onPress={() => handleProfileSubmit()}
                                                    className="font-bold px-8"
                                                    startContent={!profileLoading && <Upload size={18} />}
                                                >
                                                    Upload & Save
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Tab>

                                <Tab
                                    key="bank"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <Landmark size={18} />
                                            <span>Bank Details</span>
                                        </div>
                                    }
                                >
                                    <div className="p-6">
                                        {(profileSuccess || profileError) && (
                                            <Alert
                                                color={profileError ? "danger" : "success"}
                                                title={profileError ? "Error" : "Bank Details Updated"}
                                                description={profileError || profileSuccess}
                                                className="mb-6"
                                                variant="flat"
                                            />
                                        )}

                                        <form onSubmit={handleProfileSubmit} className="space-y-8">
                                            <div className="mb-10">
                                                <h4 className="text-md font-bold text-foreground flex items-center gap-2">
                                                    <Landmark size={18} className="text-primary" />
                                                    Bank Account Information
                                                </h4>
                                            </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                    <Input
                                                        label="Account Holder Name"
                                                        placeholder="Enter account holder name"
                                                        name="account_name"
                                                        value={formData.account_name}
                                                        onChange={handleInputChange}
                                                        variant="flat"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                    />
                                                    <Input
                                                        label="Bank Name"
                                                        placeholder="Enter bank name"
                                                        name="bank_name"
                                                        value={formData.bank_name}
                                                        onChange={handleInputChange}
                                                        variant="flat"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                    />
                                                    <Input
                                                        label="Account Number"
                                                        placeholder="Enter account number"
                                                        name="account_number"
                                                        value={formData.account_number}
                                                        onChange={handleInputChange}
                                                        variant="flat"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                    />
                                                    <Input
                                                        label="IFSC Code"
                                                        placeholder="Enter IFSC code"
                                                        name="ifsc_code"
                                                        value={formData.ifsc_code}
                                                        onChange={handleInputChange}
                                                        variant="flat"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                    />
                                                </div>

                                            <Divider className="opacity-50" />

                                            <div className="mb-10">
                                                <h4 className="text-md font-bold text-foreground flex items-center gap-2">
                                                    <CreditCard size={18} className="text-secondary" />
                                                    Statutory Details (Tax/ID)
                                                </h4>
                                            </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                                    <Input
                                                        label="PAN Number"
                                                        placeholder="Enter PAN number"
                                                        name="pan_number"
                                                        value={formData.pan_number}
                                                        onChange={handleInputChange}
                                                        variant="flat"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                    />
                                                    <Input
                                                        label="PF Account Number"
                                                        placeholder="Enter PF number"
                                                        name="pf_account_number"
                                                        value={formData.pf_account_number}
                                                        onChange={handleInputChange}
                                                        variant="flat"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                    />
                                                    <Input
                                                        label="ESIC Number"
                                                        placeholder="Enter ESIC number"
                                                        name="esic_number"
                                                        value={formData.esic_number}
                                                        onChange={handleInputChange}
                                                        variant="flat"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                    />
                                                </div>

                                            <div className="flex justify-end pt-4">
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                    variant="solid"
                                                    isLoading={profileLoading}
                                                    onPress={() => handleProfileSubmit()}
                                                    className="font-bold px-8"
                                                    startContent={!profileLoading && <CheckCircle size={18} />}
                                                >
                                                    Save Bank Details
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </Tab>

                                <Tab
                                    key="security"
                                    title={
                                        <div className="flex items-center gap-2 joyride-security-tab">
                                            <Lock size={18} />
                                            <span>Security</span>
                                        </div>
                                    }
                                >
                                    <div className="p-6 space-y-6">
                                        <div className="mb-10">
                                            <h4 className="text-md font-bold text-foreground flex items-center gap-2">
                                                <Lock size={18} className="text-primary" />
                                                Change Password
                                            </h4>
                                        </div>

                                        {(passwordSuccess || passwordError) && (
                                            <Alert
                                                color={passwordError ? "danger" : "success"}
                                                title={passwordError ? "Error" : "Success"}
                                                description={passwordError || passwordSuccess}
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
                                                variant="flat"
                                                className="joyride-current-password"
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
                                                classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input
                                                    type={isVisible.new ? "text" : "password"}
                                                    label="New Password"
                                                    labelPlacement="outside"
                                                    placeholder="Enter new password"
                                                    value={passwordData.new_password}
                                                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                                                    variant="flat"
                                                    className="joyride-new-password"
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
                                                    classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                />
                                                <Input
                                                    type={isVisible.confirm ? "text" : "password"}
                                                    label="Confirm Password"
                                                    labelPlacement="outside"
                                                    placeholder="Retype password"
                                                    value={passwordData.confirm_password}
                                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                                                    variant="flat"
                                                    className="joyride-confirm-password"
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
                                                    classNames={{ inputWrapper: "bg-default-100 dark:bg-white/5 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-white/10" }}
                                                />
                                            </div>
                                            <div className="flex justify-end pt-4">
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                    variant="shadow"
                                                    isLoading={passwordLoading}
                                                    className="font-semibold px-8 joyride-update-password-btn"
                                                >
                                                    Update Password
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>
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
