"use client";

import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserRequest, clearAuth } from "@/store/auth/action";
import clsx from "clsx";
import { AppState } from "@/store/rootReducer";
import Lottie from "lottie-react";
import HRMLoading from "./assets/HRMLoading.json";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isLoginPage = pathname === "/";
    const [isExpanded, setIsExpanded] = useState(true);
    const dispatch = useDispatch();

    const { user, getUserLoading, logoutSuccess, getUserError } = useSelector((state: AppState) => state.Auth);

    useEffect(() => {
        dispatch(getUserRequest());
    }, [dispatch]);

    useEffect(() => {
        if (!isLoginPage && (logoutSuccess)) {
            router.push("/");
            dispatch(clearAuth());
        }
    }, [logoutSuccess, getUserError, user, isLoginPage, router, dispatch]);
 
    if (!isLoginPage && !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <Lottie
                        animationData={HRMLoading}
                        loop={true}
                        className="w-52 h-52"
                    />
                    {/* <p className="text-gray-500 font-medium -mt-8">Loading ...</p> */}
                </div>
            </div>
        );
    }

    // If it's the login page, render full width without sidebar
    if (isLoginPage) {
        return (
            <div className="relative flex flex-col h-screen overflow-hidden">
                <main className="flex-grow">
                    {children}
                </main>
            </div>
        );
    }

    // Otherwise, render with sidebar (navbar)
    return (
        <div className="relative flex flex-col h-screen overflow-hidden">
            <Navbar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
            <main className={clsx(
                "flex-grow relative flex flex-col overflow-y-auto mb-16 lg:mb-0 transition-all duration-300 ease-in-out",
                isExpanded ? "lg:ml-64" : "lg:ml-16"
            )}>
                <div className="flex-grow">
                    {children}
                </div>
            </main>
        </div>
    );
}
