import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesRequest } from "../../store/employee/action";
import { generatePayslipRequest, createPayslipStates } from "../../store/payslip/action";
import { MinusCircle, Plus, X } from "lucide-react";
import { RootState } from "@/store/store";
import { addToast } from "@heroui/toast";

interface GeneratePayslipDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const GeneratePayslipDrawer = ({ isOpen, onOpenChange, onSuccess }: GeneratePayslipDrawerProps) => {
    const dispatch = useDispatch();
    const { employees } = useSelector((state: RootState) => state.Employee);
    const { payslipGenerateLoading, payslipGenerateError, payslipGenerateSuccess } = useSelector((state: RootState) => state.Payslip);

    useEffect(() => {
        if (payslipGenerateSuccess) {
            onSuccess();
            addToast({ title: "Success", description: "Payslip generated successfully", color: "success" });
        }
    }, [payslipGenerateSuccess, onSuccess]);

    useEffect(() => {
        if (payslipGenerateError) {
            addToast({ title: "Error", description: payslipGenerateError, color: "danger" });
        }
    }, [payslipGenerateError]);

    const [formData, setFormData] = useState<any>({
        employee_id: "",
        month: "",
        year: new Date().getFullYear(),
        earnings: [{ name: "Basic", amount: 0 }, { name: "HRA", amount: 0 }],
        deductions: [{ name: "PF", amount: 0 }]
    });

