"use client";

import React, { useEffect } from "react";
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
import { getEmployeeListRequest } from "@/store/employee/action";
import { AppState } from "@/store/rootReducer";

export default function EmployeePage() {
    const dispatch = useDispatch();
    const { employeeList, loading } = useSelector(
        (state: AppState) => state.Employee
    );

    useEffect(() => {
        dispatch(getEmployeeListRequest());
    }, [dispatch]);

    const columns = [
        { key: "name", label: "NAME" },
        { key: "email", label: "EMAIL" },
        { key: "employee_type", label: "EMPLOYEE TYPE" },
        { key: "role", label: "ROLE" },
    ];

    return (
        <div className="w-full px-6 py-6">
            <h1 className="text-2xl font-bold mb-4 text-default-900">
                Employee Management
            </h1>
            <Table
                aria-label="Employee Management Table"
                removeWrapper
            >
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
        </div>
    );
}
