export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  allowedRoles?: string[];
  permission?: string;
  children?: NavItem[];
};

export type SiteConfig = {
  name: string;
  description: string;
  navItems: NavItem[];
  navMenuItems: {
    label: string;
    href: string;
  }[];
  links: {
    github: string;
    twitter: string;
    docs: string;
    discord: string;
    sponsor: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "Fair Tasker",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
      allowedRoles: ["admin", "employee"],
    },
    {
      label: "Employee",
      href: "/employee",
      icon: "Users",
      allowedRoles: ["admin"],
      children: [
        {
          label: "Employee List",
          href: "/employee/list",
          icon: "Contact",
          allowedRoles: ["admin"],
        },
        {
          label: "NDA",
          href: "/employee/nda",
          icon: "FileText",
          allowedRoles: ["admin"],
        },
        {
          label: "Onboarding",
          href: "/employee/onboarding",
          icon: "UserPlus",
          allowedRoles: ["admin"],
        },
        {
          label: "Offboarding",
          href: "/employee/offboarding",
          icon: "UserMinus",
          allowedRoles: ["admin"],
        },
        {
          label: "Department",
          href: "/employee/department",
          icon: "Briefcase",
          allowedRoles: ["admin"],
        },
        {
          label: "Role",
          href: "/employee/role",
          icon: "ShieldAlert",
          allowedRoles: ["admin"],
        },
        {
          label: "Permission",
          href: "/employee/permission",
          icon: "ShieldCheck",
          allowedRoles: ["admin"],
        },
      ],
    },
    {
      label: "Attendance",
      href: "/attendance",
      icon: "Clock",
      allowedRoles: ["admin", "employee"],
    },
    {
      label: "Leave Management",
      href: "/leave-management",
      icon: "CalendarCheck",
      allowedRoles: ["admin", "employee"],
      children: [
        {
          label: "Leave Type",
          href: "/leave-management/leave-type",
          icon: "ClipboardList",
          allowedRoles: ["admin"],
        },
        {
          label: "Leave Request",
          href: "/leave-management/request",
          icon: "Calendar",
          allowedRoles: ["admin", "employee"],
        },
      ],
    },
    {
      label: "Holiday",
      href: "/holiday",
      icon: "Calendar",
      allowedRoles: ["admin"],
    },
    {
      label: "Projects & Clients",
      href: "/projects-clients",
      icon: "Briefcase",
      allowedRoles: ["admin"],
      children: [
        {
          label: "Project",
          href: "/project/list",
          icon: "Briefcase",
          allowedRoles: ["admin"],
        },
        {
          label: "Client/Vendor",
          href: "/client",
          icon: "Users",
          allowedRoles: ["admin"],
        },
      ],
    },
    {
      label: "Task Management",
      href: "/task",
      icon: "ClipboardList",
      allowedRoles: ["admin", "employee"],
      children: [
        {
          label: "Task Board",
          href: "/task/board",
          icon: "KanbanSquare",
          allowedRoles: ["admin", "employee"],
        },
        {
          label: "EOD Reports",
          href: "/task/reports",
          icon: "FileText",
          allowedRoles: ["admin", "employee"],
        },
        {
          label: "Milestone",
          href: "/task/roadmap-board",
          icon: "Milestone",
          allowedRoles: ["admin", "employee"],
          permission: "nav:milestone",
        },
      ],
    },
    {
      label: "Payroll",
      href: "/payroll",
      icon: "Banknote",
      allowedRoles: ["admin", "employee"],
      children: [
        {
          label: "Payslip List",
          href: "/payslip/list",
          icon: "FileText",
          allowedRoles: ["admin"],
        },
        {
          label: "My Payslips",
          href: "/payslip/employee",
          icon: "Contact",
          allowedRoles: ["employee"],
        },
      ],
    },

    {
      label: "Categories",
      href: "/categories",
      icon: "Layers",
      allowedRoles: ["admin"],
      children: [
        {
          label: "Asset Category",
          href: "/asset/category",
          icon: "Layers",
          allowedRoles: ["admin"],
        },
        {
          label: "Expense Category",
          href: "/expense/category",
          icon: "Receipt",
          allowedRoles: ["admin"],
        },
        {
          label: "Document Category",
          href: "/document/category",
          icon: "FolderTree",
          allowedRoles: ["admin"],
        },
      ],
    },
    {
      label: "Resources",
      href: "/resources",
      icon: "Package",
      allowedRoles: ["admin"],
      children: [
        {
          label: "Asset",
          href: "/asset/list",
          icon: "Box",
          allowedRoles: ["admin"],
        },
        {
          label: "Expense",
          href: "/expense/list",
          icon: "Wallet",
          allowedRoles: ["admin"],
        },
        {
          label: "Document",
          href: "/document/list",
          icon: "FileText",
          allowedRoles: ["admin"],
        },
      ],
    },
    {
      label: "Blog",
      href: "/blog",
      icon: "Newspaper",
      allowedRoles: ["admin"],
    },
    {
      label: "Feeds",
      href: "/feeds",
      icon: "Rss", // Using Rss icon for feeds
      allowedRoles: ["admin", "employee"],
    },
    {
      label: "Settings",
      href: "/settings",
      icon: "Settings",
      allowedRoles: ["admin"],
    },
  ],

  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
