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

    // Listen for Redux success actions to update local state
    // Note: Since we modified the backend to return { html_content, nda }, we need to handle that
    // The reducer updates 'currentNDA' with the payload.data. 
    // We might need to adjust how we access the data depending on how the saga/reducer handles the new response structure.

    // Let's assume the saga puts the response.data into the payload.
    // response.data from backend is { success: true, message: "...", data: { html_content: "...", nda: {...} } }

    // However, looking at the reducer, it expects 'currentNDA' to be action.payload.data.
    // So currentNDA will be { html_content: "...", nda: {...} }

    const { currentNDA } = useSelector((state: RootState) => state.NDA);

    useEffect(() => {
        if (currentNDA) {
            // Check if it's the new structure
            if (currentNDA.html_content) {
                setHtmlContent(currentNDA.html_content);
                setNdaData(currentNDA.nda);
            } else {
                // Fallback for old structure or if reducer mapping is different
                setNdaData(currentNDA);
            }
        }
    }, [currentNDA]);

    // Handle success messages for upload/sign
    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
                color: "success",
            });
            if (success.includes("signed")) {
                // Determine next steps if needed
                setActiveTab("review"); // Stay on review tab to show completion
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
        setSignature(sigData);
        dispatch(signNDARequest(token, sigData));
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Non-Disclosure Agreement</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please upload required documents and sign the NDA.
                    </p>
                </div>

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
                                                setActiveTab("review"); // Move to next tab
                                            }}
                                            isLoading={loading}
                                        >
                                            Upload & Continue
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
