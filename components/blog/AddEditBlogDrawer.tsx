"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { clearBlogErrors } from "@/store/blog/action";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface AddEditBlogDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    selectedBlog?: any;
    loading: boolean;
    onSubmit: (formData: FormData) => void;
}

export default function AddEditBlogDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedBlog,
    loading,
    onSubmit,
}: AddEditBlogDrawerProps) {
    const dispatch = useDispatch();
    const { createBlogError, updateBlogError } = useSelector((state: RootState) => state.Blog);

    const [formData, setFormData] = useState<any>({});
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && selectedBlog) {
                setFormData({
                    ...selectedBlog,
                    tagsString: Array.isArray(selectedBlog.tags) ? selectedBlog.tags.join(", ") : selectedBlog.tags || ""
                });
            } else {
                setFormData({
                    title: "",
                    slug: "",
                    excerpt: "",
                    content: "",
                    category: "",
                    tagsString: "",
                    is_published: true
                });
            }
            setFile(null);
            dispatch(clearBlogErrors());
        }
    }, [isOpen, mode, selectedBlog, dispatch]);

    // Auto-generate slug from title in Create Mode
    useEffect(() => {
        if (mode === "create" && formData.title) {
            const generatedSlug = formData.title
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            setFormData((prev: any) => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title, mode]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        const data = new FormData();

        data.append("title", formData.title || "");
        data.append("slug", formData.slug || "");
        data.append("excerpt", formData.excerpt || "");
        data.append("content", formData.content || "");
        data.append("category", formData.category || "");
        data.append("tags", formData.tagsString || "");
        data.append("is_published", String(!!formData.is_published));

        if (file) {
            data.append("cover_image", file);
        }

        onSubmit(data);
    };

    const error = mode === "create" ? createBlogError : updateBlogError;

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1 text-[18px] font-semibold border-b border-default-100">
                            {mode === "create" ? "Add Blog Post" : "Edit Blog Post"}
                        </DrawerHeader>
                        <DrawerBody className="gap-6 py-4 overflow-y-auto">
                            {error && (
                                <div className="p-3 bg-danger-50 text-danger rounded-lg text-tiny">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Title"
                                    placeholder="Enter blog title"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={formData.title || ""}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    isRequired
                                />
                                <Input
                                    label="Slug"
                                    placeholder="generated-slug"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={formData.slug || ""}
                                    onChange={(e) => handleChange("slug", e.target.value)}
                                    isRequired
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Category"
                                    placeholder="e.g. Technology, Updates"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={formData.category || ""}
                                    onChange={(e) => handleChange("category", e.target.value)}
                                />
                                <Input
                                    label="Tags (comma separated)"
                                    placeholder="tech, news, update"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={formData.tagsString || ""}
                                    onChange={(e) => handleChange("tagsString", e.target.value)}
                                />
                            </div>

                            <Textarea
                                label="Excerpt"
                                placeholder="Brief summary of the blog post"
                                labelPlacement="outside"
                                variant="bordered"
                                value={formData.excerpt || ""}
                                onChange={(e) => handleChange("excerpt", e.target.value)}
                                minRows={2}
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-small font-medium text-foreground">
                                    Content <span className="text-danger">*</span>
                                </label>
                                <div className="min-h-[400px] mb-12">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content || ""}
                                        onChange={(val) => handleChange("content", val)}
                                        className="h-full rounded-xl"
                                        style={{ height: "350px" }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div className="flex flex-col gap-2">
                                    <label className="text-small font-medium text-foreground">Cover Image</label>
                                    <div className="border-2 border-dashed border-default-200 rounded-xl p-4 hover:border-primary transition-colors cursor-pointer relative min-h-[56px] flex items-center justify-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <p className="text-tiny text-default-500">
                                                {file ? file.name : (formData.cover_image ? "Image uploaded (Click to change)" : "Click or drag to upload")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Switch
                                        isSelected={!!formData.is_published}
                                        onValueChange={(val) => handleChange("is_published", val)}
                                        size="sm"
                                    >
                                        Published
                                    </Switch>
                                </div>
                            </div>

                            <style jsx global>{`
                                .ql-toolbar.ql-snow {
                                    border-color: var(--heroui-default-200) !important;
                                    border-top-left-radius: 0.75rem;
                                    border-top-right-radius: 0.75rem;
                                }
                                .ql-container.ql-snow {
                                    border-color: var(--heroui-default-200) !important;
                                    border-bottom-left-radius: 0.75rem;
                                    border-bottom-right-radius: 0.75rem;
                                }
                                .dark .ql-editor { color: #E3E3E3; }
                                .dark .ql-stroke { stroke: #E3E3E3 !important; }
                                .dark .ql-fill { fill: #E3E3E3 !important; }
                                .dark .ql-picker { color: #E3E3E3 !important; }
                            `}</style>
                        </DrawerBody>
                        <DrawerFooter className="border-t border-default-100">
                            <Button color="danger" variant="light" onPress={onClose} fullWidth>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleSubmit}
                                isLoading={loading}
                                fullWidth
                                disabled={!formData.title || !formData.content}
                            >
                                {mode === "create" ? "Create Blog" : "Save Changes"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
