
import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { User } from "@heroui/user";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import {
    Users, Briefcase, Calendar, CheckCircle, Clock, AlertCircle,
    Building, TrendingUp
} from "lucide-react";

interface AdminDashboardData {
    overview: {
        total_employees: number;
        total_clients: number;
        active_projects: number;
        total_projects: number;
        pending_leaves: number;
        approved_leaves_today: number;
    };
    task_metrics: {
        total_pending: number;
        total_completed: number;
        overdue: number;
        completion_rate: number;
        by_priority: Record<string, number>;
        by_status: Record<string, number>;
    };
    attendance_metrics: {
        today_stats: {
            present: number;
            absent: number;
            late: number;
            on_leave: number;
            total_records: number;
        };
    };
    new_employees: Array<{
        name: string;
        designation: string;
        department: string;
        date_of_joining: string;
        profile_picture?: string;
    }>;
    department_distribution: Array<{ name: string; count: number }>;
    recent_activities: Array<{ type: string; message: string; timestamp: string }>;
    client_stats: { active_clients: number; new_clients_this_month: number };
    upcoming_holidays: Array<{ name: string; date: string; type: string }>;
}

export default function AdminDashboard({ data }: { data: AdminDashboardData }) {
    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStatCard
                    title="Total Employees"
                    value={data.overview.total_employees}
                    subtext="Active Employees"
                    icon={<Users className="w-6 h-6 text-primary-500" />}
                    bgColor="bg-primary-50"
                />
                <DashboardStatCard
                    title="Active Projects"
                    value={data.overview.active_projects}
                    subtext="Projects In Progress"
                    icon={<Briefcase className="w-6 h-6 text-secondary-500" />}
                    bgColor="bg-secondary-50"
                />
                <DashboardStatCard
                    title="Pending Leaves"
                    value={data.overview.pending_leaves}
                    subtext="Awaiting Approval"
                    icon={<Calendar className="w-6 h-6 text-warning-500" />}
                    bgColor="bg-warning-50"
                />
                <Card className="shadow-sm border-none bg-white h-full">
                    <CardBody className="flex flex-col p-4">
                        <div className="flex justify-between items-start">
                            <p className="text-small font-semibold text-default-500 uppercase tracking-wider">Attendance Today</p>
                            <div className="p-3 rounded-xl bg-success-50 -mt-1 -mr-1">
                                <CheckCircle className="w-6 h-6 text-success-500" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-success-600">{data.attendance_metrics.today_stats.present}</span>
                                <span className="text-[10px] uppercase text-default-500 font-bold tracking-wider">Present</span>
                            </div>
                            <div className="w-[1px] h-8 bg-default-200"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-danger-500">{data.attendance_metrics.today_stats.absent}</span>
                                <span className="text-[10px] uppercase text-default-500 font-bold tracking-wider">Absent</span>
                            </div>
                            <div className="w-[1px] h-8 bg-default-200"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-warning-500">{data.overview.approved_leaves_today}</span>
                                <span className="text-[10px] uppercase text-default-500 font-bold tracking-wider">Leave</span>
                            </div>
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
                                        <p className="text-md font-bold text-default-900">Task Efficiency</p>
                                        <p className="text-tiny text-default-500">Completion Rate</p>
                                    </div>
                                </div>
                                <Chip size="sm" color="primary" variant="flat">YTD</Chip>
                            </CardHeader>
                            <CardBody className="px-4 py-5 flex flex-col justify-center">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-default-600">Progress</span>
                                    <span className="text-sm font-bold text-default-900">{data.task_metrics.completion_rate}%</span>
                                </div>
                                <Progress
                                    aria-label="Task Completion Rate"
                                    value={data.task_metrics.completion_rate}
                                    className="h-3"
                                    color="primary"
                                />
                                <div className="flex justify-between mt-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-tiny uppercase text-default-500 font-semibold tracking-wider">Completed</span>
                                        <span className="text-lg font-bold text-default-900">{data.task_metrics.total_completed}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-tiny uppercase text-default-500 font-semibold tracking-wider">Total Tasks</span>
                                        <span className="text-lg font-bold text-default-900">
                                            {data.task_metrics.total_completed + data.task_metrics.total_pending}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Task Stats (Priority) */}
                        <Card className="shadow-sm border-none p-2">
                            <CardHeader className="px-4 pt-4 pb-0">
                                <div className="flex flex-col">
                                    <p className="text-md font-bold text-default-900">Task Stats</p>
                                    <p className="text-tiny text-default-500">Priority Distribution</p>
                                </div>
                            </CardHeader>
                            <CardBody className="px-4 py-4 gap-4">
                                {Object.entries(data.task_metrics.by_priority).slice(0, 3).map(([priority, count]) => (
                                    <div key={priority}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-default-600 capitalize">{priority}</span>
                                            <span className="text-sm font-bold text-default-900">{count}</span>
                                        </div>
                                        <Progress
                                            value={(count / (data.task_metrics.total_pending + data.task_metrics.total_completed || 1)) * 100}
                                            color={priority.toLowerCase() === 'high' ? 'danger' : priority.toLowerCase() === 'medium' ? 'warning' : 'primary'}
                                            className="h-2"
                                            aria-label={`${priority} priority tasks`}
                                        />
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    </div>

                    {/* New Joiners Table (Replaces Project Status) */}
                    <Card className="shadow-sm border-none">
                        <CardHeader className="flex justify-between px-6 py-4">
                            <div className="flex gap-2 items-center">
                                <Users className="w-5 h-5 text-default-500" />
                                <h3 className="font-bold text-large text-default-900">New Employees</h3>
                            </div>
                            <Chip size="sm" variant="flat" color="default">Last 30 Days</Chip>
                        </CardHeader>
                        <CardBody className="px-4 pb-4">
                            <Table aria-label="New Joiners Table" removeWrapper shadow="none">
                                <TableHeader>
                                    <TableColumn className="uppercase text-xs text-default-500 bg-transparent">Employee</TableColumn>
                                    <TableColumn className="uppercase text-xs text-default-500 bg-transparent">Department</TableColumn>
                                    <TableColumn className="uppercase text-xs text-default-500 bg-transparent">Role</TableColumn>
                                    <TableColumn className="uppercase text-xs text-default-500 bg-transparent">Joined Date</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent={"No new employees found."}>
                                    {data.new_employees.map((emp, index) => (
                                        <TableRow key={index} className="border-b border-default-100 last:border-none">
                                            <TableCell>
                                                <User
                                                    name={emp.name}
                                                    description={emp.designation}
                                                    avatarProps={{
                                                        src: emp.profile_picture,
                                                        radius: "lg",
                                                        size: "sm",
                                                        color: "primary",
                                                        isBordered: true
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-success-500"></span>
                                                    <span className="text-default-700 font-medium">{emp.department}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-default-500">{emp.designation}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-default-500 font-medium">{new Date(emp.date_of_joining).toLocaleDateString()}</span>
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
                    {/* Departments */}
                    <Card className="shadow-sm border-none">
                        <CardHeader className="flex justify-between px-6 py-4 pb-2">
                            <div className="flex gap-2 items-center">
                                <Building className="w-5 h-5 text-default-500" />
                                <h3 className="font-bold text-medium text-default-900">Departments</h3>
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 py-4 pt-2">
                            <div className="space-y-4">
                                {data.department_distribution.map((dept, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-default-100 last:border-none">
                                        <span className="text-sm font-medium text-default-700">{dept.name}</span>
                                        <Chip size="sm" variant="flat" className="bg-default-100 text-default-700 font-bold min-w-[30px] text-center">
                                            {dept.count}
                                        </Chip>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Daily Exceptions */}
                    <Card className="shadow-sm border-none border-l-4 border-danger">
                        <CardHeader className="flex gap-2 px-6 py-4 text-danger">
                            <AlertCircle className="w-5 h-5" />
                            <h3 className="font-bold text-medium">Daily Exceptions</h3>
                        </CardHeader>
                        <CardBody className="px-6 py-2 pb-6">
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase text-default-500 font-semibold mb-1">Late Arrivals</span>
                                    {data.attendance_metrics.today_stats.late > 0 ? (
                                        <div className="p-3 bg-danger-50 rounded-lg border border-danger-100">
                                            <p className="text-sm font-medium text-danger-700">
                                                {data.attendance_metrics.today_stats.late} employees arrived late today.
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-default-400 italic">No one was late today.</p>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase text-default-500 font-semibold mb-1">On Leave</span>
                                    {data.attendance_metrics.today_stats.on_leave > 0 ? (
                                        <div className="p-3 bg-warning-50 rounded-lg border border-warning-100">
                                            <p className="text-sm font-medium text-warning-700">
                                                {data.attendance_metrics.today_stats.on_leave} employees are on leave.
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-default-400 italic">All employees present.</p>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="shadow-sm border-none">
                        <CardHeader className="flex gap-2 px-6 py-4">
                            <Clock className="w-5 h-5 text-default-500" />
                            <h3 className="font-bold text-medium text-default-900">Recent Activity</h3>
                        </CardHeader>
                        <CardBody className="px-6 py-2 pb-6">
                            <div className="relative border-l border-default-200 ml-2 space-y-6">
                                {data.recent_activities.length === 0 ? (
                                    <p className="pl-6 text-sm text-default-500 italic">No recent activity.</p>
                                ) : (
                                    data.recent_activities.slice(0, 5).map((act, index) => (
                                        <div key={index} className="ml-6 relative">
                                            <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-primary-500 ring-4 ring-white"></span>
                                            <p className="text-sm font-semibold text-default-900">{act.type === 'new_user' ? 'New Employee' : act.type === 'project_created' ? 'New Project' : 'System Update'}</p>
                                            <p className="text-xs text-default-600 mt-0.5 line-clamp-2">{act.message}</p>
                                            <span className="text-[10px] text-default-400 block mt-1">
                                                {new Date(act.timestamp).toLocaleDateString()}
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
        <Card className="shadow-sm border-none h-full bg-white">
            <CardBody className="flex flex-col p-4">
                <div className="flex justify-between items-start">
                    <p className="text-small font-semibold text-default-500 uppercase tracking-wider">{title}</p>
                    <div className={`p-3 rounded-xl ${bgColor} -mt-1 -mr-1`}>
                        {icon}
                    </div>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-default-900">{value}</h3>
                    <p className="text-xs text-default-400 mt-1">{subtext}</p>
                </div>
            </CardBody>
        </Card>
    );
}
