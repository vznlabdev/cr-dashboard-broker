"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
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
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  {
    label: null,
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-border bg-sidebar text-foreground"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 transition-opacity" />
          <Dialog.Content
            className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-sidebar shadow-modern-lg flex flex-col animate-fade-in"
            onPointerDownOutside={() => setOpen(false)}
            onEscapeKeyDown={() => setOpen(false)}
          >
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2">
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
                <span className="text-sm font-semibold text-foreground">Creation Rights</span>
              </Link>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded p-2 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              {navSections.map((section) => (
                <div key={section.label ?? "main"} className="mb-4">
                  {section.label && (
                    <div className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex h-9 items-center gap-2 rounded-md px-2 text-[13px] transition-colors border-l-4 border-transparent",
                              isActive && "border-l-4 border-primary font-medium bg-sidebar-active text-primary dark:text-foreground",
                              !isActive && "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
