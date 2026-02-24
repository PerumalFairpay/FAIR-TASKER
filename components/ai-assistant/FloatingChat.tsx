"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";

import { useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";


type Message = {
    role: "user" | "ai";
    content: string;
};

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hi there! I'm your AI Assistant. How can I help you today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector((state: AppState) => state.Auth);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
            const response = await fetch(`${apiUrl}/ai/chat`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    // Include Authorization if needed: "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ query: userMessage }),
            });

            if (!response.ok) {
                throw new Error("Failed to connect to AI");
            }

            setMessages((prev) => [...prev, { role: "ai", content: "" }]);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let aiResponse = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    aiResponse += chunk;

                    setMessages((prev) => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].content = aiResponse;
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: "ai", content: "I'm sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Only render if logged in (optional depending on use case)
    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen ? (
                <Card className="w-80 h-[500px] shadow-2xl flex flex-col mb-4 overflow-hidden border border-default-200">
                    <CardHeader className="flex justify-between items-center bg-primary text-white py-3 px-4 rounded-t-xl z-20">
                        <div className="flex items-center gap-2">
                            <Bot size={20} />
                            <h3 className="font-semibold text-medium">AI Assistant</h3>
                        </div>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-primary-400"
                        >
                            <X size={18} />
                        </Button>
                    </CardHeader>

                    <CardBody className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-default-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-white" : "bg-default-200 text-default-600"
                                        }`}
                                >
                                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div
                                    className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === "user"
                                        ? "bg-primary text-white rounded-tr-none"
                                        : "bg-white border border-default-200 text-default-800 rounded-tl-none"
                                        }`}
                                    style={{ whiteSpace: "pre-wrap" }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-2 flex-row">
                                <div className="w-8 h-8 rounded-full bg-default-200 text-default-600 flex items-center justify-center shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="p-3 bg-white border border-default-200 rounded-2xl rounded-tl-none w-16 flex items-center justify-center">
                                    <Loader2 size={16} className="animate-spin text-default-400" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardBody>

                    <CardFooter className="p-3 bg-white border-t border-default-200 z-20">
                        <form onSubmit={handleSubmit} className="flex gap-2 w-full items-center">
                            <Input
                                placeholder="Ask me anything..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                size="sm"
                                fullWidth
                                variant="faded"
                                classNames={{
                                    inputWrapper: "bg-default-100",
                                }}
                            />
                            <Button
                                isIconOnly
                                type="submit"
                                color="primary"
                                size="sm"
                                isDisabled={!inputValue.trim() || isLoading}
                                className="shrink-0 rounded-full"
                            >
                                <Send size={16} />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ) : (
                <Button
                    isIconOnly
                    color="primary"
                    size="lg"
                    onClick={() => setIsOpen(true)}
                    className="rounded-full shadow-lg w-14 h-14"
                >
                    <MessageCircle size={24} />
                </Button>
            )}
        </div>
    );
}
