"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogsRequest } from "@/store/blog/action";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { motion } from "framer-motion";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { Image } from "@heroui/image";
import { EditIcon, Eye, Trash2, Plus } from "lucide-react";

import CreateBlogModal from "@/components/blog/CreateBlogModal";
import DeleteBlogModal from "@/components/blog/DeleteBlogModal";
import ViewBlogModal from "@/components/blog/ViewBlogModal";

export default function BlogPage() {
    const dispatch = useDispatch();
    const { blogs, getBlogsLoading, deleteBlogSuccess } = useSelector((state: any) => state.Blog);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewBlogId, setViewBlogId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(getBlogsRequest(1, 10));
    }, [dispatch]);

    useEffect(() => {
        if (deleteBlogSuccess) {
            setIsDeleteModalOpen(false);
            setBlogToDelete(null);
        }
    }, [deleteBlogSuccess]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleEdit = (blog: any) => {
        setSelectedBlog(blog);
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setSelectedBlog(null);
    };

    const handleDelete = (blog: any) => {
        setBlogToDelete(blog);
        setIsDeleteModalOpen(true);
    };

    const handleView = (blog: any) => {
        setViewBlogId(blog.id);
        setIsViewModalOpen(true);
    };

    return (
        <div className="flex-1 h-full bg-white dark:bg-[#131314] overflow-y-auto">
            <div className="max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-[20px] md:text-[24px] font-normal text-[#1f1f1f] dark:text-[#E3E3E3]">Blogs</h1>

                    <div className="flex items-center gap-3">
                        <Button
                            startContent={<Plus size={16} />}
                            className="font-medium"
                            variant="shadow"
                            color="primary"
                            onPress={() => setIsCreateModalOpen(true)}
                        >
                            Create Blog
                        </Button>
                    </div>
                </div>

                <CreateBlogModal
                    isOpen={isCreateModalOpen}
                    onClose={handleCloseModal}
                    blogToEdit={selectedBlog}
                />

                <DeleteBlogModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    blogToDelete={blogToDelete}
                />

                <ViewBlogModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    blogId={viewBlogId}
                />

                {/* Blogs Grid Layout */}
                <div className="w-full">
                    {getBlogsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Card key={`skeleton-${index}`} className="w-full p-2 bg-white dark:bg-[#1a1a1a] shadow-sm border border-transparent" radius="lg" style={{ borderRadius: "24px" }}>
                                    <Skeleton className="rounded-[16px]">
                                        <div className="h-48 rounded-[16px] bg-default-300"></div>
                                    </Skeleton>
                                    <div className="space-y-3 mt-4 px-3 pb-2">
                                        <Skeleton className="w-3/4 rounded-lg">
                                            <div className="h-6 w-3/4 rounded-lg bg-default-200"></div>
                                        </Skeleton>
                                        <Skeleton className="w-full rounded-lg">
                                            <div className="h-3 w-full rounded-lg bg-default-200"></div>
                                        </Skeleton>
                                        <div className="pt-2 flex justify-between items-center">
                                            <Skeleton className="w-24 rounded-full">
                                                <div className="h-6 w-24 rounded-full bg-default-200"></div>
                                            </Skeleton>
                                            <div className="flex gap-2">
                                                <Skeleton className="w-8 h-8 rounded-lg" />
                                                <Skeleton className="w-8 h-8 rounded-lg" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        blogs && blogs.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                            >
                                {blogs.map((blog: any) => (
                                    <motion.div
                                        key={blog.id}
                                        variants={{
                                            hidden: { y: 20, opacity: 0 },
                                            visible: {
                                                y: 0,
                                                opacity: 1,
                                                transition: { type: "spring", stiffness: 100 }
                                            }
                                        }}
                                    >
                                        <Card
                                            className="h-full bg-white dark:bg-[#1a1a1a] border border-white dark:border-[#333] p-2 transition-all duration-300"
                                            style={{
                                                borderRadius: "24px",
                                                boxShadow: '0px 0.6021873017743928px 0.6021873017743928px 0px rgba(28, 28, 28, 0.01), 0px 2.288533303243457px 2.288533303243457px 0px rgba(28, 28, 28, 0.03), 0px 10px 10px 0px rgba(28, 28, 28, 0.12), 0px -6px 6px -5px rgb(255, 255, 255)'
                                            }}
                                        >
                                            {/* Clickable Area for View Details */}
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => handleView(blog)}
                                            >
                                                {/* Card Image Area */}
                                                <div className="relative w-full aspect-[2/1] overflow-hidden rounded-[16px] bg-gray-100 dark:bg-zinc-800 group">
                                                    <Image
                                                        removeWrapper
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover transform group-hover:scale-105 group-hover:blur-[2px] transition-all duration-500 ease-out"
                                                        src={blog.cover_image?.replace("host.docker.internal", "localhost") || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"}
                                                    />
                                                    {/* Status Badge - Top Right */}
                                                    <div className="absolute top-3 right-3 z-10">
                                                        <Chip
                                                            classNames={{
                                                                base: "bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-sm h-7",
                                                                content: "text-[11px] font-semibold text-default-800 dark:text-gray-200 px-2"
                                                            }}
                                                            variant="flat"
                                                            color={blog.is_published ? "success" : "warning"}
                                                        >
                                                            {blog.is_published ? "Published" : "Draft"}
                                                        </Chip>
                                                    </div>
                                                </div>

                                                <CardBody className="px-3 pt-4 pb-2 flex flex-col gap-2">
                                                    <div className="flex justify-between items-start">
                                                        <h2 className="text-xl font-bold text-[#111827] dark:text-[#E3E3E3] leading-[1.2] tracking-tight line-clamp-1">
                                                            {blog.title}
                                                        </h2>
                                                    </div>
                                                    <p className="text-[#52525B] dark:text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
                                                        {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').slice(0, 150) + "..." || "No description"}
                                                    </p>
                                                </CardBody>
                                            </div>

                                            <CardFooter className="px-3 pb-3 pt-2">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar
                                                            src={blog.author?.avatar?.replace("host.docker.internal", "localhost")}
                                                            name={blog.author?.name || "Admin"}
                                                            className="w-6 h-6 text-tiny"
                                                        />
                                                        <span className="text-[12px] font-medium text-[#374151] dark:text-gray-300">
                                                            {formatDate(blog.created_at)}
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-1">
                                                        <Tooltip content="Edit">
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="light"
                                                                className="text-default-500 hover:text-secondary"
                                                                onPress={() => handleEdit(blog)}
                                                            >
                                                                <EditIcon size={18} />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip content="Delete">
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="light"
                                                                className="text-default-500 hover:text-danger"
                                                                onPress={() => handleDelete(blog)}
                                                            >
                                                                <Trash2 size={18} />
                                                            </Button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-12 bg-content1 rounded-3xl border border-default-200">
                                <div className="w-16 h-16 mb-4 bg-default-100 rounded-full flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-default-400" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-[#1f1f1f] dark:text-[#E3E3E3] mb-2">
                                    No blogs created yet
                                </h3>
                                <p className="text-sm text-[#444746] dark:text-[#C4C7C5] max-w-xs mx-auto">
                                    Get started by creating your first blog post to share with your audience.
                                </p>
                                <Button
                                    className="mt-6 font-medium"
                                    color="primary"
                                    variant="shadow"
                                    onPress={() => setIsCreateModalOpen(true)}
                                >
                                    Create Blog
                                </Button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
