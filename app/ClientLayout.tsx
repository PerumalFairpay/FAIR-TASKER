"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/";

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
            <Navbar />
            <main className="lg:ml-16 flex-grow relative flex flex-col overflow-y-auto mb-16 lg:mb-0">
                <div className="flex-grow">
                    {children}
                </div>
            </main>
        </div>
    );
}
