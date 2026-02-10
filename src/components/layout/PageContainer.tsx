import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex-1 p-4 md:p-6 space-y-6 animate-fade-in overflow-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
