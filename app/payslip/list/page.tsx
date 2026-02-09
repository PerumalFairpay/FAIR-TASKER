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
import { Download, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getPayslipsRequest, downloadPayslipRequest } from "../../../store/payslip/action";
import GeneratePayslipDrawer from "../../../components/payslip/GeneratePayslipDrawer";
import { RootState } from "@/store/store";
import { PageHeader } from "@/components/PageHeader";
import TablePagination from "@/components/common/TablePagination";
import { useDisclosure } from "@heroui/modal";

const PayslipList = () => {
    const dispatch = useDispatch();
    const { payslips, loading, meta } = useSelector((state: RootState) => state.Payslip);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        dispatch(getPayslipsRequest({ page, limit }));
    }, [dispatch, page, limit]);

    const handleGenerateSuccess = () => {
        onClose();
        // dispatch(getPayslips({ page: 1, limit }));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Payslips (Admin)" />
                <Button color="primary" endContent={<Plus size={16} />} onPress={onOpen}>
                    Generate Payslip
                </Button>
            </div>

            <Table
                aria-label="Payslips Table"
                removeWrapper
                bottomContent={
                    meta && meta.total_items > limit && (
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
                    <TableColumn>MONTH/YEAR</TableColumn>
                    <TableColumn>EMPLOYEE ID</TableColumn>
                    <TableColumn>NET PAY</TableColumn>
                    <TableColumn>GENERATED AT</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={payslips || []} emptyContent={"No payslips found"} isLoading={loading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>{`${item.month} ${item.year}`}</TableCell>
                            <TableCell>{item.employee_id}</TableCell>
                            <TableCell>{`₹ ${item.net_pay.toFixed(2)}`}</TableCell>
                            <TableCell>{new Date(item.generated_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex justify-center">
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

            <GeneratePayslipDrawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onSuccess={handleGenerateSuccess}
            />
        </div>
    );
};

export default PayslipList;
