"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getDepartmentsRequest,
    createDepartmentRequest,
    updateDepartmentRequest,
    deleteDepartmentRequest,
    clearDepartmentDetails,
} from "@/store/department/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { PlusIcon, PencilIcon, TrashIcon, ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

// Helper to build tree structure
const buildTree = (departments: any[]) => {
    const map = new Map();
    const roots: any[] = [];

    // Initialize map
    departments.forEach(dept => {
        map.set(dept.id, { ...dept, children: [] });
    });

    // Build hierarchy
    departments.forEach(dept => {
        const node = map.get(dept.id);
        if (dept.parent_id && map.has(dept.parent_id)) {
            map.get(dept.parent_id).children.push(node);
        } else {
            roots.push(node); // No parent or parent not found -> root
        }
    });

    return roots;
};

// Recursive Tree Node Component
const DepartmentTreeNode = ({ node, onEdit, onDelete, onAddSub }: { node: any, onEdit: (d: any) => void, onDelete: (id: string) => void, onAddSub: (id: string) => void }) => {
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

                <div className="text-primary">
                    {isOpen ? <FolderOpen size={20} /> : <Folder size={20} />}
                </div>

                <span className="font-medium text-default-700 flex-1">{node.name}</span>

                {/* Actions - visible on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" isIconOnly variant="light" color="primary" onPress={() => onAddSub(node.id)} title="Add Sub-department">
                        <PlusIcon size={16} />
                    </Button>
                    <Button size="sm" isIconOnly variant="light" color="warning" onPress={() => onEdit(node)} title="Edit">
                        <PencilIcon size={16} />
                    </Button>
                    <Button size="sm" isIconOnly variant="light" color="danger" onPress={() => onDelete(node.id)} title="Delete">
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
                            <DepartmentTreeNode
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

export default function DepartmentPage() {
    const dispatch = useDispatch();
    const { departments, loading, error, success } = useSelector(
        (state: RootState) => state.Department
    );

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        parent_id: "",
    });

    useEffect(() => {
        dispatch(getDepartmentsRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onClose();
            dispatch(clearDepartmentDetails());
        }
    }, [success, onClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setFormData({ name: "", parent_id: "" });
        onOpen();
    };

    const handleAddSub = (parentId: string) => {
        setMode("create");
        setFormData({ name: "", parent_id: parentId });
        onOpen();
    };

    const handleEdit = (department: any) => {
        setMode("edit");
        setSelectedDepartment(department);
        setFormData({
            name: department.name,
            parent_id: department.parent_id || "",
        });
        onOpen();
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this department?")) {
            dispatch(deleteDepartmentRequest(id));
        }
    };

    const handleSubmit = () => {
        const parentId = formData.parent_id ? formData.parent_id : null;

        if (mode === "create") {
            const payload = {
                name: formData.name,
                parent_id: parentId,
            };
            dispatch(createDepartmentRequest(payload));
        } else {
            const payload = {
                name: formData.name,
                parent_id: parentId,
            };
            dispatch(updateDepartmentRequest(selectedDepartment.id, payload));
        }
    };

    const treeData = React.useMemo(() => buildTree(departments || []), [departments]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Departments</h1>
                <Button color="primary" endContent={<PlusIcon size={16} />} onPress={handleCreate}>
                    Add Root Department
                </Button>
            </div>

            <div className="bg-default-50 rounded-xl p-4 min-h-[400px]">
                {!loading && treeData.length === 0 && <p className="text-default-500">No departments found.</p>}

                {treeData.map((node: any) => (
                    <DepartmentTreeNode
                        key={node.id}
                        node={node}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddSub={handleAddSub}
                    />
                ))}
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {mode === "create" ? "Add Department" : "Edit Department"}
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Name"
                                    placeholder="Enter department name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <Select
                                    label="Parent Department"
                                    placeholder="Select a parent (optional)"
                                    selectedKeys={formData.parent_id ? [formData.parent_id] : []}
                                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                >
                                    {[
                                        { id: "", name: "None (Root)" },
                                        ...(departments || []).filter((d: any) => d.id !== selectedDepartment?.id)
                                    ].map((dept: any) => (
                                        <SelectItem key={dept.id || "root"} textValue={dept.name}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </Select>
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
        </div>
    );
}
