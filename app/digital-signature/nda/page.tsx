"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useSelector } from "react-redux";
import api from "@/store/api";
import { Loader2 } from "lucide-react";

export default function NDAPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const { toast } = useToast(); // Removed, using addToast directly
    const { user, isAuthenticated } = useSelector((state: any) => state.Auth);

    const [loading, setLoading] = useState(false);
    const [signed, setSigned] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && !user) {
            // Redirect if not logged in
            router.push("/auth/login");
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        // Check for success callback from DocuSign
        const event = searchParams.get("event");
        if (event === "signing_complete") {
            setSigned(true);
            addToast({
                title: "Success",
                description: "NDA Signed Successfully!",
                color: "success",
            });
            // Clean up URL
            router.replace("/digital-signature/nda");
        }
    }, [searchParams, router]);

    const handleSign = async () => {
        setLoading(true);
        try {
            // Initiate signing process
            const response = await api.post("/digital-signature/send-nda");

            if (response.data && response.data.signing_url) {
                // Redirect to DocuSign
                window.location.href = response.data.signing_url;
            } else {
                throw new Error("No signing URL returned");
            }
        } catch (error: any) {
            console.error("Signing Error:", error);
            addToast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to initiate signing. Please try again.",
                color: "danger",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    // Visual layout helpers
    const dateStr = new Date(user.join_date || Date.now()).toLocaleDateString();
    const empName = user.name || "________________";
    const empFather = user.father_name || "________________";
    const empAddress = user.address || "________________, ________________";

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">

                {/* Header Actions */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Digital Signature</h1>
                    {signed ? (
                        <Button variant="flat" className="bg-green-500 hover:bg-green-600 text-white" disabled>
                            Signed & Verified (Simulated)
                        </Button>
                    ) : (
                        <Button onPress={handleSign} isDisabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Sign with DocuSign"}
                        </Button>
                    )}
                </div>

                {/* NDA Content Preview - Must match HTML template for consistency */}
                <div className="p-8 text-sm text-gray-800 leading-relaxed font-serif" style={{ lineHeight: '1.6' }}>

                    {/* Header / Logo */}
                    <div className="border-b-2 border-gray-400 pb-4 mb-6">
                        <div className="text-2xl font-bold text-gray-600">
                            Fair<span className="text-blue-500">PAY</span> <br />
                            <span className="text-sm tracking-widest text-gray-500">TECHWORKS</span>
                        </div>
                    </div>

                    <div className="text-center font-bold text-lg my-6 uppercase">NON-DISCLOSURE AGREEMENT (NDA)</div>

                    <div className="mb-4 text-justify">
                        This Non-Disclosure Agreement (hereinafter "Agreement") is made {dateStr}, as indicated below, and by and between:
                    </div>

                    <div className="mb-6 space-y-4">
                        <div className="text-justify">
                            <strong>FAIRPAY TECH WORKS</strong>, a registered company in India, Tamil Nadu, Chennai – 600 113, (hereinafter referred to as "<strong>FIRST PARTY</strong>").
                        </div>
                        <div className="text-justify">
                            <strong>FAIRPY INC</strong>, a registered company in USA, 880 SW 15th St #3, Forest Lake MN 55025, USA, (hereinafter referred to as "<strong>FIRST PARTY</strong>").
                        </div>

                        <div className="text-center my-2">And</div>

                        <div className="text-justify bg-yellow-50 p-2 border border-yellow-100 rounded">
                            <strong>{empName}</strong>, S/O <strong>{empFather}</strong>, at {empAddress}, is a full-time employee of company <strong>FAIRPAY TECH WORKS</strong> in Chennai – 600 113, India. (Hereinafter referred to as "<strong>SECOND PARTY</strong>")
                        </div>
                    </div>

                    <div className="mb-4 text-justify">
                        WHEREAS, in consideration of the premises and of the covenants and obligations hereinafter set forth, First Party (FairPay Tech Works, Fairpy Inc, FairReturns & Fairental) and Second party (<strong>{empName}</strong>) hereto, intending to be legally bound, agree as follows:
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex gap-2">
                            <span className="font-bold w-6">1.</span>
                            <div>For the purpose of this Agreement, <strong>Information</strong> shall mean any and all sorts of information (whether financial, marketing, business, economical, technical, design, commercial or of any nature) relating to <strong>{empName}</strong>.</div>
                        </div>

                        <div className="flex gap-2">
                            <span className="font-bold w-6">2.</span>
                            <div><strong>{empName}</strong> means: all <strong>Information</strong> in a written, oral, visual or tangible form disclosed to by either party from time to time after the Effective Date of this agreement and the delivery of any proposals to the other party concerning (FairPAY Tech Works, Fairpy Inc, FairReturns & Fairental) whether identified at time of disclosure and marked confidential or not.</div>
                        </div>

                        <div className="flex gap-2">
                            <span className="font-bold w-6">3.</span>
                            <div>
                                <strong>{empName} agrees</strong> that he/she shall:
                                <ul className="list-none mt-2 space-y-2 pl-2">
                                    <li>(i) keep Confidential Information and not to share it with any other third party whether orally or in writing without the written consent and prior approval of the other party.</li>
                                    <li>(ii) not to use the Confidential Information for any commercial purpose including directly or indirectly.</li>
                                    <li>(iii) not to use any of FairPAY Tech Works, Fairpy Inc, FairReturns & Fairental 's name or reference in any of current or future marketing tools or website.</li>
                                    <li>(iv) to safeguard and not misuse any devices, equipment, or office property provided by the disclosing party, and to return the same in good working condition upon request or upon termination of engagement;</li>
                                    <li>(v) to be solely responsible and liable for the care, use, and protection of such devices, equipment, and office property until their proper handover to the disclosing party.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Signature Area */}
                    <div className="mt-12 flex justify-between items-end pt-8">
                        <div className="w-5/12">
                            <div className="mb-8">Signed for and in behalf of <br /> <strong>FAIRPAY TECH WORKS</strong></div>
                            <div className="border-t border-black pt-2 font-bold">Authorized Signatory</div>
                        </div>

                        <div className="w-5/12 relative">
                            <div className="mb-8">Signed by <br /> <strong>{empName}</strong></div>

                            {/* Visual Indicator for where signature will go */}
                            <div className="absolute bottom-8 left-0 right-0 h-12 bg-yellow-100 border border-yellow-300 border-dashed flex items-center justify-center text-xs text-yellow-700 opacity-50">
                                (DocuSign Signature will appear here)
                            </div>

                            <div className="border-t border-black pt-2 font-bold relative z-10">Signature</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
