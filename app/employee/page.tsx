"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { RadioGroup, Radio } from "@heroui/radio";
import { Select, SelectItem } from "@heroui/select";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter
} from "@heroui/drawer";
import { getEmployeeListRequest, addEmployeeRequest } from "@/store/employee/action";
import { AppState } from "@/store/rootReducer";

export default function EmployeePage() {
    const dispatch = useDispatch();
    const { employeeList, loading, isSubmitting } = useSelector(
        (state: AppState) => state.Employee
    );

    const [isOpen, setIsOpen] = useState(false);

    // --- Form State ---
    // Personal Info
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("Male");
    const [emergencyName, setEmergencyName] = useState("");
    const [emergencyMobile, setEmergencyMobile] = useState("");
    const [parentsName, setParentsName] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("Unmarried");
    const [profile, setProfile] = useState<File | null>(null);

    // Employment Info
    const [employeeType, setEmployeeType] = useState("");
    const [employeeNumberId, setEmployeeNumberId] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Active");
    const [dateOfJoining, setDateOfJoining] = useState("");
    const [confirmationDate, setConfirmationDate] = useState("");
    const [noticePeriod, setNoticePeriod] = useState("");

    // Proofs
    const [attachments, setAttachments] = useState<{ title: string; file: File | null }[]>([
        { title: "", file: null }
    ]);

    // Bank & Pay Info
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [pfAccount, setPfAccount] = useState("");
    const [paidDays, setPaidDays] = useState("");
    const [clAvailed, setClAvailed] = useState("");
    const [plAvailed, setPlAvailed] = useState("");
    const [slAvailed, setSlAvailed] = useState("");
    const [elAvailed, setElAvailed] = useState("");

    // Earnings
    const [basic, setBasic] = useState("");
    const [hra, setHra] = useState("");
    const [conveyance, setConveyance] = useState("");
    const [medicalAllowance, setMedicalAllowance] = useState("");
    const [specialAllowance, setSpecialAllowance] = useState("");

    // Deductions
    const [pfDeduction, setPfDeduction] = useState("");
    const [professionalTax, setProfessionalTax] = useState("");

    useEffect(() => {
        dispatch(getEmployeeListRequest());
    }, [dispatch]);

    const handleOpen = () => setIsOpen(true);
    // const handleClose = () => setIsOpen(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const handleAttachmentChange = (index: number, field: 'title' | 'file', value: string | File | null) => {
        const newAttachments = [...attachments];
        if (field === 'title' && typeof value === 'string') {
            newAttachments[index].title = value;
        } else if (field === 'file' && value instanceof File) {
            newAttachments[index].file = value;
        }
        setAttachments(newAttachments);
    };

    const addAttachmentRow = () => {
        setAttachments([...attachments, { title: "", file: null }]);
    };

    const removeAttachmentRow = (index: number) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
    };

    // Derived Pay Calculations (Simple version)
    const grossTotal = useMemo(() => {
        return (Number(basic) || 0) + (Number(hra) || 0) + (Number(conveyance) || 0) + (Number(medicalAllowance) || 0) + (Number(specialAllowance) || 0);
    }, [basic, hra, conveyance, medicalAllowance, specialAllowance]);

    const deductionTotal = useMemo(() => {
        return (Number(pfDeduction) || 0) + (Number(professionalTax) || 0);
    }, [pfDeduction, professionalTax]);

    const netPay = useMemo(() => grossTotal - deductionTotal, [grossTotal, deductionTotal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        // Personal
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("password", password);
        // formData.append("password_confirmation", confirmPassword); 
        formData.append("date_of_birth", dob);
        formData.append("gender", gender);
        formData.append("emergency_contact_name", emergencyName);
        formData.append("emergency_contact_number", emergencyMobile);
        formData.append("parents_name", parentsName);
        formData.append("marital_status", maritalStatus);
        if (profile) formData.append("profile", profile);

        // Employment
        formData.append("employee_type_id", employeeType); // Assuming ID
        formData.append("employee_number_id", employeeNumberId);
        formData.append("department_id", department); // Assuming ID
        formData.append("designation_id", designation); // Assuming ID
        formData.append("role_id", role); // Assuming ID
        formData.append("status", status);
        formData.append("date_of_joining", dateOfJoining);
        formData.append("confirmation_date", confirmationDate);
        formData.append("notice_period", noticePeriod);

        // Attachments (Complex handling usually needed for arrays in FormData, simplified here)
        attachments.forEach((att, index) => {
            if (att.file) {
                formData.append(`attachment[${index}][file]`, att.file);
                formData.append(`attachment[${index}][title]`, att.title);
            }
        });

        // Pay Details - append as needed by backend
        // ... (Appending bank/pay details would go here based on backend requirement)

        dispatch(addEmployeeRequest(formData));
    };

    const columns = [
        { key: "name", label: "NAME" },
        { key: "email", label: "EMAIL" },
        { key: "employee_type", label: "EMPLOYEE TYPE" },
        { key: "role", label: "ROLE" },
    ];

    // Placeholder Data for Selects
    const employeeTypes = [
        { key: "1", label: "Permanent" },
        { key: "2", label: "Contract" },
    ];
    const departments = [
        { key: "1", label: "IT" },
        { key: "2", label: "HR" },
    ];
    const designations = [
        { key: "1", label: "Developer" },
        { key: "2", label: "Manager" },
    ];
    const roles = [
        { key: "1", label: "Admin" },
        { key: "2", label: "Employee" },
    ];
    const statusOptions = [
        { key: "1", label: "Active" },
        { key: "0", label: "Inactive" },
    ];

    return (
        <div className="w-full px-6 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-default-900">
                    Employee Management
                </h1>
                <Button color="primary" onPress={handleOpen}>
                    Add Employee
                </Button>
            </div>

            <Table aria-label="Employee Management Table" removeWrapper isHeaderSticky isStriped>
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={employeeList || []}
                    emptyContent={"No employees found"}
                    isLoading={loading}
                    loadingContent={<Spinner label="Loading..." />}
                >
                    {(item: any) => (
                        <TableRow key={item.id}>
                            {(columnKey) => {
                                let cellValue = "";
                                switch (columnKey) {
                                    case "name":
                                        cellValue = item.users?.name || `${item.first_name} ${item.last_name}`;
                                        break;
                                    case "email":
                                        cellValue = item.users?.email || "N/A";
                                        break;
                                    case "employee_type":
                                        cellValue = item.employee_types?.name || "N/A";
                                        break;
                                    case "role":
                                        cellValue = item.users?.roles?.[0]?.name || "N/A";
                                        break;
                                    default:
                                        cellValue = "";
                                }
                                return <TableCell>{cellValue}</TableCell>;
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Drawer isOpen={isOpen} onOpenChange={setIsOpen} size="4xl" placement="right">
                <DrawerContent className="overflow-y-auto">
                    {(onClose) => (
                        <>
                            <DrawerHeader className="border-b border-default-200">Add New Employee</DrawerHeader>
                            <DrawerBody className="gap-6 p-6">
                                <form id="add-employee-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    {/* --- Personal Details --- */}
                                    <section className="flex flex-col gap-4">
                                        <h3 className="text-lg font-semibold text-default-700">Personal Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input isRequired label="First Name" placeholder="Enter first name" value={firstName} onValueChange={setFirstName} />
                                            <Input label="Last Name" placeholder="Enter last name" value={lastName} onValueChange={setLastName} />
                                            <Input isRequired type="email" label="Email" placeholder="Enter email" value={email} onValueChange={setEmail} />
                                            <Input label="Mobile" placeholder="Enter mobile" value={mobile} onValueChange={setMobile} />
                                            <Input isRequired type="password" label="Password" placeholder="Enter password" value={password} onValueChange={setPassword} />
                                            <Input isRequired type="password" label="Confirm Password" placeholder="Enter confirm password" value={confirmPassword} onValueChange={setConfirmPassword} />
                                            <Input isRequired type="date" label="Date of Birth" placeholder="Select date" value={dob} onValueChange={setDob}
                                            // labelPlacement="outside" 
                                            />
                                            <div className="flex flex-col gap-2">
                                                <span className="text-small text-default-500">Gender</span>
                                                <RadioGroup orientation="horizontal" value={gender} onValueChange={setGender}>
                                                    <Radio value="Male">Male</Radio>
                                                    <Radio value="Female">Female</Radio>
                                                </RadioGroup>
                                            </div>
                                            <Input isRequired label="Emergency Contact Name" placeholder="Enter name" value={emergencyName} onValueChange={setEmergencyName} />
                                            <Input isRequired label="Emergency Contact Number" placeholder="Enter number" value={emergencyMobile} onValueChange={setEmergencyMobile} />
                                            <Input label="Parents Name" placeholder="Enter parents name" value={parentsName} onValueChange={setParentsName} />
                                            <div className="flex flex-col gap-1">
                                                <span className="text-small text-default-600">Profile Picture</span>
                                                <input type="file" className="block w-full text-sm text-default-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" onChange={(e) => handleFileChange(e, setProfile)} />
                                            </div>
                                            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                                                <span className="text-small text-default-500">Marital Status</span>
                                                <RadioGroup orientation="horizontal" value={maritalStatus} onValueChange={setMaritalStatus}>
                                                    <Radio value="Unmarried">Unmarried</Radio>
                                                    <Radio value="Married">Married</Radio>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </section>

                                    {/* --- Employment Details --- */}
                                    <section className="flex flex-col gap-4 border-t border-default-200 pt-4">
                                        <h3 className="text-lg font-semibold text-default-700">Employment Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Select isRequired label="Employee Type" placeholder="Select..." selectedKeys={employeeType ? [employeeType] : []} onChange={(e) => setEmployeeType(e.target.value)}>
                                                {employeeTypes.map((type) => <SelectItem key={type.key}>{type.label}</SelectItem>)}
                                            </Select>
                                            <Input isRequired label="Employee Number" placeholder="Enter employee number" value={employeeNumberId} onValueChange={setEmployeeNumberId} />
                                            <Select isRequired label="Department" placeholder="Select..." selectedKeys={department ? [department] : []} onChange={(e) => setDepartment(e.target.value)}>
                                                {departments.map((dept) => <SelectItem key={dept.key}>{dept.label}</SelectItem>)}
                                            </Select>
                                            <Select isRequired label="Designation" placeholder="Select..." selectedKeys={designation ? [designation] : []} onChange={(e) => setDesignation(e.target.value)}>
                                                {designations.map((desig) => <SelectItem key={desig.key}>{desig.label}</SelectItem>)}
                                            </Select>
                                            <Select isRequired label="Role" placeholder="Select..." selectedKeys={role ? [role] : []} onChange={(e) => setRole(e.target.value)}>
                                                {roles.map((r) => <SelectItem key={r.key}>{r.label}</SelectItem>)}
                                            </Select>
                                            <Select isRequired label="Status" placeholder="Select..." selectedKeys={status ? [status] : []} onChange={(e) => setStatus(e.target.value)}>
                                                {statusOptions.map((s) => <SelectItem key={s.key}>{s.label}</SelectItem>)}
                                            </Select>
                                            <Input isRequired type="date" label="Date of Joining" value={dateOfJoining} onValueChange={setDateOfJoining} />
                                            <Input isRequired type="date" label="Confirmation Date" value={confirmationDate} onValueChange={setConfirmationDate} />
                                            <Input isRequired label="Notice Period (In Days)" placeholder="Enter notice period" value={noticePeriod} onValueChange={setNoticePeriod} />
                                        </div>

                                        {/* Upload Proof */}
                                        <div className="flex flex-col gap-2 mt-2">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-small font-semibold text-default-600">Upload Proof</h4>
                                                <Button size="sm" color="primary" variant="flat" onPress={addAttachmentRow}>+ More</Button>
                                            </div>
                                            {attachments.map((att, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <Input placeholder="Enter title" value={att.title} onValueChange={(val) => handleAttachmentChange(index, 'title', val)} className="flex-1" size="sm" />
                                                    <input type="file" className="text-sm file:py-1 file:px-2" onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) handleAttachmentChange(index, 'file', e.target.files[0]);
                                                    }} />
                                                    {index > 0 && <Button size="sm" color="danger" isIconOnly variant="light" onPress={() => removeAttachmentRow(index)}>X</Button>}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* --- Bank & Pay Details --- */}
                                    <section className="flex flex-col gap-4 border-t border-default-200 pt-4">
                                        <h3 className="text-lg font-semibold text-default-700">Bank & Pay Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input label="Bank Name" placeholder="Enter bank name" value={bankName} onValueChange={setBankName} />
                                            <Input label="Account Number" placeholder="Enter account number" value={accountNumber} onValueChange={setAccountNumber} />
                                            <Input label="PF Account Number" placeholder="Enter PF account" value={pfAccount} onValueChange={setPfAccount} />
                                            <Input label="Paid Days" placeholder="Enter paid days" value={paidDays} onValueChange={setPaidDays} />
                                            <Input label="CL Availed" value={clAvailed} onValueChange={setClAvailed} />
                                            <Input label="PL Availed" value={plAvailed} onValueChange={setPlAvailed} />
                                            <Input label="SL Availed" value={slAvailed} onValueChange={setSlAvailed} />
                                            <Input label="EL Availed" value={elAvailed} onValueChange={setElAvailed} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                                            {/* Earnings */}
                                            <div className="flex flex-col gap-3">
                                                <h4 className="text-md font-semibold text-default-600">Earnings</h4>
                                                <Input label="Basic" value={basic} onValueChange={setBasic} type="number" />
                                                <Input label="HRA" value={hra} onValueChange={setHra} type="number" />
                                                <Input label="Conveyance" value={conveyance} onValueChange={setConveyance} type="number" />
                                                <Input label="Medical Allowance" value={medicalAllowance} onValueChange={setMedicalAllowance} type="number" />
                                                <Input label="Special Allowance" value={specialAllowance} onValueChange={setSpecialAllowance} type="number" />
                                            </div>

                                            {/* Deductions */}
                                            <div className="flex flex-col gap-3">
                                                <h4 className="text-md font-semibold text-default-600">Deductions</h4>
                                                <Input label="PF" value={pfDeduction} onValueChange={setPfDeduction} type="number" />
                                                <Input label="Professional Tax" value={professionalTax} onValueChange={setProfessionalTax} type="number" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-default-50 p-4 rounded-lg">
                                            <Input isReadOnly label="Gross Total" value={String(grossTotal.toFixed(2))} variant="flat" />
                                            <Input isReadOnly label="Deduction Total" value={String(deductionTotal.toFixed(2))} variant="flat" />
                                            <Input isReadOnly label="Net Pay" value={String(netPay.toFixed(2))} variant="flat" />
                                        </div>
                                        <div className="mt-2">
                                            <Input label="Amount in Words" placeholder="Zero Only" />
                                        </div>
                                    </section>
                                </form>
                            </DrawerBody>
                            <DrawerFooter className="border-t border-default-200">
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit" form="add-employee-form" isLoading={isSubmitting}>
                                    Save
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
