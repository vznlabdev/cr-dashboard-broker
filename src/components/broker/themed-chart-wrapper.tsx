"use client";

import * as React from "react";
import { useChartTheme, type ChartTheme } from "@/lib/use-chart-theme";

type ThemedChartWrapperProps = {
  children: (theme: ChartTheme) => React.ReactNode;
  className?: string;
};

/** Default theme used for SSR and initial client render to avoid hydration mismatch */
const SSR_THEME: ChartTheme = {
  chart1: "#00bfff",
  chart2: "#28a745",
  chart3: "#9370db",
  chart4: "#ffc107",
  chart5: "#dc3545",
  textColor: "#ffffff",
  gridColor: "#444444",
  tooltipBg: "rgba(36, 36, 36, 0.98)",
  tooltipBorder: "rgba(255, 255, 255, 0.1)",
  tooltipText: "#ffffff",
};

/**
 * Wraps Recharts (or any chart) and injects the current chart theme.
 * Uses a fixed theme for SSR and first paint so server and client match; then switches to resolved theme after mount.
 */
export function ThemedChartWrapper({ children, className }: ThemedChartWrapperProps) {
  const resolvedTheme = useChartTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const theme = mounted ? resolvedTheme : SSR_THEME;

  return (
    <div
      className={className}
      style={
        {
          "--chart-1": theme.chart1,
          "--chart-2": theme.chart2,
          "--chart-3": theme.chart3,
          "--chart-4": theme.chart4,
          "--chart-5": theme.chart5,
        } as React.CSSProperties
      }
    >
      {children(theme)}
    </div>
  );
}
