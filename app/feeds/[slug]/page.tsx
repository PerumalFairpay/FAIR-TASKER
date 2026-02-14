"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogRequest } from "@/store/blog/action";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Tag from "@/components/Tag";
import styles from "./blog.module.css";

export default function BlogDetailPage() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { blog, getBlogLoading, getBlogError } = useSelector((state: any) => state.Blog);

    useEffect(() => {
        if (slug) {
            dispatch(getBlogRequest(slug as string));
        }
    }, [dispatch, slug]);

    // Static fallback author if API doesn't provide one
    const defaultAuthor = {
        name: "Admin",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    };

    if (getBlogLoading && !blog) {
        return (
            <div className="w-full min-h-screen pt-24 pb-20 px-6 font-sans">
                <div className="max-w-2xl mx-auto">
                    <Skeleton className="rounded-lg w-24 h-8 mb-6" />
                    <Skeleton className="rounded-lg w-3/4 h-12 mb-4" />
                    <div className="flex gap-4 mb-8">
                        <Skeleton className="rounded-full w-10 h-10" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="rounded-lg w-32 h-4" />
                            <Skeleton className="rounded-lg w-24 h-3" />
                        </div>
                    </div>
                    <Skeleton className="rounded-[24px] w-full aspect-[2/1] mb-10" />
                    <div className="space-y-4">
                        <Skeleton className="rounded-lg w-full h-4" />
                        <Skeleton className="rounded-lg w-full h-4" />
                        <Skeleton className="rounded-lg w-5/6 h-4" />
                        <Skeleton className="rounded-lg w-4/5 h-4" />
                    </div>
                </div>
            </div>
        );
    }

    if (getBlogError || (!getBlogLoading && !blog)) {
        return (
            <div className="w-full min-h-screen   pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Blog not found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                    We couldn't find the blog post you're looking for. It might have been removed or the URL is incorrect.
                </p>
                <Link
                    href="/feeds"
                    className="px-6 py-2.5 bg-gray-900 dark:bg-primary text-white rounded-full font-medium hover:bg-gray-800 dark:hover:bg-primary-600 transition-colors"
                >
                    Back to Feeds
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen   p-4 sm:p-6 lg:p-8 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >

                {blog.category && (
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-[#1a1a1a] rounded-full shadow-sm border border-gray-200 dark:border-gray-800">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {blog.category}
                            </span>
                        </div>
                    </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-[#3D3D3D] dark:text-white leading-tight mb-8 text-center max-w-4xl mx-auto">
                    {blog.title}
                </h1>





                {/* Cover Image */}
                {blog.cover_image && (
                    <div className="relative w-full aspect-[16/9] md:aspect-[2/1] overflow-hidden rounded-[24px] mb-16 shadow-sm bg-gray-100 dark:bg-gray-800">
                        <Image
                            removeWrapper
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            src={blog.cover_image?.replace("host.docker.internal", "localhost")}
                        />

                        {/* Author info overlay */}
                        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 bg-black/20 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 shadow-lg">
                            <Avatar
                                src={blog.author?.avatar?.replace("host.docker.internal", "localhost")}
                                name={blog.author?.name || defaultAuthor.name}
                                className="w-10 h-10 border border-white/20"
                            />
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold text-white leading-tight">
                                    {blog.author?.name || defaultAuthor.name}
                                </span>
                                <span className="text-[11px] text-white/70 font-medium">
                                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {blog.excerpt && (
                    <div className="mb-10 mx-auto">
                        <p className="text-[#52525B] dark:text-gray-300 text-lg md:text-xl leading-relaxed">
                            {blog.excerpt}
                        </p>
                    </div>
                )}

                <div className={`${styles.content} dark:text-gray-300 max-w-3xl mx-auto`}>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>

                {blog.tags && blog.tags.length > 0 && (
                    <div className="max-w-7xl mx-auto mt-7 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag: string, index: number) => (
                                <Chip key={index} variant="flat" size="sm" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                    {tag}
                                </Chip>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations Section */}
                {blog.recommendations && blog.recommendations.length > 0 && (
                    <div className="mt-7 pt-10 border-t border-gray-200 dark:border-gray-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center md:text-left">Recommended for you</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {blog.recommendations.map((recommendation: any) => (
                                <Link
                                    key={recommendation.id}
                                    href={`/feeds/${recommendation.id}`}
                                    className="block h-full group"
                                >
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full bg-white dark:bg-[#1a1a1a] border border-white dark:border-[#333] rounded-[24px] p-2 transition-all duration-300"
                                        style={{
                                            boxShadow: '0px 0.6021873017743928px 0.6021873017743928px 0px rgba(28, 28, 28, 0.01), 0px 2.288533303243457px 2.288533303243457px 0px rgba(28, 28, 28, 0.03), 0px 10px 10px 0px rgba(28, 28, 28, 0.12), 0px -6px 6px -5px rgb(255, 255, 255)'
                                        }}
                                    >
                                        {/* Card Image Area */}
                                        <div className="relative w-full aspect-[2/1] overflow-hidden rounded-[16px] bg-gray-100 dark:bg-gray-800">
                                            <Image
                                                removeWrapper
                                                alt={recommendation.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                                                src={recommendation.cover_image?.replace("host.docker.internal", "localhost") || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"}
                                            />
                                            {/* Category Badge */}
                                            {recommendation.category && (
                                                <div className="absolute top-3 left-3 z-10">
                                                    <div className="inline-flex items-center px-3 py-1.5 bg-white/95 dark:bg-black/90 backdrop-blur-sm rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            {recommendation.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-3 pt-4 pb-2 flex flex-col gap-2">
                                            <h4 className="text-lg font-bold text-[#111827] dark:text-[#E3E3E3] leading-[1.2] tracking-tight line-clamp-2">
                                                {recommendation.title}
                                            </h4>
                                            <p className="text-[#52525B] dark:text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
                                                {recommendation.excerpt || recommendation.content?.replace(/<[^>]*>/g, '').slice(0, 100) + "..."}
                                            </p>
                                        </div>

                                        <div className="px-4  pb-2 pt-2 ">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={recommendation.author?.avatar?.replace("host.docker.internal", "localhost")}
                                                    name={recommendation.author?.name || defaultAuthor.name}
                                                    className="w-7 h-7 text-tiny"
                                                />
                                                <span className="text-sm font-medium text-[#374151] dark:text-gray-300">
                                                    {recommendation.author?.name || defaultAuthor.name}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
