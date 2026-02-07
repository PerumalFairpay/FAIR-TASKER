"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    getNDAByTokenRequest,
    uploadNDADocumentsRequest,
    signNDARequest,
} from "@/store/nda/action";
import { RootState } from "@/store/store";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Upload, CheckCircle2, AlertTriangle, FileText, Lock, ShieldCheck } from "lucide-react";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import FileUpload from "@/components/common/FileUpload";
import { motion, AnimatePresence } from "framer-motion";

import { addToast } from "@heroui/toast";
import SignaturePad from "react-signature-canvas";
import Image from "next/image";
import logo from "../../../app/assets/FairPay.png";

const VerificationOverlay = ({ employeeName, onComplete }: { employeeName: string, onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        "Retrieving FairPay company profile...",
        "Preparing Non-Disclosure Agreement...",
        "Loading confidentiality guidelines...",
        "Finalizing NDA for Review & Sign...",
        "Ready for document access..."
    ];

    useEffect(() => {
        const duration = 4000;
        const interval = 800; // time per status

        const statusTimer = setInterval(() => {
            setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
        }, interval);

        const progressTimer = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 1 : 100));
        }, duration / 100);

        const completeTimer = setTimeout(() => {
            onComplete();
        }, duration);

        return () => {
            clearInterval(statusTimer);
            clearInterval(progressTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete, statuses.length]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4 text-center overflow-hidden"
        >
            {/* Background elements for rich aesthetics */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div
                layoutId="company-logo"
                className="mb-12 relative z-10"
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" />
                    <div className="absolute inset-[-10px] border border-primary/20 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                    <Image
                        src={logo}
                        alt="FairPay Logo"
                        width={120}
                        height={120}
                        className="relative z-10 object-contain drop-shadow-2xl"
                        priority
                    />
                </div>
            </motion.div>

            <div className="max-w-md w-full space-y-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        NDA Verification
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        Securing your digital signature session
                    </p>
                </motion.div>

                <div className="space-y-4">
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.p
                            key={statusIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm font-mono text-primary flex items-center justify-center gap-2"
                        >
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            {statuses[statusIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm"
                >
                    <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">Authenticated User</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{employeeName}</p>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Organization</p>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                                <FileText size={14} />
                                FairPay HRM
                            </div>
                        </div>
                        <div className="space-y-1 text-right md:text-left">
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Document Type</p>
                            <div className="flex items-center justify-end md:justify-start gap-1.5 text-xs font-semibold text-primary">
                                <ShieldCheck size={14} />
                                Legal NDA Form
                            </div>
                        </div>
                    </div>
                </motion.div>

                <p className="text-[10px] text-gray-400 max-w-[280px] mx-auto italic">
                    By accessing this document, you agree to maintain the confidentiality as per the company's integrity guidelines.
                </p>
            </div>
        </motion.div>
    );
};

export default function NDATokenPage() {
    const params = useParams();
    const token = params.token as string;
    const dispatch = useDispatch();

    // We'll use local state for the fetched data to handle the HTML content directly
    const [ndaData, setNdaData] = useState<any>(null);
    const [htmlContent, setHtmlContent] = useState<string>("");

    // Initialize with required documents
    const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string, file: File | null }[]>([]);


    const [signature, setSignature] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("documents");

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");
    const [showIntroAnimation, setShowIntroAnimation] = useState(false);

    // Using Redux for loading/error states and actions
    const { loading, error, success } = useSelector((state: RootState) => state.NDA);
    const sigPad = useRef<any>(null);

    // Fetch NDA data
    useEffect(() => {
        if (token) {
            dispatch(getNDAByTokenRequest(token));
        }
    }, [token, dispatch]);

    const { currentNDA } = useSelector((state: RootState) => state.NDA);

    useEffect(() => {
        if (currentNDA) {
            let data = currentNDA;
            if (currentNDA.html_content) {
                setHtmlContent(currentNDA.html_content);
                data = currentNDA.nda;
                setIsAuthenticated(true); // If HTML content is present, we are authenticated
            } else if (currentNDA.nda?.requires_auth) {
                setNdaData(currentNDA.nda);
                setIsAuthenticated(false);
                return; // Stop processing until authenticated
            } else {
                setHtmlContent(""); // Or handle no content
            }
            setNdaData(data);

            if (data?.required_documents) {
                setRequiredDocuments(data.required_documents);
                // Initialize uploaded files based on required documents
                setUploadedFiles(data.required_documents.map((name: string) => ({ name, file: null })));
            }
        }
    }, [currentNDA]);

    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
                color: "success",
            });
            if (success.includes("signed")) {
                setActiveTab("review");
            }
        }
        if (error) {
            addToast({
                title: "Error",
                description: typeof error === "string" ? error : "An error occurred",
                color: "danger",
            });
        }
    }, [success, error]);

    const handleUpload = () => {
        // Validate that all required documents are uploaded
        const missingDocs = uploadedFiles.filter(f => !f.file);

        if (missingDocs.length > 0) {
            addToast({
                title: "Missing Documents",
                description: `Please upload: ${missingDocs.map(d => d.name).join(", ")}`,
                color: "warning",
            });
            return;
        }

        const formData = new FormData();
        uploadedFiles.forEach((fileItem) => {
            if (fileItem.file && fileItem.name) {
                formData.append("files", fileItem.file);
                formData.append("names", fileItem.name);
            }
        });

        dispatch(uploadNDADocumentsRequest(token, formData));
    };

    const handleClearSignature = () => {
        sigPad.current?.clear();
        setSignature(null);
    };

    const getDeviceDetails = async () => {
        const ua = navigator.userAgent;
        let browser = "Unknown";
        let os = "Unknown";
        let deviceType = "Desktop";
        let ipAddress = "";

        // Fetch real IP address
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            ipAddress = data.ip;
        } catch (error) {
            console.error('Failed to fetch IP address:', error);
            ipAddress = "Unknown";
        }

        // Browser detection (check Edge before Chrome since Edge UA contains "Chrome")
        if (ua.indexOf("Firefox") > -1) browser = "Firefox";
        else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
        else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
        else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
        else if (ua.indexOf("Edg") > -1 || ua.indexOf("Edge") > -1) browser = "Edge";
        else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
        else if (ua.indexOf("Safari") > -1) browser = "Safari";

        // OS detection
        if (ua.indexOf("Win") > -1) os = "Windows";
        else if (ua.indexOf("Mac") > -1) os = "MacOS";
        else if (ua.indexOf("Linux") > -1) os = "Linux";
        else if (ua.indexOf("Android") > -1) os = "Android";
        else if (ua.indexOf("like Mac") > -1) os = "iOS";

        // Device Type detection (simple check)
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            deviceType = "Tablet";
        } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            deviceType = "Mobile";
        }

        return {
            browser,
            os,
            device_type: deviceType,
            user_agent: ua,
            ip_address: ipAddress
        };
    };

    const handleSaveSignature = async () => {
        if (sigPad.current?.isEmpty()) {
            addToast({
                title: "Warning",
                description: "Please sign before submitting",
                color: "warning",
            });
            return;
        }
        const sigData = sigPad.current?.getTrimmedCanvas().toDataURL("image/png");
        const deviceDetails = await getDeviceDetails();

        setSignature(sigData);
        dispatch(signNDARequest(token, sigData, deviceDetails));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError("");
        setAuthLoading(true);

        if (!loginEmail) {
            setAuthError("Email is required");
            setAuthLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nda/access/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: loginEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setHtmlContent(data.data.html_content);
                setNdaData(data.data.nda);

                if (data.data.nda?.required_documents) {
                    setRequiredDocuments(data.data.nda.required_documents);
                    setUploadedFiles(data.data.nda.required_documents.map((name: string) => ({ name, file: null })));
                }

                // Start verification animation instead of showing content immediately
                setShowIntroAnimation(true);
            } else {
                setAuthError(data.message || "Invalid Email");
                addToast({
                    title: "Access Denied",
                    description: data.message || "Invalid Email Address",
                    color: "danger",
                });
            }
        } catch (err) {
            console.error("Login Check Error:", err);
            setAuthError("An error occurred. Please try again.");
        } finally {
            setAuthLoading(false);
        }
    };

    const downloadNDA = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nda/download/${token}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `NDA_${token}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error("Failed to download PDF");
                addToast({
                    title: "Error",
                    description: "Failed to download PDF",
                    color: "danger",
                });
            }
        } catch (error) {
            console.error("Error downloading PDF:", error);
            addToast({
                title: "Error",
                description: "Error downloading PDF",
                color: "danger",
            });
        }
    };

    const [isVertical, setIsVertical] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsVertical(window.innerWidth >= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (error && error.includes("expired")) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <AlertTriangle size={48} className="text-danger mb-4" />
                <h1 className="text-2xl font-bold text-danger">Link Expired</h1>
                <p className="text-gray-600 mt-2">This NDA link has expired. Please request a new one.</p>
            </div>
        );
    }

    if (!ndaData && loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // New top-level success view
    if (ndaData?.status === "Signed") {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">NDA Signed Successfully</h2>
                <p className="text-gray-600 mb-6">
                    Thank you for signing the Non-Disclosure Agreement. The signed document has been securely stored.
                </p>
                <Button
                    variant="bordered"
                    onPress={() => window.close()}
                >
                    Close Window
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
            <AnimatePresence>
                {showIntroAnimation && (
                    <VerificationOverlay
                        employeeName={ndaData?.employee_name || "User"}
                        onComplete={() => {
                            setShowIntroAnimation(false);
                            setIsAuthenticated(true);
                            addToast({
                                title: "Access Granted",
                                description: "You can now view and sign the document.",
                                color: "success",
                            });
                        }}
                    />
                )}
            </AnimatePresence>

            {isAuthenticated && !showIntroAnimation ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-6 md:p-12"
                >
                    <div className="max-w-8xl mx-auto">
                        <Tabs
                            aria-label="NDA Steps"
                            color="primary"
                            variant="solid"
                            isVertical={isVertical}
                            classNames={{
                                base: "flex flex-col md:flex-row gap-8 md:gap-16",
                                tabList: "bg-gray-100/80 dark:bg-gray-800/60 p-2 rounded-2xl w-full md:w-56 flex-shrink-0 border border-gray-200/50 dark:border-gray-700/50 shadow-inner h-fit sticky top-4 md:top-12 z-40 backdrop-blur-md mb-6 md:mb-0",
                                cursor: "rounded-xl bg-white dark:bg-gray-700 shadow-md",
                                tab: "h-11 md:h-14 px-4 rounded-xl transition-all data-[selected=true]:shadow-sm justify-start",
                                tabContent: "font-semibold text-gray-500 dark:text-gray-400 group-data-[selected=true]:text-primary text-xs md:text-sm",
                                panel: "flex-1 p-0 w-full md:ml-4"
                            }}
                            selectedKey={activeTab}
                            onSelectionChange={(key) => setActiveTab(key as string)}
                        >
                            <Tab
                                key="logo"
                                title={
                                    <motion.div
                                        layoutId="company-logo"
                                        className="flex items-center justify-center w-full py-1"
                                    >
                                        <Image
                                            src={logo}
                                            alt="FairPay Logo"
                                            width={140}
                                            height={40}
                                            className="object-contain"
                                        />
                                    </motion.div>
                                }
                                isDisabled
                                className="opacity-100 cursor-default mb-4 pointer-events-none data-[disabled=true]:opacity-100"
                            />
                            <Tab
                                key="documents"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <Upload size={20} />
                                        <span>Upload Documents</span>
                                    </div>
                                }
                            >
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                                    <div className="flex flex-col gap-4">
                                        {uploadedFiles.map((doc, index) => {
                                            const isRequired = index < requiredDocuments.length;
                                            return (
                                                <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 relative group">

                                                    {!isRequired && (
                                                        <button
                                                            onClick={() => {
                                                                const newFiles = uploadedFiles.filter((_, i) => i !== index);
                                                                setUploadedFiles(newFiles);
                                                            }}
                                                            className="absolute -top-2 -right-2 md:top-1/2 md:-translate-y-1/2 md:-right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md z-20 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                                            title="Remove Document"
                                                        >
                                                            &times;
                                                        </button>
                                                    )}

                                                    <div className="w-full md:w-1/3 flex items-center gap-3">
                                                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-offset-2 dark:ring-offset-gray-900 ${doc.file
                                                            ? "bg-green-100 text-green-700 ring-green-100 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-900/30"
                                                            : "bg-primary/10 text-primary ring-primary/10"
                                                            }`}>
                                                            {doc.file ? <CheckCircle2 size={18} /> : index + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            {isRequired ? (
                                                                <span className="font-semibold text-gray-800 dark:text-gray-100 text-base block truncate" title={doc.name}>
                                                                    {doc.name} <span className="text-danger ml-0.5">*</span>
                                                                </span>
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    placeholder="Document Name"
                                                                    className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-primary focus:outline-none text-base font-semibold px-0 py-1 transition-colors"
                                                                    value={doc.name}
                                                                    onChange={(e) => {
                                                                        const newFiles = [...uploadedFiles];
                                                                        newFiles[index].name = e.target.value;
                                                                        setUploadedFiles(newFiles);
                                                                    }}
                                                                />
                                                            )}
                                                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                                                                {doc.file ? doc.file.name : "No file selected"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="w-full md:w-2/3 relative">
                                                        <FileUpload
                                                            files={doc.file ? [doc.file] : []}
                                                            setFiles={(fileItems) => {
                                                                const file = fileItems[0]?.file as File || null;
                                                                const newFiles = [...uploadedFiles];
                                                                newFiles[index].file = file;
                                                                setUploadedFiles(newFiles);
                                                            }}
                                                            name={`file-${index}`}
                                                            acceptedFileTypes={['image/png', 'image/jpeg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                                                            labelIdle='<span class="text-sm flex items-center gap-2 justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload-cloud"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg> Drag & Drop or <span class="text-primary hover:underline cursor-pointer">Browse</span></span>'
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Add Document Button */}
                                        <button
                                            className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-800 cursor-pointer w-full"
                                            onClick={() => setUploadedFiles([...uploadedFiles, { name: "", file: null }])}
                                        >
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                                                <Upload size={18} className="text-gray-400" />
                                            </div>
                                            <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">Add Another Document</span>
                                        </button>
                                    </div>

                                    <div className="flex justify-end mt-10">
                                        <Button
                                            color="primary"
                                            size="lg"
                                            onPress={handleUpload}
                                            isLoading={loading}
                                            className="font-semibold px-8 shadow-lg shadow-primary/20"
                                            endContent={<CheckCircle2 size={18} />}
                                        >
                                            Upload & Proceed
                                        </Button>
                                    </div>
                                </div>
                            </Tab>

                            <Tab
                                key="review"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <FileText size={20} />
                                        <span>Review & Sign</span>
                                    </div>
                                }
                            >
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {ndaData?.status === "Signed" ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                                                <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">NDA Signed Successfully</h2>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg mb-8">
                                                Thank you for signing the Non-Disclosure Agreement. A copy has been sent to the administration.
                                            </p>
                                            <Button
                                                size="lg"
                                                variant="flat"
                                                onClick={() => window.location.reload()}
                                            >
                                                Refresh Status
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-6">
                                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                                                    <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center backdrop-blur-sm">
                                                        <span className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                                                            <FileText size={18} className="text-primary" />
                                                            Document Preview
                                                        </span>
                                                        <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-mono border border-gray-100 dark:border-gray-700 shadow-sm">
                                                            {ndaData?.employee_name}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-[60vh] md:h-[700px] bg-white relative">
                                                        <iframe
                                                            srcDoc={htmlContent}
                                                            className="w-full h-full border-0"
                                                            title="NDA Document"
                                                            style={{ display: 'block' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:col-span-1">
                                                <div className="sticky top-8 space-y-6">
                                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                            <div className="w-1 h-6 bg-primary rounded-full"></div>
                                                            Sign Document
                                                        </h3>

                                                        <div className="space-y-4">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                By signing below, you acknowledge that you have read and understood the terms of this agreement.
                                                            </p>

                                                            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white overflow-hidden touch-none">
                                                                <SignaturePad
                                                                    ref={sigPad}
                                                                    canvasProps={{
                                                                        className: "w-full h-48",
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex justify-end">
                                                                <Button
                                                                    size="sm"
                                                                    variant="light"
                                                                    color="danger"
                                                                    onPress={handleClearSignature}
                                                                    className="text-xs"
                                                                    startContent={<span className="text-lg">&times;</span>}
                                                                >
                                                                    Clear Signature
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                                                            <Button
                                                                color="primary"
                                                                size="lg"
                                                                onPress={handleSaveSignature}
                                                                isLoading={loading}
                                                                className="w-full font-semibold shadow-lg shadow-primary/20"
                                                            >
                                                                Submit Signature
                                                            </Button>
                                                            <Button
                                                                variant="flat"
                                                                onPress={() => setActiveTab("documents")}
                                                                className="w-full"
                                                            >
                                                                Back to Documents
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </motion.div>
            ) : (
                !showIntroAnimation && (
                    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
                        <div className="w-full max-w-md">
                            <div className="text-center mb-8">
                                <div className="mb-6 flex justify-center">
                                    <Image
                                        src={logo}
                                        alt="FairPay Logo"
                                        width={180}
                                        height={56}
                                        className="object-contain drop-shadow-sm"
                                        priority
                                    />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Secure Document Access</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    Please verify your identity to access the Non-Disclosure Agreement for
                                    <span className="font-semibold text-primary block mt-1">{ndaData?.employee_name}</span>
                                </p>
                            </div>

                            <Card className="shadow-lg border border-gray-100 dark:border-gray-800">
                                <form onSubmit={handleLogin}>
                                    <CardBody className="gap-4 p-6">
                                        {authError && (
                                            <div className="bg-danger-50 text-danger-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                                <AlertTriangle size={16} />
                                                {authError}
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <Input
                                                label="Email Address"
                                                placeholder="Enter your email"
                                                type="email"
                                                variant="bordered"
                                                labelPlacement="outside"
                                                value={loginEmail}
                                                onValueChange={(val) => {
                                                    setLoginEmail(val);
                                                    setAuthError("");
                                                }}
                                                isRequired
                                                classNames={{
                                                    inputWrapper: "h-12"
                                                }}
                                                startContent={<span className="text-gray-400">@</span>}
                                            />
                                            <p className="text-xs text-gray-400 px-1">
                                                Enter the email address provided during the request generation.
                                            </p>
                                        </div>
                                    </CardBody>
                                    <CardFooter className="px-6 pb-6 pt-0">
                                        <Button
                                            type="submit"
                                            color="primary"
                                            fullWidth
                                            size="lg"
                                            isLoading={authLoading}
                                            className="font-semibold"
                                        >
                                            Verify & Access
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>

                            <p className="text-center text-xs text-gray-400 mt-8">
                                This document is secure and intended only for the specified recipient.
                            </p>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
