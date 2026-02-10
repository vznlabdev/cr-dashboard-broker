"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Bell, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

type HeaderProps = {
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
};

export function Header({ title, breadcrumb }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-sm px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
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
        ) : (
          <h1 className="truncate text-base font-semibold text-foreground">
            {title ?? "Dashboard"}
          </h1>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </button>
        <button
          type="button"
          className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full p-1 pr-2 text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
              aria-label="User menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <User className="h-4 w-4" />
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[180px] rounded-md border border-border/50 bg-background p-1 shadow-modern-lg animate-fade-in"
              sideOffset={8}
              align="end"
            >
              <DropdownMenu.Item
                className="cursor-pointer rounded px-2 py-1.5 text-sm outline-none hover:bg-muted/50 focus:bg-muted/50"
                onSelect={(e) => e.preventDefault()}
              >
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="cursor-pointer rounded px-2 py-1.5 text-sm outline-none hover:bg-muted/50 focus:bg-muted/50"
                onSelect={(e) => e.preventDefault()}
              >
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border/50" />
              <DropdownMenu.Item
                className="cursor-pointer rounded px-2 py-1.5 text-sm text-muted-foreground outline-none hover:bg-muted/50 hover:text-foreground focus:bg-muted/50"
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
