import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getDepartmentsRequest } from "@/store/department/action";
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
    const dispatch = useDispatch();
    const { departments } = useSelector((state: RootState) => state.Department);

    const [newDoc, setNewDoc] = useState("");
    const [isExperience, setIsExperience] = useState(false);
    const initialAddress = {
        door_no: "",
        care_of_type: "S/o",
        care_of_name: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
    };

    const [formData, setFormData] = useState({
        employee_name: "",
        email: "",
        mobile: "",
        department: "",
        role: "",
        address: { ...initialAddress },
        residential_address: { ...initialAddress },
        expires_in_hours: 48,
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
        department: "",
        role: "",
        address: "",
        residential_address: "",
    });

    const [copied, setCopied] = useState(false);
    const [showLink, setShowLink] = useState(false);
    const [isSameAddress, setIsSameAddress] = useState(false);

    // Compute root departments
    const rootDepartments = useMemo(() => {
        return (departments || []).filter((dept: any) => !dept.parent_id);
    }, [departments]);

    // Compute designation options (descendants of selected root department)
    const designationOptions = useMemo(() => {
        if (!formData.department) return [];
        const selectedRoot = rootDepartments.find((d: any) => d.name === formData.department);
        if (!selectedRoot) return [];

        const descendants: any[] = [];
        const traverse = (parentId: any, level: number) => {
            const children = (departments || []).filter((d: any) => d.parent_id === parentId);
            children.forEach((child: any) => {
                descendants.push({
                    ...child,
                    displayName: level > 0 ? `${".".repeat(level * 4)} ${child.name}` : child.name
                });
                traverse(child.id, level + 1);
            });
        };
        traverse(selectedRoot.id, 0);
        return descendants;
    }, [formData.department, rootDepartments, departments]);

    useEffect(() => {
        if (isOpen) {
            dispatch(getDepartmentsRequest());
        } else {
            // Reset form when drawer closes
            setTimeout(() => {
                setFormData({
                    employee_name: "",
                    email: "",
                    mobile: "",
                    department: "",
                    role: "",
                    address: { ...initialAddress },
                    residential_address: { ...initialAddress },
                    expires_in_hours: 48,
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
                    department: "",
                    role: "",
                    address: "",
                    residential_address: "",
                });
                setShowLink(false);
                setCopied(false);
                setIsSameAddress(false);
                setIsExperience(false);
            }, 300); // Delay to avoid visual glitch during close animation
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (isSameAddress) {
            setFormData((prev) => ({
                ...prev,
                residential_address: prev.address,
            }));
            if (errors.residential_address) {
                setErrors((prev) => ({ ...prev, residential_address: "" }));
            }
        }
    }, [isSameAddress, formData.address, errors.residential_address]);

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

    const handleAddressChange = (name: 'address' | 'residential_address', field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...(prev[name] as any),
                [field]: value
            }
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {
            employee_name: "",
            email: "",
            mobile: "",
            department: "",
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
        if (!formData.department.trim()) {
            newErrors.department = "Department is required";
        }
        if (!formData.role.trim()) {
            newErrors.role = "Role is required";
        }

        // Basic address validation: require at least one of Building, Street, or City
        const isAddressEmpty = (addr: any) => {
            return !addr.door_no.trim() && !addr.street.trim() && !addr.city.trim();
        };

        if (isAddressEmpty(formData.address)) {
            newErrors.address = "Address details are required";
        }
        if (!isSameAddress && isAddressEmpty(formData.residential_address)) {
            newErrors.residential_address = "Residential address details are required";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== "");
    };

    const handleSubmit = () => {
        if (validate()) {
            const formatAddress = (addr: any) => {
                const parts = [];
                if (addr.door_no) parts.push(addr.door_no);
                
                const careOf = addr.care_of_name ? `${addr.care_of_type} ${addr.care_of_name}` : "";
                if (careOf) parts.push(careOf);
                
                if (addr.street) parts.push(addr.street);
                if (addr.city) parts.push(addr.city);
                if (addr.state) {
                    if (addr.pincode) {
                        parts.push(`${addr.state} - ${addr.pincode}`);
                    } else {
                        parts.push(addr.state);
                    }
                } else if (addr.pincode) {
                    parts.push(addr.pincode);
                }
                return parts.join(", ");
            };

            const { department, address, residential_address, ...rest } = formData as any;
            onSubmit({
                ...rest,
                address: formatAddress(address),
                residential_address: formatAddress(residential_address),
            });
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
        <Drawer 
            isOpen={isOpen} 
            onOpenChange={onOpenChange} 
            size="md"
            isDismissable={false}
        >
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
                                        isInvalid={!!errors.mobile}
                                        errorMessage={errors.mobile}
                                    />
                                    <Select
                                        label="Department"
                                        placeholder="Select Department"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        selectedKeys={formData.department ? [formData.department] : []}
                                        onChange={(e) => {
                                            handleChange("department", e.target.value);
                                            handleChange("role", ""); // Reset role when department changes
                                        }}
                                        isRequired
                                        isInvalid={!!errors.department}
                                        errorMessage={errors.department}
                                    >
                                        {rootDepartments.map((dept: any) => (
                                            <SelectItem key={dept.name} textValue={dept.name}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="Role"
                                        placeholder="Select Role/Designation"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        selectedKeys={formData.role ? [formData.role] : []}
                                        onChange={(e) => handleChange("role", e.target.value)}
                                        isRequired
                                        isInvalid={!!errors.role}
                                        errorMessage={errors.role}
                                        isDisabled={!formData.department || designationOptions.length === 0}
                                    >
                                        {designationOptions.map((desig: any) => (
                                            <SelectItem key={desig.name} textValue={desig.name}>
                                                {desig.displayName}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold mb-1">
                                            <MapPin size={18} />
                                            <span className="text-sm">Office / Permanent Address</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Building / Door No"
                                                placeholder="e.g. 42B, Tower 1"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.address.door_no}
                                                onChange={(e) => handleAddressChange("address", "door_no", e.target.value)}
                                            />
                                            <div className="flex flex-col">
                                                <div className="flex items-end">
                                                    <Select
                                                        label="S/o, D/o, W/o Name"
                                                        labelPlacement="outside"
                                                        placeholder="S/o"
                                                        variant="bordered"
                                                        className="w-24"
                                                        classNames={{
                                                            trigger: "rounded-r-none border-r-0 h-[40px] shadow-none",
                                                            label: "text-small font-medium text-foreground whitespace-nowrap",
                                                        }}
                                                        selectedKeys={[formData.address.care_of_type]}
                                                        onChange={(e) => handleAddressChange("address", "care_of_type", e.target.value)}
                                                    >
                                                        <SelectItem key="S/o" textValue="S/o">S/o</SelectItem>
                                                        <SelectItem key="D/o" textValue="D/o">D/o</SelectItem>
                                                        <SelectItem key="W/o" textValue="W/o">W/o</SelectItem>
                                                        <SelectItem key="C/o" textValue="C/o">C/o</SelectItem>
                                                    </Select>
                                                    <Input
                                                        placeholder="Father/Guardian Name"
                                                        variant="bordered"
                                                        className="flex-1"
                                                        classNames={{
                                                            inputWrapper: "rounded-l-none h-[40px] shadow-none",
                                                        }}
                                                        value={formData.address.care_of_name}
                                                        onChange={(e) => handleAddressChange("address", "care_of_name", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Input
                                            label="Street / Area / Colony"
                                            placeholder="Enter street and locality"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            value={formData.address.street}
                                            onChange={(e) => handleAddressChange("address", "street", e.target.value)}
                                        />
                                        <div className="grid grid-cols-3 gap-4">
                                            <Input
                                                label="City"
                                                placeholder="City"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.address.city}
                                                onChange={(e) => handleAddressChange("address", "city", e.target.value)}
                                            />
                                            <Input
                                                label="State"
                                                placeholder="State"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.address.state}
                                                onChange={(e) => handleAddressChange("address", "state", e.target.value)}
                                            />
                                            <Input
                                                label="Pincode"
                                                placeholder="Pincode"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.address.pincode}
                                                onChange={(e) => handleAddressChange("address", "pincode", e.target.value)}
                                            />
                                        </div>
                                        {errors.address && (
                                            <p className="text-tiny text-danger mt-1 font-medium">{errors.address}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            size="sm"
                                            isSelected={isSameAddress}
                                            onValueChange={(isSelected) => {
                                                setIsSameAddress(isSelected);
                                                if (isSelected) {
                                                    setFormData(prev => ({ ...prev, residential_address: prev.address }));
                                                }
                                            }}
                                        >
                                            Same as Address
                                        </Checkbox>
                                    </div>
                                    <div className={`flex flex-col gap-4 transition-opacity ${isSameAddress ? "opacity-50 pointer-events-none" : ""}`}>
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold mb-1">
                                            <MapPin size={18} />
                                            <span className="text-sm">Residential Address</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Building / Door No"
                                                placeholder="e.g. 42B, Tower 1"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.residential_address.door_no}
                                                onChange={(e) => handleAddressChange("residential_address", "door_no", e.target.value)}
                                                isDisabled={isSameAddress}
                                            />
                                            <div className="flex flex-col">
                                                <div className="flex items-end">
                                                    <Select
                                                        label="S/o, D/o, W/o Name"
                                                        labelPlacement="outside"
                                                        placeholder="S/o"
                                                        variant="bordered"
                                                        className="w-24"
                                                        classNames={{
                                                            trigger: "rounded-r-none border-r-0 h-[40px] shadow-none",
                                                            label: "text-small font-medium text-foreground whitespace-nowrap",
                                                        }}
                                                        selectedKeys={[formData.residential_address.care_of_type]}
                                                        onChange={(e) => handleAddressChange("residential_address", "care_of_type", e.target.value)}
                                                        isDisabled={isSameAddress}
                                                    >
                                                        <SelectItem key="S/o" textValue="S/o">S/o</SelectItem>
                                                        <SelectItem key="D/o" textValue="D/o">D/o</SelectItem>
                                                        <SelectItem key="W/o" textValue="W/o">W/o</SelectItem>
                                                        <SelectItem key="C/o" textValue="C/o">C/o</SelectItem>
                                                    </Select>
                                                    <Input
                                                        placeholder="Father/Guardian Name"
                                                        variant="bordered"
                                                        className="flex-1"
                                                        classNames={{
                                                            inputWrapper: "rounded-l-none h-[40px] shadow-none",
                                                        }}
                                                        value={formData.residential_address.care_of_name}
                                                        onChange={(e) => handleAddressChange("residential_address", "care_of_name", e.target.value)}
                                                        isDisabled={isSameAddress}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Input
                                            label="Street / Area / Colony"
                                            placeholder="Enter street and locality"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            value={formData.residential_address.street}
                                            onChange={(e) => handleAddressChange("residential_address", "street", e.target.value)}
                                            isDisabled={isSameAddress}
                                        />
                                        <div className="grid grid-cols-3 gap-4">
                                            <Input
                                                label="City"
                                                placeholder="City"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.residential_address.city}
                                                onChange={(e) => handleAddressChange("residential_address", "city", e.target.value)}
                                                isDisabled={isSameAddress}
                                            />
                                            <Input
                                                label="State"
                                                placeholder="State"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.residential_address.state}
                                                onChange={(e) => handleAddressChange("residential_address", "state", e.target.value)}
                                                isDisabled={isSameAddress}
                                            />
                                            <Input
                                                label="Pincode"
                                                placeholder="Pincode"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.residential_address.pincode}
                                                onChange={(e) => handleAddressChange("residential_address", "pincode", e.target.value)}
                                                isDisabled={isSameAddress}
                                            />
                                        </div>
                                        {errors.residential_address && (
                                            <p className="text-tiny text-danger mt-1 font-medium">{errors.residential_address}</p>
                                        )}
                                    </div>

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
                                        <SelectItem key="48">2 Days</SelectItem>
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
