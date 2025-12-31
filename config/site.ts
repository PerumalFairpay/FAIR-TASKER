export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      label: "Employee",
      href: "/employee",
      icon: "Users",
      children: [
        {
          label: "Department",
          href: "/employee/department",
          icon: "Briefcase",
        },
        {
          label: "Role",
          href: "/employee/role",
          icon: "ShieldAlert",
        },
        {
          label: "Employee List",
          href: "/employee/list",
          icon: "Contact",
        },
      ],
    },
    {
      label: "Expense Management",
      href: "/expense",
      icon: "Wallet",
      children: [
        {
          label: "Category",
          href: "/expense/category",
          icon: "Receipt",
        },
        {
          label: "Expense",
          href: "/expense/list",
          icon: "Banknote",
        },
      ],
    },
    {
      label: "Document Management",
      href: "/document",
      icon: "FileText",
      children: [
        {
          label: "Category",
          href: "/document/category",
          icon: "FolderTree",
        },
        {
          label: "Document",
          href: "/document/list",
          icon: "Files",
        },
      ],
    },
    {
      label: "Client/Vendor",
      href: "/client",
      icon: "Users",
    },
    {
      label: "Project",
      href: "/project/list",
      icon: "Briefcase",
    },
    {
      label: "Holiday",
      href: "/holiday",
      icon: "Calendar",
    },
    {
      label: "Asset Management",
      href: "/asset",
      icon: "Package",
      children: [
        {
          label: "Category",
          href: "/asset/category",
          icon: "Layers",
        },
        {
          label: "Asset",
          href: "/asset/list",
          icon: "Box",
        },
      ],
    },
    {
      label: "Leave Management",
      href: "/leave-management",
      icon: "CalendarCheck",
      children: [
        {
          label: "Leave Type",
          href: "/leave-management/leave-type",
          icon: "ClipboardList",
        },
        {
          label: "Leave Request",
          href: "/leave-management/request",
          icon: "Calendar",
        },
      ],
    },
    {
      label: "Blog",
      href: "/blog",
      icon: "Newspaper",
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
