"use client";

import React, { useState, useRef, useEffect } from "react";
import { Modal, ModalContent } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Tooltip } from "@heroui/tooltip";
import { Badge } from "@heroui/badge";
import { SendIcon, SparklesIcon, XIcon, MessageCircleIcon, BotIcon } from "@/components/icons";
import axios from "axios";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm Fair-Tasker AI. How can I help you today? I can check your leave balance, tasks, or attendance." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading) return;

        const userMessage = message;
        setMessage("");
        setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            // Create a placeholder for the assistant response
            setChatHistory(prev => [...prev, { role: "assistant", content: "" }]);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    message: userMessage,
                    history: chatHistory.slice(-10) // Send last 10 messages for context
                })
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantResponse = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                assistantResponse += chunk;

                // Update the last message in history with the accumulated response
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].content = assistantResponse;
                    return newHistory;
                });
            }
        } catch (error) {
            console.error("AI Error:", error);
            setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { label: "Can I take leave today?", icon: "📅" },
        { label: "What are my pending tasks?", icon: "✅" },
        { label: "My attendance last month", icon: "📊" }
    ];

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Badge content="AI" color="primary" shape="circle">
                    <Button
                        isIconOnly
                        color="primary"
                        variant="shadow"
                        className="w-14 h-14 rounded-full"
                        onPress={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <XIcon className="w-6 h-6" /> : <SparklesIcon className="w-6 h-6" />}
                    </Button>
                </Badge>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-96 max-h-[600px] z-50 shadow-2xl border border-default-200 animate-in fade-in slide-in-from-bottom-5">
                    <div className="bg-primary p-4 text-white flex justify-between items-center rounded-t-xl">
                        <div className="flex items-center gap-2">
                            <BotIcon className="w-6 h-6" />
                            <span className="font-bold">Fair-Tasker Assistant</span>
                        </div>
                        <Button isIconOnly size="sm" variant="light" color="secondary" onPress={() => setIsOpen(false)}>
                            <XIcon className="w-4 h-4" />
                        </Button>
                    </div>

                    <CardBody className="p-0 flex flex-col h-[450px]">
                        <ScrollShadow ref={scrollRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                        <Avatar
                                            size="sm"
                                            className="flex-shrink-0"
                                            icon={msg.role === "assistant" ? <BotIcon /> : undefined}
                                            src={msg.role === "user" ? "/user-avatar.png" : undefined}
                                        />
                                        <div className={`p-3 rounded-2xl text-sm ${msg.role === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-default-100 text-default-900 rounded-tl-none"
                                            }`}>
                                            {msg.content || (isLoading && idx === chatHistory.length - 1 ? "..." : "")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ScrollShadow>

                        {/* Quick Actions */}
                        {chatHistory.length === 1 && !isLoading && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {quickActions.map((action, i) => (
                                    <Button
                                        key={i}
                                        size="sm"
                                        variant="flat"
                                        onPress={() => {
                                            setMessage(action.label);
                                        }}
                                        className="text-xs"
                                    >
                                        {action.icon} {action.label}
                                    </Button>
                                ))}
                            </div>
                        )}

                        <div className="p-4 border-t border-default-100 flex gap-2">
                            <Input
                                fullWidth
                                size="sm"
                                placeholder="Ask me anything..."
                                value={message}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSendMessage()}
                            />
                            <Button isIconOnly size="md" color="primary" onPress={handleSendMessage} isLoading={isLoading}>
                                <SendIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    );
};
