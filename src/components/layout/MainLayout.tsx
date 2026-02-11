"use client";

import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PageContainer } from "./PageContainer";
import { MobileNav } from "./MobileNav";

type MainLayoutProps = {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
};

function MainLayoutInner({
  children,
  title,
  breadcrumb,
}: MainLayoutProps) {
  const { expanded } = useSidebar();

  return (
    <>
      <Sidebar />
      <MobileNav />
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col bg-background transition-[margin-left] duration-200",
          expanded ? "md:ml-56" : "md:ml-16"
        )}
      >
        <Header title={title} breadcrumb={breadcrumb} />
        <main className="flex min-h-0 flex-1 flex-col bg-background">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </>
  );
}

export function MainLayout(props: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <MainLayoutInner {...props} />
      </div>
    </SidebarProvider>
  );
}
