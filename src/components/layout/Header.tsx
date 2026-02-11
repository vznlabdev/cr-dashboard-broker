"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Bell, User, Search } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

type HeaderProps = {
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
};

export function Header({ title, breadcrumb }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-sidebar px-4 md:px-6">
      {/* Global search - KYA style */}
      <div className="hidden flex-1 max-w-md sm:flex items-center gap-2 rounded-lg bg-muted/80 border border-border px-3 py-1.5 text-sm text-muted-foreground focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-colors">
        <Search className="h-4 w-4 shrink-0" />
        <input
          type="search"
          placeholder="Search projects, assets..."
          className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted-foreground"
          aria-label="Search"
        />
        <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-background/80 px-1.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="flex min-w-0 flex-1 sm:flex-initial items-center gap-2">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/70">&gt;</span>}
                {item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : title ? (
          <h1 className="truncate text-base font-semibold text-foreground">
            {title}
          </h1>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <a
          href="#"
          className="hidden sm:inline-flex text-sm text-primary hover:underline"
        >
          Documentation
        </a>
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </button>
        <button
          type="button"
          className="relative rounded p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            2
          </span>
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full p-1 pr-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              aria-label="User menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <User className="h-4 w-4" />
              </span>
              <span className="hidden text-sm font-medium text-foreground sm:inline">
                John Doe
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[180px] rounded-lg border border-border bg-card p-1 shadow-modern-lg animate-fade-in"
              sideOffset={8}
              align="end"
            >
              <DropdownMenu.Item
                className="cursor-pointer rounded-md px-2 py-1.5 text-sm outline-none hover:bg-muted/50 focus:bg-muted/50"
                onSelect={(e) => e.preventDefault()}
              >
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="cursor-pointer rounded-md px-2 py-1.5 text-sm outline-none hover:bg-muted/50 focus:bg-muted/50"
                onSelect={(e) => e.preventDefault()}
              >
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                className="cursor-pointer rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none hover:bg-muted/50 hover:text-foreground focus:bg-muted/50"
                onSelect={(e) => e.preventDefault()}
              >
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
