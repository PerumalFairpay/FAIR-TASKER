"use client";
import React, { useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Download, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getPayslipsRequest, downloadPayslipRequest } from "../../../store/payslip/action";
import { RootState } from "@/store/store";
import { PageHeader } from "@/components/PageHeader";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";

const EmployeePayslipList = () => {
    const dispatch = useDispatch();
    const { payslips, loading } = useSelector((state: RootState) => state.Payslip);
    const { user } = useSelector((state: RootState) => state.Auth);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedPayslipId, setSelectedPayslipId] = React.useState<string | null>(null);

    useEffect(() => {
        if (user && user.employee_id) {
            dispatch(getPayslipsRequest({ employee_id: user.employee_id }));
        }
    }, [dispatch, user]);

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
            <div className="mb-6">
                <PageHeader title="My Payslips" />
            </div>

            <Table aria-label="My Payslips Table" removeWrapper>
                <TableHeader>
                    <TableColumn>MONTH</TableColumn>
                    <TableColumn>YEAR</TableColumn>
                    <TableColumn>NET PAY</TableColumn>
                    <TableColumn>GENERATED AT</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={payslips || []} emptyContent={"No payslips found"} isLoading={loading}>
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
