"use client";

import { useCallback, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  ZAxis,
} from "recharts";
import { Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ThemedChartWrapper } from "@/components/broker/themed-chart-wrapper";
import type { Territory } from "@/types";
import type { PortfolioMixType } from "@/types";
import {
  rateTable,
  lossRatioByYear,
  avgRateBySyndicate,
  yoyRateChange,
} from "@/lib/mock-data/pricing";

const TERRITORIES: Territory[] = ["UK", "EU", "US", "APAC", "MEA", "LATAM"];
const PORTFOLIO_MIX_OPTIONS: PortfolioMixType[] = [
  "Pure Human",
  "AI-Assisted",
  "Hybrid",
  "AI-Generated",
];

/** Map risk score 1–100 to grade A/B/C */
function riskScoreToGrade(score: number): "A" | "B" | "C" {
  if (score <= 40) return "A";
  if (score <= 70) return "B";
  return "C";
}

/** Get rate per million and min premium from rate table; fallback for MEA/LATAM */
function getRateForTerritoryAndGrade(
  territory: string,
  riskGrade: "A" | "B" | "C"
): { ratePerMillion: number; minPremium: number } {
  const row = rateTable.find(
    (r) => r.territory === territory && r.riskGrade === riskGrade
  );
  if (row) return { ratePerMillion: row.ratePerMillion, minPremium: row.minPremium };
  const fallback = rateTable.find((r) => r.territory === "UK");
  return fallback
    ? { ratePerMillion: fallback.ratePerMillion, minPremium: fallback.minPremium }
    : { ratePerMillion: 50, minPremium: 25_000 };
}

/** Technical price calculation result */
interface CalcResult {
  burningCost: number;
  technicalPremium: number;
  marketPremium: number;
  ratePct: number;
}

function calculateTechnicalPrice(
  tiv: number,
  riskScore: number,
  territory: string,
  _portfolioMix: string
): CalcResult {
  const grade = riskScoreToGrade(riskScore);
  const { ratePerMillion, minPremium } = getRateForTerritoryAndGrade(
    territory,
    grade
  );
  const tivMillions = tiv / 1_000_000;
  const technicalPremium = Math.max(
    minPremium,
    tivMillions * ratePerMillion
  );
  const avgLossRatio = 0.1;
  const burningCost = technicalPremium * avgLossRatio;
  const marketPremium = technicalPremium * 1.05;
  const ratePct = tiv > 0 ? (marketPremium / tiv) * 100 : 0;
  return {
    burningCost,
    technicalPremium,
    marketPremium,
    ratePct,
  };
}

/** Scatter data: premium vs limit (band midpoint), size = account count */
const scatterData = [
  { limit: 50, premium: 23_750, count: 4, band: "£0-100k" },
  { limit: 300, premium: 35_000, count: 12, band: "£100k-500k" },
  { limit: 750, premium: 65_000, count: 8, band: "£500k-1M" },
  { limit: 1500, premium: 177_500, count: 6, band: "£1M+" },
];

/** Mock: technical vs market price gap (e.g. market is 5% above technical) */
const PRICE_GAP_PCT = 5;

