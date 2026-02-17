"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { getEmployeeSummaryDetailsRequest } from "@/store/employee/action";
import { RootState } from "@/store/store";
import { PageHeader } from "@/components/PageHeader"; // Assuming this exists as used in list page
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { CircularProgress } from "@heroui/progress";
import { PermissionGuard } from "@/components/PermissionGuard";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, Clock, CheckCircle, AlertCircle, FileText, UserCircle, X, Eye, Layers } from "lucide-react";
import Lottie from "lottie-react";
import HRMLoading from "@/app/assets/HRMLoading.json";
import FilePreviewModal from "@/components/common/FilePreviewModal";
export default function EmployeeSummaryPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        employeeSummaryData,
        employeeSummaryLoading,
        employeeSummaryError,
    } = useSelector((state: RootState) => state.Employee);

    const [selectedPeriod, setSelectedPeriod] = React.useState<"month" | "year" | "today">("month");
    const [previewData, setPreviewData] = React.useState<{ url: string | null; type: string | null; name: string }>({
        url: null,
        type: null,
        name: "",
    });
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    const handlePreview = (doc: any) => {
        setPreviewData({
            url: doc.document_proof,
            type: doc.file_type,
            name: doc.document_name,
        });
        setIsPreviewOpen(true);
    };

    useEffect(() => {
        if (id) {
            dispatch(getEmployeeSummaryDetailsRequest(id as string));
        }
    }, [dispatch, id]);

    const { employee, leave_summary, attendance_stats, task_metrics } = employeeSummaryData || {};

    return (
        <PermissionGuard permission="employee:view" fallback={<div className="p-6 text-center text-red-500">Access Denied</div>}>
            {employeeSummaryLoading ? (
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="w-64 h-64">
                        <Lottie animationData={HRMLoading} loop={true} />
                    </div>
                </div>
            ) : (
                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <Button
                            isIconOnly
                            variant="flat"
                            radius="full"
                            onPress={() => router.back()}
                            className="bg-white shadow-sm"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Employee Summary</h1>
                            <p className="text-default-500 text-sm">Viewing details for {employee?.name || "Employee"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Profile Card & Quick Info */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Profile Card - Dashboard Style */}
                            <Card className="shadow-none border-none bg-transparent w-full h-[320px] relative overflow-hidden rounded-[32px] group">
                                {/* Background Image */}
                                <img
                                    src={employee?.profile_picture?.replace("host.docker.internal", "localhost")}
                                    alt={employee?.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Gradient Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Chip
                                                className="capitalize font-bold text-[10px] h-5"
                                                color={employee?.status === "Active" ? "success" : "warning"}
                                                variant="solid"
                                                size="sm"
                                            >
                                                {employee?.status || "Unknown"}
                                            </Chip>
                                            <Chip
                                                className="capitalize font-bold text-[10px] h-5 bg-white/20 backdrop-blur-md text-white border-none"
                                                variant="flat"
                                                size="sm"
                                            >
                                                {employee?.employee_type || "Full-Time"}
                                            </Chip>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{employee?.name || "N/A"}</h2>
                                        <p className="text-white/80 text-sm font-medium tracking-wide mt-1">
                                            {employee?.designation || "N/A"} • {employee?.department || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-none shadow-sm bg-white p-2">
                                <CardBody className="p-4 space-y-4">

                                    <div className="w-full space-y-4 px-2">
                                        {[
                                            { icon: <Mail size={18} className="text-primary" />, label: "Email", text: employee?.email },
                                            { icon: <Phone size={18} className="text-success" />, label: "Mobile", text: employee?.mobile },
                                            { icon: <Briefcase size={18} className="text-secondary" />, label: "Department", text: employee?.department, subtext: employee?.role },
                                            { icon: <MapPin size={18} className="text-warning" />, label: "Work Mode", text: employee?.work_mode }
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="mt-1 p-2 bg-default-100/50 rounded-lg">
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

                            {/* Leave summary integration */}
                            <Card className="border-none shadow-sm">
                                <CardHeader className="flex justify-between items-center px-6 pt-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Calendar size={20} className="text-secondary" /> Leave Balances
                                    </h3>
                                </CardHeader>
                                <CardBody className="px-6 pb-6 pt-2">
                                    <div className="space-y-4">
                                        {leave_summary?.map((leave: any, idx: number) => {
                                            const percent = leave.total_allowed > 0 ? Math.round((leave.used / leave.total_allowed) * 100) : 0;
                                            const color = percent > 80 ? "danger" : percent > 50 ? "warning" : "success";

                                            return (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-default-700">{leave.leave_type}</span>
                                                            <span className="text-[10px] text-default-400 font-bold uppercase tracking-wider">{leave.code}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-sm font-bold text-${color}`}>{leave.available}</span>
                                                            <span className="text-[10px] text-default-400 font-bold ml-1">/ {leave.total_allowed}</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-default-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-${color} transition-all duration-1000`}
                                                            style={{ width: `${100 - (leave.available / leave.total_allowed * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {(!leave_summary || leave_summary.length === 0) && (
                                            <div className="text-center text-default-400 py-6 text-sm">No leave data available</div>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Right Column: Key Metrics & Detailed Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Attendance Stats */}
                            <Card className="border-none shadow-sm">
                                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Clock size={20} className="text-primary" /> Attendance Overview
                                    </h3>
                                    <Tabs
                                        size="sm"
                                        radius="full"
                                        selectedKey={selectedPeriod}
                                        onSelectionChange={(key) => setSelectedPeriod(key as "month" | "year" | "today")}
                                        classNames={{
                                            tabList: "bg-default-100",
                                            cursor: "bg-white shadow-sm",
                                            tabContent: "group-data-[selected=true]:text-primary font-bold"
                                        }}
                                    >
                                        <Tab key="today" title="Today" />
                                        <Tab key="month" title="Month" />
                                        <Tab key="year" title="Year" />
                                    </Tabs>
                                </CardHeader>
                                <Divider className="opacity-50" />
                                <CardBody className="p-6">
                                    <div className="flex flex-col md:flex-row items-center gap-10">
                                        {/* Main Progress Circle */}
                                        <div className="flex flex-col items-center gap-3">
                                            {(() => {
                                                const stats = attendance_stats?.[selectedPeriod] || {};
                                                const total = (stats.total_present || 0) + (stats.absent || 0) + (stats.leave || 0) + (stats.holiday || 0);
                                                const rate = total > 0 ? Math.round(((stats.total_present || 0) / total) * 100) : 0;

                                                return (
                                                    <>
                                                        <CircularProgress
                                                            label="Attendance Rate"
                                                            size="lg"
                                                            value={rate}
                                                            color={rate > 90 ? "success" : rate > 75 ? "primary" : "warning"}
                                                            showValueLabel={true}
                                                            classNames={{
                                                                svg: "w-36 h-36 drop-shadow-sm",
                                                                indicator: "stroke-current",
                                                                track: "stroke-default-100",
                                                                value: "text-3xl font-black",
                                                                label: "text-[10px] font-bold text-default-400 uppercase tracking-widest mt-2"
                                                            }}
                                                        />
                                                        <div className="text-center">
                                                            <p className="text-sm font-bold text-default-700">{stats.total_present || 0} Days Present</p>
                                                            <p className="text-[10px] font-bold text-default-400 uppercase">Out of {total || 0} Total Days</p>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>

                                        <Divider orientation="vertical" className="hidden md:block h-32 opacity-50" />

                                        {/* Detail Stats Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1 w-full">
                                            {[
                                                { label: "On Time", value: attendance_stats?.[selectedPeriod]?.on_time, color: "success", icon: <CheckCircle size={18} /> },
                                                { label: "Late", value: attendance_stats?.[selectedPeriod]?.late, color: "warning", icon: <Clock size={18} /> },
                                                { label: "Absent", value: attendance_stats?.[selectedPeriod]?.absent, color: "danger", icon: <X size={18} /> },
                                                { label: "Leaves", value: attendance_stats?.[selectedPeriod]?.leave, color: "secondary", icon: <Calendar size={18} /> },
                                                { label: "Holiday", value: attendance_stats?.[selectedPeriod]?.holiday, color: "primary", icon: <MapPin size={18} /> },
                                                { label: "Overtime", value: attendance_stats?.[selectedPeriod]?.overtime, color: "warning", icon: <Clock size={18} /> },
                                            ].map((stat, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative overflow-hidden group p-4 rounded-2xl bg-default-50/50 border border-transparent hover:border-default-200 hover:bg-white hover:shadow-sm transition-all duration-300"
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`p-2 rounded-xl bg-${stat.color}/10 text-${stat.color}`}>
                                                            {stat.icon}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-default-400 uppercase tracking-widest truncate">{stat.label}</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-black text-default-800 tabular-nums">{stat.value || 0}</span>
                                                        {stat.label === "Overtime" && <span className="text-xs font-bold text-default-400">hrs</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Task Metrics */}
                            <Card className="border-none shadow-sm">
                                <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Briefcase size={20} className="text-primary" /> Task Performance
                                    </h3>
                                    <Chip size="sm" variant="flat" color="primary" className="font-bold">
                                        Overall
                                    </Chip>
                                </CardHeader>
                                <Divider className="opacity-50 my-2" />
                                <CardBody className="p-6">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        {/* Completion Circle */}
                                        <div className="flex flex-col items-center justify-center p-4">
                                            <CircularProgress
                                                classNames={{
                                                    svg: "w-32 h-32 drop-shadow-md",
                                                    indicator: "stroke-primary",
                                                    track: "stroke-default-100",
                                                    value: "text-2xl font-black text-default-800",
                                                    label: "text-[10px] font-bold text-default-400 uppercase mt-1"
                                                }}
                                                value={task_metrics?.completion_rate || 0}
                                                size="lg"
                                                showValueLabel={true}
                                                label="Completion"
                                            />
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            {[
                                                {
                                                    label: "Assigned",
                                                    value: task_metrics?.total_assigned || 0,
                                                    icon: <Layers size={18} />,
                                                    bg: "bg-default-100",
                                                    text: "text-default-600"
                                                },
                                                {
                                                    label: "In Progress",
                                                    value: task_metrics?.in_progress || 0,
                                                    icon: <Clock size={18} />,
                                                    bg: "bg-warning-50",
                                                    text: "text-warning-600"
                                                },
                                                {
                                                    label: "Completed",
                                                    value: task_metrics?.completed || 0,
                                                    icon: <CheckCircle size={18} />,
                                                    bg: "bg-success-50",
                                                    text: "text-success-600"
                                                },
                                                {
                                                    label: "Overdue",
                                                    value: task_metrics?.overdue || 0,
                                                    icon: <AlertCircle size={18} />,
                                                    bg: "bg-danger-50",
                                                    text: "text-danger-600"
                                                }
                                            ].map((stat, idx) => (
                                                <div key={idx} className={`flex flex-col p-3 rounded-xl border border-transparent hover:border-default-200 transition-colors ${stat.bg} bg-opacity-50`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className={`p-1.5 rounded-lg bg-white shadow-sm ${stat.text}`}>
                                                            {stat.icon}
                                                        </div>
                                                        <span className={`text-xl font-black ${stat.text}`}>{stat.value}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-default-500 uppercase tracking-wider">{stat.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Detailed Information Tabs */}
                            <Card className="border-none shadow-sm overflow-hidden">
                                <CardBody className="p-0">
                                    <Tabs
                                        aria-label="Employee Details"
                                        color="primary"
                                        variant="solid"
                                        radius="lg"
                                        size="sm"
                                        fullWidth
                                        classNames={{
                                            base: "w-full p-4 pb-0",
                                            tabList: "w-full bg-default-100/80 backdrop-blur-md p-1 border border-default-200/50 gap-1",
                                            cursor: "bg-white shadow-sm border border-default-100",
                                            tab: "h-8",
                                            tabContent: "group-data-[selected=true]:text-primary text-default-500 font-bold transition-all px-4"
                                        }}
                                    >
                                        <Tab
                                            key="personal"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <UserCircle size={18} />
                                                    <span>Personal Details</span>
                                                </div>
                                            }
                                        >
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                <InfoItem label="Full Name" value={employee?.name} />
                                                <InfoItem label="Personal Email" value={employee?.personal_email} />
                                                <InfoItem label="Date of Birth" value={employee?.date_of_birth} />
                                                <InfoItem label="Gender" value={employee?.gender} />
                                                <InfoItem label="Marital Status" value={employee?.marital_status} />
                                                <InfoItem label="Parent Name" value={employee?.parent_name} />
                                                <InfoItem label="Emergency Contact" value={employee?.emergency_contact_name} />
                                                <InfoItem label="Emergency Phone" value={employee?.emergency_contact_number} />
                                                <div className="md:col-span-2">
                                                    <InfoItem label="Address" value={employee?.address} />
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab
                                            key="employment"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <Briefcase size={18} />
                                                    <span>Employment</span>
                                                </div>
                                            }
                                        >
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                <InfoItem label="Employee ID" value={employee?.employee_no_id} />
                                                <InfoItem label="Biometric ID" value={employee?.biometric_id} />
                                                <InfoItem label="Employee Type" value={employee?.employee_type} />
                                                <InfoItem label="Work Mode" value={employee?.work_mode} />
                                                <InfoItem label="Joining Date" value={employee?.date_of_joining} />
                                                <InfoItem label="Confirmation Date" value={employee?.confirmation_date} />
                                                <InfoItem label="Notice Period" value={employee?.notice_period ? `${employee.notice_period} Days` : "N/A"} />
                                                <InfoItem label="Current Status" value={employee?.status} />
                                                <InfoItem label="Role" value={employee?.role} />
                                                <InfoItem label="Designation" value={employee?.designation} />
                                            </div>
                                        </Tab>
                                        <Tab
                                            key="financial"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <X size={18} className="rotate-45" /> {/* Using X as a placeholder for a financial icon */}
                                                    <span>Financial & IDs</span>
                                                </div>
                                            }
                                        >
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                <InfoItem label="Bank Name" value={employee?.bank_name} />
                                                <InfoItem label="Account Name" value={employee?.account_name} />
                                                <InfoItem label="Account Number" value={employee?.account_number} />
                                                <InfoItem label="IFSC Code" value={employee?.ifsc_code} />
                                                <InfoItem label="PAN Number" value={employee?.pan_number} />
                                                <InfoItem label="PF Account Number" value={employee?.pf_account_number} />
                                                <InfoItem label="ESIC Number" value={employee?.esic_number} />
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
                                                {employee?.documents?.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {employee.documents.map((doc: any, idx: number) => (
                                                            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border-2 border-default-100 bg-white">
                                                                <div className="flex items-center gap-4 min-w-0">
                                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-default-50 text-primary border border-default-200 shadow-sm">
                                                                        <FileText size={24} strokeWidth={1.5} />
                                                                    </div>
                                                                    <div className="flex flex-col min-w-0">
                                                                        <span className="text-sm font-bold text-default-900 truncate tracking-tight">{doc.document_name}</span>
                                                                        <div className="flex items-center gap-2 mt-0.5 overflow-hidden">
                                                                            <span className="text-[10px] text-primary font-black uppercase tracking-widest truncate max-w-[80px]">{doc.file_type?.split('/')?.[1] || 'DOC'}</span>
                                                                            <span className="w-1 h-1 shrink-0 rounded-full bg-default-300" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="flat"
                                                                    color="primary"
                                                                    radius="lg"
                                                                    onPress={() => handlePreview(doc)}
                                                                    startContent={<Eye size={16} />}
                                                                    className="font-bold h-9 bg-primary/5 text-primary border-none"
                                                                >
                                                                    View
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-12 text-default-400">
                                                        <FileText size={48} className="mb-4 opacity-20" />
                                                        <p className="text-sm font-bold">No documents uploaded</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </CardBody>
                            </Card>

                        </div>
                    </div>
                </div>
            )}
            <FilePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                fileUrl={previewData.url}
                fileType={previewData.type}
                fileName={previewData.name}
            />
        </PermissionGuard>
    );
}

function InfoItem({ label, value }: { label: string, value: any }) {
    return (
        <div className="space-y-1.5 min-w-0">
            <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-semibold text-default-700 break-words">{value || "—"}</p>
        </div>
    );
}

