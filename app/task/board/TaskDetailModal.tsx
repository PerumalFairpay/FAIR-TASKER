
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

import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/rootReducer";
import { getTaskRequest } from "@/store/task/action";
import { useEffect } from "react";

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task: initialTask }) => {
    const dispatch = useDispatch();
    const { currentTask } = useSelector((state: AppState) => state.Task);
    const [previewFile, setPreviewFile] = React.useState<{ url: string; type: string; name: string } | null>(null);

    useEffect(() => {
        if (isOpen && initialTask?.id) {
            dispatch(getTaskRequest(initialTask.id));
        }
    }, [isOpen, initialTask, dispatch]);

    const task = (currentTask && currentTask.id === initialTask?.id) ? currentTask : initialTask;

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
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {task.attachments.map((att: string | any, index: number) => {
                                                    let url = "";
                                                    let fileName = "";
                                                    let fileType = "";

                                                    if (typeof att === 'string') {
                                                        url = att;
                                                        fileName = url.split("/").pop() || `Attachment ${index + 1}`;
                                                    } else {
                                                        url = att.file_url;
                                                        fileName = att.file_name;
                                                        fileType = att.file_type;
                                                    }

                                                    return (
                                                        <div key={index} className="border border-default-200 rounded-lg p-3 flex items-center justify-between hover:bg-default-50 transition-colors bg-background">
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
                                                                    <Eye size={16} className="text-default-500" />
                                                                </Button>
                                                                <a href={url} download target="_blank" rel="noopener noreferrer">
                                                                    <Button isIconOnly size="sm" variant="light">
                                                                        <Download size={16} className="text-default-500" />
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

                                    <Divider />

                                    {/* EOD History / Work Log */}
                                    {task.eod_history && task.eod_history.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-default-700 mb-4 flex items-center gap-2">
                                                <Clock size={16} /> Work History
                                            </h4>
                                            <div className="flex flex-col gap-0 border-l-2 border-default-200 ml-2">
                                                {task.eod_history.map((log: any, index: number) => (
                                                    <div key={index} className="relative pl-6 pb-6 last:pb-0">
                                                        {/* Timeline Dot */}
                                                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />

                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="text-xs font-semibold text-default-600">
                                                                    {log.timestamp ? format(new Date(log.timestamp), "MMM dd, hh:mm a") : log.date}
                                                                </span>
                                                                <Chip size="sm" variant="flat" color={getStatusColor(log.status) as any} className="h-5 text-[10px]">
                                                                    {log.status}
                                                                </Chip>
                                                                {log.progress != null && (
                                                                    <span className="text-xs text-secondary font-medium">
                                                                        {log.progress}% Completed
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {log.summary && log.summary !== "<p></p>" && (
                                                                <div className="bg-default-50 p-3 rounded-lg text-sm text-default-600">
                                                                    <div dangerouslySetInnerHTML={{ __html: log.summary }} />
                                                                </div>
                                                            )}

                                                            {/* History Attachments */}
                                                            {log.attachments && log.attachments.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mt-1">
                                                                    {log.attachments.map((att: any, i: number) => {
                                                                        const fName = typeof att === 'string' ? att.split('/').pop() : (att.file_name || "File");
                                                                        const fUrl = typeof att === 'string' ? att : att.file_url;
                                                                        return (
                                                                            <a key={i} href={fUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline bg-primary-50 px-2 py-1 rounded">
                                                                                <Paperclip size={12} />
                                                                                {fName}
                                                                            </a>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Meta Info */}
                                <div className="flex flex-col gap-5 border-l border-divider pl-6 md:pl-6">

                                    {/* Progress Bar Display */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wider">Progress</h4>
                                            <span className="text-sm font-bold text-primary">{task.progress || 0}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-default-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-500 ease-out"
                                                style={{ width: `${Math.min(100, Math.max(0, task.progress || 0))}%` }}
                                            />
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Dates */}
                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wider">Timeline</h4>
                                        <div className="flex items-start gap-3">
                                            <Calendar size={18} className="text-default-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">Start Date</span>
                                                <span className="text-xs text-default-500">
                                                    {task.start_date ? format(new Date(task.start_date), "MMM dd, yyyy") : "N/A"} {task.start_time || ""}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 size={18} className="text-default-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">End Date</span>
                                                <span className="text-xs text-default-500">
                                                    {task.end_date ? format(new Date(task.end_date), "MMM dd, yyyy") : "N/A"} {task.end_time || ""}
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

            {
                previewFile && (
                    <FilePreviewModal
                        isOpen={Boolean(previewFile)}
                        onClose={() => setPreviewFile(null)}
                        fileUrl={previewFile.url}
                        fileType={previewFile.type}
                        fileName={previewFile.name}
                    />
                )
            }
        </Modal >
    );
};

export default TaskDetailModal;
