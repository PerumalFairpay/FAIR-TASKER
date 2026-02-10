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
    }, [fetchPayslips, page, limit]);

    const handleFilterChange = (type: 'month' | 'year', value: string) => {
        if (type === 'month') setMonth(value);
        if (type === 'year') setYear(value);
        setPage(1);
        fetchPayslips(1, limit, type === 'month' ? value : month, type === 'year' ? value : year);
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
        <div className="p-6">
            <div className="flex flex-col gap-4 mb-6">
                <PageHeader title="My Payslips" />

                <div className="flex flex-wrap gap-2 items-center">
                    <Select
                        label="Month"
                        placeholder="Filter by Month"
                        labelPlacement="outside"
                        size="sm"
                        className="w-[150px]"
                        classNames={{
                            trigger: "h-10 bg-default-100 data-[hover=true]:bg-default-200 border-none shadow-none",
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
                        className="w-[150px]"
                        classNames={{
                            trigger: "h-10 bg-default-100 data-[hover=true]:bg-default-200 border-none shadow-none",
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

            <Table
                aria-label="My Payslips Table"
                removeWrapper
                bottomContent={
                    meta && meta.total_items > 0 && (
                        <TablePagination
                            page={page}
                            total={meta.total_pages}
                            onChange={(p) => setPage(p)}
                            limit={limit}
                            onLimitChange={(l) => { setLimit(l); setPage(1); }}
                        />
                    )
                }
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
                            <TableCell>{item.month}</TableCell>
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{`₹ ${item.net_pay.toFixed(2)}`}</TableCell>
                            <TableCell>{new Date(item.generated_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex justify-center">
                                    <Button
                                        color="primary"
                                        variant="flat"
                                        startContent={<Eye size={18} />}
                                        onPress={() => handleView(item.id)}
                                    >
                                        View / Download
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

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
