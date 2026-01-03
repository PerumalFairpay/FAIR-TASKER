
import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { User } from "@heroui/user";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import {
    Users, Briefcase, Calendar, CheckCircle, Clock, AlertCircle,
    Building, Activity, FileText
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
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Employees"
                    value={data.overview.total_employees}
                    icon={<Users className="w-6 h-6 text-blue-500" />}
                    subtext="Active Workflow"
                />
                <StatCard
                    title="Projects"
                    value={`${data.overview.active_projects} / ${data.overview.total_projects}`}
                    icon={<Briefcase className="w-6 h-6 text-purple-500" />}
                    subtext="Active / Total"
                />
                <StatCard
                    title="Attendance Today"
                    value={`${data.attendance_metrics.today_stats.present} / ${data.overview.total_employees}`}
                    icon={<CheckCircle className="w-6 h-6 text-green-500" />}
                    subtext={`Absent: ${data.attendance_metrics.today_stats.absent}, Late: ${data.attendance_metrics.today_stats.late}`}
                />
                <StatCard
                    title="Pending Leaves"
                    value={data.overview.pending_leaves}
                    icon={<Calendar className="w-6 h-6 text-orange-500" />}
                    subtext={`${data.overview.approved_leaves_today} Approved Today`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task Metrics */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader className="flex gap-3">
                        <Activity className="w-6 h-6" />
                        <div className="flex flex-col">
                            <p className="text-md font-bold">Task Statistics</p>
                            <p className="text-small text-default-500">Overall Progress</p>
                        </div>
                    </CardHeader>
                    <CardBody className="gap-6">
                        <div className="flex justify-between items-center px-4 py-2 bg-default-100 rounded-lg">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{data.task_metrics.total_completed}</p>
                                <p className="text-xs text-default-500">Completed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{data.task_metrics.total_pending}</p>
                                <p className="text-xs text-default-500">Pending</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-danger">{data.task_metrics.overdue}</p>
                                <p className="text-xs text-default-500">Overdue</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Completion Rate</span>
                                <span className="text-sm text-default-500">{data.task_metrics.completion_rate}%</span>
                            </div>
                            <Progress value={data.task_metrics.completion_rate} color="success" className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-semibold mb-2">By Priority</h4>
                                <div className="space-y-2">
                                    {Object.entries(data.task_metrics.by_priority).map(([key, val]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span>{key}</span>
                                            <span className="font-bold">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-2">By Status</h4>
                                <div className="space-y-2">
                                    {Object.entries(data.task_metrics.by_status).map(([key, val]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span>{key}</span>
                                            <span className="font-bold">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Department Distribution */}
                <Card>
                    <CardHeader className="flex gap-3">
                        <Building className="w-6 h-6" />
                        <div className="flex flex-col">
                            <p className="text-md font-bold">Departments</p>
                            <p className="text-small text-default-500">Employee Distribution</p>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            {data.department_distribution.map((dept, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm">{dept.name}</span>
                                    <div className="flex items-center gap-2">
                                        <Progress value={(dept.count / data.overview.total_employees) * 100} className="w-20 h-2" />
                                        <span className="text-xs font-bold w-6 text-right">{dept.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* New Employees */}
                <Card>
                    <CardHeader className="flex gap-3">
                        <Users className="w-6 h-6" />
                        <div className="flex flex-col">
                            <p className="text-md font-bold">New Joiners</p>
                            <p className="text-small text-default-500">Last 30 Days</p>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            {data.new_employees.length === 0 ? (
                                <p className="text-default-500 text-sm">No new employees recently.</p>
                            ) : data.new_employees.map((emp, i) => (
                                <User
                                    key={i}
                                    name={emp.name}
                                    description={`${emp.designation} • ${emp.department}`}
                                    avatarProps={{
                                        src: emp.profile_picture,
                                        fallback: emp.name[0]
                                    }}
                                />
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Recent Activity & Holidays */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex gap-3">
                            <Clock className="w-6 h-6" />
                            <div className="flex flex-col">
                                <p className="text-md font-bold">Recent Activity</p>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <ul className="space-y-3">
                                {data.recent_activities.length === 0 ? <p className="text-sm text-default-500">No activity.</p> :
                                    data.recent_activities.map((act, i) => (
                                        <li key={i} className="flex gap-3 items-start text-sm">
                                            <div className="mt-1 min-w-[6px] min-h-[6px] rounded-full bg-blue-500" />
                                            <div>
                                                <p>{act.message}</p>
                                                <p className="text-xs text-default-400">{new Date(act.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader className="flex gap-3">
                            <Calendar className="w-6 h-6" />
                            <div className="flex flex-col">
                                <p className="text-md font-bold">Upcoming Holidays</p>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                {data.upcoming_holidays.length === 0 ? <p className="text-sm text-default-500">No upcoming holidays.</p> :
                                    data.upcoming_holidays.map((h, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm p-2 bg-default-50 rounded-lg">
                                            <span className="font-medium">{h.name}</span>
                                            <Chip size="sm" variant="flat">{new Date(h.date).toLocaleDateString()}</Chip>
                                        </div>
                                    ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

        </div>
    );
}

function StatCard({ title, value, icon, subtext }: { title: string, value: string | number, icon: React.ReactNode, subtext: string }) {
    return (
        <Card>
            <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 bg-default-100 rounded-large">
                    {icon}
                </div>
                <div>
                    <p className="text-lg font-bold">{value}</p>
                    <p className="text-small text-default-500 font-medium">{title}</p>
                    <p className="text-xs text-default-400 mt-1">{subtext}</p>
                </div>
            </CardBody>
        </Card>
    );
}
