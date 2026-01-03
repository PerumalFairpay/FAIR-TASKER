
import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import {
    Briefcase, Calendar, CheckCircle, Clock,
    Leaf, TrendingUp, Activity, CheckSquare
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
            name: string;
            task_name?: string; // Fallback
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

    // Calculate completion rate safely
    const totalTasks = data.my_tasks.overview.total_assigned || 0;
    const completionRate = totalTasks > 0
        ? Math.round((data.my_tasks.overview.completed / totalTasks) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStatCard
                    title="Total Tasks"
                    value={data.my_tasks.overview.total_assigned}
                    subtext="Assigned to you"
                    icon={<CheckSquare className="w-6 h-6 text-primary-500" />}
                    bgColor="bg-primary-50"
                />
                <DashboardStatCard
                    title="Pending"
                    value={data.my_tasks.overview.pending}
                    subtext="Tasks To Do"
                    icon={<Clock className="w-6 h-6 text-warning-500" />}
                    bgColor="bg-warning-50"
                />
                <DashboardStatCard
                    title="Completed"
                    value={data.my_tasks.overview.completed}
                    subtext="Tasks Finished"
                    icon={<CheckCircle className="w-6 h-6 text-success-500" />}
                    bgColor="bg-success-50"
                />

                {/* Custom Attendance Card to match Admin's style */}
                <Card className="shadow-sm border-none">
                    <CardBody className="flex flex-row justify-between items-center p-4">
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <p className="text-small font-medium text-default-500 uppercase tracking-wider">Attendance</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <h3 className="text-2xl font-bold text-default-900">{data.attendance_summary.present_days}</h3>
                                    <span className="text-xs font-medium text-success-600">Present</span>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-3">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-danger-500">{data.attendance_summary.absent_days}</span>
                                    <span className="text-[10px] text-default-400 uppercase">Absent</span>
                                </div>
                                <div className="w-[1px] h-full bg-default-200"></div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-warning-500">{data.attendance_summary.late_days}</span>
                                    <span className="text-[10px] text-default-400 uppercase">Late</span>
                                </div>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl bg-purple-50 h-fit`}>
                            <Clock className="w-6 h-6 text-purple-500" />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Main Metrics) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Efficiency / Completion */}
                        <Card className="shadow-sm border-none p-2">
                            <CardHeader className="justify-between px-4 pt-4 pb-0">
                                <div className="flex gap-3">
                                    <div className="p-2 bg-default-100 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-default-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-md font-bold text-default-900">Efficiency</p>
                                        <p className="text-tiny text-default-500">Task Completion</p>
                                    </div>
                                </div>
                                <Chip size="sm" color="success" variant="flat">On Track</Chip>
                            </CardHeader>
                            <CardBody className="px-4 py-5 flex flex-col justify-center">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-default-600">Progress</span>
                                    <span className="text-sm font-bold text-default-900">{completionRate}%</span>
                                </div>
                                <Progress
                                    aria-label="Task Completion Rate"
                                    value={completionRate}
                                    className="h-3"
                                    color="success"
                                />
                                <div className="flex justify-between mt-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-tiny uppercase text-default-500 font-semibold tracking-wider">Completed</span>
                                        <span className="text-lg font-bold text-default-900">{data.my_tasks.overview.completed}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-tiny uppercase text-default-500 font-semibold tracking-wider">Assigned</span>
                                        <span className="text-lg font-bold text-default-900">
                                            {data.my_tasks.overview.total_assigned}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Task Priority Distribution */}
                        <Card className="shadow-sm border-none p-2">
                            <CardHeader className="px-4 pt-4 pb-0">
                                <div className="flex flex-col">
                                    <p className="text-md font-bold text-default-900">Task Overiew</p>
                                    <p className="text-tiny text-default-500">Status Distribution</p>
                                </div>
                            </CardHeader>
                            <CardBody className="px-4 py-4 gap-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-default-600">Active</span>
                                        <span className="text-sm font-bold text-default-900">{data.my_tasks.overview.in_progress}</span>
                                    </div>
                                    <Progress value={(data.my_tasks.overview.in_progress / (totalTasks || 1)) * 100} color="primary" className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-default-600">Pending</span>
                                        <span className="text-sm font-bold text-default-900">{data.my_tasks.overview.pending}</span>
                                    </div>
                                    <Progress value={(data.my_tasks.overview.pending / (totalTasks || 1)) * 100} color="warning" className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-default-600">Overdue</span>
                                        <span className="text-sm font-bold text-default-900">{data.my_tasks.overview.overdue}</span>
                                    </div>
                                    <Progress value={(data.my_tasks.overview.overdue / (totalTasks || 1)) * 100} color="danger" className="h-2" />
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Recent Tasks Table */}
                    <Card className="shadow-sm border-none">
                        <CardHeader className="flex justify-between px-6 py-4">
                            <div className="flex gap-2 items-center">
                                <Activity className="w-5 h-5 text-default-500" />
                                <h3 className="font-bold text-large text-default-900">Recent Tasks</h3>
                            </div>
                            <Chip size="sm" variant="flat" color="default">Latest</Chip>
                        </CardHeader>
                        <CardBody className="px-4 pb-4">
                            <Table aria-label="Recent Tasks Table" removeWrapper shadow="none">
                                <TableHeader>
                                    <TableColumn className="uppercase text-xs text-default-500 bg-transparent">Task Name</TableColumn>
                                    <TableColumn className="uppercase text-xs text-default-500 bg-transparent">Priority</TableColumn>
                                    <TableColumn className="uppercase text-xs text-default-500 bg-transparent">Status</TableColumn>
                                    <TableColumn className="uppercase text-xs text-default-500 bg-transparent">Due Date</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent={"No recent tasks."}>
                                    {data.my_tasks.recent_tasks.map((task, index) => (
                                        <TableRow key={index} className="border-b border-default-100 last:border-none">
                                            <TableCell>
                                                <span className="text-default-900 font-medium">{task.task_name || task.name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Chip size="sm" variant="flat" color={getPriorityColor(task.priority)} className="capitalize text-xs">
                                                    {task.priority || "Normal"}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${getStatusDotColor(task.status)}`}></span>
                                                    <span className="text-default-700 capitalize">{task.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-default-500">{task.end_date || task.due_date ? new Date(task.end_date || task.due_date!).toLocaleDateString() : "-"}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6">
                    {/* Active Projects */}
                    <Card className="shadow-sm border-none">
                        <CardHeader className="flex justify-between px-6 py-4 pb-2">
                            <div className="flex gap-2 items-center">
                                <Briefcase className="w-5 h-5 text-default-500" />
                                <h3 className="font-bold text-medium text-default-900">My Projects</h3>
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 py-4 pt-2">
                            <div className="space-y-4">
                                {data.my_projects.length === 0 ? <p className="text-sm text-default-500">No active projects.</p> :
                                    data.my_projects.map((proj, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-default-100 last:border-none">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-default-700">{proj.name}</span>
                                                <span className="text-xs text-default-400 capitalize">{proj.status}</span>
                                            </div>
                                            <Chip size="sm" variant="flat" className="bg-default-100 text-default-700 text-[10px] uppercase font-bold">
                                                {proj.role}
                                            </Chip>
                                        </div>
                                    ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Leave Balance */}
                    <Card className="shadow-sm border-none">
                        <CardHeader className="flex gap-2 px-6 py-4 pb-2">
                            <Leaf className="w-5 h-5 text-default-500" />
                            <h3 className="font-bold text-medium text-default-900">Leave Balance</h3>
                        </CardHeader>
                        <CardBody className="px-6 py-2 pb-6">
                            <div className="space-y-4">
                                {data.leave_balance.map((lb, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-default-700 font-medium">{lb.type}</span>
                                            <span className="text-default-500 text-xs">{lb.balance} Left</span>
                                        </div>
                                        <Progress value={(lb.balance / lb.total) * 100} size="sm" color={lb.balance < 2 ? "danger" : "secondary"} className="h-1.5" />
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Upcoming Holidays */}
                    <Card className="shadow-sm border-none">
                        <CardHeader className="flex gap-2 px-6 py-4">
                            <Calendar className="w-5 h-5 text-default-500" />
                            <h3 className="font-bold text-medium text-default-900">Holidays</h3>
                        </CardHeader>
                        <CardBody className="px-6 py-2 pb-6">
                            <div className="relative border-l border-default-200 ml-2 space-y-6">
                                {data.upcoming_holidays.length === 0 ? (
                                    <p className="pl-6 text-sm text-default-500 italic">No upcoming holidays.</p>
                                ) : (
                                    data.upcoming_holidays.slice(0, 4).map((h, index) => (
                                        <div key={index} className="ml-6 relative">
                                            <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-default-400 ring-4 ring-white"></span>
                                            <p className="text-sm font-semibold text-default-900">{h.name}</p>
                                            <span className="text-[10px] text-default-400 block mt-1">
                                                {new Date(h.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function DashboardStatCard({ title, value, subtext, icon, bgColor }: { title: string, value: string | number, subtext: string, icon: React.ReactNode, bgColor: string }) {
    return (
        <Card className="shadow-sm border-none h-full">
            <CardBody className="flex flex-row justify-between items-start p-4 h-full">
                <div className="flex flex-col justify-between h-full">
                    <p className="text-small font-medium text-default-500 uppercase tracking-wider">{title}</p>
                    <div className="mt-2">
                        <h3 className="text-3xl font-bold text-default-900">{value}</h3>
                        <p className="text-xs text-default-400 mt-1">{subtext}</p>
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${bgColor} h-fit`}>
                    {icon}
                </div>
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

function getStatusDotColor(s: string) {
    if (!s) return "bg-default-400";
    switch (s.toLowerCase()) {
        case 'completed': return 'bg-success-500';
        case 'in progress': return 'bg-primary-500';
        case 'todo': return 'bg-default-400';
        case 'overdue': return 'bg-danger-500';
        default: return 'bg-warning-500';
    }
}
