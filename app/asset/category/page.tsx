"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAssetCategoriesRequest,
    createAssetCategoryRequest,
    updateAssetCategoryRequest,
    deleteAssetCategoryRequest,
    clearAssetCategoryDetails,
} from "@/store/assetCategory/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { PlusIcon, PencilIcon, TrashIcon, ChevronRight, ChevronDown, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import DeleteAssetCategoryModal from "./DeleteAssetCategoryModal";

// Helper to build tree structure
const buildTree = (categories: any[]) => {
    const map = new Map();
    const roots: any[] = [];

    // Initialize map
    categories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
    });

    // Build hierarchy
    categories.forEach(cat => {
        const node = map.get(cat.id);
        if (cat.parent_id && map.has(cat.parent_id)) {
            map.get(cat.parent_id).children.push(node);
        } else {
            roots.push(node); // No parent or parent not found -> root
        }
    });

    return roots;
};

// Recursive Tree Node Component
const CategoryTreeNode = ({ node, onEdit, onDelete, onAddSub }: { node: any, onEdit: (d: any) => void, onDelete: (node: any) => void, onAddSub: (id: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="ml-4">
            <div className={clsx(
                "flex items-center gap-2 p-2 rounded-lg hover:bg-default-100 transition-colors group",
                !hasChildren && "ml-6" // Indent if no chevron
            )}>
                {hasChildren && (
                    <button onClick={toggleOpen} className="p-1 hover:bg-default-200 rounded-full transition-colors">
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                )}

                <div className="text-secondary">
                    <Tag size={20} />
                </div>

                <div className="flex flex-col flex-1">
                    <span className="font-medium text-default-700">{node.name}</span>
                    {node.description && <span className="text-tiny text-default-400">{node.description}</span>}
                </div>

                {/* Actions - visible on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" isIconOnly variant="light" color="primary" onPress={() => onAddSub(node.id)} title="Add Sub-category">
                        <PlusIcon size={16} />
                    </Button>
                    <Button size="sm" isIconOnly variant="light" color="warning" onPress={() => onEdit(node)} title="Edit">
                        <PencilIcon size={16} />
                    </Button>
                    <Button size="sm" isIconOnly variant="light" color="danger" onPress={() => onDelete(node)} title="Delete">
                        <TrashIcon size={16} />
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-l border-default-200 ml-5"
                    >
                        {node.children.map((child: any) => (
                            <CategoryTreeNode
                                key={child.id}
                                node={child}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onAddSub={onAddSub}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function AssetCategoryPage() {
    const dispatch = useDispatch();
    const { assetCategories, loading, success } = useSelector(
        (state: RootState) => state.AssetCategory
    );

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent_id: "",
    });

    useEffect(() => {
        dispatch(getAssetCategoriesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onClose();
            onDeleteClose();
            dispatch(clearAssetCategoryDetails());
        }
    }, [success, onClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setFormData({ name: "", description: "", parent_id: "" });
        onOpen();
    };

    const handleAddSub = (parentId: string) => {
        setMode("create");
        setFormData({ name: "", description: "", parent_id: parentId });
        onOpen();
    };

    const handleEdit = (category: any) => {
        setMode("edit");
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            parent_id: category.parent_id || "",
        });
        onOpen();
    };

    const handleDelete = (category: any) => {
        setCategoryToDelete(category);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            dispatch(deleteAssetCategoryRequest(categoryToDelete.id));
        }
    };

    const handleSubmit = () => {
        const parentId = formData.parent_id ? formData.parent_id : null;

        if (mode === "create") {
            const payload = {
                name: formData.name,
                description: formData.description,
                parent_id: parentId,
            };
            dispatch(createAssetCategoryRequest(payload));
        } else {
            const payload = {
                name: formData.name,
                description: formData.description,
                parent_id: parentId,
            };
            dispatch(updateAssetCategoryRequest(selectedCategory.id, payload));
        }
    };

    const treeData = React.useMemo(() => buildTree(assetCategories || []), [assetCategories]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Asset Categories</h1>
                    <p className="text-default-500">Manage categories for asset tracking</p>
                </div>
                <Button color="secondary" endContent={<PlusIcon size={16} />} onPress={handleCreate}>
                    Add Root Category
                </Button>
            </div>

            <div className="bg-default-50 rounded-xl p-4 min-h-[400px] border border-default-200">
                {!loading && treeData.length === 0 && <p className="text-default-500">No categories found.</p>}

                {treeData.map((node: any) => (
                    <CategoryTreeNode
                        key={node.id}
                        node={node}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddSub={handleAddSub}
                    />
                ))}
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {mode === "create" ? "Add Category" : "Edit Category"}
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Name"
                                    placeholder="Enter category name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    isRequired
                                />
                                <Textarea
                                    label="Description"
                                    placeholder="Enter category description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                <Select
                                    label="Parent Category"
                                    placeholder="Select a parent (optional)"
                                    selectedKeys={formData.parent_id ? [formData.parent_id] : []}
                                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                >
                                    {[
                                        { id: "", name: "None (Root)" },
                                        ...(assetCategories || []).filter((c: any) => c.id !== selectedCategory?.id)
                                    ].map((cat: any) => (
                                        <SelectItem key={cat.id || "root"} textValue={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="secondary" onPress={handleSubmit} isLoading={loading}>
                                    {mode === "create" ? "Create" : "Update"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <DeleteAssetCategoryModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={confirmDelete}
                loading={loading}
                categoryName={categoryToDelete?.name}
            />
        </div>
    );
}
