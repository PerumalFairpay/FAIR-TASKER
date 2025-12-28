"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

import { useState } from "react";
import clsx from "clsx";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/";
    const [isExpanded, setIsExpanded] = useState(true);

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
