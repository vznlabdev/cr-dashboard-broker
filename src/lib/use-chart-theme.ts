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

/** KYA dark: teal, green, purple, orange, red */
const darkMode: ChartTheme = {
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

/** KYA light: blue, green, purple, orange, red */
const lightMode: ChartTheme = {
  chart1: "#007bff",
  chart2: "#28a745",
  chart3: "#6f42c1",
  chart4: "#ffc107",
  chart5: "#dc3545",
  textColor: "#333333",
  gridColor: "#e0e0e0",
  tooltipBg: "rgba(255, 255, 255, 0.98)",
  tooltipBorder: "rgba(0, 0, 0, 0.1)",
  tooltipText: "#333333",
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
