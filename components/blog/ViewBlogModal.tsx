"use client";

import React, { useEffect } from "react";
import { Drawer, DrawerContent, DrawerBody } from "@heroui/drawer";
import { useDispatch, useSelector } from "react-redux";
import { getBlogRequest } from "@/store/blog/action";
import { Loader2 } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import styles from "./blog.module.css";

interface ViewBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    blogId: string | null;
}

const ViewBlogModal: React.FC<ViewBlogModalProps> = ({ isOpen, onClose, blogId }) => {
    const dispatch = useDispatch();
    const { blog, getBlogLoading } = useSelector((state: any) => state.Blog);

    useEffect(() => {
        if (isOpen && blogId) {
            dispatch(getBlogRequest(blogId));
        }
    }, [isOpen, blogId, dispatch]);

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            placement="right"
            size="4xl"
            className="bg-white dark:bg-[#1f1f1f]"
            classNames={{
                body: "p-0"
            }}
        >
            <DrawerContent>
                {(onClose) => (
                    <DrawerBody className="overflow-y-auto custom-scrollbar">
                        {getBlogLoading ? (
                            <div className="flex items-center justify-center h-full min-h-[50vh]">
                                <Loader2 className="w-8 h-8 animate-spin text-[#0b57d0]" />
                            </div>
                        ) : blog ? (
                            <div className="w-full min-h-full pt-16 pb-20 px-6 md:px-12 font-sans">
                                <div className="max-w-4xl mx-auto">

                                    {/* Category Tag */}
                                    {blog.category && (
                                        <div className="flex justify-center mb-6">
                                            <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-zinc-800 rounded-full shadow-sm border border-gray-200 dark:border-zinc-700">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {blog.category}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h1 className="text-3xl md:text-5xl font-bold text-[#3D3D3D] dark:text-[#E3E3E3] leading-tight mb-8 text-center">
                                        {blog.title}
                                    </h1>

                                    {/* Cover Image */}
                                    {blog.cover_image && (
                                        <div className="relative w-full aspect-[16/9] md:aspect-[2/1] overflow-hidden rounded-[24px] mb-8 shadow-sm bg-gray-100 dark:bg-zinc-800">
                                            <Image
                                                removeWrapper
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                                src={blog.cover_image?.replace("host.docker.internal", "localhost")}
                                            />
                                        </div>
                                    )}

                                    {/* Excerpt */}
                                    {blog.excerpt && (
                                        <div className="mb-10 text-center max-w-3xl mx-auto">
                                            <p className="text-[#52525B] dark:text-[#A1A1AA] text-base md:text-lg leading-relaxed">
                                                {blog.excerpt}
                                            </p>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className={`${styles.content} dark:prose-invert max-w-none`}>
                                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                                    </div>

                                    {/* Tags */}
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-zinc-800">
                                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(",")).map((tag: string, index: number) => (
                                                    <Chip
                                                        key={index}
                                                        variant="flat"
                                                        size="sm"
                                                        className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300"
                                                    >
                                                        {tag.trim()}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
                                <p className="text-[#5f6368] dark:text-[#9aa0a6] text-lg">Blog post not found.</p>
                            </div>
                        )}
                    </DrawerBody>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default ViewBlogModal;
