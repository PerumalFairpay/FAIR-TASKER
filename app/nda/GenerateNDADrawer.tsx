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
import { User, Briefcase, MapPin, Copy, CheckCircle2, Clock } from "lucide-react";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";

interface GenerateNDADrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    generatedLink: string | null;
    loading: boolean;
    onSubmit: (data: {
        employee_name: string;
        role: string;
        address: string;
        residential_address: string;
        expires_in_hours: number;
        required_documents: string[];
    }) => void;
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
        residential_address: "",
        expires_in_hours: 1,
        required_documents: [
            "10th Marksheet",
            "12th Marksheet",
            "TC",
            "Degree Certificate",
            "Cumulative Certificate",
            "Adhar",
            "PAN Card"
        ],
    });

    const [errors, setErrors] = useState({
        employee_name: "",
        role: "",
        address: "",
        residential_address: "",
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
                    residential_address: "",
                    expires_in_hours: 1,
                    required_documents: [
                        "10th Marksheet",
                        "12th Marksheet",
                        "TC",
                        "Degree Certificate",
                        "Cumulative Certificate",
                        "Adhar",
                        "PAN Card"
                    ],
                });
                setErrors({
                    employee_name: "",
                    role: "",
                    address: "",
                    residential_address: "",
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

    const handleChange = (name: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (name !== 'expires_in_hours' && errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {
            employee_name: "",
            role: "",
            address: "",
            residential_address: "",
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
        if (!formData.residential_address.trim()) {
            newErrors.residential_address = "Residential Address is required";
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

    const handleAddDocument = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val && !formData.required_documents.includes(val)) {
                setFormData(prev => ({
                    ...prev,
                    required_documents: [...prev.required_documents, val]
                }));
                e.currentTarget.value = '';
            }
        }
    };

    const handleRemoveDocument = (docToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            required_documents: prev.required_documents.filter(doc => doc !== docToRemove)
        }));
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {showLink ? "NDA Link Generated" : "Generate NDA Link"}
                        </DrawerHeader>
                        <DrawerBody className="py-6">
                            {showLink ? (
                                <div className="flex flex-col gap-6">
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
                                <div className="flex flex-col gap-6">
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
                                    />
                                    <Textarea
                                        label="Residential Address"
                                        placeholder="Enter employee address"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.residential_address}
                                        onChange={(e) => handleChange("residential_address", e.target.value)}
                                        isRequired
                                        isInvalid={!!errors.residential_address}
                                        errorMessage={errors.residential_address}
                                        minRows={3}
                                    />

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Required Documents</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.required_documents.map((doc, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-1 bg-default-100 hover:bg-default-200 text-default-700 px-3 py-1 rounded-full text-sm transition-colors border border-default-200"
                                                >
                                                    <span>{doc}</span>
                                                    <button
                                                        onClick={() => handleRemoveDocument(doc)}
                                                        className="ml-1 text-default-400 hover:text-danger focus:outline-none"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <Input
                                            placeholder="Type document name and press Enter to add"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            onKeyDown={handleAddDocument}
                                            description="Press Enter to add a document"
                                            endContent={<span className="text-default-400 text-xs">↵</span>}
                                        />
                                    </div>

                                    <Select
                                        label="Expiry Time"
                                        placeholder="Select expiry time"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        selectedKeys={[formData.expires_in_hours.toString()]}
                                        onChange={(e) => handleChange("expires_in_hours", Number(e.target.value))}
                                    >
                                        <SelectItem key="1">1 Hour</SelectItem>
                                        <SelectItem key="24">24 Hours</SelectItem>
                                        <SelectItem key="48">48 Hours</SelectItem>
                                        <SelectItem key="168">7 Days</SelectItem>
                                    </Select>
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
