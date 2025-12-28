"use client";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  ChevronLeftIcon, ChevronRightIcon, Logo
} from "@/components/icons";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  // Custom simple useMediaQuery hook
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    // Initial check
    checkMobile();
    // Listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Mobile Bottom Navbar
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-default-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 h-16">
        <div className="flex items-center justify-around h-full px-2">
          {siteConfig.navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = Logo; // Fallback to Logo since items don't have icons in siteConfig yet
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
          <div className="flex flex-col items-center justify-center rounded-xl flex-1 mx-1 py-1">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={clsx(
          "fixed top-0 left-0 h-full bg-background border-r border-divider z-50 transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-16", // Increased collapsed width slightly for better spacing
          "hidden lg:block", "bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg"
        )}
      >
        <div className="flex flex-col h-full">

          <div className="flex items-center justify-center p-2 border-b border-divider h-14">
            <NextLink
              className="flex justify-start items-center gap-2"
              href="/"
            >
              <Logo
                size={isExpanded ? 32 : 28}
                className="text-primary transition-all duration-300"
              />
              {isExpanded && (
                <p className="font-bold text-inherit whitespace-nowrap">
                  ACME
                </p>
              )}
            </NextLink>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="flex flex-col gap-2 px-2">
              {siteConfig.navItems.map((item) => {
                const Icon = Logo; // Fallback
                return (
                  <NextLink
                    key={item.href}
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium",
                      "p-2 rounded-lg flex items-center transition-colors",
                      isExpanded ? "justify-start gap-2" : "justify-center",
                      pathname === item.href ? "bg-default-100 text-primary" : "hover:bg-default-50"
                    )}
                    href={item.href}
                  >
                    <Icon className="flex-shrink-0 w-5 h-5" />
                    {isExpanded && item.label}
                  </NextLink>
                )
              })}
            </nav>
          </div>

          <div className="p-1 border-t border-divider">
            <div className={clsx(
              "flex items-center gap-1 mb-2",
              isExpanded ? "justify-start px-2" : "justify-center"
            )}>
              <ThemeSwitch />
              {isExpanded && <span className="text-sm">Theme</span>}
            </div>

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
