"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getExpenseCategoriesRequest,
    createExpenseCategoryRequest,
    updateExpenseCategoryRequest,
    deleteExpenseCategoryRequest,
    clearExpenseCategoryDetails,
} from "@/store/expenseCategory/action";
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
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ChevronRight,
    ChevronDown,
    Folder,
    FolderOpen,
    Tag,
    Wallet,
    ShoppingBag,
    Coffee,
    Car,
    Plane,
    Wrench,
    Zap,
    Utensils,
    Truck,
    Gift,
    Receipt,
    Coins
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

// Helper to get specialized icons for expense categories
const getCategoryIcon = (name: string, level: number, hasChildren: boolean, isOpen: boolean) => {
    const lowerName = name.toLowerCase();

    // Level 0 (Root) usually gets a Wallet icon
    if (level === 0) return <Wallet size={22} />;

    // Name-based icons
    if (lowerName.includes("food") || lowerName.includes("eat") || lowerName.includes("meal")) return <Utensils size={20} />;
    if (lowerName.includes("travel") || lowerName.includes("trip") || lowerName.includes("flight")) return <Plane size={20} />;
    if (lowerName.includes("transport") || lowerName.includes("car") || lowerName.includes("taxi")) return <Car size={20} />;
    if (lowerName.includes("shop") || lowerName.includes("buy") || lowerName.includes("purchase")) return <ShoppingBag size={20} />;
    if (lowerName.includes("office") || lowerName.includes("suppli")) return <Receipt size={20} />;
    if (lowerName.includes("bill") || lowerName.includes("utilit") || lowerName.includes("power")) return <Zap size={20} />;
    if (lowerName.includes("repair") || lowerName.includes("mainten")) return <Wrench size={20} />;
    if (lowerName.includes("logistics") || lowerName.includes("deliver") || lowerName.includes("ship")) return <Truck size={20} />;
    if (lowerName.includes("entertain") || lowerName.includes("fun") || lowerName.includes("coffee")) return <Coffee size={20} />;
    if (lowerName.includes("gift") || lowerName.includes("bonus")) return <Gift size={20} />;
    if (lowerName.includes("tax") || lowerName.includes("fee") || lowerName.includes("charge")) return <Coins size={20} />;
    if (lowerName.includes("tag") || lowerName.includes("label")) return <Tag size={20} />;

    // Fallback based on children/state
    if (hasChildren) return isOpen ? <FolderOpen size={20} /> : <Folder size={20} />;
    return <ShoppingBag size={20} />;
};

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
const CategoryTreeNode = ({
    node,
    onEdit,
    onDelete,
    onAddSub,
    isLast = false,
    level = 0
}: {
    node: any,
    onEdit: (d: any) => void,
    onDelete: (id: string) => void,
    onAddSub: (id: string) => void,
    isLast?: boolean,
    level?: number
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    const toggleOpen = () => setIsOpen(!isOpen);

    const icon = getCategoryIcon(node.name, level, hasChildren, isOpen);

    return (
        <div className="relative">
            {/* Connecting lines for children */}
            {level > 0 && (
                <div
                    className={clsx(
                        "absolute -left-6 top-0 w-6 border-l-2 border-primary/20",
                        isLast ? "h-6 rounded-bl-xl border-b-2" : "h-full"
                    )}
                />
            )}

            <div className={clsx(
                "group relative flex items-center gap-4 p-3 mb-2 rounded-2xl transition-all duration-300",
                "bg-transparent border border-default-200 shadow-sm hover:shadow-md",
                "hover:border-primary/50 hover:bg-primary/5",
                level === 0 && "bg-gradient-to-r from-primary/5 to-transparent border-primary/20 shadow-md shadow-primary/5"
            )}>
                {/* Visual Accent */}
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={clsx(
                        "p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center",
                        level === 0 ? "bg-primary text-white shadow-lg shadow-primary/30" :
                            hasChildren ? "bg-primary/10 text-primary" : "bg-default-100 text-default-600",
                        "group-hover:scale-110"
                    )}>
                        {icon}
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className={clsx(
                            "font-semibold text-default-800 truncate transition-colors",
                            level === 0 ? "text-lg" : "text-base",
                            "group-hover:text-primary transition-colors"
                        )}>
                            {node.name}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-default-400">
                                {level === 0 ? 'Main Category' : `Sub Category`}
                            </span>
                            {hasChildren && (
                                <span className="w-1 h-1 rounded-full bg-default-300" />
                            )}
                            <span className="text-xs text-default-400">
                                {hasChildren ? `${node.children.length} types` : 'Type'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-300">
                    <Button size="sm" isIconOnly variant="flat" color="primary" onPress={() => onAddSub(node.id)} className="rounded-lg">
                        <PlusIcon size={16} />
                    </Button>
                    <Button size="sm" isIconOnly variant="flat" color="warning" onPress={() => onEdit(node)} className="rounded-lg">
                        <PencilIcon size={16} />
                    </Button>
                    <Button size="sm" isIconOnly variant="flat" color="danger" onPress={() => onDelete(node.id)} className="rounded-lg">
                        <TrashIcon size={16} />
                    </Button>
                    {hasChildren && (
                        <Button size="sm" isIconOnly variant="light" onClick={toggleOpen} className="rounded-lg ml-1">
                            <motion.div
                                animate={{ rotate: isOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronRight size={16} />
                            </motion.div>
                        </Button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden ml-10 relative"
                    >
                        {/* Vertical line through children */}
                        <div className="absolute left-[-24px] top-[-8px] bottom-6 w-0.5 bg-primary/20" />

                        {node.children.map((child: any, index: number) => (
                            <CategoryTreeNode
                                key={child.id}
                                node={child}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onAddSub={onAddSub}
                                level={level + 1}
                                isLast={index === node.children.length - 1}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ExpenseCategoryPage() {
    const dispatch = useDispatch();
    const { expenseCategories, loading, error, success } = useSelector(
        (state: RootState) => state.ExpenseCategory
    );

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onOpenChange: onDeleteOpenChange,
        onClose: onDeleteClose
    } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showParentSelect, setShowParentSelect] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent_id: "",
    });

    useEffect(() => {
        dispatch(getExpenseCategoriesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onClose();
            onDeleteClose();
            dispatch(clearExpenseCategoryDetails());
        }
    }, [success, onClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setFormData({ name: "", description: "", parent_id: "" });
        setShowParentSelect(false);
        onOpen();
    };

    const handleAddSub = (parentId: string) => {
        setMode("create");
        setFormData({ name: "", description: "", parent_id: parentId });
        setShowParentSelect(false);
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
        setShowParentSelect(true);
        onOpen();
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteExpenseCategoryRequest(deleteId));
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
            dispatch(createExpenseCategoryRequest(payload));
        } else {
            const payload = {
                name: formData.name,
                description: formData.description,
                parent_id: parentId,
            };
            dispatch(updateExpenseCategoryRequest(selectedCategory.id, payload));
        }
    };

    const treeData = React.useMemo(() => buildTree(expenseCategories || []), [expenseCategories]);

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-default-900">Expense Categories</h1>
                    <p className="text-default-500 text-sm">Organize and manage your expense tracking hierarchy.</p>
                </div>
                <Button
                    color="primary"
                    size="md"
                    variant="shadow"
                    startContent={<PlusIcon size={18} />}
                    onPress={handleCreate}
                    className="font-semibold px-6"
                >
                    Category
                </Button>
            </div>

            <div className="relative p-0 pt-4">
                {!loading && treeData.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                        <div className="p-4 bg-default-100 rounded-2xl mb-4 text-default-400">
                            <Tag size={48} />
                        </div>
                        <h3 className="text-lg font-semibold text-default-900">No Categories Found</h3>
                        <p className="text-default-500 max-w-xs">Start by creating your first root category to build your expense tracking tree.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {treeData.map((node: any, index: number) => (
                        <CategoryTreeNode
                            key={node.id}
                            node={node}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAddSub={handleAddSub}
                            level={0}
                            isLast={index === treeData.length - 1}
                        />
                    ))}
                </div>
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
                                {showParentSelect && (
                                    <Select
                                        label="Parent Category"
                                        placeholder="Select a parent (optional)"
                                        selectedKeys={formData.parent_id ? [formData.parent_id] : []}
                                        onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                    >
                                        {[
                                            { id: "", name: "None (Root)" },
                                            ...(expenseCategories || []).filter((cat: any) => cat.id !== selectedCategory?.id)
                                        ].map((cat: any) => (
                                            <SelectItem key={cat.id || "root"} textValue={cat.name}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                                    {mode === "create" ? "Create" : "Update"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} size="sm">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirm Delete</ModalHeader>
                            <ModalBody>
                                <p className="text-default-600">
                                    Are you sure you want to delete this category? This action cannot be undone.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="danger" variant="shadow" onPress={confirmDelete} isLoading={loading}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
