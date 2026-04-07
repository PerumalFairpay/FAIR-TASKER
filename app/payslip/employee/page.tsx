"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Download, Eye, Calendar, Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getPayslipsRequest, downloadPayslipRequest } from "../../../store/payslip/action";
import { RootState } from "@/store/store";
import { PageHeader } from "@/components/PageHeader";
import TablePagination from "@/components/common/TablePagination";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";

const EmployeePayslipList = () => {
    const dispatch = useDispatch();
    const { payslips, payslipListLoading, meta } = useSelector((state: RootState) => state.Payslip);
    const { user } = useSelector((state: RootState) => state.Auth);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedPayslipId, setSelectedPayslipId] = React.useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [month, setMonth] = useState("All");
    const [year, setYear] = useState("All");

    const months = [
        "All", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = ["All", ...Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())];

    const fetchPayslips = useCallback((p: number, l: number, m: string, y: string) => {
        if (user && user.employee_id) {
            dispatch(getPayslipsRequest({
                employee_id: user.employee_id,
                page: p,
                limit: l,
                month: m === "All" ? undefined : m,
                year: y === "All" ? undefined : y
            }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        fetchPayslips(page, limit, month, year);
    }, [fetchPayslips, page, limit, month, year]);

    const handleFilterChange = (type: 'month' | 'year', value: string) => {
        if (type === 'month') setMonth(value);
        if (type === 'year') setYear(value);
        setPage(1);
    };

    const handleView = (id: string) => {
        setSelectedPayslipId(id);
        onOpen();
    };

    if (!user) {
        return <div className="p-6">Loading user profile...</div>;
    }

    if (!user.employee_id) {
        return <div className="p-6">No employee profile linked to this account.</div>;
    }

    const confirmDownload = () => {
        if (selectedPayslipId) {
            dispatch(downloadPayslipRequest(selectedPayslipId));
            onOpenChange();
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <PageHeader title="My Payslips" />
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Select
                        label="Month"
                        placeholder="Filter by Month"
                        labelPlacement="outside"
                        size="sm"
                        className="w-full sm:w-[150px]"
                        classNames={{
                            trigger: "h-10 bg-default-100 dark:bg-white/5 border-none shadow-none",
                            value: "text-small",
                        }}
                        selectedKeys={[month]}
                        onSelectionChange={(keys) => handleFilterChange('month', Array.from(keys)[0] as string)}
                        radius="lg"
                        startContent={<Calendar size={14} className="text-default-500" />}
                    >
                        {months.map((m) => (
                            <SelectItem key={m} textValue={m}>{m}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Year"
                        placeholder="Filter by Year"
                        labelPlacement="outside"
                        size="sm"
                        className="w-full sm:w-[150px]"
                        classNames={{
                            trigger: "h-10 bg-default-100 dark:bg-white/5 border-none shadow-none",
                            value: "text-small",
                        }}
                        selectedKeys={[year]}
                        onSelectionChange={(keys) => handleFilterChange('year', Array.from(keys)[0] as string)}
                        radius="lg"
                        startContent={<Filter size={14} className="text-default-500" />}
                    >
                        {years.map((y) => (
                            <SelectItem key={y} textValue={y}>{y}</SelectItem>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <Table
                    aria-label="My Payslips Table"
                    removeWrapper
                    isHeaderSticky
                >
                    <TableHeader>
                        <TableColumn>MONTH</TableColumn>
                        <TableColumn>YEAR</TableColumn>
                        <TableColumn>NET PAY</TableColumn>
                        <TableColumn>GENERATED AT</TableColumn>
                        <TableColumn align="center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody items={payslips || []} emptyContent={"No payslips found"} isLoading={payslipListLoading}>
                        {(item: any) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.month}</TableCell>
                                <TableCell>{item.year}</TableCell>
                                <TableCell className="font-semibold text-primary">
                                    {`₹ ${item.net_pay.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                                </TableCell>
                                <TableCell>{new Date(item.generated_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <Button
                                            color="primary"
                                            variant="flat"
                                            size="sm"
                                            startContent={<Eye size={16} />}
                                            onPress={() => handleView(item.id)}
                                            className="font-medium"
                                        >
                                            View / Download
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile View — NDA style */}
            <div className="md:hidden space-y-4">
                {payslipListLoading ? (
                    <div className="flex justify-center py-8 text-default-400">Loading payslips...</div>
                ) : (payslips || []).length > 0 ? (
                    (payslips as any[]).map((item: any) => (
                        <Card key={item.id} className="shadow-sm border border-default-100 bg-white dark:bg-zinc-900/50">
                            <CardBody className="p-4 flex flex-col gap-4">
                                {/* Header: Month name + year chip */}
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-0.5">
                                        <h3 className="text-sm font-bold text-default-900">{item.month}</h3>
                                        <p className="text-[10px] text-default-300 uppercase font-bold tracking-wider mt-1">Monthly Payslip</p>
                                    </div>
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg shrink-0">
                                        {item.year}
                                    </span>
                                </div>

                                <Divider className="opacity-50" />

                                {/* NDA-style compact info bar */}
                                <div className="flex justify-between items-center bg-default-50 dark:bg-white/5 p-2 rounded-xl">
                                    <div className="flex gap-4 items-center">
                                        {/* Net Pay */}
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-bold text-default-400 uppercase">Net Pay</span>
                                            <span className="text-tiny font-bold text-primary">
                                                ₹ {item.net_pay.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        {/* Generated */}
                                        <div className="flex flex-col gap-0.5 border-l border-default-200 dark:border-white/10 pl-4">
                                            <span className="text-[9px] font-bold text-default-400 uppercase">Generated</span>
                                            <span className="text-tiny">
                                                {new Date(item.generated_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Action Button */}
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        onPress={() => handleView(item.id)}
                                    >
                                        <Eye size={14} />
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 text-default-400">No payslips found</div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
                {meta && meta.total_items > 0 && (
                    <TablePagination
                        page={page}
                        total={meta.total_pages}
                        onChange={(p) => setPage(p)}
                        limit={limit}
                        onLimitChange={(l) => { setLimit(l); setPage(1); }}
                    />
                )}
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Download Payslip</ModalHeader>
                            <ModalBody>
                                <p>This payslip is password protected.</p>
                                <p><strong>Password:</strong> Your registered mobile number.</p>
                                <p>Click download to get the file.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={confirmDownload} startContent={<Download size={18} />}>
                                    Download
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default EmployeePayslipList;
