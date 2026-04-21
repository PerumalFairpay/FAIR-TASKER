"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    getNDAByTokenRequest,
    uploadNDADocumentsRequest,
    signNDARequest,
    updateNDADetailsRequest,
} from "@/store/nda/action";
import { RootState } from "@/store/store";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Upload, CheckCircle2, AlertTriangle, FileText, Lock, ShieldCheck, Eye, MapPin, Home, ArrowRight, ChevronsRight, Save, PenTool, RefreshCw } from "lucide-react";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import FileUpload from "@/components/common/FileUpload";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import { motion, AnimatePresence } from "framer-motion";

import { addToast } from "@heroui/toast";
import SignaturePad from "react-signature-canvas";
import Image from "next/image";
import logo from "@/app/assets/FairPay.png";

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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col items-center gap-8 py-4"
                >
                    <div className="space-y-1">
                        <p className="text-15px] text-gray-400">Authenticated Recipient</p>
                        <p className="text-4xl text-gray-900 dark:text-white tracking-tight">{employeeName}</p>
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
    const [activeTab, setActiveTab] = useState("details");
    const initialAddress = {
        door_no: "",
        care_of_type: "S/o",
        care_of_name: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
    };

    const [permaAddr, setPermaAddr] = useState({ ...initialAddress });
    const [resAddr, setResAddr] = useState({ ...initialAddress });
    const [mobile, setMobile] = useState("");
    const [sameAsAddress, setSameAsAddress] = useState(false);

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");
    const [showIntroAnimation, setShowIntroAnimation] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string, type: string, name: string } | null>(null);

    const handleAddressChange = (type: 'permanent' | 'residential', field: string, value: string) => {
        if (type === 'permanent') {
            setPermaAddr(prev => {
                const next = { ...prev, [field]: value };
                if (sameAsAddress) setResAddr(next);
                return next;
            });
        } else {
            setResAddr(prev => ({ ...prev, [field]: value }));
        }
    };

    const formatAddress = (addr: any) => {
        const parts = [];
        if (addr.door_no) parts.push(addr.door_no);
        const careOf = addr.care_of_name ? `${addr.care_of_type} ${addr.care_of_name}` : "";
        if (careOf) parts.push(careOf);
        if (addr.street) parts.push(addr.street);
        if (addr.city) parts.push(addr.city);
        if (addr.state) {
            if (addr.pincode) parts.push(`${addr.state} - ${addr.pincode}`);
            else parts.push(addr.state);
        } else if (addr.pincode) {
            parts.push(addr.pincode);
        }
        return parts.join(", ");
    };

    // Using Redux for loading/error states and actions
    const {
        getByTokenLoading, getByTokenError,
        uploadLoading, uploadSuccess, uploadError,
        signLoading, signSuccess, signError,
        updateDetailsLoading, updateDetailsSuccess, updateDetailsError
    } = useSelector((state: RootState) => state.NDA);
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
            // Identify target data - it might be nested in 'nda' key or direct
            const nda = currentNDA.nda || currentNDA;
            const html = currentNDA.html_content;

            if (html) {
                setHtmlContent(html);
                setIsAuthenticated(true);
            }
            else if (nda.requires_auth) {
                setIsAuthenticated(false);
            }

            setNdaData(nda);

            if (nda?.required_documents) {
                setRequiredDocuments(nda.required_documents);
                setUploadedFiles(nda.required_documents.map((name: string) => ({ name, file: null })));
            }

            if (nda?.address) {
                // If the address contains commas, it might be the formatted string.
                // We'll just put the whole string in the 'street' field as a fallback
                // if we can't reliably parse it into granular fields.
                setPermaAddr(prev => ({ ...prev, street: nda.address }));
            }
            if (nda?.residential_address) {
                setResAddr(prev => ({ ...prev, street: nda.residential_address }));
            }
            if (nda?.mobile) setMobile(nda.mobile);
        }
    }, [currentNDA]);

    useEffect(() => {
        const successMessage = uploadSuccess || signSuccess || updateDetailsSuccess;
        const errorMessage = getByTokenError || uploadError || signError || updateDetailsError;
 
        if (successMessage) {
            addToast({
                title: "Success",
                description: successMessage,
                color: "success",
            });
            // Navigation is handled by manual button clicks now
        }
        if (errorMessage) {
            addToast({
                title: "Error",
                description: typeof errorMessage === "string" ? errorMessage : "An error occurred",
                color: "danger",
            });
        }
    }, [uploadSuccess, signSuccess, getByTokenError, uploadError, signError]);

    const handleUpdateDetails = () => {
        const isAddressEmpty = (addr: any) => {
            return !addr.door_no.trim() && !addr.street.trim() && !addr.city.trim();
        };

        if (isAddressEmpty(permaAddr)) {
            addToast({ title: "Validation Error", description: "Permanent Address is required", color: "danger" });
            return;
        }
        if (!sameAsAddress && isAddressEmpty(resAddr)) {
            addToast({ title: "Validation Error", description: "Residential Address is required", color: "danger" });
            return;
        }
        if (!mobile.trim()) {
            addToast({ title: "Validation Error", description: "Mobile Number is required", color: "danger" });
            return;
        }

        dispatch(updateNDADetailsRequest(token, {
            address: formatAddress(permaAddr),
            residential_address: formatAddress(resAddr),
            mobile
        }));
    };

    const handleUpload = () => {
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

                if (data.data.nda?.address) setPermaAddr(prev => ({ ...prev, street: data.data.nda.address }));
                if (data.data.nda?.residential_address) setResAddr(prev => ({ ...prev, street: data.data.nda.residential_address }));
                if (data.data.nda?.mobile) setMobile(data.data.nda.mobile);
 
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

    if (getByTokenError && getByTokenError.includes("expired")) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <AlertTriangle size={48} className="text-danger mb-4" />
                <h1 className="text-2xl font-bold text-danger">Link Expired</h1>
                <p className="text-gray-600 mt-2">This NDA link has expired. Please request a new one.</p>
            </div>
        );
    }

    if (!ndaData && getByTokenLoading) {
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
                    className="p-2 md:p-12"
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
                            {isVertical && (
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
                            )}
                            <Tab
                                key="details"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={20} />
                                        <span>Personal Details</span>
                                    </div>
                                }
                            >
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                                    <Card className="shadow-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                        <CardHeader className="flex gap-3 px-6 pt-6 pb-0">
                                            <div className="flex flex-col">
                                                <p className="text-lg md:text-xl font-bold">Contact Information</p>
                                                <p className="text-xs md:text-sm text-gray-500">Provide your address details to be included in the legal agreement</p>
                                            </div>
                                        </CardHeader>
                                        <CardBody className="gap-6 p-6">
                                            <div className="space-y-6">
                                                    <Input
                                                        label="Mobile Number"
                                                        placeholder="Enter your mobile number"
                                                        labelPlacement="outside"
                                                        variant="bordered"
                                                        value={mobile}
                                                        onValueChange={setMobile}
                                                        isRequired
                                                    />

                                                {/* Granular Permanent Address */}
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold mb-1">
                                                        <MapPin size={18} />
                                                        <span className="text-sm">Permanent Address</span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Input
                                                            label="Building / Door No"
                                                            placeholder="e.g. 42B, Tower 1"
                                                            labelPlacement="outside"
                                                            variant="bordered"
                                                            value={permaAddr.door_no}
                                                            onChange={(e) => handleAddressChange("permanent", "door_no", e.target.value)}
                                                        />

                                                        <div className="flex flex-col">
                                                            <div className="flex items-end">
                                                                <Select
                                                                    label="S/o, D/o, W/o Name"
                                                                    labelPlacement="outside"
                                                                    placeholder="S/o"
                                                                    variant="bordered"
                                                                    className="w-24"
                                                                    classNames={{
                                                                        trigger: "rounded-r-none border-r-0 h-[40px] shadow-none",
                                                                        label: "text-small font-medium text-foreground whitespace-nowrap",
                                                                    }}
                                                                    selectedKeys={[permaAddr.care_of_type]}
                                                                    onChange={(e) => handleAddressChange("permanent", "care_of_type", e.target.value)}
                                                                >
                                                                    <SelectItem key="S/o" textValue="S/o">S/o</SelectItem>
                                                                    <SelectItem key="D/o" textValue="D/o">D/o</SelectItem>
                                                                    <SelectItem key="W/o" textValue="W/o">W/o</SelectItem>
                                                                    <SelectItem key="C/o" textValue="C/o">C/o</SelectItem>
                                                                </Select>
                                                                <Input
                                                                    placeholder="Father/Guardian Name"
                                                                    variant="bordered"
                                                                    className="flex-1"
                                                                    classNames={{
                                                                        inputWrapper: "rounded-l-none h-[40px] shadow-none",
                                                                    }}
                                                                    value={permaAddr.care_of_name}
                                                                    onChange={(e) => handleAddressChange("permanent", "care_of_name", e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Input
                                                        label="Street / Area / Colony"
                                                        placeholder="Enter street and locality"
                                                        labelPlacement="outside"
                                                        variant="bordered"
                                                        value={permaAddr.street}
                                                        onChange={(e) => handleAddressChange("permanent", "street", e.target.value)}
                                                    />

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <Input
                                                            label="City"
                                                            placeholder="City"
                                                            labelPlacement="outside"
                                                            variant="bordered"
                                                            value={permaAddr.city}
                                                            onChange={(e) => handleAddressChange("permanent", "city", e.target.value)}
                                                        />

                                                        <Input
                                                            label="State"
                                                            placeholder="State"
                                                            labelPlacement="outside"
                                                            variant="bordered"
                                                            value={permaAddr.state}
                                                            onChange={(e) => handleAddressChange("permanent", "state", e.target.value)}
                                                        />

                                                        <Input
                                                            label="Pincode"
                                                            placeholder="Pincode"
                                                            labelPlacement="outside"
                                                            variant="bordered"
                                                            value={permaAddr.pincode}
                                                            onChange={(e) => handleAddressChange("permanent", "pincode", e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Granular Residential Address */}
                                                <div className="flex flex-col gap-4 mt-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
                                                            <Home size={18} />
                                                            <span className="text-sm">Residential Address</span>
                                                        </div>
                                                        <Checkbox
                                                            isSelected={sameAsAddress}
                                                            onValueChange={(selected) => {
                                                                setSameAsAddress(selected);
                                                                if (selected) setResAddr(permaAddr);
                                                            }}
                                                            size="sm"
                                                            color="primary"
                                                            classNames={{
                                                                label: "text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400"
                                                            }}
                                                        >
                                                            Same as permanent address
                                                        </Checkbox>
                                                    </div>

                                                    <div className={`flex flex-col gap-4 transition-opacity ${sameAsAddress ? "opacity-50 pointer-events-none" : ""}`}>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <Input
                                                                label="Building / Door No"
                                                                placeholder="e.g. 42B, Tower 1"
                                                                labelPlacement="outside"
                                                                variant="bordered"
                                                                value={resAddr.door_no}
                                                                onChange={(e) => handleAddressChange("residential", "door_no", e.target.value)}
                                                                isDisabled={sameAsAddress}
                                                            />

                                                            <div className="flex flex-col">
                                                                <div className="flex items-end">
                                                                    <Select
                                                                        label="S/o, D/o, W/o Name"
                                                                        labelPlacement="outside"
                                                                        placeholder="S/o"
                                                                        variant="bordered"
                                                                        className="w-24"
                                                                        classNames={{
                                                                            trigger: "rounded-r-none border-r-0 h-[40px] shadow-none",
                                                                            label: "text-small font-medium text-foreground whitespace-nowrap",
                                                                        }}
                                                                        selectedKeys={[resAddr.care_of_type]}
                                                                        onChange={(e) => handleAddressChange("residential", "care_of_type", e.target.value)}
                                                                        isDisabled={sameAsAddress}
                                                                    >
                                                                        <SelectItem key="S/o" textValue="S/o">S/o</SelectItem>
                                                                        <SelectItem key="D/o" textValue="D/o">D/o</SelectItem>
                                                                        <SelectItem key="W/o" textValue="W/o">W/o</SelectItem>
                                                                        <SelectItem key="C/o" textValue="C/o">C/o</SelectItem>
                                                                    </Select>
                                                                    <Input
                                                                        placeholder="Father/Guardian Name"
                                                                        variant="bordered"
                                                                        className="flex-1"
                                                                        classNames={{
                                                                            inputWrapper: "rounded-l-none h-[40px] shadow-none",
                                                                        }}
                                                                        value={resAddr.care_of_name}
                                                                        onChange={(e) => handleAddressChange("residential", "care_of_name", e.target.value)}
                                                                        isDisabled={sameAsAddress}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Input
                                                            label="Street / Area / Colony"
                                                            placeholder="Enter street and locality"
                                                            labelPlacement="outside"
                                                            variant="bordered"
                                                            value={resAddr.street}
                                                            onChange={(e) => handleAddressChange("residential", "street", e.target.value)}
                                                            isDisabled={sameAsAddress}
                                                        />

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <Input
                                                                label="City"
                                                                placeholder="City"
                                                                labelPlacement="outside"
                                                                variant="bordered"
                                                                value={resAddr.city}
                                                                onChange={(e) => handleAddressChange("residential", "city", e.target.value)}
                                                                isDisabled={sameAsAddress}
                                                            />

                                                            <Input
                                                                label="State"
                                                                placeholder="State"
                                                                labelPlacement="outside"
                                                                variant="bordered"
                                                                value={resAddr.state}
                                                                onChange={(e) => handleAddressChange("residential", "state", e.target.value)}
                                                                isDisabled={sameAsAddress}
                                                            />

                                                            <Input
                                                                label="Pincode"
                                                                placeholder="Pincode"
                                                                labelPlacement="outside"
                                                                variant="bordered"
                                                                value={resAddr.pincode}
                                                                onChange={(e) => handleAddressChange("residential", "pincode", e.target.value)}
                                                                isDisabled={sameAsAddress}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                        <CardFooter className="px-6 pb-6 pt-2 flex justify-end gap-3">
                                            {ndaData?.address || ndaData?.residential_address ? (
                                                <>
                                                    <Button
                                                        color="primary"
                                                        size="md"
                                                        onPress={handleUpdateDetails}
                                                        isLoading={updateDetailsLoading}
                                                        className="font-semibold shadow-lg shadow-primary/20 px-4 md:px-8"
                                                        startContent={<Save size={18} />}
                                                    >
                                                        Update Details
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        variant="flat"
                                                        size="md"
                                                        onPress={() => setActiveTab("documents")}
                                                        className="font-semibold px-4 md:px-8"
                                                        endContent={<ChevronsRight size={18} />}
                                                    >
                                                        Next Step
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    color="primary"
                                                    size="md"
                                                    onPress={handleUpdateDetails}
                                                    isLoading={updateDetailsLoading}
                                                    className="font-semibold shadow-lg shadow-primary/20 px-4 md:px-8"
                                                    startContent={<Save size={18} />}
                                                >
                                                    Save & Proceed
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </div>
                            </Tab>

                            <Tab
                                key="documents"
                                isDisabled={!ndaData?.address || !ndaData?.residential_address}
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
                                                            {/* <p className="text-xs text-gray-400 mt-0.5 truncate">
                                                                {doc.file ? doc.file.name : "No file selected"}
                                                            </p> */}
                                                        </div>
                                                    </div>

                                                    <div className="w-full md:w-2/3 relative">
                                                        {ndaData?.documents?.find((d: any) => d.document_name === doc.name) ? (
                                                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-xl">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                                                        <CheckCircle2 size={16} />
                                                                    </div>
                                                                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Document Uploaded</span>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    variant="flat"
                                                                    className="font-semibold"
                                                                    startContent={<Eye size={14} />}
                                                                    onPress={() => {
                                                                        const uploadedDoc = ndaData.documents.find((d: any) => d.document_name === doc.name);
                                                                        if (uploadedDoc) {
                                                                            setPreviewFile({
                                                                                url: uploadedDoc.document_proof,
                                                                                type: uploadedDoc.file_type || "application/pdf",
                                                                                name: uploadedDoc.document_name
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    View Preview
                                                                </Button>
                                                            </div>
                                                        ) : (
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
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {ndaData?.status !== "Document Uploaded" && (
                                            <button
                                                className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-800 cursor-pointer w-full"
                                                onClick={() => setUploadedFiles([...uploadedFiles, { name: "", file: null }])}
                                            >
                                                <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                                                    <Upload size={18} className="text-gray-400" />
                                                </div>
                                                <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">Add Another Document</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex justify-end mt-10 gap-3">
                                        <Button
                                            color="primary"
                                            size="md"
                                            onPress={handleUpload}
                                            isLoading={uploadLoading}
                                            isDisabled={ndaData?.status === "Document Uploaded"}
                                            className="font-semibold px-4 md:px-8 shadow-lg shadow-primary/20"
                                            startContent={ndaData?.status === "Document Uploaded" ? <CheckCircle2 size={18} /> : <Upload size={18} />}
                                        >
                                            {ndaData?.status === "Document Uploaded" ? "Uploaded Successfully" : "Upload Documents"}
                                        </Button>
                                        {ndaData?.status === "Document Uploaded" && (
                                            <Button
                                                color="primary"
                                                variant="flat"
                                                size="md"
                                                onPress={() => setActiveTab("review")}
                                                className="font-semibold px-4 md:px-8"
                                                endContent={<ChevronsRight size={18} />}
                                            >
                                                Next Step
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Tab>

                            <Tab
                                key="review"
                                isDisabled={!ndaData?.address || !ndaData?.residential_address || ndaData?.status !== "Document Uploaded"}
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
                                                size="md"
                                                variant="flat"
                                                onClick={() => window.location.reload()}
                                                startContent={<RefreshCw size={18} />}
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
                                                    <div className="w-full h-[75vh] lg:h-[calc(100vh-200px)] min-h-[600px] bg-white relative">
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
                                                                size="md"
                                                                onPress={handleSaveSignature}
                                                                isLoading={signLoading}
                                                                isDisabled={ndaData?.status !== "Document Uploaded"}
                                                                className="w-full font-semibold shadow-lg shadow-primary/20"
                                                                startContent={<PenTool size={18} />}
                                                            >
                                                                {ndaData?.status !== "Document Uploaded" ? "Please Upload Document" : "Submit Signature"}
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
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Confidential Document Access</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Verify your identity to securely access the Non-Disclosure Agreement for
                                    <span className="font-semibold text-primary ms-1">{ndaData?.employee_name}</span>
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
                                                Please enter the registered email address where you received the access link.
                                            </p>
                                        </div>
                                    </CardBody>
                                    <CardFooter className="px-6 pb-6 pt-0">
                                        <Button
                                            type="submit"
                                            color="primary"
                                            fullWidth
                                            size="md"
                                            isLoading={authLoading}
                                            className="font-semibold"
                                            startContent={<ShieldCheck size={18} />}
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

            <FilePreviewModal
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
                fileUrl={previewFile?.url || null}
                fileType={previewFile?.type || null}
                fileName={previewFile?.name || ""}
            />
        </div>
    );
}
