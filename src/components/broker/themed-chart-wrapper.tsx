"use client";

import * as React from "react";
import { useChartTheme } from "@/lib/use-chart-theme";

type ThemedChartWrapperProps = {
  children: (theme: ReturnType<typeof useChartTheme>) => React.ReactNode;
  className?: string;
};

/**
 * Wraps Recharts (or any chart) and injects the current chart theme (oklch colors, tooltip styles).
 * Use the theme in Tooltip content and for stroke/fill colors.
 */
export function ThemedChartWrapper({ children, className }: ThemedChartWrapperProps) {
  const theme = useChartTheme();

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
