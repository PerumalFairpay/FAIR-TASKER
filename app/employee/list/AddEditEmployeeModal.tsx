import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getRolesRequest } from "@/store/role/action";
import { getDepartmentsRequest } from "@/store/department/action";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

// Helper to build hierarchy for dropdown
const buildDropdownOptions = (departments: any[]) => {
    if (!departments) return [];

    const map = new Map();
    const roots: any[] = [];

    // Create nodes
    departments.forEach(dept => {
        map.set(dept.id, { ...dept, children: [] });
    });

    // Build tree
    departments.forEach(dept => {
        const node = map.get(dept.id);
        if (dept.parent_id && map.has(dept.parent_id)) {
            map.get(dept.parent_id).children.push(node);
        } else {
            roots.push(node);
        }
    });

    const options: any[] = [];

    // Flatten with level
    const traverse = (nodes: any[], level: number) => {
        nodes.forEach(node => {
            options.push({
                ...node,
                // Add prefix based on level for visual hierarchy
                displayName: level > 0 ? `${".".repeat(level * 4)} ${node.name}` : node.name
            });
            if (node.children.length > 0) {
                traverse(node.children, level + 1);
            }
        });
    };

    traverse(roots, 0);
    return options;
};

interface AddEditEmployeeModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    selectedEmployee?: any;
    loading: boolean;
    onSubmit: (formData: FormData) => void;
}

