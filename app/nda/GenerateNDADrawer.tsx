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
import { User, Briefcase, MapPin, Copy, CheckCircle2, Clock, Plus, X } from "lucide-react";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { addToast } from "@heroui/toast";

interface GenerateNDADrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    generatedLink: string | null;
    loading: boolean;
    onSubmit: (data: {
        employee_name: string;
        email: string;
        mobile: string;
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
    const [newDoc, setNewDoc] = useState("");
    const [isExperience, setIsExperience] = useState(false);
    const [formData, setFormData] = useState({
        employee_name: "",
        email: "",
        mobile: "",
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
        email: "",
        mobile: "",
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
                    email: "",
                    mobile: "",
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
                    email: "",
                    mobile: "",
                    role: "",
                    address: "",
                    residential_address: "",
                });
                setShowLink(false);
                setCopied(false);
                setIsExperience(false);
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
            email: "",
            mobile: "",
            role: "",
            address: "",
            residential_address: "",
        };

        if (!formData.employee_name.trim()) {
            newErrors.employee_name = "Employee name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.mobile.trim()) {
            newErrors.mobile = "Mobile number is required";
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

    const handleAddDocument = () => {
        const val = newDoc.trim();
        if (val && !formData.required_documents.includes(val)) {
            setFormData(prev => ({
                ...prev,
                required_documents: [...prev.required_documents, val]
            }));
            setNewDoc("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddDocument();
        }
    }

    const handleRemoveDocument = (docToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            required_documents: prev.required_documents.filter(doc => doc !== docToRemove)
        }));
    };

    const experienceDocs = [
        "last 3months salary slips",
        "experience certificate",
        "relieving letter"
    ];

    const handleExperienceToggle = (checked: boolean) => {
        setIsExperience(checked);
        if (checked) {
            setFormData(prev => ({
                ...prev,
                required_documents: Array.from(new Set([...prev.required_documents, ...experienceDocs]))
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                required_documents: prev.required_documents.filter(doc => !experienceDocs.includes(doc))
            }));
        }
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
                                        label="Email"
                                        type="email"
                                        placeholder="Enter employee email"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        isRequired
                                        isInvalid={!!errors.email}
                                        errorMessage={errors.email}
                                    />
                                    <Input
                                        label="Mobile"
                                        placeholder="Enter employee mobile number"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.mobile}
                                        onChange={(e) => handleChange("mobile", e.target.value)}
                                        isRequired
                                        isInvalid={!!errors.mobile}
                                        errorMessage={errors.mobile}
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

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <label className="text-sm font-medium text-foreground">Required Documents</label>
                                            <span className="text-tiny text-default-400">{formData.required_documents.length} selected</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Type document name"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={newDoc}
                                                onValueChange={setNewDoc}
                                                onKeyDown={handleKeyDown}
                                                className="flex-1"
                                                // size="sm"
                                            />
                                            <Button isIconOnly color="primary" variant="flat" onPress={handleAddDocument}>
                                                <Plus size={18} />
                                            </Button>
                                        </div>

                                        <Checkbox
                                            isSelected={isExperience}
                                            onValueChange={handleExperienceToggle}
                                            size="sm"
                                            classNames={{
                                                label: "text-small text-default-500"
                                            }}
                                            className="mb-2"
                                        >
                                            Experience
                                        </Checkbox>

                                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-default-50 rounded-lg border border-dashed border-default-200">
                                            {formData.required_documents.length > 0 ? (
                                                formData.required_documents.map((doc, index) => (
                                                    <div
                                                        key={index}
                                                        className="group flex items-center gap-1.5 bg-background border border-default-200 pl-3 pr-1.5 py-1 rounded-full text-small shadow-sm transition-all hover:border-default-300 hover:shadow-md"
                                                    >
                                                        <span className="font-medium text-foreground-600">{doc}</span>
                                                        <button
                                                            onClick={() => handleRemoveDocument(doc)}
                                                            className="text-default-400 hover:text-danger hover:bg-danger/10 p-0.5 rounded-full transition-colors"
                                                            title="Remove"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-tiny text-default-400 italic">
                                                    No documents required. Add one above.
                                                </div>
                                            )}
                                        </div>
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
