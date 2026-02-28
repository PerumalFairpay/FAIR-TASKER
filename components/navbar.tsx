"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";

import { siteConfig } from "@/config/site";

import {
  ChevronLeftIcon, ChevronRightIcon, Logo, LogoutIcon, SunFilledIcon, MoonFilledIcon
} from "@/components/icons";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Contact,
  Wallet,
  Receipt,
  Banknote,
  FileText,
  FolderTree,
  Files,
  Calendar,
  Package,
  Layers,
  Box,
  BookOpen,
  Newspaper,
  CalendarCheck,
  ClipboardList,
  KanbanSquare,
  Clock,
  Key,
  Rss,
  Milestone,
  ShieldCheck,
  UserPlus,
  UserMinus,
  SettingsIcon,
  Settings,
  MessageSquare,
  MoreHorizontal,
  X,
  LogOut,
  User as UserIcon,
} from "lucide-react";


import { useDispatch, useSelector } from "react-redux";
import { logoutRequest } from "@/store/auth/action";
import { AppState } from "@/store/rootReducer";

import Image from "next/image";
import FairPayLogo from "@/app/assets/FairPay.png";
import FairPayMiniLogo from "@/app/assets/FairPaymini.svg";
import FairPayMiniDarkLogo from "@/app/assets/FairPaymini-dark.svg";
import { User } from "@heroui/user";
import { ScrollShadow } from "@heroui/scroll-shadow";

interface NavbarProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldAlert,
  Contact,
  Wallet,
  Receipt,
  Banknote,
  FileText,
  FolderTree,
  Files,
  Calendar,
  Package,
  Layers,
  Box,
  BookOpen,
  Newspaper,
  CalendarCheck,
  ClipboardList,
  KanbanSquare,
  Clock,
  Key,
  Rss,
  Milestone,
  ShieldCheck,
  UserPlus,
  UserMinus,
  SettingsIcon,
  Settings,
  MessageSquare
};

// The 4 pinned bottom nav items (by href). Everything else goes in "More".
const PINNED_HREFS = ["/dashboard", "/attendance", "/task/board", "/feeds"];

