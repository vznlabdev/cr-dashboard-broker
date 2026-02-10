"use client";

import { useTheme } from "next-themes";

export interface ChartTheme {
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  textColor: string;
  gridColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
}

const darkMode: ChartTheme = {
  chart1: "oklch(0.65 0.18 270)",
  chart2: "oklch(0.70 0.20 280)",
  chart3: "oklch(0.68 0.17 240)",
  chart4: "oklch(0.72 0.16 300)",
  chart5: "oklch(0.75 0.14 200)",
  textColor: "#d1d5db",
  gridColor: "#374151",
  tooltipBg: "rgba(30, 30, 45, 0.95)",
  tooltipBorder: "rgba(255, 255, 255, 0.1)",
  tooltipText: "#f9fafb",
};

const lightMode: ChartTheme = {
  chart1: "oklch(0.55 0.15 260)",
  chart2: "oklch(0.60 0.18 280)",
  chart3: "oklch(0.65 0.16 240)",
  chart4: "oklch(0.62 0.14 300)",
  chart5: "oklch(0.68 0.12 200)",
  textColor: "#6b7280",
  gridColor: "#e5e7eb",
  tooltipBg: "rgba(255, 255, 255, 0.95)",
  tooltipBorder: "rgba(0, 0, 0, 0.1)",
  tooltipText: "#111827",
};

export function useChartTheme(): ChartTheme {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "light" ? lightMode : darkMode;
}

export const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;
