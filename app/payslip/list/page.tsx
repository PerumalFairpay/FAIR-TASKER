"use client";
import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Download, Plus, Search, Calendar, Filter, Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getPayslipsRequest, downloadPayslipRequest, createPayslipStates } from "../../../store/payslip/action";
import AddEditPayslipDrawer from "../../../components/payslip/AddEditPayslipDrawer";
import { RootState } from "@/store/store";
import { PageHeader } from "@/components/PageHeader";
import TablePagination from "@/components/common/TablePagination";
import { useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { debounce } from "lodash";
import { useCallback } from "react";

const PayslipList = () => {
    const dispatch = useDispatch();
    const { payslips, payslipListLoading, meta } = useSelector((state: RootState) => state.Payslip);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

    const handleEdit = (payslip: any) => {
        dispatch(createPayslipStates());
        setSelectedPayslip(payslip);
        setDrawerMode("edit");
        onOpen();
    };

    const handleOpen = () => {
        dispatch(createPayslipStates());
        setSelectedPayslip(null);
        setDrawerMode("create");
        onOpen();
    };

    const handleSuccess = useCallback(() => {
        onClose();
    }, [onClose]);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState("All");
    const [year, setYear] = useState("All");

    const months = [
        "All", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = ["All", ...Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())];

    const fetchPayslips = useCallback((p: number, l: number, s: string, m: string, y: string) => {
        dispatch(getPayslipsRequest({
            page: p,
            limit: l,
            search: s || undefined,
            month: m === "All" ? undefined : m,
            year: y === "All" ? undefined : y
        }));
    }, [dispatch]);

    // Use a debounced search function
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            fetchPayslips(1, limit, value, month, year);
            setPage(1);
        }, 500),
        [limit, month, year, fetchPayslips]
    );

    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedSearch(value);
    };

    const handleFilterChange = (type: 'month' | 'year', value: string) => {
        if (type === 'month') setMonth(value);
        if (type === 'year') setYear(value);
        setPage(1);
    };

    useEffect(() => {
        fetchPayslips(page, limit, search, month, year);
    }, [fetchPayslips, page, limit, search, month, year]);

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <PageHeader title="Payslips (Admin)" />
                    <Button color="primary" endContent={<Plus size={16} />} onPress={handleOpen}>
                        Generate Payslip
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <Input
                        classNames={{
                            base: "w-full md:w-[25%]",
                            mainWrapper: "h-full",
                            input: "text-small",
                            inputWrapper: "h-10 font-normal text-default-500 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100",
                        }}
                        placeholder="Search Employee..."
                        size="sm"
                        startContent={<Search size={18} className="text-default-400" />}
                        value={search}
                        onValueChange={handleSearchChange}
                    />
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
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
            </div>

            <Table
                aria-label="Payslips Table"
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
                    <TableColumn>EMPLOYEE DETAILS</TableColumn>
                    <TableColumn>MONTH/YEAR</TableColumn>
                    <TableColumn>NET PAY</TableColumn>
                    <TableColumn>GENERATED AT</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={payslips || []} emptyContent={"No payslips found"} isLoading={payslipListLoading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="flex flex-col gap-0.5 py-1">
                                    <span className="font-semibold text-sm">{item.employee_name}</span>
                                    <div className="flex flex-col text-xs text-default-400">
                                        <span>ID: {item.employee_id}</span>
                                        <span>Email: {item.employee_email}</span>
                                        <span>Ph: {item.employee_mobile}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{`${item.month} ${item.year}`}</TableCell>
                            <TableCell>{`₹ ${item.net_pay.toFixed(2)}`}</TableCell>
                            <TableCell>{new Date(item.generated_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2">
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        onPress={() => handleEdit(item)}
                                    >
                                        <Edit size={18} />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        onPress={() => dispatch(downloadPayslipRequest(item.id))}
                                    >
                                        <Download size={18} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AddEditPayslipDrawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onSuccess={handleSuccess}
                mode={drawerMode}
                payslip={selectedPayslip}
            />
        </div>
    );
};

export default PayslipList;
