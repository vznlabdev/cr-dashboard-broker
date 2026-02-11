"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { cn } from "@/lib/utils";
import {
  historicYears,
  limitBandsHistoric,
  pipelineConversion,
  declineRateBySyndicate,
} from "@/lib/mock-data/historic-results";
import { territoryBreakdown } from "@/lib/mock-data/markets";
import { premiumBandsMarket } from "@/lib/mock-data/markets";
import { claims } from "@/lib/mock-data/claims";

const latestYear = historicYears[historicYears.length - 1];
const priorYear = historicYears[historicYears.length - 2];
const renewalTrend = latestYear && priorYear
  ? (latestYear.renewalRate - priorYear.renewalRate) * 100
  : 0;
const totalGwp = latestYear?.gwp ?? 0;
const gwpYoY = priorYear
  ? ((latestYear!.gwp - priorYear.gwp) / priorYear.gwp) * 100
  : 0;

const lossChartData = historicYears.map((y) => ({
  year: y.year,
  incurred: y.incurredClaims,
  paid: y.paidClaims,
}));

const renewalChartData = historicYears.map((y) => ({
  year: y.year,
  renewalRatePct: y.renewalRate * 100,
}));

const lossRatioChartData = historicYears.map((y) => ({
  year: y.year,
  lossRatioPct: y.lossRatio * 100,
}));

const geographyData = territoryBreakdown
  .filter((t) => t.accountCount > 0)
  .map((t) => ({ name: t.territory, count: t.accountCount }));

const funnelStages = [
  { stage: "Submissions", count: pipelineConversion.submissionsTotal, pct: 100 },
  {
    stage: "Quotes",
    count: pipelineConversion.quotesReceived,
    pct: pipelineConversion.submissionsTotal
      ? (pipelineConversion.quotesReceived / pipelineConversion.submissionsTotal) * 100
      : 0,
  },
  {
    stage: "Binds",
    count: pipelineConversion.binds,
    pct: pipelineConversion.submissionsTotal
      ? (pipelineConversion.binds / pipelineConversion.submissionsTotal) * 100
      : 0,
  },
];

