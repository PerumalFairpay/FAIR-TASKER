"use client";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  ChevronLeftIcon, ChevronRightIcon, Logo, LogoutIcon
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
  Files
} from "lucide-react";

import { useDispatch } from "react-redux";
import { logoutRequest } from "@/store/auth/action";

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
};

export const Navbar = ({ isExpanded = false, onToggle }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  /* eslint-disable react-hooks/exhaustive-deps */
  // Custom simple useMediaQuery hook
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    // Initial check
    checkMobile();
    // Listener
    window.addEventListener('resize', checkMobile);

    // Load user data
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    if (name) {
      setUser({ name, email: email || "" });
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (onToggle) onToggle();
  };

  const handleLogout = () => {
    dispatch(logoutRequest());
    setUser(null);
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

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Mobile Bottom Navbar
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-default-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 h-16">
        <div className="flex items-center justify-around h-full px-2">
          {siteConfig.navItems.map((item: any) => {
            // For mobile, simpler to just show top level or flat list? 
            // Logic: If it has children, maybe skip or show parent link if it exists.
            // For now, let's just render parent links for mobile to keep it simple as per original
            if (item.children) return null; // Skip complex items on mobile bottom bar for now or handle differently

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
    );
  }

  return (
    <>
      <div
        className={clsx(
          "fixed top-0 left-0 h-full bg-background border-r border-divider z-50 transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-16",
          "hidden lg:block", "bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg"
        )}
      >
        <div className="flex flex-col h-full">

          <div className="flex items-center justify-center p-2 border-b border-divider h-14">
            <NextLink
              className="flex justify-start items-center gap-2"
              href="/"
            >
              <Image
                src={FairPayLogo}
                alt="FairPay"
                className={clsx(
                  "object-contain transition-all duration-300",
                  isExpanded ? "h-8 w-auto" : "h-8 w-8"
                )}
              />
            </NextLink>
          </div>

          <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
            <nav className="flex flex-col gap-1 px-2">
              {siteConfig.navItems.map((item: any) => {
                const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Logo;
                const isActive = pathname === item.href;
                const hasChildren = item.children && item.children.length > 0;
                const isOpen = openMenus[item.label];

                if (hasChildren) {
                  return (
                    <div key={item.label}>
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
                              {item.children.map((child: any) => {
                                const ChildIcon = child.icon && iconMap[child.icon] ? iconMap[child.icon] : Logo;
                                const isChildActive = pathname === child.href;

                                return (
                                  <NextLink
                                    key={child.href}
                                    href={child.href}
                                    className={clsx(
                                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                      isChildActive
                                        ? "bg-default-100 text-primary"
                                        : "text-default-500 hover:bg-default-50 hover:text-default-900"
                                    )}
                                  >
                                    <ChildIcon size={18} strokeWidth={1.5} />
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
                      "p-2 rounded-lg flex items-center transition-colors h-10",
                      isExpanded ? "justify-start gap-2" : "justify-center",
                      pathname === item.href ? "bg-default-100 text-primary" : "hover:bg-default-50 text-default-600"
                    )}
                    href={item.href}
                  >
                    <Icon className={clsx("flex-shrink-0 w-5 h-5", pathname === item.href ? "text-primary" : "text-default-500")} />
                    {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
                  </NextLink>
                )
              })}
            </nav>
          </div>

          <div className="p-1 border-t border-divider">
            {user && (
              <div className={clsx(
                "flex items-center mb-2 overflow-hidden transition-all duration-300",
                isExpanded ? "justify-between px-2" : "justify-center"
              )}>
                <User
                  name={isExpanded ? user.name : ""}
                  description={isExpanded ? (
                    <p className="truncate max-w-[100px] text-tiny text-default-500">
                      {user.email}
                    </p>
                  ) : ""}
                  avatarProps={{
                    name: user.name?.charAt(0).toUpperCase()
                  }}
                  classNames={{
                    name: clsx("text-sm font-semibold", !isExpanded && "hidden"),
                    description: clsx(!isExpanded && "hidden"),
                    base: clsx("transition-transform", !isExpanded && "justify-center")
                  }}
                />
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
    </>
  );
};
