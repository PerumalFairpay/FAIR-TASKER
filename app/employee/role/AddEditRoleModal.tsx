import React, { useMemo } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface AddEditRoleModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    formData: {
        name: string;
        description: string;
        permissions: string[]; // IDs
    };
    setFormData: (data: any) => void;
    loading: boolean;
    onSubmit: () => void;
}

export default function AddEditRoleModal({
    isOpen,
    onOpenChange,
    mode,
    formData,
    setFormData,
    loading,
    onSubmit,
}: AddEditRoleModalProps) {
    const { permissions: allPermissions } = useSelector((state: RootState) => state.Permission);

    // Group permissions by module
    const groupedPermissions = useMemo(() => {
        const groups: { [key: string]: any[] } = {};
        allPermissions.forEach((perm: any) => {
            const module = perm.module || "Other";
            if (!groups[module]) {
                groups[module] = [];
            }
            groups[module].push(perm);
        });
        return groups;
    }, [allPermissions]);

    const handleCheckboxChange = (values: string[]) => {
        setFormData({ ...formData, permissions: values });
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Role" : "Edit Role"}
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="Name"
                                    placeholder="Enter role name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                                <Input
                                    label="Description"
                                    placeholder="Enter description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />

                                <div className="mt-2">
                                    <p className="text-sm font-semibold mb-2">Permissions</p>
                                    <div className="flex flex-col gap-6">
                                        {Object.entries(groupedPermissions).map(([module, perms]) => (
                                            <div key={module} className="flex flex-col gap-2">
                                                <p className="text-xs font-bold text-gray-500 uppercase">{module}</p>
                                                <CheckboxGroup
                                                    orientation="horizontal"
                                                    value={formData.permissions}
                                                    onValueChange={handleCheckboxChange}
                                                    className="gap-4"
                                                >
                                                    {perms.map((perm) => (
                                                        <Checkbox key={perm.id} value={perm.id}>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">{perm.name}</span>
                                                                <span className="text-tiny text-gray-400">{perm.slug}</span>
                                                            </div>
                                                        </Checkbox>
                                                    ))}
                                                </CheckboxGroup>
                                            </div>
                                        ))}
                                        {allPermissions.length === 0 && (
                                            <p className="text-sm text-gray-400 italic">No permissions available. Please create permissions first.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={onSubmit} isLoading={loading}>
                                {mode === "create" ? "Create" : "Update"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
