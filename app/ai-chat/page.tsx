"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    SendHorizontal,
    Loader2,
    Trash2,
    Bot,
    Webhook,
    User
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

    if (!user) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen w-full bg-white dark:bg-[#09090b] transition-colors duration-500">
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
                                        Hi {user?.first_name || 'there'}
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
                                    placeholder="Ask anything"
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
                                                    "px-5 py-3 rounded-2xl text-[15px] leading-relaxed transition-all",
                                                    msg.role === "user"
                                                        ? "bg-default-100 text-default-900 shadow-sm"
                                                        : "bg-transparent text-default-800 dark:text-default-200"
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
                                            {msg.role === "user" && (
                                                <div className="w-8 h-8 rounded-full bg-default-100 flex items-center justify-center shrink-0 mt-1 uppercase text-xs font-bold text-default-600">
                                                    {user?.first_name?.charAt(0) || 'U'}
                                                </div>
                                            )}
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
                                        placeholder="Ask anything"
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
    return (
        <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 w-full group"
        >
            <div
                className={clsx(
                    "relative flex-1 flex items-center transition-all duration-400 ease-in-out",
                    "bg-white/80 dark:bg-default-50/50 backdrop-blur-xl",
                    "border border-default-200 dark:border-white/10",
                    "focus-within:border-primary-500/50 focus-within:ring-2 focus-within:ring-primary-500/5",
                    "rounded-[2.5rem]",
                    compact ? "py-0.5 px-3" : "py-1 px-5"
                )}
            >
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    minRows={1}
                    maxRows={6}
                    variant="bordered"
                    color="primary"
                    className="flex-1"
                    classNames={{
                        base: "border-none shadow-none",
                        inputWrapper: [
                            "bg-transparent",
                            "border-none",
                            "shadow-none",
                            "group-data-[focus=true]:bg-transparent",
                            "hover:bg-transparent",
                            "data-[hover=true]:bg-transparent",
                            "p-0",
                            "min-h-[40px]",
                        ].join(" "),
                        input: clsx(
                            "text-[15px] py-2 lg:py-2.5 resize-none bg-transparent leading-relaxed font-medium",
                            compact ? "lg:py-1.5" : ""
                        ),
                    }}
                />
            </div>

            <Button
                isIconOnly
                type="submit"
                isDisabled={!value.trim() || isLoading}
                className={clsx(
                    "rounded-full transition-all duration-300 active:scale-95 shrink-0",
                    value.trim()
                        ? "bg-primary-500 text-white"
                        : "bg-default-200 text-default-400 dark:bg-default-100 dark:text-default-500",
                    compact ? "h-11 w-11" : "h-12 w-12"
                )}
                size="md"
            >
                {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <SendHorizontal size={20} className={value.trim() ? "translate-x-0.5" : ""} />
                )}
            </Button>
        </form>
    );
}
