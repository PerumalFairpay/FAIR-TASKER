"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import SignatureCanvas from 'react-signature-canvas';
import { useDispatch, useSelector } from "react-redux";
import { getNdaRequest, signNdaRequest, clearNda } from "@/store/nda/action";
import { AppState } from "@/store/rootReducer";

export default function SignNDAPage() {
    const params = useParams();
    const token = params.token as string;
    const dispatch = useDispatch();

    const { getNdaLoading, getNdaError, ndaData, signNdaLoading, signNdaSuccess, signNdaError } = useSelector((state: AppState) => state.Nda);

    const [error, setError] = useState<string | null>(null);
    const [isSigned, setIsSigned] = useState(false);

    const sigCanvas = useRef<SignatureCanvas>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (token) {
            dispatch(getNdaRequest({ token }));
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (ndaData) {
            if (ndaData.status === 'Signed') {
                setIsSigned(true);
            } else if (ndaData.status === 'Expired') {
                setError("This NDA link has expired.");
            }
        }
    }, [ndaData]);

    useEffect(() => {
        if (getNdaError) {
            if (getNdaError.includes("404") || getNdaError.includes("not found")) {
                setError("NDA document not found.");
            } else {
                setError(getNdaError);
            }
        }
    }, [getNdaError]);

    useEffect(() => {
        if (signNdaSuccess) {
            setIsSigned(true);
            addToast({
                title: "Success",
                description: signNdaSuccess,
                color: "success"
            });
            dispatch(clearNda());
        }
    }, [signNdaSuccess, dispatch]);

    useEffect(() => {
        if (signNdaError) {
            addToast({
                title: "Error",
                description: signNdaError,
                color: "danger"
            });
            dispatch(clearNda());
        }
    }, [signNdaError, dispatch]);

    const clearSignature = () => {
        sigCanvas.current?.clear();
    };

    const handleSign = async () => {
        if (sigCanvas.current?.isEmpty()) {
            addToast({
                title: "Warning",
                description: "Please sign the document before submitting.",
                color: "warning"
            });
            return;
        }

        const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

        if (!signatureData) return;

        dispatch(signNdaRequest({ token, signature_data: signatureData }));
    };

    if (getNdaLoading) {
        return <div className="flex h-screen items-center justify-center">Loading NDA...</div>;
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto">
                <div ref={contentRef}>
                    {/* Render Backend HTML */}
                    <div dangerouslySetInnerHTML={{ __html: ndaData?.html_content || '' }} />

                    {/* Signature Section */}
                    <div className="mt-8 border-t pt-8 signature-section-container">
                        <div className="flex justify-between items-end">
                            <div className="w-full max-w-sm">
                                <p className="font-bold mb-4">Signed by Employee:</p>

                                {isSigned ? (
                                    <div className="p-4 border-2 border-green-500 border-dashed rounded bg-green-50 text-center text-green-700">
                                        <p className="font-semibold">Document Signed</p>
                                        <p className="text-sm mt-1">{new Date().toLocaleDateString()}</p>
                                    </div>
                                ) : (
                                    <div className="border-2 border-gray-300 rounded bg-gray-50">
                                        <SignatureCanvas
                                            ref={sigCanvas}
                                            penColor="black"
                                            canvasProps={{
                                                className: 'w-full h-40 cursor-crosshair'
                                            }}
                                        />
                                    </div>
                                )}

                                {!isSigned && (
                                    <div className="mt-2 flex justify-end gap-2">
                                        <Button size="sm" variant="flat" onClick={clearSignature}>
                                            Clear
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-4 sticky bottom-4 bg-white p-4 border-t shadow-md md:static md:bg-transparent md:border-t-0 md:shadow-none md:p-0">
                    {!isSigned && (
                        <Button
                            color="primary"
                            size="lg"
                            onClick={handleSign}
                            isLoading={signNdaLoading}
                        >
                            Sign & Submit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
