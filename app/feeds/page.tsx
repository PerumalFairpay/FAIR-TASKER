"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogsRequest } from "@/store/blog/action";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
import { motion } from "framer-motion";
import Tag from "@/components/Tag";

export default function FeedPage() {
    const dispatch = useDispatch();
    // Using 'blogs' and 'getBlogsLoading' from the existing state structure seen in app/blog/page.tsx
    const { blogs, getBlogsLoading } = useSelector((state: any) => state.Blog);

    useEffect(() => {
        // FAIR-TASKER uses two arguments (page, limit) for this action
        dispatch(getBlogsRequest(1, 10));
    }, [dispatch]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    // Static fallback author if API doesn't provide one
    const defaultAuthor = {
        name: "Admin",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    };

    return (
        <div className="w-full min-h-screen bg-[#F9FAFB] dark:bg-[#131314] pt-24 pb-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto flex flex-col items-center">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center gap-6 mb-16 max-w-2xl">
                  
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-[#111827] dark:text-white"
                    >
                        Latest Updates
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed max-w-xl"
                    >
                        Deep dives, smart strategies, and real results — explore how we build funnels that actually convert.
                    </motion.p>
                </div>

                {/* Content Section */}
                {getBlogsLoading && (!blogs || blogs.length === 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i} className="w-full p-2 bg-white dark:bg-[#1a1a1a] shadow-sm border border-transparent" radius="lg" style={{ borderRadius: "24px" }}>
                                <Skeleton className="rounded-[16px]">
                                    <div className="h-56 rounded-[16px] bg-default-300"></div>
                                </Skeleton>
                                <div className="space-y-3 mt-4 px-3 pb-2">
                                    <Skeleton className="w-3/4 rounded-lg">
                                        <div className="h-6 w-3/4 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <Skeleton className="w-full rounded-lg">
                                        <div className="h-3 w-full rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <div className="pt-2">
                                        <Skeleton className="w-24 rounded-full">
                                            <div className="h-6 w-24 rounded-full bg-default-200"></div>
                                        </Skeleton>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
                    >
                        {blogs && blogs.map((blog: any) => (
                            <motion.div key={blog.id} variants={itemVariants}>
                                {/* Linking to /feeds/[id] since we use ID for lookup */}
                                <Link href={`/feeds/${blog.id}`} className="block h-full group">
                                    <Card
                                        className="h-full bg-white dark:bg-[#1a1a1a] border border-white dark:border-[#333] p-2 transition-all duration-300"
                                        style={{
                                            borderRadius: "24px",
                                            boxShadow: '0px 0.6021873017743928px 0.6021873017743928px 0px rgba(28, 28, 28, 0.01), 0px 2.288533303243457px 2.288533303243457px 0px rgba(28, 28, 28, 0.03), 0px 10px 10px 0px rgba(28, 28, 28, 0.12), 0px -6px 6px -5px rgb(255, 255, 255)'
                                        }}
                                    >

                                        {/* Card Image Area */}
                                        <div className="relative w-full aspect-[2/1] overflow-hidden rounded-[16px] bg-gray-100 dark:bg-zinc-800">
                                            <Image
                                                removeWrapper
                                                alt={blog.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 group-hover:blur-[2px] transition-all duration-500 ease-out"
                                                src={blog.cover_image?.replace("host.docker.internal", "localhost") || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"}
                                            />
                                            {/* Category Badge - Top Right */}
                                            {blog.category && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    <Chip
                                                        classNames={{
                                                            base: "bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-sm h-7",
                                                            content: "text-[11px] font-semibold text-default-800 dark:text-gray-200 px-2"
                                                        }}
                                                        variant="flat"
                                                    >
                                                        {blog.category}
                                                    </Chip>
                                                </div>
                                            )}
                                        </div>

                                        <CardBody className="px-3 pt-4 pb-2 flex flex-col gap-2">
                                            <h2 className="text-xl font-bold text-[#111827] dark:text-[#E3E3E3] leading-[1.2] tracking-tight line-clamp-2">
                                                {blog.title}
                                            </h2>
                                            <p className="text-[#52525B] dark:text-gray-400 text-base leading-relaxed line-clamp-2 min-h-[40px]">
                                                {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').slice(0, 150) + "..." || "No description"}
                                            </p>
                                        </CardBody>

                                        <CardFooter className="px-3 pb-3 pt-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={blog.author?.avatar?.replace("host.docker.internal", "localhost")}
                                                    name={blog.author?.name || defaultAuthor.name}
                                                    className="w-8 h-8 text-tiny"
                                                />
                                                <span className="text-[15px] font-medium text-[#374151] dark:text-gray-300">
                                                    {blog.author?.name || defaultAuthor.name}
                                                </span>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!getBlogsLoading && (!blogs || blogs.length === 0) && (
                    <div className="text-center text-gray-500 mt-10">
                        No articles found.
                    </div>
                )}
            </div>
        </div>
    );
}
