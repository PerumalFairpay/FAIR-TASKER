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
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesRequest } from "@/store/employee/action";
import { generatePayslipRequest, updatePayslipRequest, createPayslipStates } from "@/store/payslip/action";
import { getPayslipComponentsRequest } from "@/store/payslipComponent/action";
import { MinusCircle, Plus } from "lucide-react";
import { RootState } from "@/store/store";
import { AppState } from "@/store/rootReducer";
import { addToast } from "@heroui/toast";

interface AddEditPayslipDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    mode: "create" | "edit";
    payslip?: any;
}

const AddEditPayslipDrawer = ({ isOpen, onOpenChange, onSuccess, mode, payslip }: AddEditPayslipDrawerProps) => {
    const dispatch = useDispatch();
    const { employees } = useSelector((state: RootState) => state.Employee);
    const { payslipComponents } = useSelector((state: AppState) => state.PayslipComponent);
    const {
        payslipGenerateLoading,
        payslipGenerateError,
        payslipGenerateSuccess,
        payslipUpdateLoading,
        payslipUpdateError,
        payslipUpdateSuccess
    } = useSelector((state: RootState) => state.Payslip);

    const isLoading = mode === "create" ? payslipGenerateLoading : payslipUpdateLoading;

    useEffect(() => {
        if (payslipGenerateSuccess || payslipUpdateSuccess) {
            onSuccess();
            if (payslipGenerateSuccess) {
                addToast({ title: "Success", description: "Payslip generated successfully", color: "success" });
            } else {
                addToast({ title: "Success", description: "Payslip updated successfully", color: "success" });
            }
            dispatch(createPayslipStates());
        }
    }, [payslipGenerateSuccess, payslipUpdateSuccess, onSuccess, dispatch]);

    useEffect(() => {
        const error = mode === "create" ? payslipGenerateError : payslipUpdateError;
        if (error) {
            addToast({ title: "Error", description: error, color: "danger" });
        }
    }, [payslipGenerateError, payslipUpdateError, mode]);

    const [formData, setFormData] = useState<any>({
        employee_id: "",
        month: "",
        year: new Date().getFullYear(),
        earnings: [{ name: "Basic", amount: 0 }, { name: "HRA", amount: 0 }],
        deductions: [{ name: "PF", amount: 0 }]
    });

    useEffect(() => {
        if (isOpen) {
            dispatch(createPayslipStates());
            if (mode === "create") {
                dispatch(getEmployeesRequest(1, 1000));
                dispatch(getPayslipComponentsRequest());
                setFormData({
                    employee_id: "",
                    month: "",
                    year: new Date().getFullYear(),
                    earnings: [],
                    deductions: []
                });
            } else if (mode === "edit" && payslip) {
                const earningsArray = Object.entries(payslip.earnings || {}).map(([name, amount]) => ({
                    name,
                    amount
                }));

                const deductionsArray = Object.entries(payslip.deductions || {}).map(([name, amount]) => ({
                    name,
                    amount
                }));

                setFormData({
                    employee_id: payslip.employee_id,
                    month: payslip.month,
                    year: payslip.year,
                    earnings: earningsArray,
                    deductions: deductionsArray
                });
            }
        }
    }, [isOpen, mode, payslip, dispatch]);

    // When components load and we're in create mode with empty lists, populate from API
    useEffect(() => {
        if (isOpen && mode === "create" && payslipComponents && payslipComponents.length > 0) {
            const apiEarnings = payslipComponents
                .filter((c: any) => c.type === "Earnings" && c.is_active)
                .map((c: any) => ({ name: c.name, amount: 0 }));
            const apiDeductions = payslipComponents
                .filter((c: any) => c.type === "Deductions" && c.is_active)
                .map((c: any) => ({ name: c.name, amount: 0 }));
            setFormData((prev: any) => ({
                ...prev,
                earnings: apiEarnings.length > 0 ? apiEarnings : prev.earnings,
                deductions: apiDeductions.length > 0 ? apiDeductions : prev.deductions,
            }));
        }
    }, [payslipComponents, isOpen, mode]);

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

        if ((mode === "create" && !employee_id) || !month || !year) {
            addToast({ title: "Validation Error", description: "Please fill all required fields", color: "danger" });
            return;
        }

        // Calculate Net Pay
        const totalEarnings = earnings.reduce((acc: number, cur: any) => acc + (parseFloat(cur.amount) || 0), 0);
        const totalDeductions = deductions.reduce((acc: number, cur: any) => acc + (parseFloat(cur.amount) || 0), 0);
        const netPay = totalEarnings - totalDeductions;

        // Reshape for API
        const earningsDict = earnings.reduce((acc: any, cur: any) => {
            if (cur.name) return { ...acc, [cur.name]: parseFloat(cur.amount) || 0 };
            return acc;
        }, {});

        const deductionsDict = deductions.reduce((acc: any, cur: any) => {
            if (cur.name) return { ...acc, [cur.name]: parseFloat(cur.amount) || 0 };
            return acc;
        }, {});

        const payload = {
            month,
            year: parseInt(year),
            earnings: earningsDict,
            deductions: deductionsDict,
            net_pay: netPay
        };

        if (mode === "create") {
            dispatch(generatePayslipRequest({ ...payload, employee_id }));
        } else {
            dispatch(updatePayslipRequest(payslip.id, payload));
        }
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
                        <DrawerHeader className="flex flex-col gap-1">
                            {mode === "create" ? "Generate Payslip" : `Edit Payslip - ${payslip?.employee_name}`}
                        </DrawerHeader>
                        <DrawerBody>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                                {mode === "create" ? (
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
                                ) : (
                                    <div className="md:col-span-6">
                                        <Input
                                            label="Employee"
                                            value={payslip?.employee_name}
                                            labelPlacement="outside"
                                            variant="bordered"
                                            isDisabled
                                        />
                                    </div>
                                )}
                                <div className="md:col-span-3">
                                    <Select
                                        label="Month"
                                        placeholder="Select month"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        selectedKeys={formData.month ? [formData.month] : []}
                                        onChange={(e) => handleChange("month", e.target.value)}
                                        isRequired
                                        isDisabled={mode === "edit"}
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
                                        isDisabled={mode === "edit"}
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
                                            startContent={<span className="text-default-400 text-small">₹</span>}
                                            className="w-32"
                                            classNames={{
                                                input: "font-bold text-primary",
                                                inputWrapper: "bg-default-100"
                                            }}
                                            isReadOnly
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
                                            startContent={<span className="text-default-400 text-small">₹</span>}
                                            className="w-32"
                                            classNames={{
                                                input: "font-bold text-danger",
                                                inputWrapper: "bg-default-100"
                                            }}
                                            isReadOnly
                                        />
                                    </div>
                                </div>
                            </div>

                        </DrawerBody>
                        <DrawerFooter className="flex flex-col gap-4 border-t border-default-100">
                            <div className="flex justify-between items-center w-full px-2">
                                <div className="flex flex-col">
                                    <span className="text-tiny text-default-500 uppercase font-bold tracking-wider">Net Pay</span>
                                    <span className="text-xl font-bold text-primary">₹ {netPay.toFixed(2)}</span>
                                </div>
                                <Button
                                    color="primary"
                                    isLoading={isLoading}
                                    onPress={handleSubmit}
                                    size="lg"
                                    className="px-8 font-semibold"
                                >
                                    {mode === "create" ? "Generate Payslip" : "Update Payslip"}
                                </Button>
                            </div>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default AddEditPayslipDrawer;