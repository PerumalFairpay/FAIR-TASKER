import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getRolesRequest } from "@/store/role/action";
import { getDepartmentsRequest } from "@/store/department/action";
import { getEmployeeRequest, clearEmployeeDetails } from "@/store/employee/action";
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
import { Tabs, Tab } from "@heroui/tabs";
import { User, Briefcase, PhoneCall, Files, Eye, EyeOff, Plus, Trash2, X, Landmark } from "lucide-react";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import FileUpload from "@/components/common/FileUpload";


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
    const { employee: fetchedEmployee, getLoading: fetchingEmployee } = useSelector((state: RootState) => state.Employee);
    const { assets } = useSelector((state: RootState) => state.Asset || { assets: [] });

    const [formData, setFormData] = useState<any>({});
    const [profileFiles, setProfileFiles] = useState<any[]>([]);
    const [documentList, setDocumentList] = useState<{ id: number; name: string; files: any[] }[]>([
        { id: Date.now(), name: "", files: [] }
    ]);
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string>("personal");
    const [confirmationPeriod, setConfirmationPeriod] = useState<string>("");

    const rootDepartments = useMemo(() => {
        return (departments || []).filter((dept: any) => !dept.parent_id);
    }, [departments]);

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

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

    useEffect(() => {
        if (isOpen) {
            dispatch(getRolesRequest());
            dispatch(getDepartmentsRequest());
            if (mode === "edit" && selectedEmployee?.id) {
                dispatch(getEmployeeRequest(selectedEmployee.id));
            }
        } else {
            setFormData({});
            setProfileFiles([]);
            setDocumentList([{ id: Date.now(), name: "", files: [] }]);
            setSelectedTab("personal");
            setIsVisible(false);
            setIsConfirmVisible(false);
            setConfirmationPeriod("");
            dispatch(clearEmployeeDetails());
        }
    }, [isOpen, dispatch, mode, selectedEmployee]);

    useEffect(() => {
        if (isOpen && mode === "edit" && fetchedEmployee) {
            const allDepts = departments || [];
            const currentDeptName = fetchedEmployee.department;

            setDocumentList([{ id: Date.now(), name: "", files: [] }]);

            const isRoot = rootDepartments.some((d: any) => d.name === currentDeptName);

            if (!isRoot && currentDeptName) {
                const findRoot = (deptName: string): any => {
                    const dept = allDepts.find((d: any) => d.name === deptName);
                    if (dept && dept.parent_id) {
                        const parent = allDepts.find((p: any) => p.id === dept.parent_id);
                        if (parent) return findRoot(parent.name);
                    }
                    return dept;
                };

                const root = findRoot(currentDeptName);
                if (root && root.name !== currentDeptName) {
                    setFormData({
                        ...fetchedEmployee,
                        department: root.name,
                        designation: currentDeptName
                    });
                    return;
                }
            }

            setFormData({ ...fetchedEmployee });
        } else if (isOpen && mode === "create") {
            if (Object.keys(formData).length === 0) {
                setFormData({ status: "Onboarding" });
            }
        }
    }, [fetchedEmployee, isOpen, mode, departments, rootDepartments]);



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

    const handleConfirmationPeriodChange = (value: string) => {
        setConfirmationPeriod(value);
        const days = parseInt(value, 10);
        if (!isNaN(days) && formData.date_of_joining) {
            try {
                const joiningDate = parseDate(formData.date_of_joining);
                const confirmationDate = joiningDate.add({ days: days });
                handleChange("confirmation_date", confirmationDate.toString());
            } catch (error) {
                console.error("Invalid date", error);
            }
        }
    };

    const handleConfirmationDateChange = (dateStr: string) => {
        handleChange("confirmation_date", dateStr);
        if (dateStr && formData.date_of_joining) {
            try {
                const start = parseDate(formData.date_of_joining);
                const end = parseDate(dateStr);

                const d1 = new Date(start.toString());
                const d2 = new Date(end.toString());

                const diffTime = d2.getTime() - d1.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                setConfirmationPeriod(diffDays.toString());
            } catch (error) {
                console.error("Invalid date calculation", error);
            }
        }
    };



    const handleSubmit = () => {
        const data = new FormData();
        const excludedKeys = ["id", "created_at", "updated_at", "profile_picture", "document_proof", "document_name", "documents", "onboarding_checklist", "offboarding_checklist"];

        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== undefined && !excludedKeys.includes(key)) {
                data.append(key, formData[key]);
            }
        });

        if (profileFiles.length > 0) {
            data.append("profile_picture", profileFiles[0].file);
        }

        if (documentList.length > 0) {
            documentList.forEach((doc) => {
                if (doc.files && doc.files.length > 0) {
                    data.append("document_names", doc.name || doc.files[0].file.name);
                    data.append("document_proofs", doc.files[0].file);
                }
            });
        }

        onSubmit(data);
    };

    const addDocumentRow = () => {
        setDocumentList([...documentList, { id: Date.now(), name: "", files: [] }]);
    };

    const removeDocumentRow = (id: number) => {
        setDocumentList(documentList.filter(doc => doc.id !== id));
    };

    const updateDocumentRow = (id: number, field: "name" | "files", value: any) => {
        setDocumentList(documentList.map(doc =>
            doc.id === id ? { ...doc, [field]: value } : doc
        ));
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Add Employee" : "Edit Employee"}
                        </DrawerHeader>
                        <DrawerBody className="py-3">
                            <Tabs
                                aria-label="Employee Details"
                                color="primary"
                                variant="solid"
                                selectedKey={selectedTab}
                                onSelectionChange={(key) => setSelectedTab(key as string)}
                                classNames={{
                                    base: "w-full",
                                    tabList: "bg-default-100 p-1 rounded-xl w-full flex justify-between",
                                    cursor: "rounded-lg bg-white dark:bg-default-200 shadow-sm",
                                    tab: "h-10",
                                    tabContent: "font-semibold text-default-500 group-data-[selected=true]:text-primary"
                                }}
                            >
                                <Tab key="personal" title={
                                    <div className="flex items-center space-x-2">
                                        <User size={16} />
                                        <span>Personal</span>
                                    </div>
                                }>
                                    <div className="space-y-6 pt-4">
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
                                                label="Personal Email"
                                                placeholder="john.doe@gmail.com"
                                                type="email"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.personal_email || ""}
                                                onChange={(e) => handleChange("personal_email", e.target.value)}
                                                description="Used to fetching NDA documents"
                                            />
                                            {mode === "create" && (
                                                <>
                                                    <Input
                                                        label="Password"
                                                        placeholder="Enter password"
                                                        labelPlacement="outside"
                                                        variant="bordered"
                                                        type={isVisible ? "text" : "password"}
                                                        value={formData.password || ""}
                                                        onChange={(e) => handleChange("password", e.target.value)}
                                                        isRequired
                                                        endContent={
                                                            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                                                {isVisible ? (
                                                                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                                                                ) : (
                                                                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                                                                )}
                                                            </button>
                                                        }
                                                    />
                                                    <Input
                                                        label="Confirm Password"
                                                        placeholder="Confirm your password"
                                                        labelPlacement="outside"
                                                        variant="bordered"
                                                        type={isConfirmVisible ? "text" : "password"}
                                                        value={formData.confirm_password || ""}
                                                        onChange={(e) => handleChange("confirm_password", e.target.value)}
                                                        isRequired
                                                        endContent={
                                                            <button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
                                                                {isConfirmVisible ? (
                                                                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                                                                ) : (
                                                                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                                                                )}
                                                            </button>
                                                        }
                                                    />
                                                </>
                                            )}
                                            <Input
                                                label="Mobile"
                                                placeholder="+1234567890"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.mobile || ""}
                                                onChange={(e) => handleChange("mobile", e.target.value)}
                                                isRequired
                                            />
                                            <I18nProvider locale="en-GB">
                                                <DatePicker
                                                    label="Date of Birth"
                                                    labelPlacement="outside"
                                                    variant="bordered"
                                                    showMonthAndYearPickers
                                                    value={formData.date_of_birth ? parseDate(formData.date_of_birth) : null}
                                                    onChange={(date) => handleChange("date_of_birth", date?.toString() || "")}
                                                    isRequired
                                                    description="Required for payslip generation"
                                                />
                                            </I18nProvider>
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
                                            <Textarea
                                                label="Address"
                                                placeholder="Enter employee address"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.address || ""}
                                                onChange={(e) => handleChange("address", e.target.value)}
                                                className="md:col-span-2"
                                            />
                                            <Input
                                                label="Emergency Contact Name"
                                                placeholder="Jane Doe"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.emergency_contact_name || ""}
                                                onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
                                            />
                                            <Input
                                                label="Emergency Contact Number"
                                                placeholder="+1234567890"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.emergency_contact_number || ""}
                                                onChange={(e) => handleChange("emergency_contact_number", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Tab>

                                <Tab key="professional" title={
                                    <div className="flex items-center space-x-2">
                                        <Briefcase size={16} />
                                        <span>Professional</span>
                                    </div>
                                }>
                                    <div className="space-y-6 pt-4">
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
                                                onChange={(e) => {
                                                    handleChange("department", e.target.value);
                                                    handleChange("designation", ""); // Reset designation when department changes
                                                }}
                                            >
                                                {rootDepartments.map((dept: any) => (
                                                    <SelectItem key={dept.name} textValue={dept.name}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Select
                                                label="Designation"
                                                placeholder="Select Designation"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                selectedKeys={formData.designation ? [formData.designation] : []}
                                                onChange={(e) => handleChange("designation", e.target.value)}
                                                isDisabled={!formData.department || designationOptions.length === 0}
                                            >
                                                {designationOptions.map((desig: any) => (
                                                    <SelectItem key={desig.name} textValue={desig.name}>
                                                        {desig.displayName}
                                                    </SelectItem>
                                                ))}
                                            </Select>
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
                                                <SelectItem key="Onboarding" textValue="Onboarding">Onboarding</SelectItem>
                                                <SelectItem key="Probation" textValue="Probation">Probation</SelectItem>
                                                <SelectItem key="Active" textValue="Active">Active</SelectItem>
                                                <SelectItem key="Offboarding" textValue="Offboarding">Offboarding</SelectItem>
                                                <SelectItem key="Inactive" textValue="Inactive">Inactive</SelectItem>
                                                <SelectItem key="Terminated" textValue="Terminated">Terminated</SelectItem>
                                            </Select>
                                            <I18nProvider locale="en-GB">
                                                <DatePicker
                                                    label="Date of Joining"
                                                    labelPlacement="outside"
                                                    variant="bordered"
                                                    showMonthAndYearPickers
                                                    value={formData.date_of_joining ? parseDate(formData.date_of_joining) : null}
                                                    onChange={(date) => {
                                                        const newDate = date?.toString() || "";
                                                        handleChange("date_of_joining", newDate);
                                                        if (confirmationPeriod && newDate) {
                                                            try {
                                                                const joiningDate = parseDate(newDate);
                                                                const days = parseInt(confirmationPeriod, 10);
                                                                if (!isNaN(days)) {
                                                                    const confirmationDate = joiningDate.add({ days: days });
                                                                    handleChange("confirmation_date", confirmationDate.toString());
                                                                }
                                                            } catch (error) {
                                                                console.error("Invalid date or period", error);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </I18nProvider>
                                            <I18nProvider locale="en-GB">
                                                <DatePicker
                                                    label="Confirmation Date"
                                                    labelPlacement="outside"
                                                    variant="bordered"
                                                    showMonthAndYearPickers
                                                    value={formData.confirmation_date ? parseDate(formData.confirmation_date) : null}
                                                    onChange={(date) => handleConfirmationDateChange(date?.toString() || "")}
                                                />
                                            </I18nProvider>
                                            <Input
                                                label="Confirmation Period (Days)"
                                                placeholder="e.g., 90 days"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={confirmationPeriod}
                                                onChange={(e) => handleConfirmationPeriodChange(e.target.value)}
                                                type="number"
                                            />
                                            <Select
                                                label="Work Mode"
                                                placeholder="Select Work Mode"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                selectedKeys={formData.work_mode ? [formData.work_mode] : []}
                                                onChange={(e) => handleChange("work_mode", e.target.value)}
                                            >
                                                <SelectItem key="Office" textValue="Office">Office</SelectItem>
                                                <SelectItem key="Remote" textValue="Remote">Remote</SelectItem>
                                                <SelectItem key="Hybrid" textValue="Hybrid">Hybrid</SelectItem>
                                            </Select>
                                            <Input
                                                label="Notice Period"
                                                placeholder="e.g., 30 days"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.notice_period || ""}
                                                onChange={(e) => handleChange("notice_period", e.target.value)}
                                                className="md:col-span-2"
                                            />
                                        </div>
                                    </div>
                                </Tab>



                                <Tab key="bank" title={
                                    <div className="flex items-center space-x-2">
                                        <Landmark size={16} />
                                        <span>Bank Details</span>
                                    </div>
                                }>
                                    <div className="space-y-6 pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Account Holder Name"
                                                placeholder="John Doe"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.account_name || ""}
                                                onChange={(e) => handleChange("account_name", e.target.value)}
                                            />
                                            <Input
                                                label="Bank Name"
                                                placeholder="State Bank of India"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.bank_name || ""}
                                                onChange={(e) => handleChange("bank_name", e.target.value)}
                                            />
                                            <Input
                                                label="Account Number"
                                                placeholder="1234567890"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.account_number || ""}
                                                onChange={(e) => handleChange("account_number", e.target.value)}
                                            />
                                            <Input
                                                label="IFSC Code"
                                                placeholder="SBIN0001234"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.ifsc_code || ""}
                                                onChange={(e) => handleChange("ifsc_code", e.target.value)}
                                            />
                                            <Input
                                                label="PAN Number"
                                                placeholder="ABCDE1234F"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.pan_number || ""}
                                                onChange={(e) => handleChange("pan_number", e.target.value)}
                                            />
                                            <Input
                                                label="PF Account Number"
                                                placeholder="PF/KN/12345/000/1234567"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.pf_account_number || ""}
                                                onChange={(e) => handleChange("pf_account_number", e.target.value)}
                                            />
                                            <Input
                                                label="ESIC Number"
                                                placeholder="1234567890"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                value={formData.esic_number || ""}
                                                onChange={(e) => handleChange("esic_number", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Tab>

                                <Tab key="documents" title={
                                    <div className="flex items-center space-x-2">
                                        <Files size={16} />
                                        <span>Documents</span>
                                    </div>
                                }>
                                    <div className="space-y-6 pt-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col gap-2 items-center">
                                                <label className="text-small font-medium text-foreground">Profile Picture</label>
                                                <div className="w-32 h-32">
                                                    <FileUpload
                                                        files={profileFiles}
                                                        setFiles={setProfileFiles}
                                                        name="profile_picture"
                                                        labelIdle='<span class="filepond--label-action">Upload</span>'
                                                        acceptedFileTypes={['image/*']}
                                                        stylePanelLayout="compact circle"
                                                        styleLoadIndicatorPosition="center bottom"
                                                        styleProgressIndicatorPosition="right bottom"
                                                        styleButtonRemoveItemPosition="left bottom"
                                                        styleButtonProcessItemPosition="right bottom"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-small font-medium text-foreground">Documents</label>
                                                    <Button
                                                        color="primary"
                                                        variant="flat"
                                                        size="sm"
                                                        startContent={<Plus size={16} />}
                                                        onPress={addDocumentRow}
                                                    >
                                                        Add Document
                                                    </Button>
                                                </div>

                                                {documentList.map((doc, index) => (
                                                    <div key={doc.id} className="border border-default-200 p-3 rounded-lg relative">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-semibold text-tiny text-default-500">Document {index + 1}</span>
                                                            {(documentList.length > 1 || mode === "create") && (
                                                                <Button isIconOnly color="danger" variant="light" size="sm" onPress={() => removeDocumentRow(doc.id)}>
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex flex-col gap-2">
                                                                <FileUpload
                                                                    files={doc.files}
                                                                    setFiles={(files: any) => updateDocumentRow(doc.id, "files", files)}
                                                                    name={`document_proof_${doc.id}`}
                                                                    labelIdle='Proof of Document'
                                                                    acceptedFileTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']}
                                                                />
                                                            </div>
                                                            <Input
                                                                label="Document Name"
                                                                placeholder="e.g., Passport, ID Card"
                                                                labelPlacement="outside"
                                                                variant="bordered"
                                                                value={doc.name}
                                                                onChange={(e) => updateDocumentRow(doc.id, "name", e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                {documentList.length === 0 && (
                                                    <div className="text-center p-4 border border-dashed border-default-200 rounded-lg text-default-400">
                                                        No documents added.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="light" onPress={onClose} fullWidth>
                                Close
                            </Button>
                            {selectedTab === "documents" ? (
                                <Button color="primary" onPress={handleSubmit} isLoading={loading} fullWidth>
                                    {mode === "create" ? "Create Employee" : "Update Employee"}
                                </Button>
                            ) : (
                                <Button color="primary" onPress={() => {
                                    const tabs = ["personal", "professional", "bank", "documents"];
                                    const currentIndex = tabs.indexOf(selectedTab);
                                    if (currentIndex < tabs.length - 1) {
                                        setSelectedTab(tabs[currentIndex + 1]);
                                    }
                                }} fullWidth>
                                    Next
                                </Button>
                            )}
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
