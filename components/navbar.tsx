"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
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
  ChevronRight, // Lucide chevron
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
  UserMinus
} from "lucide-react";


import { useDispatch, useSelector } from "react-redux";
import { logoutRequest } from "@/store/auth/action";
import { AppState } from "@/store/rootReducer";

import Image from "next/image";
import FairPayLogo from "@/app/assets/FairPay.png";
import { User } from "@heroui/user";

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
  UserMinus
};


export const Navbar = ({ isExpanded = false, onToggle }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: AppState) => state.Auth);

  /* eslint-disable react-hooks/exhaustive-deps */
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme, setTheme } = useTheme();
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
      // If we are expanding, we also want to open this menu
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

  return (
    <>
      {/* Mobile Bottom Navbar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-default-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 h-16">
        <div className="flex items-center justify-around h-full px-2">
          {siteConfig.navItems.filter(item => {
            const roleMatch = !item.allowedRoles || item.allowedRoles.includes(user?.role?.toLowerCase() || "employee");
            const permissionMatch = !item.permission || user?.permissions?.includes(item.permission);
            return roleMatch && permissionMatch;
          }).map((item: any) => {
            if (item.children && !item.children.some((child: any) => child.href === item.href)) {
              if (item.children) return null;
            }

            const isActive = pathname === item.href;
            const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Logo;
            return (
              <NextLink
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center justify-center rounded-xl flex-1 mx-1 py-1 transition-all duration-200 ease-in-out",
                  isActive
                    ? "text-primary bg-primary/10 shadow-sm scale-105"
                    : "text-default-600 hover:bg-default-50 active:scale-95"
                )}
              >
                <Icon
                  className={clsx(
                    "w-5 h-5 mb-1 transition-colors",
                    isActive ? "text-primary" : "text-default-500"
                  )}
                />
                <span
                  className={clsx(
                    "text-[11px] font-medium truncate max-w-[70px]",
                    isActive ? "text-primary" : "text-default-600"
                  )}
                >
                  {item.label}
                </span>
              </NextLink>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
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
                src={FairPayLogo}
                alt="FairPay"
                className={clsx(
                  "object-contain transition-all duration-300",
                  isExpanded ? "h-10 w-auto" : "h-8 w-8"
                )}
              />
            </NextLink>
          </div>

          <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
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

                  if (hasChildren) {
                    return (
                      <div key={item.label} className="relative">
                        {!isExpanded ? (
                          <Popover
                            isOpen={hoveredItem === item.label}
                            placement="right-start"
                            offset={10}
                          >
                            <PopoverTrigger>
                              <div
                                onMouseEnter={() => handleMouseEnter(item.label)}
                                onMouseLeave={handleMouseLeave}
                                className="w-full flex justify-center h-10 items-center"
                              >
                                <Button
                                  onPress={() => toggleMenu(item.label)}
                                  className={clsx(
                                    "bg-transparent h-10 px-0 min-w-10 w-10 justify-center",
                                    "hover:bg-default-50 text-default-600"
                                  )}
                                  disableRipple
                                  isIconOnly
                                >
                                  <Icon className={clsx("w-5 h-5 flex-shrink-0", isOpen ? "text-primary" : "text-default-500")} />
                                </Button>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent
                              onMouseEnter={() => handleMouseEnter(item.label)}
                              onMouseLeave={handleMouseLeave}
                              className="p-2 min-w-[200px]"
                            >
                              <div className="space-y-1">
                                <div className="px-2 py-1.5 border-b border-default-100 mb-1">
                                  <span className="font-semibold text-small text-default-700">{item.label}</span>
                                </div>
                                {filteredChildren.map((child: any) => {
                                  const ChildIcon = child.icon && iconMap[child.icon] ? iconMap[child.icon] : Logo;
                                  const isChildActive = pathname === child.href;

                                  return (
                                    <NextLink
                                      key={child.href}
                                      href={child.href}
                                      className={clsx(
                                        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                        isChildActive
                                          ? "bg-primary/10 text-primary"
                                          : "text-default-500 hover:bg-default-50 hover:text-default-900"
                                      )}
                                      onClick={() => setHoveredItem(null)}
                                    >
                                      <ChildIcon size={16} strokeWidth={2} />
                                      <span>{child.label}</span>
                                    </NextLink>
                                  );
                                })}
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <>
                            <Button
                              onPress={() => toggleMenu(item.label)}
                              className={clsx(
                                "w-full bg-transparent justify-start gap-2 h-10 px-2",
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
                                    <ChevronRight size={16} />
                                  </motion.div>
                                </>
                              )}
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
                                    <NextLink
                                      key={child.href}
                                      href={child.href}
                                      className={clsx(
                                        "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                        isChildActive
                                          ? "bg-primary/10 text-primary"
                                          : "text-default-500 hover:bg-default-50 hover:text-default-900"
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
                                    </NextLink>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <NextLink
                      key={item.href}
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "data-[active=true]:text-primary data-[active=true]:font-medium",
                        "relative p-2 rounded-lg flex items-center transition-colors h-10",
                        isExpanded ? "justify-start gap-2" : "justify-center",
                        pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-default-50 text-default-600"
                      )}
                      href={item.href}
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
                      {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
                    </NextLink>
                  )
                })}
            </nav>
          </div>

          <div className="p-1 border-t border-divider">
            {user && (
              <div className={clsx(
                "flex items-center my-2 overflow-hidden transition-all duration-300",
                isExpanded ? "justify-between px-2" : "justify-self-end"
              )}>
                {user?.role?.toLowerCase() === "admin" ? (
                  <div className="flex-1 min-w-0 cursor-default">
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
                  </div>
                ) : (
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
                )}
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
