
import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import {
    Users, Briefcase, Calendar, CheckCircle, Clock, AlertCircle,
    Leaf
} from "lucide-react";

interface EmployeeDashboardData {
    profile: {
        name: string;
        employee_id?: string;
        designation?: string;
        department?: string;
        profile_picture?: string;
    };
    attendance_summary: {
        present_days: number;
        absent_days: number;
        late_days: number;
        total_working_days: number;
        average_work_hours: number;
    };
    leave_balance: Array<{
        type: string;
        balance: number;
        total: number;
        used: number;
    }>;
    my_tasks: {
        overview: {
            total_assigned: number;
            pending: number;
            in_progress: number;
            completed: number;
            overdue: number;
        };
        recent_tasks: Array<{
            id: string;
            name: string; // or task_name
            task_name?: string;
            priority: string;
            due_date?: string;
            end_date?: string;
            status: string;
        }>;
    };
    my_projects: Array<{
        name: string;
        status: string;
        role: string;
        end_date?: string;
    }>;
    recent_leaves: Array<{
        type?: string;
        status: string;
        start_date: string;
        end_date: string;
        leave_type_details?: { name: string };
    }>;
    upcoming_holidays: Array<{ name: string; date: string; type: string }>;
}

export default function EmployeeDashboard({ data }: { data: EmployeeDashboardData }) {
    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Welcome & Profile */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
                <CardBody className="flex flex-row items-center gap-6 p-6">
                    <User
                        name={data.profile.name}
                        description={
                            <span className="text-white/80">
                                {data.profile.designation} • {data.profile.department}
                            </span>
                        }
                        avatarProps={{
                            src: data.profile.profile_picture,
                            size: "lg",
                            className: "w-20 h-20 text-large"
                        }}
                        classNames={{
                            name: "text-2xl font-bold text-white",
                            description: "text-white/80"
                        }}
                    />
                    <div className="ml-auto text-right hidden lg:block">
                        <p className="text-white/80 text-sm">Employee ID</p>
                        <p className="text-xl font-mono font-bold">{data.profile.employee_id || "N/A"}</p>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance & Leaves */}
                <div className="space-y-6 lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <p className="font-bold flex items-center gap-2"><Clock size={18} /> Attendance (This Month)</p>
                        </CardHeader>
                        <CardBody className="grid grid-cols-2 gap-4">
                            <div className="bg-default-50 p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold text-success">{data.attendance_summary.present_days}</p>
                                <p className="text-xs text-default-500">Present</p>
                            </div>
                            <div className="bg-default-50 p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold text-danger">{data.attendance_summary.absent_days}</p>
                                <p className="text-xs text-default-500">Absent</p>
                            </div>
                            <div className="bg-default-50 p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold text-warning">{data.attendance_summary.late_days}</p>
                                <p className="text-xs text-default-500">Late</p>
                            </div>
                            <div className="bg-default-50 p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold">{data.attendance_summary.average_work_hours}h</p>
                                <p className="text-xs text-default-500">Avg Hrs/Day</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <p className="font-bold flex items-center gap-2"><Leaf size={18} /> Leave Balance</p>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            {data.leave_balance.map((lb, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{lb.type}</span>
                                        <span className="font-medium text-default-500">{lb.balance} left</span>
                                    </div>
                                    <Progress value={(lb.balance / lb.total) * 100} size="sm" className="h-1.5" />
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>

                {/* Tasks & Projects */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Assigned Tasks"
                            value={data.my_tasks.overview.total_assigned}
                            color="primary"
                        />
                        <StatCard
                            title="Pending"
                            value={data.my_tasks.overview.pending}
                            color="warning"
                        />
                        <StatCard
                            title="Completed"
                            value={data.my_tasks.overview.completed}
                            color="success"
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <p className="font-bold">Recent Tasks</p>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                {data.my_tasks.recent_tasks.length === 0 ? <p className="text-sm text-default-500">No recent tasks.</p> :
                                    data.my_tasks.recent_tasks.map((task, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-default-100 hover:bg-default-50">
                                            <div>
                                                <p className="font-medium text-sm">{task.task_name || task.name}</p>
                                                <p className="text-xs text-default-400">Due: {task.end_date || task.due_date || "N/A"}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Chip size="sm" variant="flat" color={getPriorityColor(task.priority)}>{task.priority}</Chip>
                                                <Chip size="sm" variant="dot" color={getStatusColor(task.status)}>{task.status}</Chip>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardBody>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><p className="font-bold">My Projects</p></CardHeader>
                            <CardBody>
                                <div className="space-y-3">
                                    {data.my_projects.length === 0 ? <p className="text-sm text-default-500">No active projects.</p> :
                                        data.my_projects.map((proj, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <span className="font-medium">{proj.name}</span>
                                                <Chip size="sm" variant="flat">{proj.role}</Chip>
                                            </div>
                                        ))}
                                </div>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader><p className="font-bold">Upcoming Holidays</p></CardHeader>
                            <CardBody>
                                <div className="space-y-3">
                                    {data.upcoming_holidays.length === 0 ? <p className="text-sm text-default-500">No holidays.</p> :
                                        data.upcoming_holidays.map((h, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <span>{h.name}</span>
                                                <span className="text-default-500">{new Date(h.date).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }: { title: string, value: number, color: "primary" | "success" | "warning" | "danger" }) {
    const colorMap = {
        primary: "bg-blue-100 text-blue-600",
        success: "bg-green-100 text-green-600",
        warning: "bg-orange-100 text-orange-600",
        danger: "bg-red-100 text-red-600",
    }
    return (
        <Card>
            <CardBody className="text-center p-4">
                <p className={`text-3xl font-bold mb-1 ${color === "primary" ? "text-blue-600" : color === "success" ? "text-green-600" : color === "warning" ? "text-orange-600" : "text-red-600"}`}>
                    {value}
                </p>
                <p className="text-sm text-default-500">{title}</p>
            </CardBody>
        </Card>
    );
}

function getPriorityColor(p: string) {
    if (!p) return "default";
    switch (p.toLowerCase()) {
        case 'high': return 'danger';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return 'default';
    }
}

function getStatusColor(s: string) {
    if (!s) return "default";
    switch (s.toLowerCase()) {
        case 'completed': return 'success';
        case 'in progress': return 'primary';
        case 'todo': return 'default';
        default: return 'warning';
    }
}
