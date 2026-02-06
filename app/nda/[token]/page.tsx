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
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Upload, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import FileUpload from "@/components/common/FileUpload";
import { addToast } from "@heroui/toast";
import SignaturePad from "react-signature-canvas";

export default function NDATokenPage() {
    const params = useParams();
    const token = params.token as string;
    const dispatch = useDispatch();

    // We'll use local state for the fetched data to handle the HTML content directly
    const [ndaData, setNdaData] = useState<any>(null);
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [signature, setSignature] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("documents");

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
            if (currentNDA.html_content) {
                setHtmlContent(currentNDA.html_content);
                setNdaData(currentNDA.nda);
            } else {
                setNdaData(currentNDA);
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
        if (uploadedFiles.length === 0) {
            addToast({
                title: "Warning",
                description: "Please select files to upload",
                color: "warning",
            });
            return;
        }

        const formData = new FormData();
        uploadedFiles.forEach((fileItem) => {
            formData.append("files", fileItem.file);
        });

        dispatch(uploadNDADocumentsRequest(token, formData));
    };

    const handleClearSignature = () => {
        sigPad.current?.clear();
        setSignature(null);
    };

    const getDeviceDetails = () => {
        const ua = navigator.userAgent;
        let browser = "Unknown";
        let os = "Unknown";
        let deviceType = "Desktop";

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
            user_agent: ua
        };
    };

    const handleSaveSignature = () => {
        if (sigPad.current?.isEmpty()) {
            addToast({
                title: "Warning",
                description: "Please sign before submitting",
                color: "warning",
            });
            return;
        }
        const sigData = sigPad.current?.getTrimmedCanvas().toDataURL("image/png");
        const deviceDetails = getDeviceDetails();

        setSignature(sigData);
        dispatch(signNDARequest(token, sigData, deviceDetails));
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">

                <Card className="min-h-[600px]">
                    <CardBody className="p-0">
                        <Tabs
                            aria-label="NDA Steps"
                            color="primary"
                            variant="underlined"
                            classNames={{
                                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                                cursor: "w-full bg-primary",
                                tab: "max-w-fit px-4 h-12",
                                tabContent: "group-data-[selected=true]:text-primary font-medium"
                            }}
                            selectedKey={activeTab}
                            onSelectionChange={(key) => setActiveTab(key as string)}
                        >
                            <Tab
                                key="documents"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <Upload size={18} />
                                        <span>Upload Documents</span>
                                    </div>
                                }
                            >
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-2">Upload KYC Documents</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Please upload copies of your ID proof, address proof, or any other requested documents.
                                        </p>

                                        <div className="max-w-xl mx-auto border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 dark:bg-gray-800/50">
                                            <FileUpload
                                                files={uploadedFiles}
                                                setFiles={setUploadedFiles}
                                                name="nda_documents"
                                                labelIdle="Drag & Drop your files or <span class='filepond--label-action'>Browse</span>"
                                                acceptedFileTypes={['application/pdf', 'image/jpeg', 'image/png']}
                                                allowMultiple={true}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-8">
                                        <Button
                                            color="primary"
                                            onPress={() => {
                                                handleUpload();
                                            }}
                                            isLoading={loading}
                                        >
                                            Upload
                                        </Button>
                                    </div>
                                </div>
                            </Tab>

                            <Tab
                                key="review"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <FileText size={18} />
                                        <span>Review & Sign</span>
                                    </div>
                                }
                            >
                                <div className="p-6">
                                    {ndaData?.status === "Signed" ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                                <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">NDA Signed Successfully</h2>
                                            <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                                Thank you for signing the Non-Disclosure Agreement. A copy has been sent to the administration.
                                            </p>
                                            <Button
                                                className="mt-6"
                                                variant="bordered"
                                                onClick={() => window.location.reload()}
                                            >
                                                Refresh Status
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-6 border rounded-lg overflow-hidden shadow-inner bg-gray-100">
                                                <div className="bg-white p-3 border-b text-sm font-medium text-gray-600 flex justify-between items-center">
                                                    <span className="flex items-center gap-2"><FileText size={16} /> Document Preview</span>
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{ndaData?.employee_name}</span>
                                                </div>
                                                <div className="w-full h-[600px] bg-white overflow-hidden relative">
                                                    <iframe
                                                        srcDoc={htmlContent}
                                                        className="w-full h-full border-0"
                                                        title="NDA Document"
                                                        style={{ display: 'block' }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-t pt-6">
                                                <h3 className="text-lg font-semibold mb-4">Sign Document</h3>
                                                <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                                                    <p className="text-sm text-gray-500 mb-2">Please sign in the box below:</p>
                                                    <div className="border border-gray-300 rounded bg-white touch-none">
                                                        <SignaturePad
                                                            ref={sigPad}
                                                            canvasProps={{
                                                                className: "w-full h-40",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between mt-2">
                                                        <Button size="sm" variant="light" color="danger" onPress={handleClearSignature}>
                                                            Clear Signature
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end mt-6 gap-4">
                                                    <Button
                                                        variant="flat"
                                                        onPress={() => setActiveTab("documents")}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        onPress={handleSaveSignature}
                                                        isLoading={loading}
                                                    >
                                                        Submit Signature
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
