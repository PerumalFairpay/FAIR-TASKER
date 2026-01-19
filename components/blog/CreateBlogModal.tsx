"use client";

import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { useDispatch, useSelector } from "react-redux";
import { clearBlogErrors, createBlogRequest, updateBlogRequest } from "@/store/blog/action";
import { Loader2, Plus, X, Image as ImageIcon, BookOpen } from "lucide-react";
import { Switch } from "@heroui/switch";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface CreateBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    blogToEdit?: any;
}

const CreateBlogModal: React.FC<CreateBlogModalProps> = ({ isOpen, onClose, blogToEdit }) => {
    const dispatch = useDispatch();

    const {
        createBlogLoading, createBlogSuccess, createBlogError,
        updateBlogLoading, updateBlogSuccess, updateBlogError
    } = useSelector((state: any) => state.Blog);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState<string>("");
    const [isPublished, setIsPublished] = useState(false);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [existingCoverImage, setExistingCoverImage] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            if (blogToEdit) {
                // Edit Mode
                setTitle(blogToEdit.title || "");
                setSlug(blogToEdit.slug || "");
                setExcerpt(blogToEdit.excerpt || "");
                setContent(blogToEdit.content || "");
                setCategory(blogToEdit.category || "");
                setTags(blogToEdit.tags ? (Array.isArray(blogToEdit.tags) ? blogToEdit.tags.join(", ") : blogToEdit.tags) : "");
                setIsPublished(blogToEdit.is_published || false);
                setExistingCoverImage(blogToEdit.cover_image || "");
                setCoverImage(null);
            } else {
                // Create Mode
                setTitle("");
                setSlug("");
                setExcerpt("");
                setContent("");
                setCategory("");
                setTags("");
                setIsPublished(false);
                setCoverImage(null);
                setExistingCoverImage("");
            }
            dispatch(clearBlogErrors());
        }
    }, [isOpen, blogToEdit, dispatch]);

    useEffect(() => {
        if (createBlogSuccess || updateBlogSuccess) {
            onClose();
        }
    }, [createBlogSuccess, updateBlogSuccess, onClose]);

    // Auto-generate slug from title only in Create Mode
    useEffect(() => {
        if (!blogToEdit && title) {
            setSlug(title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
        }
    }, [title, blogToEdit]);

    const handleSubmit = () => {
        if (!title.trim() || !slug.trim() || !content.trim()) return;

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("slug", slug.trim());
        formData.append("excerpt", excerpt.trim());
        formData.append("content", content.trim());
        formData.append("category", category.trim());
        formData.append("tags", tags.trim());
        formData.append("is_published", String(isPublished));

        if (coverImage) {
            formData.append("cover_image", coverImage);
        }

        if (blogToEdit) {
            dispatch(updateBlogRequest(blogToEdit.id, formData));
        } else {
            dispatch(createBlogRequest(formData));
        }
    };

    const isLoading = createBlogLoading || updateBlogLoading;
    const error = createBlogError || updateBlogError;

    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            onClose={onClose}
            size="4xl"
            placement="right"
            className="bg-white dark:bg-[#1f1f1f]"
        >
            <DrawerContent>
                {() => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1 px-6 py-4 border-b border-[#e5e7eb] dark:border-[#444746]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] dark:bg-[#394457] flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-[#0b57d0] dark:text-[#8ab4f8]" />
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-semibold text-[#1f1f1f] dark:text-[#E3E3E3]">
                                        {blogToEdit ? "Edit Blog Post" : "Create New Blog Post"}
                                    </h2>
                                    <p className="text-[13px] text-[#5f6368] dark:text-[#9aa0a6]">
                                        Share your thoughts and updates with the world
                                    </p>
                                </div>
                            </div>
                        </DrawerHeader>

                        <DrawerBody className="px-6 py-5 overflow-y-auto">
                            <div className="space-y-5">
                                <style jsx global>{`
                                    .ql-toolbar.ql-snow {
                                        border-color: #e5e7eb !important;
                                        border-top-left-radius: 0.5rem;
                                        border-top-right-radius: 0.5rem;
                                        background: transparent;
                                    }
                                    .dark .ql-toolbar.ql-snow {
                                        border-color: #444746 !important;
                                        background: #1f1f1f;
                                    }
                                    .ql-container.ql-snow {
                                        border-color: #e5e7eb !important;
                                        border-bottom-left-radius: 0.5rem;
                                        border-bottom-right-radius: 0.5rem;
                                        min-height: 200px;
                                    }
                                    .dark .ql-container.ql-snow {
                                        border-color: #444746 !important;
                                        background: #1f1f1f;
                                        color: #E3E3E3;
                                    }
                                    .ql-picker-label {
                                        color: #1f1f1f;
                                    }
                                    .dark .ql-picker-label {
                                        color: #E3E3E3;
                                    }
                                    .ql-stroke {
                                        stroke: #1f1f1f !important;
                                    }
                                    .dark .ql-stroke {
                                        stroke: #E3E3E3 !important;
                                    }
                                    .ql-fill {
                                        fill: #1f1f1f !important;
                                    }
                                    .dark .ql-fill {
                                        fill: #E3E3E3 !important;
                                    }
                                    .ql-picker-options {
                                        background-color: #ffffff !important;
                                        color: #1f1f1f !important;
                                    }
                                    .dark .ql-picker-options {
                                        background-color: #1f1f1f !important;
                                        color: #E3E3E3 !important;
                                        border-color: #444746 !important;
                                    }
                                `}</style>
                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-[#1f1f1f] dark:text-[#E3E3E3]">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Enter blog title"
                                        variant="flat"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-[#1f1f1f] dark:text-[#E3E3E3]">
                                        Category
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. Technology, Updates"
                                        variant="flat"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-[#1f1f1f] dark:text-[#E3E3E3]">
                                        Excerpt
                                    </label>
                                    <Textarea
                                        placeholder="Brief summary of the blog post"
                                        variant="flat"
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        minRows={2}
                                        maxRows={4}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-[#1f1f1f] dark:text-[#E3E3E3]">
                                        Content <span className="text-red-500">*</span>
                                    </label>
                                    <div className="h-[400px] mb-12">
                                        <ReactQuill
                                            theme="snow"
                                            value={content}
                                            onChange={setContent}
                                            className="h-full"
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': [1, 2, 3, false] }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                    ['link', 'image'],
                                                    ['clean']
                                                ],
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-medium text-[#1f1f1f] dark:text-[#E3E3E3]">
                                            Tags (comma separated)
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="tech, news, update"
                                            variant="flat"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[13px] font-medium text-[#1f1f1f] dark:text-[#E3E3E3]">
                                            Publish Status
                                        </label>
                                        <div className="flex items-center gap-2 h-10">
                                            <Switch
                                                isSelected={isPublished}
                                                onValueChange={setIsPublished}
                                                size="sm"
                                            >
                                                {isPublished ? "Published" : "Draft"}
                                            </Switch>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-[#1f1f1f] dark:text-[#E3E3E3]">
                                        Cover Image
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="cover-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setCoverImage(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="cover-upload"
                                                className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-xl bg-[#f8f9fa] dark:bg-[#2d2e30] border border-[#e5e7eb] dark:border-[#444746] hover:bg-[#e8f0fe] dark:hover:bg-[#3c4043] transition-colors"
                                            >
                                                {coverImage ? (
                                                    <img
                                                        src={URL.createObjectURL(coverImage)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded-xl"
                                                    />
                                                ) : existingCoverImage ? (
                                                    <img
                                                        src={existingCoverImage.replace("host.docker.internal", "localhost")}
                                                        alt="Existing Preview"
                                                        className="w-full h-full object-cover rounded-xl"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-[#5f6368] dark:text-[#9aa0a6]" />
                                                )}
                                            </label>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13px] text-[#1f1f1f] dark:text-[#E3E3E3] font-medium truncate">
                                                {coverImage ? coverImage.name : existingCoverImage ? "Current Image" : "No image selected"}
                                            </p>
                                            <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6]">
                                                Click to upload (JPG, PNG)
                                            </p>
                                        </div>
                                        {(coverImage || existingCoverImage) && (
                                            <button
                                                onClick={() => {
                                                    setCoverImage(null);
                                                    setExistingCoverImage("");
                                                }}
                                                className="p-1 hover:bg-[#f1f3f4] dark:hover:bg-[#303134] rounded-full text-[#5f6368] dark:text-[#9aa0a6]"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DrawerBody>

                        <DrawerFooter className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[#444746]">
                            <div className="flex items-center gap-3 w-full justify-end">
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                    className="text-[#5f6368] dark:text-[#9aa0a6] font-medium rounded-full px-6 h-10 text-[14px] hover:bg-[#f8f9fa] dark:hover:bg-[#2d2e30] transition-colors"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onPress={handleSubmit}
                                    disabled={isLoading || !title.trim() || !slug.trim() || !content.trim()}
                                    className="bg-[#0b57d0] dark:bg-[#8ab4f8] text-white dark:text-[#1f1f1f] font-medium rounded-full px-6 h-10 text-[14px] hover:bg-[#0b57d0]/90 dark:hover:bg-[#8ab4f8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {blogToEdit ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        blogToEdit ? "Update Blog" : "Create Blog"
                                    )}
                                </Button>
                            </div>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default CreateBlogModal;
