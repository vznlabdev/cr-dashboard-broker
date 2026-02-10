"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ThemedChartWrapper } from "@/components/broker/themed-chart-wrapper";
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
import { cn } from "@/lib/utils";
import {
  territoryBreakdown,
  limitBandsMarket,
  premiumBandsMarket,
  regulatoryFlags,
  syndicateAppetiteMatrix,
} from "@/lib/mock-data/markets";
import type { AppetiteLevel } from "@/types";

const APPETITE_STYLES: Record<AppetiteLevel, string> = {
  hot: "bg-emerald-600/90 text-white border-0",
  warm: "bg-amber-500/90 text-white border-0",
  cold: "bg-slate-500/80 text-white border-0",
  declined: "bg-red-600/90 text-white border-0",
};

const COMPLIANCE_STYLES: Record<string, string> = {
  Compliant: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  "In review": "bg-amber-500/10 text-amber-600 border-amber-500/30",
  Pending: "bg-slate-500/10 text-slate-600 border-slate-500/30",
  "Not applicable": "bg-muted/50 text-muted-foreground border-border",
};

export default function MarketsPage() {
  const totalGwp = territoryBreakdown.reduce((s, t) => s + t.gwp, 0);
  const totalAccounts = territoryBreakdown.reduce((s, t) => s + t.accountCount, 0);
  const activeTerritories = territoryBreakdown.filter((t) => t.gwp > 0).length;
  const largestMarket = territoryBreakdown.reduce(
    (best, t) => (t.gwp > (best?.gwp ?? 0) ? t : best),
    territoryBreakdown[0] as (typeof territoryBreakdown)[0] | undefined
  );

  const syndicates = useMemo(() => {
    const set = new Set(syndicateAppetiteMatrix.map((c) => c.syndicate));
    return Array.from(set);
  }, []);
  const territories = useMemo(() => {
    const set = new Set(syndicateAppetiteMatrix.map((c) => c.territory));
    return Array.from(set);
  }, []);
  const appetiteMap = useMemo(() => {
    const m = new Map<string, AppetiteLevel>();
    for (const c of syndicateAppetiteMatrix) {
      m.set(`${c.syndicate}|${c.territory}`, c.appetite);
    }
    return m;
  }, []);

  const gwpChartData = territoryBreakdown
    .filter((t) => t.gwp > 0)
    .map((t) => ({ name: t.territory, gwp: t.gwp }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Markets
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Territory overview, limit and premium bands, regulatory flags and syndicate appetite
        </p>
      </div>

      {/* 1. Territory overview stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total territories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{territoryBreakdown.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeTerritories} with GWP
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total GWP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              £{(totalGwp / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Gross written premium</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Largest market
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{largestMarket?.territory ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              £{largestMarket ? (largestMarket.gwp / 1000).toFixed(0) : "0"}k GWP
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Account count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalAccounts}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Across all territories</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. GWP by Territory */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">GWP by Territory</CardTitle>
                <CardDescription>Gross written premium by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                    <BarChart
                      data={gwpChartData}
                      layout="vertical"
                      margin={{ top: 8, right: 8, left: 40, bottom: 0 }}
                    >
                      <XAxis
                        type="number"
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                        tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={40}
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
                        formatter={(value: number | undefined) => [
                          value != null ? `£${(value / 1000).toFixed(0)}k` : "",
                          "GWP",
                        ]}
                      />
                      <Bar dataKey="gwp" fill={theme.chart1} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Territory breakdown</CardTitle>
            <CardDescription>GWP, accounts, avg premium/limit, dominant syndicate</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Territory</TableHead>
                  <TableHead className="text-right">GWP</TableHead>
                  <TableHead className="text-right">Accounts</TableHead>
                  <TableHead className="text-right">Avg Premium</TableHead>
                  <TableHead className="text-right">Avg Limit</TableHead>
                  <TableHead>Dominant syndicate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {territoryBreakdown.map((t) => (
                  <TableRow key={t.territory}>
                    <TableCell className="font-medium">{t.territory}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      £{(t.gwp / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {t.accountCount}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      £{(t.avgPremium / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      £{(t.avgLimit / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {t.dominantSyndicate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 3. Accounts by Limit Band */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accounts by Limit Band</CardTitle>
                <CardDescription>£0-100k through £5M+</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                    <BarChart
                      data={limitBandsMarket}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="band"
                        tick={{ fill: theme.textColor, fontSize: 11 }}
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
                      <Bar
                        dataKey="accountCount"
                        fill={theme.chart2}
                        radius={[4, 4, 0, 0]}
                        name="Accounts"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Limit band table</CardTitle>
            <CardDescription>Counts and GWP per band</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Band</TableHead>
                  <TableHead className="text-right">Account count</TableHead>
                  <TableHead className="text-right">GWP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {limitBandsMarket.map((row) => (
                  <TableRow key={row.band}>
                    <TableCell className="font-medium">{row.band}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.accountCount}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      £{(row.totalGwp / 1000).toFixed(0)}k
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 4. Accounts by Premium Band */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accounts by Premium Band</CardTitle>
                <CardDescription>£0-10k through £100k+</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                    <BarChart
                      data={premiumBandsMarket}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="band"
                        tick={{ fill: theme.textColor, fontSize: 11 }}
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
                      <Bar
                        dataKey="accountCount"
                        fill={theme.chart3}
                        radius={[4, 4, 0, 0]}
                        name="Accounts"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Premium band table</CardTitle>
            <CardDescription>Account counts per band</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Band</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {premiumBandsMarket.map((row) => (
                  <TableRow key={row.band}>
                    <TableCell className="font-medium">{row.band}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.accountCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 5. Regulatory Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regulatory flags</CardTitle>
          <CardDescription>Key regulations and compliance status by territory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Territory</TableHead>
                <TableHead>Key regulations</TableHead>
                <TableHead>Compliance status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regulatoryFlags.map((row) => (
                <TableRow key={row.territory}>
                  <TableCell className="font-medium">{row.territory}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    {row.keyRegulations}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("font-normal", COMPLIANCE_STYLES[row.complianceStatus])}
                    >
                      {row.complianceStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    {row.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 6. Syndicate Appetite by Territory */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Syndicate appetite by territory</CardTitle>
          <CardDescription>Hot = green, warm = amber, cold = slate, declined = red</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border/50 bg-muted/30 px-2 py-2 text-left font-medium sticky left-0 z-10 min-w-[140px]">
                    Syndicate
                  </th>
                  {territories.map((t) => (
                    <th
                      key={t}
                      className="border border-border/50 bg-muted/30 px-2 py-2 text-center font-medium min-w-[64px]"
                    >
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {syndicates.map((syndicate) => (
                  <tr key={syndicate}>
                    <td className="border border-border/50 px-2 py-1.5 font-medium sticky left-0 bg-background z-10">
                      {syndicate}
                    </td>
                    {territories.map((territory) => {
                      const appetite = appetiteMap.get(`${syndicate}|${territory}`) ?? "declined";
                      return (
                        <td
                          key={territory}
                          className="border border-border/50 px-1 py-1 text-center"
                        >
                          <span
                            className={cn(
                              "inline-block rounded px-1.5 py-0.5 text-xs font-medium capitalize",
                              APPETITE_STYLES[appetite]
                            )}
                            title={`${syndicate} – ${territory}: ${appetite}`}
                          >
                            {appetite.replace("_", " ")}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
