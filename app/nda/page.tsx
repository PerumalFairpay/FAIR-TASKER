"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
    generateNDARequest,
    getNDAListRequest,
    clearNDAState,
} from "@/store/nda/action";
import { RootState } from "@/store/store";
import { Button } from "@heroui/button";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { useDisclosure } from "@heroui/modal";
import { PlusIcon, CheckCircle2, Clock, FileText } from "lucide-react";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { PermissionGuard } from "@/components/PermissionGuard";
import GenerateNDADrawer from "./GenerateNDADrawer";

export default function NDAPage() {
    const dispatch = useDispatch();
    const { ndaList, generatedLink, loading, success, error } = useSelector(
        (state: RootState) => state.NDA
    );

    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onOpenChange: onDrawerOpenChange, onClose: onDrawerClose } = useDisclosure();

    useEffect(() => {
        dispatch(getNDAListRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            addToast({
                title: "Success",
                description: success,
                color: "success",
            }); 
        }
        if (error) {
            addToast({
                title: "Error",
                description: typeof error === "string" ? error : "Something went wrong",
                color: "danger",
            });
            dispatch(clearNDAState());
        }
    }, [success, error, dispatch]);

    const handleGenerate = (data: { employee_name: string; role: string; address: string }) => {
        dispatch(generateNDARequest(data));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Signed":
                return "success";
            case "Expired":
                return "danger";
            case "Pending":
                return "warning";
            default:
                return "default";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <PermissionGuard
            permission="employee:submit"
            fallback={
                <div className="p-6 text-center text-red-500">Access Denied</div>
            }
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <PageHeader title="NDA Management" />
                    <Button
                        color="primary"
                        endContent={<PlusIcon size={16} />}
                        onPress={onDrawerOpen}
                    >
                        Generate NDA Link
                    </Button>
                </div>

                {/* NDA List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">NDA Requests</h2>
                    <Table aria-label="NDA requests table" removeWrapper>
                        <TableHeader>
                            <TableColumn>EMPLOYEE NAME</TableColumn>
                            <TableColumn>ROLE</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>CREATED AT</TableColumn>
                            <TableColumn>EXPIRES AT</TableColumn>
                            <TableColumn>DOCUMENTS</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={ndaList || []}
                            emptyContent={"No NDA requests found"}
                            isLoading={loading}
                        >
                            {(item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm">{item.employee_name}</p>
                                            <p className="text-tiny text-default-400">
                                                {item.address}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{item.role}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            color={getStatusColor(item.status)}
                                            size="sm"
                                            variant="flat"
                                            startContent={
                                                item.status === "Signed" ? (
                                                    <CheckCircle2 size={14} />
                                                ) : item.status === "Pending" ? (
                                                    <Clock size={14} />
                                                ) : (
                                                    <FileText size={14} />
                                                )
                                            }
                                        >
                                            {item.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">
                                            {formatDate(item.created_at)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">
                                            {formatDate(item.expires_at)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">
                                            {item.documents?.length || 0}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Generate NDA Drawer */}
                <GenerateNDADrawer
                    isOpen={isDrawerOpen}
                    onOpenChange={onDrawerOpenChange}
                    loading={loading}
                    onSubmit={handleGenerate}
                    generatedLink={generatedLink}
                />
            </div>
        </PermissionGuard>
    );
}