    useEffect(() => {
        if (isOpen) {
            dispatch(getEmployeesRequest(1, 1000)); // Fetch all employees for selection
            dispatch(createPayslipStates());
            setFormData({
                employee_id: "",
                month: "",
                year: new Date().getFullYear(),
                earnings: [{ name: "Basic", amount: 0 }, { name: "HRA", amount: 0 }],
                deductions: [{ name: "PF", amount: 0 }]
            });
        }
    }, [isOpen, dispatch]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleDynamicChange = (type: "earnings" | "deductions", index: number, field: string, value: any) => {
        const newList = [...formData[type]];
        newList[index] = { ...newList[index], [field]: value };
        handleChange(type, newList);
    };

    const addRow = (type: "earnings" | "deductions") => {
        handleChange(type, [...formData[type], { name: "", amount: 0 }]);
    };

    const removeRow = (type: "earnings" | "deductions", index: number) => {
        const newList = formData[type].filter((_: any, i: number) => i !== index);
        handleChange(type, newList);
    };

    const handleSubmit = () => {
        const { employee_id, month, year, earnings, deductions } = formData;

        if (!employee_id || !month || !year) {
            addToast({ title: "Validation Error", description: "Please fill all required fields", color: "danger" });
            return;
        }

        // Calculate Net Pay
        const totalEarnings = earnings.reduce((acc: number, cur: any) => acc + (parseFloat(cur.amount) || 0), 0);
        const totalDeductions = deductions.reduce((acc: number, cur: any) => acc + (parseFloat(cur.amount) || 0), 0);
        const netPay = totalEarnings - totalDeductions;

        // Reshape for API (Dict format as expected by backend)
        const earningsDict = earnings.reduce((acc: any, cur: any) => ({ ...acc, [cur.name]: parseFloat(cur.amount) || 0 }), {});
        const deductionsDict = deductions.reduce((acc: any, cur: any) => ({ ...acc, [cur.name]: parseFloat(cur.amount) || 0 }), {});

        const payload = {
            employee_id,
            month,
            year: parseInt(year),
            earnings: earningsDict,
            deductions: deductionsDict,
            net_pay: netPay
        };

        dispatch(generatePayslipRequest(payload));
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const totalEarnings = formData.earnings.reduce((acc: number, cur: any) => acc + (parseFloat(cur.amount) || 0), 0);
    const totalDeductions = formData.deductions.reduce((acc: number, cur: any) => acc + (parseFloat(cur.amount) || 0), 0);
    const netPay = totalEarnings - totalDeductions;

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">Generate Payslip</DrawerHeader>
                        <DrawerBody>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                                <div className="md:col-span-6">
                                    <Select
                                        label="Employee"
                                        placeholder="Select an employee"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        selectedKeys={formData.employee_id ? [formData.employee_id] : []}
                                        onChange={(e) => handleChange("employee_id", e.target.value)}
                                        isRequired
                                    >
                                        {(employees || []).map((emp: any) => (
                                            <SelectItem key={emp.id} textValue={`${emp.name} (${emp.employee_no_id})`}>
                                                {emp.name} ({emp.employee_no_id})
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="md:col-span-3">
                                    <Select
                                        label="Month"
                                        placeholder="Select month"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        selectedKeys={formData.month ? [formData.month] : []}
                                        onChange={(e) => handleChange("month", e.target.value)}
                                        isRequired
                                    >
                                        {months.map((m) => (
                                            <SelectItem key={m} textValue={m}>{m}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="md:col-span-3">
                                    <Input
                                        label="Year"
                                        placeholder="2024"
                                        type="number"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.year.toString()}
                                        onChange={(e) => handleChange("year", e.target.value)}
                                        isRequired
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-medium font-semibold">Earnings</h4>
                                    <Button size="sm" color="primary" variant="flat" startContent={<Plus size={16} />} onPress={() => addRow("earnings")}>
                                        Add Earning
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {formData.earnings.map((earning: any, index: number) => (
                                        <div key={index} className="flex gap-4 items-end">
                                            <Input
                                                placeholder="e.g. Basic Salary"
                                                variant="bordered"
                                                value={earning.name}
                                                onChange={(e) => handleDynamicChange("earnings", index, "name", e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="0.00"
                                                type="number"
                                                variant="bordered"
                                                value={earning.amount}
                                                onChange={(e) => handleDynamicChange("earnings", index, "amount", e.target.value)}
                                                startContent={<span className="text-default-400 text-small">₹</span>}
                                                className="w-32"
                                            />
                                            <Button isIconOnly color="danger" variant="light" onPress={() => removeRow("earnings", index)}>
                                                <MinusCircle size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-4 pr-14">
                                    <div className="flex items-center gap-3">
                                        <span className="text-small font-medium text-default-500 whitespace-nowrap">Total Earnings:</span>
                                        <Input
                                            value={totalEarnings.toFixed(2)}
                                            variant="flat"
                                            // isDisabled
                                            isReadOnly
                                            // size="sm"
                                            startContent={<span className="text-default-400 text-small">₹</span>}
                                            className="w-32"
                                            // classNames={{
                                            //     input: "font-bold text-primary opacity-100",
                                            //     inputWrapper: "bg-default-100"
                                            // }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-medium font-semibold text-danger">Deductions</h4>
                                    <Button size="sm" color="danger" variant="flat" startContent={<Plus size={16} />} onPress={() => addRow("deductions")}>
                                        Add Deduction
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {formData.deductions.map((deduction: any, index: number) => (
                                        <div key={index} className="flex gap-4 items-end">
                                            <Input
                                                placeholder="e.g. PF"
                                                variant="bordered"
                                                value={deduction.name}
                                                onChange={(e) => handleDynamicChange("deductions", index, "name", e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="0.00"
                                                type="number"
                                                variant="bordered"
                                                value={deduction.amount}
                                                onChange={(e) => handleDynamicChange("deductions", index, "amount", e.target.value)}
                                                startContent={<span className="text-default-400 text-small">₹</span>}
                                                className="w-32"
                                            />
                                            <Button isIconOnly color="danger" variant="light" onPress={() => removeRow("deductions", index)}>
                                                <MinusCircle size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-4 pr-14">
                                    <div className="flex items-center gap-3">
                                        <span className="text-small font-medium text-default-500 whitespace-nowrap">Total Deductions:</span>
                                        <Input
                                            value={totalDeductions.toFixed(2)}
                                            variant="flat"
                                            // isDisabled
                                            // // size="sm"
                                            startContent={<span className="text-default-400 text-small">₹</span>}
                                            className="w-32"
                                            // classNames={{
                                            //     input: "font-bold text-danger opacity-100",
                                            //     inputWrapper: "bg-default-100"
                                            // }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-primary-50/50 rounded-xl border border-primary-100">
                                <div className="flex justify-between items-center bg-transparent">
                                    <span className="font-bold text-primary-700">Net Pay:</span>
                                    <span className="font-bold text-primary text-xl">
                                        ₹ {netPay.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                            <Button color="primary" isLoading={payslipGenerateLoading} onPress={handleSubmit}>
                                Generate Payslip
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default GeneratePayslipDrawer;
