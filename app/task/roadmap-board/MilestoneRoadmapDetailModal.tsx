
import React, { useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Calendar, Paperclip, Tag, User, CheckCircle2, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";

import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { getMilestoneRoadmapRequest } from "@/store/milestoneRoadmap/action";

interface MilestoneRoadmapDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any; // Using 'task' to match existing usage in page.tsx
}

const MilestoneRoadmapDetailModal: React.FC<MilestoneRoadmapDetailModalProps> = ({ isOpen, onClose, task: initialTask }) => {
    const dispatch = useDispatch();
    const { currentMilestoneRoadmap } = useSelector((state: AppState) => state.MilestoneRoadmap);
    const { employees } = useSelector((state: AppState) => state.Employee);
    const [previewFile, setPreviewFile] = React.useState<{ url: string; type: string; name: string } | null>(null);

    useEffect(() => {
        if (isOpen && initialTask?.id) {
            dispatch(getMilestoneRoadmapRequest(initialTask.id));
        }
    }, [isOpen, initialTask, dispatch]);

    const task = (currentMilestoneRoadmap && currentMilestoneRoadmap.id === initialTask?.id) ? currentMilestoneRoadmap : initialTask;

    if (!task) return null;

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "high": return "danger";
            case "medium": return "warning";
            case "low": return "success";
            default: return "default";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Backlog": return "warning";
            case "Milestone": return "primary";
            case "Roadmap": return "success";
            default: return "default";
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            backdrop="blur"
        >
            <ModalContent>
                {(onClose: () => void) => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-4 pr-10">
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-bold">{task.task_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Chip size="sm" color={getPriorityColor(task.priority)} variant="flat">
                                    {task.priority}
                                </Chip>
                                <Chip size="sm" color={getStatusColor(task.status) as any} variant="flat" className="capitalize">
                                    {task.status}
                                </Chip>
                            </div>
                        </ModalHeader>
                        <ModalBody className="pb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column: Description & Details */}
                                <div className="md:col-span-2 flex flex-col gap-6">

                                    {/* Description Section */}
                                    <div className="bg-default-50 p-4 rounded-xl">
                                        <h4 className="text-sm font-semibold text-default-700 mb-2 flex items-center gap-2">
                                            Description
                                        </h4>
                                        <div
                                            className="text-sm text-default-600 prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: (task.description || "<p>No description provided.</p>").replace(/&nbsp;/g, " ")
                                            }}
                                        />
                                    </div>

                                    {/* Attachments Section */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-default-700 mb-3 flex items-center gap-2">
                                            <Paperclip size={16} /> Attachments
                                        </h4>
                                        {task.attachments && task.attachments.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {task.attachments.map((att: any, index: number) => {
                                                    let url = att.file_url;
                                                    let fileName = att.file_name;
                                                    let fileType = att.file_type || "";

                                                    const isImage = fileType?.startsWith("image/") || url.match(/\.(jpeg|jpg|gif|png|webp)$/i);

                                                    return (
                                                        <div key={index} className="group relative border border-default-200 rounded-xl overflow-hidden bg-background hover:shadow-md transition-all">
                                                            <div
                                                                className="aspect-square w-full bg-default-100 flex items-center justify-center cursor-pointer overflow-hidden relative"
                                                                onClick={() => setPreviewFile({ url, type: fileType, name: fileName })}
                                                            >
                                                                {isImage ? (
                                                                    <img
                                                                        src={url}
                                                                        alt={fileName}
                                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                    />
                                                                ) : (
                                                                    <div className="flex flex-col items-center gap-2 text-default-500">
                                                                        <FileTypeIcon fileType={fileType} fileName={fileName} className="w-8 h-8" />
                                                                        <span className="text-xs px-2 text-center line-clamp-2 break-all max-w-full">
                                                                            {fileName}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                                                    <Button
                                                                        isIconOnly
                                                                        size="sm"
                                                                        variant="flat"
                                                                        className="bg-white/90 text-default-900"
                                                                        onPress={() => setPreviewFile({ url, type: fileType, name: fileName })}
                                                                    >
                                                                        <Eye size={16} />
                                                                    </Button>
                                                                    <a href={url} download target="_blank" rel="noopener noreferrer">
                                                                        <Button isIconOnly size="sm" variant="flat" className="bg-white/90 text-default-900">
                                                                            <Download size={16} />
                                                                        </Button>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-default-400 italic">No attachments</p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Meta Info */}
                                <div className="flex flex-col gap-5 border-l border-divider pl-6 md:pl-6">
                                    {/* Dates */}
                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wider">Timeline</h4>
                                        <div className="flex items-start gap-3">
                                            <Calendar size={18} className="text-default-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">Start Date</span>
                                                <span className="text-xs text-default-500">
                                                    {task.start_date ? format(new Date(task.start_date), "MMM dd, yyyy") : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 size={18} className="text-default-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">End Date</span>
                                                <span className="text-xs text-default-500">
                                                    {task.end_date ? format(new Date(task.end_date), "MMM dd, yyyy") : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Assignees */}
                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wider">Assigned To</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {task.assigned_to?.map((userId: string) => {
                                                const emp = (employees || []).find((e: any) => e.id === userId);
                                                return (
                                                    <div key={userId} className="flex items-center gap-2 bg-default-100 pr-3 rounded-full">
                                                        <Avatar
                                                            size="sm"
                                                            src={emp?.profile_picture}
                                                            name={emp?.name || "?"}
                                                            className="w-6 h-6"
                                                        />
                                                        <span className="text-xs font-medium">{emp?.name || "Unknown"}</span>
                                                    </div>
                                                );
                                            })}
                                            {(!task.assigned_to || task.assigned_to.length === 0) && (
                                                <span className="text-sm text-default-400">Unassigned</span>
                                            )}
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Tags */}
                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wider">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {task.tags && task.tags.length > 0 ? (
                                                task.tags.map((tag: string) => (
                                                    <Chip key={tag} size="sm" variant="dot" color="primary">
                                                        {tag}
                                                    </Chip>
                                                ))
                                            ) : (
                                                <span className="text-sm text-default-400">No tags</span>
                                            )}
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Metadata */}
                                    <div className="flex flex-col gap-1 text-[10px] text-default-400">
                                        <p>Created: {task.created_at ? format(new Date(task.created_at), "MMM dd, yyyy HH:mm") : "N/A"}</p>
                                        <p>Updated: {task.updated_at ? format(new Date(task.updated_at), "MMM dd, yyyy HH:mm") : "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className="border-t border-divider">
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>

            {previewFile && (
                <FilePreviewModal
                    isOpen={Boolean(previewFile)}
                    onClose={() => setPreviewFile(null)}
                    fileUrl={previewFile.url}
                    fileType={previewFile.type}
                    fileName={previewFile.name}
                />
            )}
        </Modal>
    );
};

export default MilestoneRoadmapDetailModal;
