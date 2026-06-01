"use client";

import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserRequest, clearAuth } from "@/store/auth/action";
import { getSettingsRequest } from "@/store/settings/action";
import clsx from "clsx";
import { AppState } from "@/store/rootReducer";
import Lottie from "lottie-react";
import HRMLoading from "./assets/HRMLoading.json";
import AIAssistantSidebar from "@/components/ai-assistant/AIAssistantSidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isLoginPage = pathname === "/";
    const isNDATokenPage = (pathname?.startsWith("/nda/") && pathname !== "/nda") || pathname?.startsWith("/employee/nda/");
    const [isExpanded, setIsExpanded] = useState(true);
    const dispatch = useDispatch();

    const { user, getUserLoading, logoutSuccess, getUserError } = useSelector((state: AppState) => state.Auth);

    useEffect(() => { 
        if (!isNDATokenPage) {
            dispatch(getUserRequest());
            dispatch(getSettingsRequest());
        }
    }, [dispatch, isNDATokenPage]);

    useEffect(() => {
        if (!isLoginPage && (logoutSuccess)) {
            router.push("/");
            dispatch(clearAuth());
        }
    }, [logoutSuccess, getUserError, user, isLoginPage, router, dispatch]);
 
    if (!isLoginPage && !isNDATokenPage && !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <Lottie
                        animationData={HRMLoading}
                        loop={true}
                        className="w-52 h-52"
                    /> 
                </div>
            </div>
        );
    }
 
    if (isLoginPage || isNDATokenPage) {
        return (
            <div className="relative flex flex-col min-h-screen">
                <main className="flex-grow">
                    {children}
                </main>
            </div>
        );
    }
 
    return (
        <div className="relative flex flex-col h-[100dvh] overflow-hidden">
            <Navbar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
            <main className={clsx(
                "flex-grow relative flex flex-col overflow-y-auto mb-16 lg:mb-0 transition-all duration-300 ease-in-out",
                isExpanded ? "lg:ml-64" : "lg:ml-16"
            )}>
                <div className="flex-grow">
                    {children}
                </div>
            </main>
             {/* {pathname !== "/ai-chat" && <div className="hidden lg:block"><AIAssistantSidebar /></div>} */}
        </div>
    );
}