export default function PricingPage() {
  const [tiv, setTiv] = useState("500000");
  const [riskScore, setRiskScore] = useState("35");
  const [territory, setTerritory] = useState<Territory>("UK");
  const [portfolioMix, setPortfolioMix] = useState<PortfolioMixType>("Hybrid");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalculate = useCallback(async () => {
    const tivNum = Math.max(0, Number(tiv) || 0);
    const scoreNum = Math.min(100, Math.max(1, Number(riskScore) || 50));
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 600));
    const calc = calculateTechnicalPrice(tivNum, scoreNum, territory, portfolioMix);
    setResult(calc);
    setLoading(false);
  }, [tiv, riskScore, territory, portfolioMix]);

  const lossRatioChartData = useMemo(
    () =>
      lossRatioByYear.map((r) => ({
        year: r.year,
        lossRatioPct: (r.lossRatio * 100),
        target: 60,
      })),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Pricing
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Technical pricing, loss ratios and rate comparison
        </p>
      </div>

      {/* 1. Technical Price Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Technical Price Calculator
          </CardTitle>
          <CardDescription>
            Input TIV, risk score, territory and portfolio mix to get technical and market premium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">TIV (£)</label>
              <Input
                type="number"
                min={0}
                value={tiv}
                onChange={(e) => setTiv(e.target.value)}
                placeholder="e.g. 500000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Score (1–100)</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={riskScore}
                onChange={(e) => setRiskScore(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Territory</label>
              <Select value={territory} onValueChange={(v) => setTerritory(v as Territory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TERRITORIES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Portfolio Mix</label>
              <Select value={portfolioMix} onValueChange={(v) => setPortfolioMix(v as PortfolioMixType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PORTFOLIO_MIX_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={handleCalculate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Calculating…
                </>
              ) : (
                "Calculate"
              )}
            </Button>
          </div>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-lg border border-border/50 bg-muted/20 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Burning Cost</p>
                <p className="font-mono font-medium">£{(result.burningCost / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Technical Premium</p>
                <p className="font-mono font-medium">£{(result.technicalPremium / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Market Premium</p>
                <p className="font-mono font-medium">£{(result.marketPremium / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rate (%)</p>
                <p className="font-mono font-medium">{result.ratePct.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Loss Ratio Tracker */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loss Ratio Tracker</CardTitle>
                <CardDescription>Loss ratio by year with 60% target</CardDescription>
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
                        domain={[0, 70]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.tooltipBg,
                          border: `1px solid ${theme.tooltipBorder}`,
                          borderRadius: "8px",
                          color: theme.tooltipText,
                        }}
                        formatter={(value: number | undefined, name?: string) => [
                          value != null ? `${value.toFixed(1)}%` : "",
                          (name ?? "") === "lossRatioPct" ? "Loss ratio" : "Target",
                        ]}
                        labelFormatter={(y) => `Year ${y}`}
                      />
                      <ReferenceLine y={60} stroke={theme.chart3} strokeDasharray="4 4" />
                      <Line
                        type="monotone"
                        dataKey="lossRatioPct"
                        name="Loss ratio"
                        stroke={theme.chart1}
                        strokeWidth={2}
                        dot={{ fill: theme.chart1 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="Target"
                        stroke={theme.chart3}
                        strokeDasharray="4 4"
                        strokeWidth={1}
                        dot={false}
                      />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Loss Ratio – Table</CardTitle>
            <CardDescription>GWP, claims and ratios by year</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">GWP</TableHead>
                  <TableHead className="text-right">Claims Incurred</TableHead>
                  <TableHead className="text-right">Claims Paid</TableHead>
                  <TableHead className="text-right">Loss Ratio %</TableHead>
                  <TableHead className="text-right">Combined Ratio %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lossRatioByYear.map((r) => (
                  <TableRow key={r.year}>
                    <TableCell className="font-medium">{r.year}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      £{(r.premium / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      £{(r.incurred / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      £{(r.paid / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {(r.lossRatio * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {((r.combinedRatio ?? r.lossRatio + 0.28) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 3. Rate Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avg Rate by Syndicate</CardTitle>
                <CardDescription>Average rate % by syndicate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                    <BarChart
                      data={avgRateBySyndicate}
                      layout="vertical"
                      margin={{ top: 8, right: 8, left: 80, bottom: 0 }}
                    >
                      <XAxis
                        type="number"
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                        tickFormatter={(v) => `${v}%`}
                        domain={[0, 6]}
                      />
                      <YAxis
                        type="category"
                        dataKey="syndicate"
                        width={78}
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
                        formatter={(value: number | undefined) => [
                          value != null ? `${value}%` : "",
                          "Avg rate",
                        ]}
                      />
                      <Bar
                        dataKey="avgRatePct"
                        fill={theme.chart1}
                        radius={[0, 4, 4, 0]}
                        name="Avg rate %"
                      />
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
                <CardTitle className="text-lg">Premium vs Limit</CardTitle>
                <CardDescription>Bubble size = account count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                    <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <XAxis
                        type="number"
                        dataKey="limit"
                        name="Limit (£k)"
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                        tickFormatter={(v) => `£${v}k`}
                      />
                      <YAxis
                        type="number"
                        dataKey="premium"
                        name="Premium"
                        tick={{ fill: theme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: theme.gridColor }}
                        tickLine={{ stroke: theme.gridColor }}
                        tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                      />
                      <ZAxis type="number" dataKey="count" range={[100, 800]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.tooltipBg,
                          border: `1px solid ${theme.tooltipBorder}`,
                          borderRadius: "8px",
                          color: theme.tooltipText,
                        }}
                        formatter={(value: number | undefined, _n, item?: { payload?: { premium?: number } }) => {
                          const payload = item?.payload;
                          return [
                            value != null ? (payload?.premium === value ? `£${(value / 1000).toFixed(0)}k` : String(value)) : "",
                            payload?.premium === value ? "Premium" : "Accounts",
                          ];
                        }}
                        labelFormatter={() => ""}
                      />
                      <Scatter
                        name="Limit bands"
                        data={scatterData}
                        fill={theme.chart2}
                        fillOpacity={0.8}
                        shape="circle"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </ThemedChartWrapper>
      </div>

      {/* 4. Rate Adequacy */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rate Adequacy</CardTitle>
            <CardDescription>Technical price vs market price gap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-52 h-32">
                <svg viewBox="0 0 120 80" className="w-full h-full">
                  <path
                    d="M 10 70 A 50 50 0 0 1 110 70"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 70 A 50 50 0 0 1 110 70"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(PRICE_GAP_PCT / 20) * 157} 157`}
                  />
                  <line
                    x1="60"
                    y1="20"
                    x2={60 + 50 * Math.cos((180 - (PRICE_GAP_PCT / 20) * 180) * (Math.PI / 180))}
                    y2={20 + 50 * Math.sin((180 - (PRICE_GAP_PCT / 20) * 180) * (Math.PI / 180))}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-center w-28">
                  <span className="text-2xl font-bold">{PRICE_GAP_PCT}%</span>
                  <p className="text-xs text-muted-foreground">Market above technical</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Market premium is {PRICE_GAP_PCT}% above technical; rate adequacy is healthy.
              </p>
            </div>
          </CardContent>
        </Card>
        <ThemedChartWrapper>
          {(theme) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">YoY Rate Change</CardTitle>
                <CardDescription>Year-over-year rate change trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                    <LineChart
                      data={yoyRateChange}
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
                          value != null ? `${value}%` : "",
                          "YoY change",
                        ]}
                        labelFormatter={(y) => `Year ${y}`}
                      />
                      <ReferenceLine y={0} stroke={theme.gridColor} strokeDasharray="2 2" />
                      <Line
                        type="monotone"
                        dataKey="rateChangePct"
                        name="YoY rate change %"
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
    </div>
  );
}
