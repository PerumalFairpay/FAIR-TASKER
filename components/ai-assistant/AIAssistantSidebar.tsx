"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, BrainCircuit, User, Sparkles, MessageSquare, SendHorizontal, Webhook } from "lucide-react";
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            handleSubmit(e as any);
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
                        className="relative flex items-center justify-center h-14 w-14 bg-default-900 dark:bg-white text-white dark:text-default-900 rounded-full shadow-2xl border border-default-800 dark:border-default-200 transition-all hover:scale-110 active:scale-95 hover:bg-default-800 dark:hover:bg-default-100"
                    >
                        <Webhook size={28} />
                    </button>
                </div>
            </div>

            {/* Sidebar Drawer */}
            <Drawer
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement="right"
                size="md"
                backdrop="transparent"
                classNames={{
                    base: "max-w-[400px] border-l border-default-200 dark:border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]",
                }}
            >
                <DrawerContent className="bg-white/90 dark:bg-[#09090b]/95 backdrop-blur-xl">
                    <div className="flex flex-col h-full">
                        <DrawerHeader className="flex flex-col gap-1 border-b border-default-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md p-5">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    {/* <Badge content="" color="success" shape="circle" placement="bottom-right" className="border-2 border-white dark:border-default-100"> */}
                                    <Avatar
                                        icon={<BrainCircuit size={22} />}
                                        className="bg-secondary-100 text-secondary-600 border-2 border-secondary-500"
                                        size="md"
                                    />
                                    {/* </Badge> */}
                                    <div>
                                        <h3 className="font-bold text-lg tracking-tight text-default-900 dark:text-default-100">FAIRPAY AI</h3>
                                        <p className="text-default-500 text-xs flex items-center gap-1">
                                            <Sparkles size={10} className="text-secondary-500" /> Ai Assistant
                                        </p>
                                    </div>
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
                                                        icon={<BrainCircuit size={18} />}
                                                        className="shrink-0 shadow-sm bg-secondary-100 text-secondary-600"
                                                        size="sm"
                                                    />
                                                )}
                                                <div
                                                    className={`max-w-[92%] text-sm transition-all ${msg.role === "user"
                                                        ? "p-4 bg-default-100 dark:bg-default-200 text-default-900 rounded-2xl rounded-tr-none shadow-sm"
                                                        : "py-2 px-1 text-default-800 dark:text-default-900 w-full"
                                                        }`}
                                                >
                                                    {msg.role === "user" ? (
                                                        <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
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
                                                icon={<BrainCircuit size={18} />}
                                                className="bg-secondary-100 text-secondary-600 shrink-0"
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
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                                <div className="flex gap-2 items-center w-full">
                                    <div className="relative flex-grow group">
                                        <Textarea
                                            placeholder="Ask something..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            minRows={1}
                                            maxRows={5}
                                            fullWidth
                                            variant="bordered"
                                            color="primary"
                                            className="transition-all"
                                            classNames={{
                                                inputWrapper: "bg-default-100/50 hover:bg-default-200/50 focus-within:bg-default-100/80 border-default-200 dark:border-default-100 rounded-xl pl-4 py-2 min-h-unit-12 items-center",
                                                input: "text-small py-0",
                                            }}
                                        // startContent={<MessageSquare size={18} className="text-default-400 shrink-0" />}
                                        />
                                    </div>
                                    <Button
                                        isIconOnly
                                        type="submit"
                                        color="primary"
                                        size="sm"
                                        isDisabled={!inputValue.trim() || isLoading}
                                        className="shrink-0 rounded-xl h-10 w-10 shadow-md active:scale-95 transition-all"
                                    >
                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <SendHorizontal size={18} />}
                                    </Button>
                                </div>
                            </form>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
