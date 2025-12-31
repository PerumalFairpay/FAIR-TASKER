import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getRolesRequest } from "@/store/role/action";
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

interface AddEditEmployeeDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    selectedEmployee?: any;
    loading: boolean;
    onSubmit: (formData: FormData) => void;
}

export default function AddEditEmployeeDrawer({
    isOpen,
    onOpenChange,
    mode,
    selectedEmployee,
    loading,
    onSubmit,
}: AddEditEmployeeDrawerProps) {
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
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        if (files.profile_picture) {
            data.append("profile_picture", files.profile_picture);
        }
        if (files.document_proof) {
            data.append("document_proof", files.document_proof);
        }

        onSubmit(data);
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Employee" : "Edit Employee"}
                        </DrawerHeader>
                        <DrawerBody className="gap-6 py-6">
                            {/* Personal Details */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-primary">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="First Name"
                                        placeholder="John"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.first_name || ""}
                                        onChange={(e) => handleChange("first_name", e.target.value)}
                                        isRequired
                                    />
                                    <Input
                                        label="Last Name"
                                        placeholder="Doe"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.last_name || ""}
                                        onChange={(e) => handleChange("last_name", e.target.value)}
                                        isRequired
                                    />
                                    <Input
                                        label="Full Name"
                                        placeholder="John Doe"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.name || ""}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        isRequired
                                        className="md:col-span-2"
                                    />
                                    <Input
                                        label="Email"
                                        placeholder="john.doe@example.com"
                                        type="email"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.email || ""}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        isRequired
                                    />
                                    <Input
                                        label="Mobile"
                                        placeholder="+1234567890"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.mobile || ""}
                                        onChange={(e) => handleChange("mobile", e.target.value)}
                                        isRequired
                                    />
                                    <Input
                                        label="Date of Birth"
                                        type="date"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.date_of_birth || ""}
                                        onChange={(e) => handleChange("date_of_birth", e.target.value)}
                                    />
                                    <Select
                                        label="Gender"
                                        placeholder="Select Gender"
                                        labelPlacement="outside"
                                        variant="bordered"
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
                                        labelPlacement="outside"
                                        variant="bordered"
                                        selectedKeys={formData.marital_status ? [formData.marital_status] : []}
                                        onChange={(e) => handleChange("marital_status", e.target.value)}
                                        className="md:col-span-2"
                                    >
                                        <SelectItem key="Single" textValue="Single">Single</SelectItem>
                                        <SelectItem key="Married" textValue="Married">Married</SelectItem>
                                        <SelectItem key="Divorced" textValue="Divorced">Divorced</SelectItem>
                                    </Select>
                                </div>
                            </section>

                            <hr className="border-default-100" />

                            {/* Work Details */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-primary">Work Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Employee ID"
                                        placeholder="EMP001"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.employee_no_id || ""}
                                        onChange={(e) => handleChange("employee_no_id", e.target.value)}
                                        isRequired
                                    />
                                    <Select
                                        label="Department"
                                        placeholder="Select Department"
                                        labelPlacement="outside"
                                        variant="bordered"
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
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.designation || ""}
                                        onChange={(e) => handleChange("designation", e.target.value)}
                                    />
                                    <Select
                                        label="Role"
                                        placeholder="Select Role"
                                        labelPlacement="outside"
                                        variant="bordered"
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
                                        labelPlacement="outside"
                                        variant="bordered"
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
                                        labelPlacement="outside"
                                        variant="bordered"
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
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.date_of_joining || ""}
                                        onChange={(e) => handleChange("date_of_joining", e.target.value)}
                                    />
                                    <Input
                                        label="Confirmation Date"
                                        type="date"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.confirmation_date || ""}
                                        onChange={(e) => handleChange("confirmation_date", e.target.value)}
                                    />
                                    <Input
                                        label="Notice Period"
                                        placeholder="30 days"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.notice_period || ""}
                                        onChange={(e) => handleChange("notice_period", e.target.value)}
                                        className="md:col-span-2"
                                    />
                                </div>
                            </section>

                            <hr className="border-default-100" />

                            {/* Credentials - Only for create */}
                            {mode === "create" && (
                                <section className="space-y-4">
                                    <h3 className="text-lg font-bold text-primary">Credentials</h3>
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="Enter password"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.password || ""}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        isRequired
                                    />
                                </section>
                            )}

                            <hr className="border-default-100" />

                            {/* Emergency Contact */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-primary">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Contact Name"
                                        placeholder="Jane Doe"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.emergency_contact_name || ""}
                                        onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
                                    />
                                    <Input
                                        label="Contact Number"
                                        placeholder="+1234567890"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.emergency_contact_number || ""}
                                        onChange={(e) => handleChange("emergency_contact_number", e.target.value)}
                                    />
                                </div>
                            </section>

                            <hr className="border-default-100" />

                            {/* Documents */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-primary">Documents</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-small font-medium text-foreground">Profile Picture</label>
                                        <div className="border-2 border-dashed border-default-200 rounded-xl p-4 hover:border-primary transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, "profile_picture")}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <p className="text-tiny text-default-500">
                                                    {files.profile_picture ? files.profile_picture.name : "Click to upload profile picture"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-small font-medium text-foreground">Document Proof</label>
                                        <div className="border-2 border-dashed border-default-200 rounded-xl p-4 hover:border-primary transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.png"
                                                onChange={(e) => handleFileChange(e, "document_proof")}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <p className="text-tiny text-default-500">
                                                    {files.document_proof ? files.document_proof.name : "Click to upload document proof"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Input
                                        label="Document Name"
                                        placeholder="e.g., Passport, ID Card"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.document_name || ""}
                                        onChange={(e) => handleChange("document_name", e.target.value)}
                                    />
                                </div>
                            </section>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="light" onPress={onClose} fullWidth>
                                Close
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading} fullWidth>
                                {mode === "create" ? "Create Employee" : "Update Employee"}
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
