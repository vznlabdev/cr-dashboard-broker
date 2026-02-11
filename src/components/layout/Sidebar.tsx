"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  FileText,
  Scale,
  Briefcase,
  BookOpen,
  Calculator,
  Globe,
  GitBranch,
  Target,
  Users,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

const navSections = [
  {
    label: null,
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Pipeline",
    items: [
      { href: "/pipeline", label: "Submissions", icon: FileText },
      { href: "/pipeline/quotes", label: "Quotes", icon: Scale },
    ],
  },
  {
    label: "Clients",
    items: [{ href: "/clients", label: "Portfolio", icon: Briefcase }],
  },
  {
    label: "Book Management",
    items: [
      { href: "/wordings", label: "Wordings", icon: BookOpen },
      { href: "/pricing", label: "Pricing", icon: Calculator },
      { href: "/markets", label: "Markets", icon: Globe },
      { href: "/processes", label: "Processes", icon: GitBranch },
      { href: "/positioning", label: "Positioning", icon: Target },
      { href: "/people", label: "People", icon: Users },
    ],
  },
  {
    label: "Analytics",
    items: [{ href: "/results", label: "Historic Results", icon: BarChart3 }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { expanded, toggle } = useSidebar();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light";
  const landscapeSrc = isLight
    ? "/logo/creation-rights-logo-landscape-black.svg"
    : "/logo/creation-rights-logo-landscape-white.svg";
  const iconSrc = isLight
    ? "/logo/creation-rights-logo-icon-black.svg"
    : "/logo/creation-rights-logo-icon-white.svg";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-sidebar transition-[width] duration-200 md:flex",
        expanded ? "w-56" : "w-16"
      )}
    >
      {/* Logo area — h-14 */}
      <div className="flex h-14 shrink-0 items-center border-b border-border px-3">
        <Link
          href="/dashboard"
          className="flex min-w-0 flex-1 items-center overflow-hidden"
        >
          {expanded ? (
            <span className="relative flex h-7 w-full min-w-0 max-w-[200px] items-center">
              <img
                src={landscapeSrc}
                alt="Creation Rights"
                width={200}
                height={28}
                className={cn(
                  "h-6 w-auto max-w-full object-contain object-left",
                  !isLight && "drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                )}
              />
            </span>
          ) : (
            <span className="relative h-8 w-8 shrink-0">
              <Image
                src={iconSrc}
                alt="Creation Rights"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0"
              />
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section, index) => (
          <div key={section.label ?? "main"} className={cn("px-2", index > 0 && "mt-4")}>
            {section.label && expanded && (
              <div className="mb-2 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {section.label}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-8 items-center gap-2 rounded-md px-2 text-[13px] transition-colors border-l-4 border-transparent hover:bg-muted/50",
                        isActive && "border-l-4 border-primary font-medium",
                        isActive && "bg-sidebar-active text-primary dark:text-foreground",
                        !isActive && "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {expanded && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Settings + collapse at bottom */}
        <div className="mt-auto border-t border-border px-2 pt-2 pb-2 space-y-0.5">
          <Link
            href="/settings"
            className={cn(
              "flex h-8 items-center gap-2 rounded-md px-2 text-[13px] transition-colors border-l-4 border-transparent hover:bg-muted/50",
              pathname === "/settings" && "border-l-4 border-primary font-medium bg-sidebar-active text-primary dark:text-foreground",
              pathname !== "/settings" && "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {expanded && <span className="truncate">Settings</span>}
          </Link>
          <button
            type="button"
            onClick={toggle}
            className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? (
              <PanelLeftClose className="h-4 w-4 shrink-0" />
            ) : (
              <PanelLeft className="h-4 w-4 shrink-0" />
            )}
            {expanded && <span className="truncate">Collapse</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}
