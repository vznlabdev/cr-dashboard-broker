"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border/50 bg-background/95 backdrop-blur-sm transition-[width] duration-200 md:flex",
        expanded ? "w-56" : "w-16"
      )}
    >
      {/* Logo + collapse area — h-14 */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-3">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-2 overflow-hidden"
        >
          <span className="relative h-8 w-8 shrink-0">
            <Image
              src="/logo/creation-rights-logo-icon-white.svg"
              alt="Creation Rights"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 dark:block hidden"
            />
            <Image
              src="/logo/creation-rights-logo-icon-black.svg"
              alt="Creation Rights"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 block dark:hidden"
            />
          </span>
          {expanded && (
            <span className="truncate text-sm font-semibold text-foreground">
              Creation Rights
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggle}
          className="shrink-0 rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section) => (
          <div key={section.label ?? "main"} className="px-2">
            {section.label && expanded && (
              <div className="mb-1 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
                        "flex h-8 items-center gap-2 rounded-md px-2 text-[13px] transition-colors hover:bg-muted/30",
                        isActive
                          ? "bg-foreground/5 font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground"
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

        {/* Settings at bottom */}
        <div className="mt-auto border-t border-border/50 px-2 pt-2">
          <Link
            href="/settings"
            className={cn(
              "flex h-8 items-center gap-2 rounded-md px-2 text-[13px] transition-colors hover:bg-muted/30",
              pathname === "/settings"
                ? "bg-foreground/5 font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {expanded && <span className="truncate">Settings</span>}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
