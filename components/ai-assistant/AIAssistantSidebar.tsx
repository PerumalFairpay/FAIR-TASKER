"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Webhook, User, MessageSquare, SendHorizontal } from "lucide-react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Badge } from "@heroui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { sendChatQuery } from "@/store/aiAssistant/action";

import clsx from "clsx";

export default function AIAssistantSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const dispatch = useDispatch();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector((state: AppState) => state.Auth);
    const { messages, loading: isLoading } = useSelector((state: AppState) => state.AIAssistant);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isLoading]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue("");

        // Pass the current messages as history, excluding any temporary or loading messages
        const historyData = messages.map(msg => ({ role: msg.role, content: msg.content }));
        dispatch(sendChatQuery(userMessage, historyData));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Minimalist Transparent Trigger */}
            <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
                <div className="pointer-events-auto relative group">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative flex items-center justify-center h-12 w-12 bg-default-900 dark:bg-zinc-100 text-white dark:text-black rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] border border-default-800 dark:border-white/20 transition-all hover:scale-110 active:scale-95 hover:bg-default-800 dark:hover:bg-white group"
                    >
                        <Webhook size={22} className="transition-transform group-hover:rotate-12" />
                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity" />
                    </button>
                </div>
            </div>

            {/* Sidebar Drawer */}
            <Drawer
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement="right"
                size="lg"
                backdrop="transparent"
                classNames={{
                    base: "max-w-[500px] border-l border-default-200 dark:border-white/5 shadow-[-20px_0_80px_rgba(0,0,0,0.15)]",
                }}
            >
                <DrawerContent className="bg-white/95 dark:bg-[#050505] backdrop-blur-3xl">
                    <div className="flex flex-col h-full">
                        <DrawerHeader className="flex flex-col gap-1 border-b border-default-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md px-5 py-3">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-default-100 dark:bg-white/5 rounded-lg shrink-0">
                                        <Webhook size={18} className="text-default-600 dark:text-default-400" />
                                    </div>
                                    <h3 className="font-semibold text-sm tracking-tight text-default-900 dark:text-zinc-100">Astro</h3>
                                </div>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onClick={() => setIsOpen(false)}
                                    className="text-default-500 hover:bg-default-200 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </Button>
                            </div>
                        </DrawerHeader>

                        <DrawerBody className="flex-1 p-0 overflow-hidden bg-default-50/30">
                            <ScrollShadow className="h-full w-full p-5 overflow-y-auto" hideScrollBar>
                                <div className="flex flex-col gap-5 pb-5">
                                    <AnimatePresence initial={false}>
                                        {messages.map((msg, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                            >
                                                {msg.role === "assistant" && (
                                                    <Avatar
                                                        icon={<Webhook size={18} />}
                                                        className="shrink-0 shadow-sm bg-default-100 dark:bg-default-50 text-default-700 dark:text-default-200 border border-default-200 dark:border-white/10"
                                                        size="sm"
                                                    />
                                                )}
                                                <div
                                                    className={`max-w-[92%] text-[15px] transition-all ${msg.role === "user"
                                                        ? "px-4 py-2.5 bg-default-900 dark:bg-gradient-to-br dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-black rounded-2xl rounded-br-none shadow-md"
                                                        : "py-1 px-1 text-default-800 dark:text-zinc-300 w-full"
                                                        }`}
                                                >
                                                    {msg.role === "user" ? (
                                                        <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                                                    ) : (
                                                        <div className="prose prose-sm dark:prose-invert max-w-none 
                                                            prose-p:leading-relaxed dark:prose-p:text-zinc-300
                                                            prose-headings:dark:text-zinc-100
                                                            prose-strong:dark:text-zinc-50
                                                            prose-pre:bg-default-100 dark:prose-pre:bg-zinc-900/50 dark:prose-pre:border dark:prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-4 
                                                            prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-code:bg-primary-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none 
                                                            prose-table:border-separate prose-table:border-spacing-0 prose-table:w-full prose-table:border prose-table:border-default-200 dark:prose-table:border-white/5 prose-table:rounded-xl prose-table:overflow-hidden
                                                            prose-th:bg-default-100/50 dark:prose-th:bg-white/[0.02] prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:border-r prose-th:border-default-200 dark:prose-th:border-white/5 prose-th:last:border-r-0 prose-th:first:pl-4
                                                            prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-r prose-td:border-default-200 dark:prose-td:border-white/5 last:prose-td:border-b-0 prose-td:last:border-r-0 prose-td:first:pl-4">
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                rehypePlugins={[rehypeRaw as any]}
                                                            >
                                                                {msg.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-3 flex-row"
                                        >
                                            <Avatar
                                                icon={<Webhook size={18} className="animate-spin" />}
                                                className="bg-default-100 dark:bg-default-50 text-default-700 dark:text-default-200 border border-default-200 dark:border-white/10 shrink-0"
                                                size="sm"
                                            />
                                            <div className="flex items-center justify-center gap-2 py-3 px-1">
                                                {[0, 0.2, 0.4].map((delay, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay }}
                                                        className="w-1.5 h-1.5 rounded-full bg-secondary-400"
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollShadow>
                        </DrawerBody>

                        <DrawerFooter className="p-4 bg-white/70 dark:bg-white/[0.02] border-t border-default-200/50 dark:border-white/5 backdrop-blur-md">
                            <SearchBar
                                value={inputValue}
                                onChange={setInputValue}
                                onKeyDown={handleKeyDown}
                                onSubmit={handleSubmit}
                                isLoading={isLoading}
                                placeholder="How can I help you today?"
                                user={user}
                            />
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onSubmit: (e?: React.FormEvent) => void;
    isLoading: boolean;
    placeholder: string;
    user: any;
}

function SearchBar({ value, onChange, onKeyDown, onSubmit, isLoading, placeholder, user }: SearchBarProps) {
    return (
        <form
            onSubmit={(e) => onSubmit(e)}
            className="flex flex-col w-full group relative"
        >
            <div
                className={clsx(
                    "relative flex flex-col transition-all duration-500 ease-in-out",
                    "bg-white dark:bg-[#0c0c0e]",
                    "border border-default-200 dark:border-white/5",
                    "focus-within:border-default-400 dark:focus-within:border-white/10 dark:focus-within:bg-[#111113]",
                    "rounded-2xl shadow-sm overflow-hidden p-3 min-h-[100px]"
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
                            input: "text-[15px] py-1 resize-none bg-transparent leading-relaxed text-default-900 dark:text-zinc-100 placeholder:text-zinc-500 font-normal",
                        }}
                    />
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 pb-0.5">
                        {(user?.role?.toLowerCase() === "admin"
                            ? [
                                "Pending leave",
                                "Attendance",
                                "Reports",
                                "Onboarding"
                            ]
                            : [
                                "My tasks",
                                "Draft email",
                                "Policies",
                                "Help"
                            ]
                        ).map((rec) => (
                            <button
                                key={rec}
                                type="button"
                                onClick={() => onChange(rec)}
                                className="px-3 py-1 rounded-full bg-default-100/40 dark:bg-white/5 hover:bg-default-200/60 dark:hover:bg-white/10 text-default-500 hover:text-default-900 dark:text-zinc-400 dark:hover:text-zinc-100 text-[11px] font-medium transition-all whitespace-nowrap border border-transparent hover:border-default-200 dark:hover:border-white/10 active:scale-95"
                            >
                                {rec}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 min-h-[32px]">
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
        </form>
    );
}
