"use client";

import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, Users, FileText, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ThemedChartWrapper } from "@/components/broker/themed-chart-wrapper";
import { statusColors } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import { clients } from "@/lib/mock-data/clients";
import { submissions } from "@/lib/mock-data/submissions";
import { territoryBreakdown } from "@/lib/mock-data/markets";
import { historicYears } from "@/lib/mock-data/historic-results";
import { policies } from "@/lib/mock-data/policies";
import { alerts } from "@/lib/mock-data/alerts";

// Dashboard stats from mock data
const totalGwp = clients.reduce((s, c) => s + c.gwp, 0);
const priorYearGwp = historicYears.find((y) => y.year === 2023)?.gwp ?? 1_520_000;
const gwpTrendPct = ((totalGwp - priorYearGwp) / priorYearGwp) * 100;
const openSubmissions = submissions.filter(
  (s) => s.status === "submitted" || s.status === "quoted"
);
const avgDaysOpen =
  openSubmissions.length > 0
    ? Math.round(
        openSubmissions.reduce((a, s) => a + s.daysOpen, 0) / openSubmissions.length
      )
    : 0;
const now = new Date("2025-02-10");
const next90 = new Date(now);
next90.setDate(next90.getDate() + 90);
const pendingRenewals = policies.filter((p) => {
  if (p.status !== "active" && p.status !== "pending_renewal") return false;
  const exp = new Date(p.expiryDate);
  return exp >= now && exp <= next90;
}).length;

// GWP by territory for bar chart
const gwpByTerritory = territoryBreakdown
  .filter((t) => t.gwp > 0)
  .map((t) => ({ name: t.territory, gwp: t.gwp }));

// Risk grade distribution for donut
const riskGradeCounts = clients.reduce(
  (acc, c) => {
    acc[c.riskGrade] = (acc[c.riskGrade] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);
const riskGradeData = Object.entries(riskGradeCounts).map(([name, value]) => ({
  name: `Grade ${name}`,
  value,
}));

const CHART_COLORS = ["#007bff", "#28a745", "#6f42c1", "#ffc107", "#dc3545"];

const recentSubmissions = [...submissions]
  .sort((a, b) => {
    const da = a.dateSubmitted ? new Date(a.dateSubmitted).getTime() : 0;
    const db = b.dateSubmitted ? new Date(b.dateSubmitted).getTime() : 0;
    return db - da;
  })
  .slice(0, 10);

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Broker Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Overview of your book and pipeline
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto sm:shrink-0">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Total GWP</CardTitle>
              <CardDescription>Gross written premium</CardDescription>
            </div>
            <div className="text-2xl md:text-4xl font-bold">
              £{(totalGwp / 1_000_000).toFixed(2)}M
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-[#28a745]" />
            <span className="text-[#28a745] font-medium">
              {gwpTrendPct >= 0 ? "+" : ""}
              {gwpTrendPct.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">vs last year</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Clients</CardTitle>
              <CardDescription>In portfolio</CardDescription>
            </div>
            <div className="text-2xl md:text-4xl font-bold">{clients.length}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">12 industries</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Open Submissions</CardTitle>
              <CardDescription>In pipeline</CardDescription>
            </div>
            <div className="text-2xl md:text-4xl font-bold">
              {openSubmissions.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Avg {avgDaysOpen} days open
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Pending Renewals</CardTitle>
              <CardDescription>Next 90 days</CardDescription>
            </div>
            <div className="text-2xl md:text-4xl font-bold">
              {pendingRenewals}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due for renewal</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">GWP by Territory</CardTitle>
                <CardDescription>Gross written premium by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] min-h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                    <BarChart
                      data={gwpByTerritory}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                      />
                      <YAxis
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                        tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.tooltipBg,
                          border: `1px solid ${theme.tooltipBorder}`,
                          borderRadius: "8px",
                          color: theme.tooltipText,
                        }}
                        formatter={(value: number | undefined) => [
                          value != null ? `£${(value / 1000).toFixed(0)}k` : "",
                          "GWP",
                        ]}
                        labelStyle={{ color: theme.tooltipText }}
                      />
                      <Bar
                        dataKey="gwp"
                        fill={theme.chart1}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
      </div>

      <div>
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Grade Distribution</CardTitle>
                <CardDescription>Portfolio by risk grade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] min-h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                    <PieChart>
                      <Pie
                        data={riskGradeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={{ stroke: theme.gridColor }}
                      >
                        {riskGradeData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.tooltipBg,
                          border: `1px solid ${theme.tooltipBorder}`,
                          borderRadius: "8px",
                          color: theme.tooltipText,
                        }}
                        formatter={(value: number | undefined) => [
                          value != null
                            ? `${value} client${value !== 1 ? "s" : ""}`
                            : "",
                          "Count",
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
            <CardDescription>Last 10 submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.map((s) => (
                  <TableRow
                    key={s.id}
                    className="border-b border-border/10 hover:bg-muted/30 transition-colors cursor-pointer h-8"
                    onClick={() => router.push(`/pipeline?sub=${s.id}`)}
                  >
                    <TableCell className="px-3 py-1 font-mono text-[11px]">
                      {s.id}
                    </TableCell>
                    <TableCell className="px-3 py-1 font-medium truncate max-w-[160px]">
                      {s.clientName}
                    </TableCell>
                    <TableCell className="px-3 py-1 text-muted-foreground text-[11px]">
                      {s.coverageType.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="px-3 py-1 font-mono text-[11px]">
                      £{(s.limitRequested / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="px-3 py-1">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          statusColors[s.status] ?? statusColors.draft
                        )}
                      >
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-1 text-muted-foreground">
                      {s.daysOpen}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alerts</CardTitle>
            <CardDescription>Expiring policies & overdue items</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className={cn(
                    "rounded-lg border p-3 text-sm transition-colors",
                    a.severity === "high" && "border-[#ffc107]/30 bg-[#ffc107]/10",
                    a.severity === "medium" && "border-border/50 bg-muted/20",
                    a.severity === "low" && "border-border/30"
                  )}
                >
                  <p className="font-medium">{a.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {a.description}
                  </p>
                  {a.dueDate && (
                    <p className="text-muted-foreground text-xs mt-1">
                      Due: {a.dueDate}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