export default function ResultsPage() {
  const largeLosses = useMemo(
    () => [...claims].sort((a, b) => b.incurredAmount - a.incurredAmount),
    []
  );
  const avgPremiumLatest =
    latestYear && latestYear.accountCount > 0
      ? latestYear.gwp / latestYear.accountCount
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Historic Results
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Limit profile, renewal rate, market size, loss experience and pipeline conversion
        </p>
      </div>

      {/* 1. Limit Profile cards (3-col) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Largest account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{latestYear?.largestAccount.name ?? "—"}</p>
            <p className="font-mono text-lg mt-1">
              £{latestYear ? (latestYear.largestAccount.limit / 1_000_000).toFixed(2) : "0"}M limit
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              £{latestYear ? (latestYear.largestAccount.premium / 1000).toFixed(0) : "0"}k premium
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Smallest account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{latestYear?.smallestAccount.name ?? "—"}</p>
            <p className="font-mono text-lg mt-1">
              £{latestYear ? (latestYear.smallestAccount.limit / 1000).toFixed(0) : "0"}k limit
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              £{latestYear ? (latestYear.smallestAccount.premium / 1000).toFixed(0) : "0"}k premium
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg mt-1">
              £{latestYear ? (latestYear.avgAccountSize / 1_000_000).toFixed(2) : "0"}M limit
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              £{Math.round(avgPremiumLatest / 1000)}k premium
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Renewal Rate */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Renewal rate</CardTitle>
            <CardDescription>Current rate with prior-year trend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">
                {latestYear ? (latestYear.renewalRate * 100).toFixed(0) : 0}%
              </span>
              {renewalTrend !== 0 && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    renewalTrend > 0 ? "text-[#28a745]" : "text-[#dc3545]"
                  )}
                >
                  {renewalTrend > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {renewalTrend > 0 ? "+" : ""}
                  {renewalTrend.toFixed(1)}% vs prior year
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Renewal rate over time</CardTitle>
                <CardDescription>Last {historicYears.length} years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                    <LineChart data={renewalChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <XAxis
                        dataKey="year"
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                      />
                      <YAxis
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                        tickFormatter={(v) => `${v}%`}
                        domain={[70, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.tooltipBg,
                          border: `1px solid ${theme.tooltipBorder}`,
                          borderRadius: "8px",
                          color: theme.tooltipText,
                        }}
                        formatter={(value: number | undefined) => [
                          value != null ? `${value.toFixed(0)}%` : "",
                          "Renewal rate",
                        ]}
                        labelFormatter={(y) => `Year ${y}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="renewalRatePct"
                        name="Renewal rate %"
                        stroke={theme.chart1}
                        strokeWidth={2}
                        dot={{ fill: theme.chart1 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
      </div>

      {/* 3. Size of Market */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Size of market</CardTitle>
              <CardDescription>Total GWP and account distribution</CardDescription>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">£{(totalGwp / 1_000_000).toFixed(2)}M</span>
              <Badge
                variant="outline"
                className={cn(
                  "font-normal",
                  gwpYoY >= 0 ? "bg-[#28a745]/10 text-[#28a745]" : "bg-[#dc3545]/10 text-[#dc3545]"
                )}
              >
                {gwpYoY >= 0 ? "+" : ""}
                {gwpYoY.toFixed(1)}% YoY
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-3">
            <ThemedChartWrapper>
              {(theme) => (
                <div>
                  <p className="text-sm font-medium mb-2">Accounts by limit band</p>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                      <BarChart
                        data={limitBandsHistoric}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="band"
                          tick={{ fill: theme.textColor, fontSize: 10 }}
                          axisLine={{ stroke: theme.gridColor }}
                          tickLine={{ stroke: theme.gridColor }}
                        />
                        <YAxis
                          tick={{ fill: theme.textColor, fontSize: 12 }}
                          axisLine={{ stroke: theme.gridColor }}
                          tickLine={{ stroke: theme.gridColor }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme.tooltipBg,
                            border: `1px solid ${theme.tooltipBorder}`,
                            borderRadius: "8px",
                            color: theme.tooltipText,
                          }}
                          formatter={(value: number | undefined) => [value ?? 0, "Accounts"]}
                        />
                        <Bar dataKey="accountCount" fill={theme.chart1} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </ThemedChartWrapper>
            <ThemedChartWrapper>
              {(theme) => (
                <div>
                  <p className="text-sm font-medium mb-2">Accounts by premium band</p>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                      <BarChart
                        data={premiumBandsMarket}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="band"
                          tick={{ fill: theme.textColor, fontSize: 10 }}
                          axisLine={{ stroke: theme.gridColor }}
                          tickLine={{ stroke: theme.gridColor }}
                        />
                        <YAxis
                          tick={{ fill: theme.textColor, fontSize: 12 }}
                          axisLine={{ stroke: theme.gridColor }}
                          tickLine={{ stroke: theme.gridColor }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme.tooltipBg,
                            border: `1px solid ${theme.tooltipBorder}`,
                            borderRadius: "8px",
                            color: theme.tooltipText,
                          }}
                          formatter={(value: number | undefined) => [value ?? 0, "Accounts"]}
                        />
                        <Bar dataKey="accountCount" fill={theme.chart2} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </ThemedChartWrapper>
            <ThemedChartWrapper>
              {(theme) => (
                <div>
                  <p className="text-sm font-medium mb-2">Accounts by geography</p>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                      <BarChart
                        data={geographyData}
                        layout="vertical"
                        margin={{ top: 8, right: 8, left: 32, bottom: 0 }}
                      >
                        <XAxis
                          type="number"
                          tick={{ fill: theme.textColor, fontSize: 12 }}
                          axisLine={{ stroke: theme.gridColor }}
                          tickLine={{ stroke: theme.gridColor }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={32}
                          tick={{ fill: theme.textColor, fontSize: 11 }}
                          axisLine={{ stroke: theme.gridColor }}
                          tickLine={{ stroke: theme.gridColor }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme.tooltipBg,
                            border: `1px solid ${theme.tooltipBorder}`,
                            borderRadius: "8px",
                            color: theme.tooltipText,
                          }}
                          formatter={(value: number | undefined) => [value ?? 0, "Accounts"]}
                        />
                        <Bar dataKey="count" fill={theme.chart3} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </ThemedChartWrapper>
          </div>
        </CardContent>
      </Card>

      {/* 4. Loss Experience */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Incurred vs paid by year</CardTitle>
                <CardDescription>Claims incurred and paid</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                    <BarChart
                      data={lossChartData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="year"
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
                          "",
                        ]}
                        labelFormatter={(y) => `Year ${y}`}
                      />
                      <Legend />
                      <Bar dataKey="incurred" name="Incurred" fill={theme.chart1} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="paid" name="Paid" fill={theme.chart2} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loss ratio trend</CardTitle>
                <CardDescription>5-year loss ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                    <LineChart data={lossRatioChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <XAxis
                        dataKey="year"
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                      />
                      <YAxis
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.tooltipBg,
                          border: `1px solid ${theme.tooltipBorder}`,
                          borderRadius: "8px",
                          color: theme.tooltipText,
                        }}
                        formatter={(value: number | undefined) => [
                          value != null ? `${value.toFixed(1)}%` : "",
                          "Loss ratio",
                        ]}
                        labelFormatter={(y) => `Year ${y}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="lossRatioPct"
                        name="Loss ratio %"
                        stroke={theme.chart1}
                        strokeWidth={2}
                        dot={{ fill: theme.chart1 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Large loss register</CardTitle>
          <CardDescription>Claim ID, client, amount, type, date, status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {largeLosses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-sm">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.clientName}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    £{(c.incurredAmount / 1000).toFixed(0)}k
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.claimType}</TableCell>
                  <TableCell className="text-sm">{c.dateReported}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal capitalize">
                      {c.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 5. Pipeline Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pipeline conversion</CardTitle>
          <CardDescription>Submissions → Quotes → Binds with conversion rates; decline by syndicate; avg time to bind</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="max-w-md">
              <p className="text-sm font-medium mb-3">Funnel</p>
              <div className="space-y-2">
                {funnelStages.map((s, i) => (
                  <div key={s.stage} className="flex items-center gap-3">
                    <div
                      className="rounded-md border border-border/50 bg-muted/20 px-3 py-2 text-sm font-medium shrink-0"
                      style={{
                        width: `${Math.max(25, s.pct)}%`,
                        minWidth: "100px",
                      }}
                    >
                      {s.stage}: {s.count}
                    </div>
                    {i > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {(
                          (funnelStages[i].count / funnelStages[i - 1].count) *
                          100
                        ).toFixed(0)}
                        % conv.
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Overall: {((pipelineConversion.binds / pipelineConversion.submissionsTotal) * 100).toFixed(0)}% submission-to-bind
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Avg time to bind</p>
              <p className="text-3xl font-bold">{pipelineConversion.avgDaysToBind} days</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Decline rate by syndicate</p>
            <ThemedChartWrapper>
              {(theme) => (
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                    <BarChart
                      data={declineRateBySyndicate.map((r) => ({
                        ...r,
                        declinePct: r.declineRate * 100,
                      }))}
                      layout="vertical"
                      margin={{ top: 8, right: 8, left: 100, bottom: 0 }}
                    >
                      <XAxis
                        type="number"
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                        tickFormatter={(v) => `${v}%`}
                        domain={[0, 20]}
                      />
                      <YAxis
                        type="category"
                        dataKey="syndicate"
                        width={96}
                        tick={{ fill: theme.textColor, fontSize: 10 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.tooltipBg,
                          border: `1px solid ${theme.tooltipBorder}`,
                          borderRadius: "8px",
                          color: theme.tooltipText,
                        }}
                        formatter={(value: number | undefined) => [
                          value != null ? `${value.toFixed(1)}%` : "",
                          "Decline rate",
                        ]}
                      />
                      <Bar
                        dataKey="declinePct"
                        fill={theme.chart2}
                        radius={[0, 4, 4, 0]}
                        name="Decline rate %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ThemedChartWrapper>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
