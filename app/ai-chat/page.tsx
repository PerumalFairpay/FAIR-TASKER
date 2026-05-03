"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    SendHorizontal,
    Loader2,
    Trash2,
    Bot,
    Webhook,
    User,
    ChevronDown
} from "lucide-react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Tooltip } from "@heroui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { sendChatQuery, clearChatHistory } from "@/store/aiAssistant/action";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ClearChatModal from "./ClearChatModal";
import { useDisclosure } from "@heroui/modal";

export default function AIChatPage() {
    const [inputValue, setInputValue] = useState("");
    const dispatch = useDispatch();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { isOpen: isClearModalOpen, onOpen, onOpenChange } = useDisclosure();

    const { user } = useSelector((state: AppState) => state.Auth);
    const { messages, loading: isLoading } = useSelector((state: AppState) => state.AIAssistant);

    // Consider it "landing" if there are no messages
    const isLanding = messages.length === 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue("");

        const historyData = messages.map(msg => ({ role: msg.role, content: msg.content }));
        dispatch(sendChatQuery(userMessage, historyData));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    const handleClearChat = () => {
        dispatch(clearChatHistory());
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        containerRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        containerRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    if (!user) return null;

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="flex flex-col h-[calc(100vh-64px)] lg:h-screen w-full bg-white dark:bg-[#09090b] bg-dot-grid-interactive transition-colors duration-500 overflow-hidden"
        >
            {/* Header - Transparent and simple */}
            <header className="flex items-center justify-between px-6 py-3 z-30">
                <div className="flex items-center gap-2">
                    {!isLanding && (
                        <>
                            <motion.div
                                layoutId="astro-logo"
                                className="p-1.5 bg-default-100 rounded-lg shrink-0"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            >
                                <Webhook size={18} className="text-default-600" />
                            </motion.div>
                            <motion.span
                                layoutId="astro-name"
                                className="font-semibold text-sm tracking-tight"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            >
                                Astro
                            </motion.span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {!isLanding && (
                        <Tooltip content="Clear History">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onClick={onOpen}
                                className="text-default-400 hover:text-danger rounded-full"
                            >
                                <Trash2 size={18} />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
                <AnimatePresence initial={false}>
                    {isLanding ? (
                        /* Landing View */
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, position: "absolute" }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-start justify-center w-full max-w-3xl px-6 text-left z-20"
                        >
                            <div className="flex flex-col items-start mb-10 w-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <motion.div
                                        layoutId="astro-logo"
                                        className="relative group shrink-0"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 10, -10, 0],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 4,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute -inset-1 bg-gradient-to-r from-default-300 to-default-900 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 dark:from-default-400 dark:to-white"
                                        ></motion.div>
                                        <Webhook size={28} className="relative text-default-900 dark:text-default-100" />
                                    </motion.div>
                                    <motion.h3
                                        layoutId="astro-name"
                                        className="text-2xl font-semibold tracking-tight text-default-900 dark:text-default-100"
                                    >
                                        Hi {user?.name || 'there'}
                                    </motion.h3>
                                </div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                    className="text-4xl lg:text-5xl font-medium tracking-tight bg-gradient-to-br from-default-800 to-default-500 dark:from-default-100 dark:to-default-400 bg-clip-text text-transparent pb-2 leading-tight"
                                >
                                    Where should we start?
                                </motion.h2>
                            </div>
                            <motion.div
                                layoutId="search-bar"
                                className="w-full"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            >
                                <SearchBar
                                    value={inputValue}
                                    onChange={setInputValue}
                                    onKeyDown={handleKeyDown}
                                    onSubmit={handleSubmit}
                                    isLoading={isLoading}
                                    placeholder="How can I help you today?"
                                />
                            </motion.div>
                        </motion.div>
                    ) : (
                        /* Chat History View */
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col w-full h-full relative"
                        >
                            <ScrollShadow className="flex-1 px-4 lg:px-0 py-8" hideScrollBar>
                                <div className="max-w-3xl mx-auto flex flex-col gap-10 pb-40">
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={clsx(
                                                "flex gap-4 w-full",
                                                msg.role === "user" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            {msg.role === "assistant" && (
                                                <div className="w-8 h-8 rounded-full bg-default-100 dark:bg-default-50 flex items-center justify-center shrink-0 mt-1 border border-default-200 dark:border-white/10">
                                                    <Webhook size={16} className="text-default-700 dark:text-default-200" />
                                                </div>
                                            )}
                                            <div className={clsx(
                                                "max-w-[92%] flex flex-col gap-1",
                                                msg.role === "user" ? "items-end" : "items-start"
                                            )}>
                                                <div className={clsx(
                                                    "text-[15px] leading-relaxed transition-all",
                                                    msg.role === "user"
                                                        ? "px-5 py-3 bg-default-900 dark:bg-white text-white dark:text-black rounded-2xl rounded-br-none shadow-sm"
                                                        : "text-default-800 dark:text-default-200 py-1"
                                                )}>
                                                    {msg.role === "user" ? (
                                                        <span className="whitespace-pre-wrap">{msg.content}</span>
                                                    ) : (
                                                        <div className="prose prose-sm dark:prose-invert max-w-none 
                                                            prose-p:leading-relaxed 
                                                            prose-pre:bg-default-100 dark:prose-pre:bg-default-50/50 prose-pre:rounded-xl prose-pre:p-4 
                                                            prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-code:bg-primary-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none 
                                                            prose-table:border-separate prose-table:border-spacing-0 prose-table:w-full prose-table:border prose-table:border-default-200 prose-table:rounded-xl prose-table:overflow-hidden
                                                            prose-th:bg-default-100/50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:border-r prose-th:border-default-200 prose-th:last:border-r-0 prose-th:first:pl-4
                                                            prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-r prose-td:border-default-200 last:prose-td:border-b-0 prose-td:last:border-r-0 prose-td:first:pl-4">
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                rehypePlugins={[rehypeRaw as any]}
                                                            >
                                                                {msg.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-4 items-center">
                                            <div className="w-8 h-8 rounded-full bg-default-100 dark:bg-default-50 flex items-center justify-center border border-default-200 dark:border-white/10">
                                                <Webhook size={16} className="text-default-700 dark:text-default-200 animate-spin" />
                                            </div>
                                            <div className="flex gap-1.5 py-4">
                                                {[0, 0.2, 0.4].map((d) => (
                                                    <motion.div
                                                        key={d}
                                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                                        transition={{ repeat: Infinity, duration: 1.2, delay: d }}
                                                        className="w-1.5 h-1.5 rounded-full bg-secondary-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollShadow>

                            {/* Sticky Search Bar for Chat View */}
                            <motion.div
                                layoutId="search-bar"
                                className="absolute bottom-0 inset-x-0 p-6 lg:p-10 pointer-events-none bg-gradient-to-t from-white dark:from-[#09090b] via-white/80 dark:via-[#09090b]/80 to-transparent z-10"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            >
                                <div className="max-w-3xl mx-auto pointer-events-auto">
                                    <SearchBar
                                        value={inputValue}
                                        onChange={setInputValue}
                                        onKeyDown={handleKeyDown}
                                        onSubmit={handleSubmit}
                                        isLoading={isLoading}
                                        placeholder="How can I help you today?"
                                        compact
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <ClearChatModal
                isOpen={isClearModalOpen}
                onOpenChange={onOpenChange}
                onConfirm={handleClearChat}
            />
        </div>
    );
}

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    placeholder: string;
    compact?: boolean;
}

function SearchBar({ value, onChange, onKeyDown, onSubmit, isLoading, placeholder, compact }: SearchBarProps) {
    const { user } = useSelector((state: AppState) => state.Auth);
    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col w-full group relative"
        >
            <div
                className={clsx(
                    "relative flex flex-col transition-all duration-500 ease-in-out",
                    "bg-white dark:bg-[#18181b]/50 backdrop-blur-2xl",
                    "border border-default-200 dark:border-white/5",
                    "focus-within:border-default-400 dark:focus-within:border-white/10",
                    "rounded-[1.25rem] shadow-sm overflow-hidden",
                    compact ? "p-3 min-h-[100px]" : "p-5 min-h-[140px]"
                )}
            >
                <div className="flex-1 w-full">
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        minRows={1}
                        maxRows={8}
                        variant="flat"
                        className="w-full"
                        classNames={{
                            base: "bg-transparent",
                            inputWrapper: [
                                "bg-transparent",
                                "border-none",
                                "shadow-none",
                                "group-data-[focus=true]:bg-transparent",
                                "hover:bg-transparent",
                                "data-[hover=true]:bg-transparent",
                                "p-0",
                                "min-h-0"
                            ].join(" "),
                            input: clsx(
                                "text-[16px] py-1 resize-none bg-transparent leading-relaxed text-default-900 dark:text-default-100 placeholder:text-default-400 font-normal",
                                compact ? "text-[15px]" : ""
                            ),
                        }}
                    />
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 pb-0.5">
                        {(user?.role?.toLowerCase() === "admin" 
                            ? [
                                "Pending leave requests",
                                "Attendance summary",
                                "Generate reports",
                                "Manage onboarding"
                            ] 
                            : [
                                "Summarize my tasks",
                                "Draft an email",
                                "Explain policies",
                                "Onboarding help"
                            ]
                        ).map((rec) => (
                            <button
                                key={rec}
                                type="button"
                                onClick={() => onChange(rec)}
                                className="px-3.5 py-1.5 rounded-full bg-default-100/40 dark:bg-white/5 hover:bg-default-200/60 dark:hover:bg-white/10 text-default-500 hover:text-default-900 dark:text-default-400 dark:hover:text-white text-[12px] font-medium transition-all whitespace-nowrap border border-transparent hover:border-default-200 dark:hover:border-white/10 active:scale-95"
                            >
                                {rec}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 min-h-[32px]">
                        <div className="flex items-center gap-1">
                            <Button
                                isIconOnly
                                type="submit"
                                isDisabled={!value.trim() || isLoading}
                                className={clsx(
                                    "h-8 w-8 rounded-full transition-all shrink-0",
                                    value.trim()
                                        ? "bg-default-900 dark:bg-white text-white dark:text-black hover:opacity-90"
                                        : "bg-default-100 dark:bg-white/5 text-default-400"
                                )}
                                size="sm"
                            >
                                {isLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <SendHorizontal size={16} />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