export const Navbar = ({ isExpanded = false, onToggle }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: AppState) => state.Auth);

  /* eslint-disable react-hooks/exhaustive-deps */
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [moreOpenMenus, setMoreOpenMenus] = useState<Record<string, boolean>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredItem(label);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 200);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isSSR = useIsSSR();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    siteConfig.navItems.forEach((item: any) => {
      if (item.children?.some((child: any) => child.href === pathname)) {
        setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname]);

  // Close more sheet on navigation
  useEffect(() => {
    setMoreSheetOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        setIsAltPressed(true);
      }

      if (!event.altKey) return;

      const key = event.key.toLowerCase();
      let targetPath = '';

      switch (key) {
        case 'd': targetPath = '/dashboard'; break;
        case 'e': targetPath = '/employee/list'; break;
        case 'a': targetPath = '/attendance'; break;
        case 'l': targetPath = '/leave-management/request'; break;
        case 'h': targetPath = '/holiday'; break;
        case 'p': targetPath = '/project/list'; break;
        case 't': targetPath = '/task/board'; break;
        case 'y':
          const role = user?.role?.toLowerCase();
          targetPath = role === 'admin' ? '/payslip/list' : '/payslip/employee';
          break;
        case 'c': targetPath = '/asset/category'; break;
        case 'r': targetPath = '/asset/list'; break;
        case 'b': targetPath = '/blog'; break;
        case 'f': targetPath = '/feeds'; break;
        case 's': targetPath = '/settings'; break;
        default: return;
      }

      if (targetPath) {
        event.preventDefault();
        router.push(targetPath);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        setIsAltPressed(false);
      }
    };

    const handleBlur = () => {
      setIsAltPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [router, user]);

  const getShortcutKey = (label: string) => {
    const map: Record<string, string> = {
      'Dashboard': 'D',
      'Employee': 'E',
      'Attendance': 'A',
      'Leave Management': 'L',
      'Holiday': 'H',
      'Projects & Clients': 'P',
      'Task Management': 'T',
      'Payroll': 'Y',
      'Categories': 'C',
      'Resources': 'R',
      'Blog': 'B',
      'Feeds': 'F',
      'Settings': 'S'
    };
    return map[label];
  };

  const ShortcutBadge = ({ label }: { label: string }) => {
    const key = getShortcutKey(label);
    if (!key || !isAltPressed) return null;
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0, y: 5 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 5 }}
        className={clsx(
          "flex items-center justify-center font-sans font-bold pointer-events-none z-[60]",
          "bg-default-100 dark:bg-default-50/50 backdrop-blur-sm",
          "border-b-2 border-default-300 dark:border-default-100",
          "text-default-700 dark:text-default-200 shadow-sm",
          isExpanded
            ? "ml-auto text-[10px] px-1.5 h-5 min-w-[20px] rounded-md border"
            : "absolute bottom-0 right-0 text-[9px] px-1 h-4 min-w-[16px] rounded-sm border"
        )}
      >
        {key}
      </motion.span>
    );
  };


  const toggleSidebar = () => {
    if (onToggle) onToggle();
  };

  const handleLogout = () => {
    onOpen();
  };

  const confirmLogout = () => {
    dispatch(logoutRequest());
  };

  const toggleMenu = (label: string) => {
    if (!isExpanded && onToggle) {
      onToggle();
      setOpenMenus(prev => ({
        ...prev,
        [label]: true
      }));
      return;
    }
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // ─── Mobile helpers ────────────────────────────────────────────────────────

  const filteredNavItems = siteConfig.navItems.filter((item: any) => {
    const roleMatch = !item.allowedRoles || item.allowedRoles.includes(user?.role?.toLowerCase() || "employee");
    const permissionMatch = !item.permission || user?.permissions?.includes(item.permission);
    return roleMatch && permissionMatch;
  });

  // Build pinned items: match PINNED_HREFS order, fallback to first 4 allowed items
  const pinnedItems = PINNED_HREFS.map(href => {
    // Could be a direct item or a child item
    for (const item of filteredNavItems) {
      if (item.href === href) return { ...item, _directItem: true };
      if (item.children) {
        const child = item.children.find((c: any) => c.href === href);
        if (child) {
          const roleMatch = !child.allowedRoles || child.allowedRoles.includes(user?.role?.toLowerCase() || "employee");
          const permissionMatch = !child.permission || user?.permissions?.includes(child.permission);
          if (roleMatch && permissionMatch) return { ...child, _directItem: true };
        }
      }
    }
    return null;
  }).filter(Boolean);

  // "More" items: top-level items not in pinnedItems by href
  const moreItems = filteredNavItems.filter((item: any) => !PINNED_HREFS.includes(item.href));

  const isMoreActive = !pinnedItems.some(p => {
    if (!p) return false;
    if (p.href === pathname) return true;
    return false;
  }) && pathname !== "/";

  // Check if current path is somewhere under an item in more
  const isMoreSectionActive = moreItems.some((item: any) => {
    if (item.href === pathname) return true;
    return item.children?.some((c: any) => c.href === pathname);
  });

  const toggleMoreMenu = (label: string) => {
    setMoreOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* ─── Mobile Bottom Nav ──────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">

        {/* More Drawer Sheet */}
        <AnimatePresence>
          {moreSheetOpen && (
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-[64px] left-0 right-0 z-50 rounded-t-3xl overflow-hidden shadow-2xl"
              style={{
                background: resolvedTheme === "dark"
                  ? "rgba(15,15,25,0.97)"
                  : "rgba(255,255,255,0.98)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(128,128,128,0.15)"
              }}
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-default-100">
                <div className="flex items-center gap-2">
                  <Image
                    src={resolvedTheme === "dark" ? FairPayMiniDarkLogo : FairPayMiniLogo}
                    alt="FairPay"
                    className="h-7 w-auto object-contain"
                  />
                  <span className="text-base font-bold text-default-800">Menu</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Theme toggle */}
                  <button
                    onClick={toggleTheme}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-default-100 hover:bg-default-200 transition-colors"
                  >
                    {!isSSR && theme === "light" ? (
                      <MoonFilledIcon size={18} />
                    ) : (
                      <SunFilledIcon size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => setMoreSheetOpen(false)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-default-100 hover:bg-default-200 transition-colors"
                  >
                    <X size={18} className="text-default-600" />
                  </button>
                </div>
              </div>

              {/* User Profile strip */}
              {user && (
                <div className="px-4 py-3 border-b border-default-100">
                  <div className="flex items-center justify-between">
                    <NextLink href="/profile" onClick={() => setMoreSheetOpen(false)} className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary font-bold text-base">
                            {(user.first_name || user.name || "?").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-default-800 truncate">
                          {`${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name || ""}
                        </p>
                        <p className="text-xs text-default-500 truncate">{user.email}</p>
                      </div>
                    </NextLink>
                    <button
                      onClick={handleLogout}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-danger hover:bg-danger/10 transition-colors ml-2 flex-shrink-0"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Nav Items */}
              <ScrollShadow className="max-h-[55vh] scrollbar-hide py-2 overflow-y-auto">
                <div className="px-3 space-y-0.5">
                  {moreItems.map((item: any) => {
                    const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Logo;
                    const isItemActive = pathname === item.href;
                    const filteredChildren = item.children?.filter((child: any) => {
                      const roleMatch = !child.allowedRoles || child.allowedRoles.includes(user?.role?.toLowerCase() || "employee");
                      const permissionMatch = !child.permission || user?.permissions?.includes(child.permission);
                      return roleMatch && permissionMatch;
                    });
                    const hasChildren = filteredChildren && filteredChildren.length > 0;
                    const isSectionActive = filteredChildren?.some((c: any) => c.href === pathname);
                    const isMenuOpen = moreOpenMenus[item.label];

                    return (
                      <div key={item.label}>
                        {hasChildren ? (
                          <>
                            <button
                              onClick={() => toggleMoreMenu(item.label)}
                              className={clsx(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left",
                                isSectionActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-default-700 hover:bg-default-100"
                              )}
                            >
                              <div className={clsx(
                                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                                isSectionActive ? "bg-primary/20" : "bg-default-100"
                              )}>
                                <Icon size={18} className={isSectionActive ? "text-primary" : "text-default-500"} />
                              </div>
                              <span className="flex-1 text-sm font-medium">{item.label}</span>
                              <motion.div
                                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight size={16} className="text-default-400" />
                              </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                              {isMenuOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-3 mt-0.5 space-y-0.5 pb-1">
                                    {filteredChildren.map((child: any) => {
                                      const ChildIcon = child.icon && iconMap[child.icon] ? iconMap[child.icon] : Logo;
                                      const isChildActive = pathname === child.href;
                                      return (
                                        <NextLink
                                          key={child.href}
                                          href={child.href}
                                          onClick={() => setMoreSheetOpen(false)}
                                          className={clsx(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                            isChildActive
                                              ? "bg-primary/10 text-primary"
                                              : "text-default-600 hover:bg-default-100"
                                          )}
                                        >
                                          <div className={clsx(
                                            "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                                            isChildActive ? "bg-primary/20" : "bg-default-100"
                                          )}>
                                            <ChildIcon size={14} className={isChildActive ? "text-primary" : "text-default-500"} />
                                          </div>
                                          <span className="text-sm font-medium">{child.label}</span>
                                          {isChildActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                          )}
                                        </NextLink>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <NextLink
                            href={item.href}
                            onClick={() => setMoreSheetOpen(false)}
                            className={clsx(
                              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                              isItemActive
                                ? "bg-primary/10 text-primary"
                                : "text-default-700 hover:bg-default-100"
                            )}
                          >
                            <div className={clsx(
                              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                              isItemActive ? "bg-primary/20" : "bg-default-100"
                            )}>
                              <Icon size={18} className={isItemActive ? "text-primary" : "text-default-500"} />
                            </div>
                            <span className="flex-1 text-sm font-medium">{item.label}</span>
                            {isItemActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                          </NextLink>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollShadow>

              {/* Bottom safe area spacer */}
              <div className="h-2" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Bar */}
        <div
          className="relative flex items-center justify-around px-2 h-16"
          style={{
            background: resolvedTheme === "dark"
              ? "rgba(10,10,20,0.95)"
              : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(128,128,128,0.12)",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.07)"
          }}
        >
          {pinnedItems.map((item: any) => {
            if (!item) return null;
            const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Logo;
            const isActive = pathname === item.href;

            return (
              <NextLink
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 py-1 relative group"
              >
                <div className="relative flex flex-col items-center gap-0.5">
                  {/* Active pill indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="mobile-tab-indicator"
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className={clsx(
                      "w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary/12"
                        : "group-hover:bg-default-100"
                    )}
                  >
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={clsx(
                        "transition-colors duration-200",
                        isActive ? "text-primary" : "text-default-400 group-hover:text-default-600"
                      )}
                    />
                  </motion.div>

                  <span
                    className={clsx(
                      "text-[10px] font-medium leading-none transition-colors duration-200",
                      isActive ? "text-primary" : "text-default-400 group-hover:text-default-600"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </NextLink>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreSheetOpen(prev => !prev)}
            className="flex flex-col items-center justify-center flex-1 py-1 relative group"
          >
            <div className="relative flex flex-col items-center gap-0.5">
              <AnimatePresence>
                {isMoreSectionActive && !moreSheetOpen && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                whileTap={{ scale: 0.85 }}
                animate={{ rotate: moreSheetOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className={clsx(
                  "w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-200",
                  moreSheetOpen || isMoreSectionActive
                    ? "bg-primary/12"
                    : "group-hover:bg-default-100"
                )}
              >
                <MoreHorizontal
                  size={20}
                  strokeWidth={moreSheetOpen || isMoreSectionActive ? 2.2 : 1.8}
                  className={clsx(
                    "transition-colors duration-200",
                    moreSheetOpen || isMoreSectionActive
                      ? "text-primary"
                      : "text-default-400 group-hover:text-default-600"
                  )}
                />
              </motion.div>

              <span
                className={clsx(
                  "text-[10px] font-medium leading-none transition-colors duration-200",
                  moreSheetOpen || isMoreSectionActive
                    ? "text-primary"
                    : "text-default-400 group-hover:text-default-600"
                )}
              >
                More
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ─── Desktop Sidebar ─────────────────────────────────────────────── */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full bg-background border-r border-divider z-50 transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-16",
          "hidden lg:block", "bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg"
        )}
      >
        <div className="flex flex-col h-full">

          <div className="flex items-center justify-center p-2 border-b border-divider h-16">
            <NextLink
              className="flex justify-start items-center gap-2"
              href="/dashboard"
            >
              <Image
                src={isExpanded ? FairPayLogo : (resolvedTheme === "dark" ? FairPayMiniDarkLogo : FairPayMiniLogo)}
                alt="FairPay"
                className={clsx(
                  "object-contain transition-all duration-300",
                  isExpanded ? "h-10 w-auto" : "h-13 w-auto"
                )}
              />
            </NextLink>
          </div>

          <ScrollShadow className="flex-1 py-4 scrollbar-hide">
            <nav className="flex flex-col gap-1 px-2">
              {siteConfig.navItems
                .filter(item => {
                  const roleMatch = !item.allowedRoles || item.allowedRoles.includes(user?.role?.toLowerCase() || "employee");
                  const permissionMatch = !item.permission || user?.permissions?.includes(item.permission);
                  return roleMatch && permissionMatch;
                })
                .map((item: any) => {
                  const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Logo;
                  const isActive = pathname === item.href;

                  // Filter children based on role and permission
                  const filteredChildren = item.children?.filter((child: any) => {
                    const roleMatch = !child.allowedRoles || child.allowedRoles.includes(user?.role?.toLowerCase() || "employee");
                    const permissionMatch = !child.permission || user?.permissions?.includes(child.permission);
                    return roleMatch && permissionMatch;
                  });
                  const hasChildren = filteredChildren && filteredChildren.length > 0;
                  const isOpen = openMenus[item.label];
                  const isSectionActive = filteredChildren?.some((child: any) => child.href === pathname);

                  if (hasChildren) {
                    return (
                      <div key={item.label} className="relative">
                        {!isExpanded ? (
                          <Dropdown
                            isOpen={hoveredItem === item.label}
                            placement="right-start"
                            offset={10}
                          >
                            <DropdownTrigger>
                              <div
                                onMouseEnter={() => handleMouseEnter(item.label)}
                                onMouseLeave={handleMouseLeave}
                                className="w-full flex justify-center h-10 items-center"
                              >
                                <Button
                                  onPress={() => toggleMenu(item.label)}
                                  className={clsx(
                                    "bg-transparent h-10 px-0 min-w-10 w-10 justify-center relative",
                                    "hover:bg-default-50 text-default-600"
                                  )}
                                  disableRipple
                                  isIconOnly
                                >
                                  <Icon className={clsx("w-5 h-5 flex-shrink-0", isSectionActive ? "text-primary" : "text-default-500")} />
                                  <ShortcutBadge label={item.label} />
                                </Button>
                              </div>
                            </DropdownTrigger>
                            <DropdownMenu
                              onMouseEnter={() => handleMouseEnter(item.label)}
                              onMouseLeave={handleMouseLeave}
                              aria-label={item.label}
                              closeOnSelect={true}
                              onAction={() => setHoveredItem(null)}
                            >
                              {filteredChildren.map((child: any) => {
                                const ChildIcon = child.icon && iconMap[child.icon] ? iconMap[child.icon] : Logo;
                                const isChildActive = pathname === child.href;

                                return (
                                  <DropdownItem
                                    key={child.href}
                                    href={child.href}
                                    as={NextLink}
                                    startContent={<ChildIcon size={16} />}
                                    className={clsx(
                                      isChildActive ? "text-primary bg-primary/10" : "text-default-500"
                                    )}
                                  >
                                    {child.label}
                                  </DropdownItem>
                                );
                              })}
                            </DropdownMenu>
                          </Dropdown>
                        ) : (
                          <>
                            <Button
                              onPress={() => toggleMenu(item.label)}
                              className={clsx(
                                "w-full bg-transparent justify-start gap-2 h-10 px-2 relative",
                                "hover:bg-default-50 text-default-600",
                                !isExpanded && "justify-center px-0"
                              )}
                              disableRipple
                            >
                              <Icon className={clsx("w-5 h-5 flex-shrink-0", isOpen ? "text-primary" : "text-default-500")} />
                              {isExpanded && (
                                <>
                                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                                  <motion.div
                                    animate={{ rotate: isOpen ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ChevronDown size={16} />
                                  </motion.div>
                                </>
                              )}
                              <ShortcutBadge label={item.label} />
                            </Button>
                          </>
                        )}


                        <AnimatePresence initial={false}>
                          {isOpen && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 mt-1 space-y-1">
                                {filteredChildren.map((child: any) => {
                                  const ChildIcon = child.icon && iconMap[child.icon] ? iconMap[child.icon] : Logo;
                                  const isChildActive = pathname === child.href;

                                  return (
                                    <Button
                                      key={child.href}
                                      as={NextLink}
                                      href={child.href}
                                      className={clsx(
                                        "w-full justify-start relative flex items-center gap-2 px-4 h-10 text-sm font-medium rounded-lg transition-colors",
                                        isChildActive
                                          ? "bg-primary/10 text-primary"
                                          : "bg-transparent text-default-500 hover:bg-default-50 hover:text-default-900"
                                      )}
                                    >
                                      {isChildActive && (
                                        <motion.div
                                          layoutId="active-indicator-child"
                                          className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                      )}
                                      <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center justify-center"
                                      >
                                        <ChildIcon size={18} strokeWidth={1.5} className={isChildActive ? "text-primary" : "text-default-500"} />
                                      </motion.div>
                                      <span>{child.label}</span>
                                    </Button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  if (isExpanded) {
                    return (
                      <Button
                        key={item.href}
                        as={NextLink}
                        href={item.href}
                        className={clsx(
                          "w-full justify-start gap-2 h-10 px-2 relative",
                          pathname === item.href ? "bg-primary/10 text-primary" : "bg-transparent hover:bg-default-50 text-default-600"
                        )}
                      >
                        {pathname === item.href && (
                          <motion.div
                            layoutId="active-indicator"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center"
                        >
                          <Icon className={clsx("flex-shrink-0 w-5 h-5", pathname === item.href ? "text-primary" : "text-default-500")} />
                        </motion.div>
                        <span className="text-sm font-medium">{item.label}</span>
                        <ShortcutBadge label={item.label} />
                      </Button>
                    );
                  }

                  return (
                    <Dropdown
                      key={item.href}
                      isOpen={hoveredItem === item.label}
                      placement="right-start"
                      offset={10}
                    >
                      <DropdownTrigger>
                        <div
                          onMouseEnter={() => handleMouseEnter(item.label)}
                          onMouseLeave={handleMouseLeave}
                          className="w-full flex justify-center h-10 items-center"
                        >
                          <Button
                            onPress={() => router.push(item.href)}
                            className={clsx(
                              "bg-transparent h-10 px-0 min-w-10 w-10 justify-center relative",
                              "hover:bg-default-50 text-default-600",
                              pathname === item.href && "text-primary bg-primary/10"
                            )}
                            disableRipple
                            isIconOnly
                          >
                            <Icon className={clsx("w-5 h-5 flex-shrink-0", pathname === item.href ? "text-primary" : "text-default-500")} />
                            <ShortcutBadge label={item.label} />
                          </Button>
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                        aria-label={item.label}
                        closeOnSelect={true}
                        onAction={() => setHoveredItem(null)}
                      >
                        <DropdownItem
                          key={item.href}
                          href={item.href}
                          as={NextLink}
                          startContent={<Icon size={16} />}
                          className={clsx(
                            pathname === item.href ? "text-primary bg-primary/10" : "text-default-500"
                          )}
                        >
                          {item.label}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  );
                })}
            </nav>
          </ScrollShadow>

          <div className="p-1 border-t border-divider">
            {user && (
              <div className={clsx(
                "flex items-center my-2 overflow-hidden transition-all duration-300",
                isExpanded ? "justify-between px-2" : "justify-self-end"
              )}>
                <NextLink href="/profile" className="flex-1 min-w-0">
                  <User
                    name={isExpanded ? (`${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name || "") : ""}
                    description={isExpanded ? (
                      <p className="truncate max-w-[100px] text-tiny text-default-500">
                        {user.email}
                      </p>
                    ) : ""}
                    avatarProps={{
                      src: user.profile_picture,
                      name: (user.first_name || user.name || "?").charAt(0).toUpperCase()
                    }}
                    classNames={{
                      name: clsx("text-sm font-semibold", !isExpanded && "hidden"),
                      description: clsx(!isExpanded && "hidden"),
                      base: clsx("transition-transform", !isExpanded && "justify-center")
                    }}
                  />
                </NextLink>
                {isExpanded && (
                  <Button
                    isIconOnly
                    variant="light"
                    className="text-default-500 hover:text-danger data-[hover=true]:bg-default-100 min-w-0 w-6 h-6"
                    onPress={handleLogout}
                  >
                    <LogoutIcon size={16} />
                  </Button>
                )}
              </div>
            )}

            <div className={clsx(
              "flex items-center gap-1",
              isExpanded ? "justify-between" : "justify-center"
            )}>
              {isExpanded && (
                <Button
                  isIconOnly
                  className="bg-default-100"
                  variant="flat"
                  onPress={toggleTheme}
                >
                  {!isSSR && theme === "light" ? (
                    <MoonFilledIcon size={22} />
                  ) : (
                    <SunFilledIcon size={22} />
                  )}
                </Button>
              )}
              <Button
                isIconOnly
                className={clsx(
                  "bg-default-100",
                  isExpanded ? "flex-1 ml-1" : "w-full"
                )}
                variant="flat"
                onPress={toggleSidebar}
              >
                {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </Button>
            </div>
          </div>

        </div>
      </div>


      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm Logout</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to log out?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={() => {
                  confirmLogout();
                  onClose();
                }}>
                  Logout
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