export default function AddEditEmployeeModal({
    isOpen,
    onOpenChange,
    mode,
    selectedEmployee,
    loading,
    onSubmit,
}: AddEditEmployeeModalProps) {
    const dispatch = useDispatch();
    const { roles } = useSelector((state: RootState) => state.Role);
    const { departments } = useSelector((state: RootState) => state.Department);

    // Compute formatted departments with hierarchy
    const departmentOptions = useMemo(() => buildDropdownOptions(departments || []), [departments]);

    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<{ profile_picture?: File; document_proof?: File }>({});

    useEffect(() => {
        if (isOpen) {
            dispatch(getRolesRequest());
            dispatch(getDepartmentsRequest());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (isOpen && mode === "edit" && selectedEmployee) {
            setFormData({ ...selectedEmployee });
        } else if (isOpen && mode === "create") {
            setFormData({ status: "Active" }); // Default status
            setFiles({});
        }
    }, [isOpen, mode, selectedEmployee]);

    // Auto-populate Full Name
    useEffect(() => {
        if (mode === "create" && formData.first_name && formData.last_name) {
            // Only auto-fill if name is empty or looks like an auto-generated one (to allow manual override logic if needed, but simple check is enough)
            if (!formData.name) {
                setFormData((prev: any) => ({ ...prev, name: `${formData.first_name} ${formData.last_name}` }));
            }
        }
    }, [formData.first_name, formData.last_name, mode]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles((prev) => ({ ...prev, [name]: e.target.files![0] }));
        }
    };

    const handleSubmit = () => {
        const data = new FormData();
        // Append all text fields
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        // Append files
        if (files.profile_picture) {
            data.append("profile_picture", files.profile_picture);
        }
        if (files.document_proof) {
            data.append("document_proof", files.document_proof);
        }

        onSubmit(data);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Employee" : "Edit Employee"}
                        </ModalHeader>
                        <ModalBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Personal Details */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
                            </div>
                            <Input
                                label="First Name"
                                placeholder="John"
                                value={formData.first_name || ""}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                isRequired
                            />
                            <Input
                                label="Last Name"
                                placeholder="Doe"
                                value={formData.last_name || ""}
                                onChange={(e) => handleChange("last_name", e.target.value)}
                                isRequired
                            />
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                value={formData.name || ""}
                                onChange={(e) => handleChange("name", e.target.value)}
                                isRequired
                            />
                            <Input
                                label="Email"
                                placeholder="john.doe@example.com"
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) => handleChange("email", e.target.value)}
                                isRequired
                            />
                            <Input
                                label="Mobile"
                                placeholder="+1234567890"
                                value={formData.mobile || ""}
                                onChange={(e) => handleChange("mobile", e.target.value)}
                                isRequired
                            />
                            <Input
                                label="Date of Birth"
                                type="date"
                                placeholder="Select DOB"
                                value={formData.date_of_birth || ""}
                                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                            />
                            <Select
                                label="Gender"
                                placeholder="Select Gender"
                                selectedKeys={formData.gender ? [formData.gender] : []}
                                onChange={(e) => handleChange("gender", e.target.value)}
                            >
                                <SelectItem key="Male" textValue="Male">Male</SelectItem>
                                <SelectItem key="Female" textValue="Female">Female</SelectItem>
                                <SelectItem key="Other" textValue="Other">Other</SelectItem>
                            </Select>
                            <Select
                                label="Marital Status"
                                placeholder="Select Status"
                                selectedKeys={formData.marital_status ? [formData.marital_status] : []}
                                onChange={(e) => handleChange("marital_status", e.target.value)}
                            >
                                <SelectItem key="Single" textValue="Single">Single</SelectItem>
                                <SelectItem key="Married" textValue="Married">Married</SelectItem>
                                <SelectItem key="Divorced" textValue="Divorced">Divorced</SelectItem>
                            </Select>

                            {/* Work Details */}
                            <div className="md:col-span-2 mt-4">
                                <h3 className="text-lg font-semibold mb-2">Work Details</h3>
                            </div>
                            <Input
                                label="Employee ID"
                                placeholder="EMP001"
                                value={formData.employee_no_id || ""}
                                onChange={(e) => handleChange("employee_no_id", e.target.value)}
                                isRequired
                            />
                            <Select
                                label="Department"
                                placeholder="Select Department"
                                selectedKeys={formData.department ? [formData.department] : []}
                                onChange={(e) => handleChange("department", e.target.value)}
                            >
                                {departmentOptions.map((dept: any) => (
                                    <SelectItem key={dept.name} textValue={dept.name}>
                                        {dept.displayName}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Input
                                label="Designation"
                                placeholder="Software Engineer"
                                value={formData.designation || ""}
                                onChange={(e) => handleChange("designation", e.target.value)}
                            />
                            <Select
                                label="Role"
                                placeholder="Select Role"
                                selectedKeys={formData.role ? [formData.role] : []}
                                onChange={(e) => handleChange("role", e.target.value)}
                            >
                                {(roles || []).map((role: any) => (
                                    <SelectItem key={role.name} textValue={role.name}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                label="Employee Type"
                                placeholder="Select Type"
                                selectedKeys={formData.employee_type ? [formData.employee_type] : []}
                                onChange={(e) => handleChange("employee_type", e.target.value)}
                            >
                                <SelectItem key="Full-Time" textValue="Full-Time">Full-Time</SelectItem>
                                <SelectItem key="Part-Time" textValue="Part-Time">Part-Time</SelectItem>
                                <SelectItem key="Contract" textValue="Contract">Contract</SelectItem>
                                <SelectItem key="Intern" textValue="Intern">Intern</SelectItem>
                            </Select>
                            <Select
                                label="Status"
                                placeholder="Select Status"
                                selectedKeys={formData.status ? [formData.status] : []}
                                onChange={(e) => handleChange("status", e.target.value)}
                            >
                                <SelectItem key="Active" textValue="Active">Active</SelectItem>
                                <SelectItem key="Inactive" textValue="Inactive">Inactive</SelectItem>
                                <SelectItem key="Terminated" textValue="Terminated">Terminated</SelectItem>
                            </Select>
                            <Input
                                label="Date of Joining"
                                type="date"
                                value={formData.date_of_joining || ""}
                                onChange={(e) => handleChange("date_of_joining", e.target.value)}
                            />
                            <Input
                                label="Confirmation Date"
                                type="date"
                                value={formData.confirmation_date || ""}
                                onChange={(e) => handleChange("confirmation_date", e.target.value)}
                            />
                            <Input
                                label="Notice Period"
                                placeholder="30 days"
                                value={formData.notice_period || ""}
                                onChange={(e) => handleChange("notice_period", e.target.value)}
                            />

                            {/* Credentials - Only for create */}
                            {mode === "create" && (
                                <div className="md:col-span-2 mt-4">
                                    <h3 className="text-lg font-semibold mb-2">Credentials</h3>
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={formData.password || ""}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        isRequired
                                    />
                                </div>
                            )}

                            {/* Emergency Contact */}
                            <div className="md:col-span-2 mt-4">
                                <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
                            </div>
                            <Input
                                label="Contact Name"
                                placeholder="Jane Doe"
                                value={formData.emergency_contact_name || ""}
                                onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
                            />
                            <Input
                                label="Contact Number"
                                placeholder="+1234567890"
                                value={formData.emergency_contact_number || ""}
                                onChange={(e) => handleChange("emergency_contact_number", e.target.value)}
                            />

                            {/* Documents */}
                            <div className="md:col-span-2 mt-4">
                                <h3 className="text-lg font-semibold mb-2">Documents</h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-small font-medium text-foreground">Profile Picture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "profile_picture")}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary-50 file:text-primary-700
                                        hover:file:bg-primary-100"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-small font-medium text-foreground">Document Proof</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                    onChange={(e) => handleFileChange(e, "document_proof")}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary-50 file:text-primary-700
                                        hover:file:bg-primary-100"
                                />
                            </div>
                            <Input
                                label="Document Name"
                                placeholder="e.g., Passport, ID Card"
                                value={formData.document_name || ""}
                                onChange={(e) => handleChange("document_name", e.target.value)}
                            />

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
    );
}
