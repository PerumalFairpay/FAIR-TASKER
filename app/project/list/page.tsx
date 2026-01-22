"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    getProjectsRequest,
    getProjectRequest,
    createProjectRequest,
    updateProjectRequest,
    deleteProjectRequest,
    clearProjectDetails,
} from "@/store/project/action";
import { getClientsRequest } from "@/store/client/action";
import { getEmployeesSummaryRequest } from "@/store/employee/action";
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
import { PlusIcon, PencilIcon, TrashIcon, Calendar, Building2, User2, AlertCircle, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import AddEditProjectDrawer from "./AddEditProjectDrawer";
import DeleteProjectModal from "./DeleteProjectModal";

export default function ProjectListPage() {
    const dispatch = useDispatch();
    const { projects, project, loading, success } = useSelector((state: RootState) => state.Project);
    const { clients } = useSelector((state: RootState) => state.Client);

    const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onOpenChange: onAddEditOpenChange, onClose: onAddEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const { employees } = useSelector((state: RootState) => state.Employee);

    useEffect(() => {
        dispatch(getProjectsRequest());
        dispatch(getClientsRequest());
    }, [dispatch]);

    useEffect(() => {
        if (isAddEditOpen && (!employees || employees.length === 0)) {
            dispatch(getEmployeesSummaryRequest());
        }
    }, [isAddEditOpen, employees, dispatch]);

    useEffect(() => {
        if (success) {
            onAddEditClose();
            onDeleteClose();
            dispatch(clearProjectDetails());
        }
    }, [success, onAddEditClose, onDeleteClose, dispatch]);

    const handleCreate = () => {
        setMode("create");
        setSelectedProject(null);
        onAddEditOpen();
    };

    const handleEdit = (project: any) => {
        setMode("edit");
        setSelectedProject(project);
        dispatch(getProjectRequest(project.id));
        onAddEditOpen();
    };

    const handleDeleteClick = (project: any) => {
        setSelectedProject(project);
        onDeleteOpen();
    };

    const handleAddEditSubmit = (data: any) => {
        if (mode === "create") {
            dispatch(createProjectRequest(data));
        } else {
            dispatch(updateProjectRequest(selectedProject.id, data));
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedProject) {
            dispatch(deleteProjectRequest(selectedProject.id));
        }
    };

    const getClientName = (item: any) => {
        if (item.client) return item.client.contact_name;
        const client = clients.find((c: any) => c.id === item.client_id);
        return client ? client.contact_name : "Unknown Client";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "success";
            case "In Progress": return "primary";
            case "On Hold": return "warning";
            case "Planned": return "default";
            default: return "default";
        }
    };

    const getPriorityColor = (priority: string): "danger" | "warning" | "primary" | "success" | "default" => {
        switch (priority) {
            case "Urgent": return "danger";
            case "High": return "warning";
            case "Medium": return "primary";
            case "Low": return "success";
            default: return "default";
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case "Urgent": return <AlertCircle size={14} />;
            case "High": return <ArrowUpCircle size={14} />;
            case "Medium": return <ArrowRightCircle size={14} />;
            case "Low": return <ArrowDownCircle size={14} />;
            default: return null;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    title="Projects"
                    description="Manage your company projects and teams"
                />
                <Button
                    color="primary"
                    endContent={<PlusIcon size={16} />}
                    onPress={handleCreate}
                >
                    Add New Project
                </Button>
            </div>

            <Table aria-label="Project table" shadow="sm" removeWrapper isHeaderSticky>
                <TableHeader>
                    <TableColumn>PROJECT</TableColumn>
                    <TableColumn>CLIENT</TableColumn>
                    <TableColumn>TEAM</TableColumn>
                    <TableColumn>DATES</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>PRIORITY</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={projects || []} emptyContent={"No projects found"} isLoading={loading}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={item.logo}
                                        name={item.name}
                                        radius="lg"
                                        size="md"
                                        className="flex-shrink-0"
                                        fallback={<Building2 size={20} className="text-default-400" />}
                                        showFallback
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-default-700">{item.name}</span>
                                        {item.budget > 0 && (
                                            <span className="text-tiny text-primary font-medium">
                                                Budget: {item.currency} {parseFloat(item.budget).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Building2 size={14} className="text-default-400" />
                                    <span className="text-sm">{getClientName(item)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <AvatarGroup isBordered max={3} size="sm" total={
                                    (item.team_members?.length || 0) +
                                    (item.team_leaders?.length || 0) +
                                    (item.project_managers?.length || 0)
                                }>
                                    {[
                                        ...(item.project_managers || []),
                                        ...(item.team_leaders || []),
                                        ...(item.team_members || [])
                                    ].map((member: any) => (
                                        <Avatar
                                            key={member.id}
                                            src={member.profile_picture}
                                            name={member.name}
                                        />
                                    ))}
                                </AvatarGroup>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1 text-tiny text-default-500">
                                        <Calendar size={12} />
                                        <span>S: {item.start_date || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-tiny text-default-500">
                                        <Calendar size={12} />
                                        <span>E: {item.end_date || "N/A"}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={getStatusColor(item.status)}
                                    size="sm"
                                    variant="flat"
                                    className="capitalize"
                                >
                                    {item.status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={getPriorityColor(item.priority)}
                                    size="sm"
                                    variant="flat"
                                    startContent={getPriorityIcon(item.priority)}
                                    className="capitalize font-medium px-2 gap-1"
                                >
                                    {item.priority}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-center gap-2">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => handleEdit(item)}
                                        className="text-default-400 cursor-pointer active:opacity-50"
                                    >
                                        <PencilIcon size={18} />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => handleDeleteClick(item)}
                                        className="text-danger cursor-pointer active:opacity-50"
                                    >
                                        <TrashIcon size={18} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AddEditProjectDrawer
                isOpen={isAddEditOpen}
                onOpenChange={onAddEditOpenChange}
                mode={mode}
                selectedProject={mode === 'edit' && project && selectedProject && project.id === selectedProject.id ? project : selectedProject}
                loading={loading}
                onSubmit={handleAddEditSubmit}
            />

            <DeleteProjectModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onConfirm={handleDeleteConfirm}
                loading={loading}
            />
        </div>
    );
}
