"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    getClientsRequest,
    createClientRequest,
    updateClientRequest,
    deleteClientRequest,
    clearClientDetails,
} from "@/store/client/action";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { PlusIcon, PencilIcon, TrashIcon, User2, Mail, Phone, MapPin } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { User } from "@heroui/user";
import AddEditClientDrawer from "./AddEditClientDrawer";
import DeleteClientModal from "./DeleteClientModal";

export default function ClientListPage() {
    const dispatch = useDispatch();
    const { clients, loading, success } = useSelector((state: RootState) => state.Client);

    const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onOpenChange: onAddEditOpenChange, onClose: onAddEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedClient, setSelectedClient] = useState<any>(null);

    useEffect(() => {
        dispatch(getClientsRequest());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            onAddEditClose();
            onDeleteClose();
            dispatch(clearClientDetails());
        }
    }, [success, onAddEditClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setSelectedClient(null);
        onAddEditOpen();
    };

    const handleEdit = (client: any) => {
        setMode("edit");
        setSelectedClient(client);
        onAddEditOpen();
    };

    const handleDeleteClick = (client: any) => {
        setSelectedClient(client);
        onDeleteOpen();
    };

    const handleAddEditSubmit = (formData: FormData) => {
        if (mode === "create") {
            dispatch(createClientRequest(formData));
        } else {
            dispatch(updateClientRequest(selectedClient.id, formData));
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedClient) {
            dispatch(deleteClientRequest(selectedClient.id));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    title="Clients & Vendors"
                    description="Manage your business partners and service providers"
                />
                <Button
                    color="primary"
                    variant="shadow"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                >
                    Add Client/Vendor
                </Button>
            </div>

            <Table aria-label="Clients table" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>COMPANY</TableColumn>
                    <TableColumn>CONTACT PERSON</TableColumn>
                    <TableColumn>CONTACT DETAILS</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={clients || []} emptyContent={"No clients found"} isLoading={loading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: item.logo, name: item.company_name }}
                                    description={item.description || "No description"}
                                    name={item.company_name}
                                >
                                    {item.description || "No description"}
                                </User>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1 text-sm">
                                        <User2 size={14} className="text-default-400" />
                                        <span>{item.contact_name}</span>
                                    </div>
                                    <p className="text-tiny text-default-400 pl-5">{item.contact_person_designation}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1 text-tiny text-default-500">
                                        <Mail size={12} />
                                        {item.contact_email}
                                    </div>
                                    <div className="flex items-center gap-1 text-tiny text-default-500">
                                        <Phone size={12} />
                                        {item.contact_mobile}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={item.status === "Active" ? "success" : "danger"}
                                    size="sm"
                                    variant="flat"
                                >
                                    {item.status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-center gap-2">
                                    <span
                                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <PencilIcon size={18} />
                                    </span>
                                    <span
                                        className="text-lg text-danger cursor-pointer active:opacity-50"
                                        onClick={() => handleDeleteClick(item)}
                                    >
                                        <TrashIcon size={18} />
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AddEditClientDrawer
                isOpen={isAddEditOpen}
                onOpenChange={onAddEditOpenChange}
                mode={mode}
                selectedClient={selectedClient}
                loading={loading}
                onSubmit={handleAddEditSubmit}
            />

            <DeleteClientModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={handleDeleteConfirm}
                loading={loading}
            />
        </div>
    );
}
