"use client";

import React, { useState } from "react";
import { 
    Plus, 
    MessageSquare, 
    MoreHorizontal, 
    Trash2, 
    Edit2, 
    Search,
    History,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { 
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu, 
    DropdownItem 
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { 
    fetchSessionMessages, 
    setCurrentSessionId, 
    deleteChatSession, 
    renameChatSession 
} from "@/store/aiAssistant/action";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface ChatSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const { sessions, currentSessionId, sessionsLoading } = useSelector((state: AppState) => state.AIAssistant);

    const handleSessionClick = (sessionId: string) => {
        dispatch(setCurrentSessionId(sessionId));
        dispatch(fetchSessionMessages(sessionId));
        if (window.innerWidth < 1024) onToggle(); // Auto-close on mobile
    };

    const handleNewChat = () => {
        dispatch(setCurrentSessionId(null));
        if (window.innerWidth < 1024) onToggle();
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this chat?")) {
            dispatch(deleteChatSession(id));
        }
    };

    const handleRename = (id: string, currentTitle: string) => {
        const newTitle = prompt("Enter new title:", currentTitle);
        if (newTitle && newTitle !== currentTitle) {
            dispatch(renameChatSession(id, newTitle));
        }
    };

    const filteredSessions = sessions.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Grouping logic (simplified)
    const today = new Date().toISOString().split('T')[0];
    const groupedSessions = {
        Today: filteredSessions.filter(s => s.updated_at.startsWith(today)),
        Previous: filteredSessions.filter(s => !s.updated_at.startsWith(today))
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onToggle}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{ 
                    width: isOpen ? 280 : 0,
                    x: isOpen ? 0 : -280
                }}
                className={clsx(
                    "fixed lg:relative inset-y-0 left-0 z-50 bg-[#f9f9fb] dark:bg-[#0d0d0e] border-r border-default-200 dark:border-white/[0.05] flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
                )}
            >
                {/* Sidebar Content */}
                <div className="w-[280px] flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 flex flex-col gap-4">
                        <Button
                            onClick={handleNewChat}
                            variant="flat"
                            className="w-full justify-start gap-2 h-12 bg-white dark:bg-white/[0.03] border border-default-200 dark:border-white/[0.08] hover:bg-default-100 dark:hover:bg-white/[0.08] font-medium text-sm rounded-xl transition-all"
                            startContent={<Plus size={18} className="text-default-600 dark:text-zinc-400" />}
                        >
                            New Chat
                        </Button>

                        <Input
                            placeholder="Search chats..."
                            size="sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            startContent={<Search size={14} className="text-default-400" />}
                            classNames={{
                                inputWrapper: "bg-white dark:bg-white/[0.02] border border-default-100 dark:border-white/[0.05] h-9 rounded-lg px-3 shadow-none",
                                input: "text-xs"
                            }}
                        />
                    </div>

                    {/* Sessions List */}
                    <ScrollShadow className="flex-1 px-3 pb-4" hideScrollBar>
                        {sessionsLoading && sessions.length === 0 ? (
                            <div className="flex flex-col gap-2 p-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-10 w-full bg-default-100 dark:bg-white/[0.02] rounded-lg animate-pulse" />
                                ))}
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center opacity-40">
                                <History size={32} className="mb-2" />
                                <p className="text-xs">No chat history yet</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 mt-2">
                                {Object.entries(groupedSessions).map(([group, items]) => (
                                    items.length > 0 && (
                                        <div key={group} className="flex flex-col gap-1">
                                            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-default-400 mb-1">{group}</h4>
                                            {items.map((session) => (
                                                <div 
                                                    key={session.id}
                                                    onClick={() => handleSessionClick(session.id)}
                                                    className={clsx(
                                                        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                                                        currentSessionId === session.id
                                                            ? "bg-white dark:bg-white/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-none border border-default-200 dark:border-white/[0.08]"
                                                            : "hover:bg-default-100/50 dark:hover:bg-white/[0.02] border border-transparent"
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        "p-1.5 rounded-lg shrink-0",
                                                        currentSessionId === session.id 
                                                            ? "bg-default-900 text-white" 
                                                            : "bg-default-100 dark:bg-white/[0.05] text-default-500"
                                                    )}>
                                                        <MessageSquare size={14} />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className={clsx(
                                                            "text-[13px] font-medium truncate",
                                                            currentSessionId === session.id ? "text-default-900 dark:text-zinc-100" : "text-default-600 dark:text-zinc-400"
                                                        )}>
                                                            {session.title}
                                                        </p>
                                                    </div>

                                                    {/* Actions Dropdown */}
                                                    <div className={clsx(
                                                        "shrink-0 transition-opacity",
                                                        currentSessionId === session.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                    )}>
                                                        <Dropdown>
                                                            <DropdownTrigger>
                                                                <Button 
                                                                    isIconOnly 
                                                                    variant="light" 
                                                                    size="sm" 
                                                                    className="h-7 w-7 min-w-0"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <MoreHorizontal size={14} className="text-default-400" />
                                                                </Button>
                                                            </DropdownTrigger>
                                                            <DropdownMenu aria-label="Session actions">
                                                                <DropdownItem 
                                                                    key="rename"
                                                                    startContent={<Edit2 size={14} />}
                                                                    onClick={(e) => { e.stopPropagation(); handleRename(session.id, session.title); }}
                                                                >
                                                                    Rename
                                                                </DropdownItem>
                                                                <DropdownItem 
                                                                    key="delete"
                                                                    className="text-danger"
                                                                    color="danger"
                                                                    startContent={<Trash2 size={14} />}
                                                                    onClick={(e) => { e.stopPropagation(); handleDelete(session.id); }}
                                                                >
                                                                    Delete
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </ScrollShadow>
                </div>
            </motion.aside>

            {/* Collapse Toggle Button (Floating) */}
            <Button
                isIconOnly
                variant="flat"
                size="sm"
                onClick={onToggle}
                className={clsx(
                    "fixed lg:absolute top-1/2 -translate-y-1/2 z-[60] h-10 w-6 min-w-0 bg-white dark:bg-zinc-900 border border-default-200 dark:border-white/[0.08] rounded-r-lg rounded-l-none shadow-sm transition-all hidden lg:flex",
                    isOpen ? "left-[280px]" : "left-0"
                )}
            >
                {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </Button>
        </>
    );
}
