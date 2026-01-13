import React, { useMemo } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface AddEditRoleDrawerProps {
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

export default function AddEditRoleDrawer({
    isOpen,
    onOpenChange,
    mode,
    formData,
    setFormData,
    loading,
    onSubmit,
}: AddEditRoleDrawerProps) {
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
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Role" : "Edit Role"}
                        </DrawerHeader>
                        <DrawerBody className="py-6">
                            <div className="flex flex-col gap-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold mb-4 text-default-700">Name</label>
                                    <Input
                                        // label="Name"
                                        // labelPlacement="outside"
                                        placeholder="Enter role name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        variant="bordered"
                                        isRequired
                                    />
                                    <label className="text-sm font-semibold mb-4 text-default-700">Description</label>
                                    <Input
                                        // label="Description"
                                        // labelPlacement="outside"
                                        placeholder="Enter description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        variant="bordered"
                                    />
                                </div>

                                <div className="mt-2">
                                    <p className="text-sm font-semibold mb-4 text-default-700">Permissions</p>
                                    <div className="flex flex-col gap-8">
                                        {Object.entries(groupedPermissions).map(([module, perms]) => (
                                            <div key={module} className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-px bg-default-200 flex-1"></span>
                                                    <p className="text-[10px] font-bold text-default-400 uppercase tracking-wider">{module}</p>
                                                    <span className="h-px bg-default-200 flex-1"></span>
                                                </div>
                                                <CheckboxGroup
                                                    orientation="vertical"
                                                    value={formData.permissions}
                                                    onValueChange={handleCheckboxChange}
                                                    className="gap-4 pl-2"
                                                >
                                                    {perms.map((perm) => (
                                                        <Checkbox
                                                            key={perm.id}
                                                            value={perm.id}
                                                            classNames={{
                                                                label: "w-full"
                                                            }}
                                                        >
                                                            <div className="flex flex-col leading-tight">
                                                                <span className="text-sm font-medium text-default-700">{perm.name}</span>
                                                                <span className="text-tiny text-default-400 font-mono">{perm.slug}</span>
                                                            </div>
                                                        </Checkbox>
                                                    ))}
                                                </CheckboxGroup>
                                            </div>
                                        ))}
                                        {allPermissions.length === 0 && (
                                            <div className="text-center py-8 bg-default-50 rounded-xl border-2 border-dashed border-default-200">
                                                <p className="text-sm text-default-400 italic">No permissions available.</p>
                                                <p className="text-tiny text-default-300">Please create permissions in the settings first.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DrawerBody>
                        <DrawerFooter className="">
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={onSubmit} isLoading={loading}>
                                {mode === "create" ? "Create Role" : "Update Role"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
