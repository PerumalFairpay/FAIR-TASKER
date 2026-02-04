import React, { useState, useEffect } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { User, Briefcase, MapPin, Copy, CheckCircle2 } from "lucide-react";
import { addToast } from "@heroui/toast";

interface GenerateNDADrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    generatedLink: string | null;
    loading: boolean;
    onSubmit: (data: { employee_name: string; role: string; address: string }) => void;
}

export default function GenerateNDADrawer({
    isOpen,
    onOpenChange,
    loading,
    onSubmit,
    generatedLink,
}: GenerateNDADrawerProps) {
    const [formData, setFormData] = useState({
        employee_name: "",
        role: "",
        address: "",
    });

    const [errors, setErrors] = useState({
        employee_name: "",
        role: "",
        address: "",
    });

    const [copied, setCopied] = useState(false);
    const [showLink, setShowLink] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Reset form when drawer closes
            setTimeout(() => {
                setFormData({
                    employee_name: "",
                    role: "",
                    address: "",
                });
                setErrors({
                    employee_name: "",
                    role: "",
                    address: "",
                });
                setShowLink(false);
                setCopied(false);
            }, 300); // Delay to avoid visual glitch during close animation
        }
    }, [isOpen]);

    useEffect(() => {
        if (generatedLink) {
            setShowLink(true);
        }
    }, [generatedLink]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {
            employee_name: "",
            role: "",
            address: "",
        };

        if (!formData.employee_name.trim()) {
            newErrors.employee_name = "Employee name is required";
        }
        if (!formData.role.trim()) {
            newErrors.role = "Role is required";
        }
        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== "");
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleCopyLink = () => {
        if (generatedLink) {
            const fullLink = `${window.location.origin}${generatedLink}`;
            navigator.clipboard.writeText(fullLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            addToast({
                title: "Copied!",
                description: "Link copied to clipboard",
                color: "success",
            });
        }
    };

    const handleClose = () => {
        setShowLink(false);
        onOpenChange(false);
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {showLink ? "NDA Link Generated" : "Generate NDA Link"}
                        </DrawerHeader>
                        <DrawerBody className="py-4">
                            {showLink ? (
                                <div className="space-y-4">
                                    <div className="bg-success-50 dark:bg-success-950/30 p-4 rounded-lg border border-success-200 dark:border-success-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="text-success-600" size={20} />
                                            <h3 className="font-semibold text-success-700 dark:text-success-400">
                                                Link Generated Successfully!
                                            </h3>
                                        </div>
                                        <p className="text-sm text-success-600 dark:text-success-300">
                                            Share this link with the employee. It will expire in 1 hour.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                            Generated Link
                                        </label>
                                        <div className="bg-default-100 p-3 rounded-lg flex items-center justify-between gap-2">
                                            <code className="text-sm flex-1 overflow-x-auto break-all">
                                                {generatedLink &&
                                                    `${window.location.origin}${generatedLink}`}
                                            </code>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={handleCopyLink}
                                                color={copied ? "success" : "default"}
                                            >
                                                {copied ? (
                                                    <CheckCircle2 size={18} />
                                                ) : (
                                                    <Copy size={18} />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            <strong>Tip:</strong> You can send this link via email or any
                                            messaging platform. The employee doesn't need to be logged in.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Input
                                        label="Employee Name"
                                        placeholder="Enter employee full name"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.employee_name}
                                        onChange={(e) =>
                                            handleChange("employee_name", e.target.value)
                                        }
                                        isRequired
                                        isInvalid={!!errors.employee_name}
                                        errorMessage={errors.employee_name}
                                        startContent={
                                            <User className="text-default-400" size={18} />
                                        }
                                    />
                                    <Input
                                        label="Role"
                                        placeholder="Enter employee role/designation"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.role}
                                        onChange={(e) => handleChange("role", e.target.value)}
                                        isRequired
                                        isInvalid={!!errors.role}
                                        errorMessage={errors.role}
                                        startContent={
                                            <Briefcase className="text-default-400" size={18} />
                                        }
                                    />
                                    <Textarea
                                        label="Address"
                                        placeholder="Enter employee address"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                        isRequired
                                        isInvalid={!!errors.address}
                                        errorMessage={errors.address}
                                        minRows={3}
                                        startContent={
                                            <MapPin className="text-default-400 mt-2" size={18} />
                                        }
                                    />
                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            <strong>Note:</strong> The generated link will be valid for 1
                                            hour. Share it with the employee to complete the NDA form.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </DrawerBody>
                        <DrawerFooter>
                            {showLink ? (
                                <Button color="primary" onPress={handleClose} fullWidth>
                                    Done
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={handleSubmit}
                                        isLoading={loading}
                                        fullWidth
                                    >
                                        Generate Link
                                    </Button>
                                </>
                            )}
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
