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
          icon: "Key",
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
          label: "Leave Status",
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
      label: "Project",
      href: "/project/list",
      icon: "Briefcase",
      allowedRoles: ["admin"],
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
      ],
    },
    {
      label: "Client/Vendor",
      href: "/client",
      icon: "Users",
      allowedRoles: ["admin"],
    },
    {
      label: "Asset Management",
      href: "/asset",
      icon: "Package",
      allowedRoles: ["admin"],
      children: [
        {
          label: "Category",
          href: "/asset/category",
          icon: "Layers",
          allowedRoles: ["admin"],
        },
        {
          label: "Asset",
          href: "/asset/list",
          icon: "Box",
          allowedRoles: ["admin"],
        },
      ],
    },
    {
      label: "Expense Management",
      href: "/expense",
      icon: "Wallet",
      allowedRoles: ["admin"],
      children: [
        {
          label: "Category",
          href: "/expense/category",
          icon: "Receipt",
          allowedRoles: ["admin"],
        },
        {
          label: "Expenses",
          href: "/expense/list",
          icon: "Banknote",
          allowedRoles: ["admin"],
        },
      ],
    },
    {
      label: "Document Management",
      href: "/document",
      icon: "FileText",
      allowedRoles: ["admin"],
      children: [
        {
          label: "Category",
          href: "/document/category",
          icon: "FolderTree",
          allowedRoles: ["admin"],
        },
        {
          label: "Document",
          href: "/document/list",
          icon: "Files",
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
