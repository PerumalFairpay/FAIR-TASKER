
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Calendar, Clock, Paperclip, Tag, User, CheckCircle2, AlertCircle, X, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import FileTypeIcon from "@/components/common/FileTypeIcon";

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task }) => {
    const [previewFile, setPreviewFile] = React.useState<{ url: string; type: string; name: string } | null>(null);

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
            case "Todo": return "default";
            case "In Progress": return "primary";
            case "Completed": return "success";
            case "Moved": return "warning";
            default: return "default";
        }
    };

    // Helper to strip HTML tags for cleaner display if needed, but we used dangerouslySetInnerHTML for description
    // const stripHtml = (html: string) => {
    //    let tmp = document.createElement("DIV");
    //    tmp.innerHTML = html;
    //    return tmp.textContent || tmp.innerText || "";
    // };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            backdrop="blur"
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                }
            }}
        >
            <ModalContent>
                {(onClose: () => void) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 pr-10">
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-bold">{task.task_name}</span>
                                <Chip size="sm" color={getPriorityColor(task.priority)} variant="flat">
                                    {task.priority}
                                </Chip>
                            </div>
                            <div className="flex items-center gap-2 text-small text-default-500 font-normal">
                                <span className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full bg-${getStatusColor(task.status)}`} />
                                    {task.status}
                                </span>
                                <span>•</span>
                                <span>Project ID: {task.project_id}</span>
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
                                            dangerouslySetInnerHTML={{ __html: task.description || "<p>No description provided.</p>" }}
                                        />
                                    </div>

                                    {/* Attachments Section */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-default-700 mb-3 flex items-center gap-2">
                                            <Paperclip size={16} /> Attachments
                                        </h4>
                                        {task.attachments && task.attachments.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-2">
                                                {task.attachments.map((att: string | any, index: number) => {
                                                    let url = "";
                                                    let fileName = "";
                                                    let fileType = "";

                                                    if (typeof att === 'string') {
                                                        url = att;
                                                        fileName = url.split("/").pop() || `Attachment ${index + 1}`;
                                                        // Try to guess extension if possible, else unknown
                                                    } else {
                                                        url = att.file_url;
                                                        fileName = att.file_name;
                                                        fileType = att.file_type;
                                                    }

                                                    return (
                                                        <div key={index} className="border border-default-200 rounded-lg p-3 flex items-center justify-between hover:bg-default-50 transition-colors">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <FileTypeIcon fileType={fileType} fileName={fileName} />
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="text-small font-medium truncate" title={fileName}>
                                                                        {fileName}
                                                                    </span>
                                                                    {fileType && (
                                                                        <span className="text-tiny text-default-400 capitalize">
                                                                            {fileType.split('/')[1] || fileType}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    isIconOnly
                                                                    size="sm"
                                                                    variant="light"
                                                                    onPress={() => setPreviewFile({
                                                                        url: url,
                                                                        type: fileType,
                                                                        name: fileName,
                                                                    })}
                                                                >
                                                                    <Eye size={18} className="text-default-500" />
                                                                </Button>
                                                                <a href={url} download target="_blank" rel="noopener noreferrer">
                                                                    <Button isIconOnly size="sm" variant="light">
                                                                        <Download size={18} className="text-default-500" />
                                                                    </Button>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-default-400 italic">No attachments</p>
                                        )}
                                    </div>

                                    {/* Sub-tasks / Checklist (Placeholder if structure existed, but going by payload) */}
                                    {/* ... */}
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
                                        <div className="flex items-start gap-3">
                                            <Clock size={18} className="text-default-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">Time</span>
                                                <span className="text-xs text-default-500">
                                                    {task.start_time} - {task.end_time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Assignees */}
                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wider">Assigned To</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {task.assigned_to?.map((userId: string) => (
                                                <div key={userId} className="flex items-center gap-2 bg-default-100 pr-3 rounded-full">
                                                    <Avatar
                                                        size="sm"
                                                        name={userId} // In a real app, map ID to name/avatar
                                                        className="w-6 h-6"
                                                    />
                                                    <span className="text-xs font-medium">User {userId}</span>
                                                </div>
                                            ))}
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

export default TaskDetailModal;
