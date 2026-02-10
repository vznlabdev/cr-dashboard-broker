"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemedChartWrapper } from "@/components/broker/themed-chart-wrapper";
import { cn } from "@/lib/utils";
import type { CoverageType, AppetiteLevel } from "@/types";
import { syndicateContacts } from "@/lib/mock-data/people";
import {
  capacityByCoverage,
  syndicateRelationshipScores,
} from "@/lib/mock-data/positioning";

const COVERAGE_LABELS: Record<CoverageType, string> = {
  ai_content_ip: "AI Content IP",
  deepfake_liability: "Deepfake Liability",
  copyright_infringement: "Copyright Infringement",
  nilp_protection: "NILP Protection",
  comprehensive: "Comprehensive",
};

const APPETITE_STYLES: Record<AppetiteLevel, string> = {
  hot: "bg-emerald-600/90 text-white",
  warm: "bg-amber-500/90 text-white",
  cold: "bg-slate-500/80 text-white",
  declined: "bg-red-600/90 text-white",
};

/** Unique syndicates (first contact per syndicate), with appetite by coverage */
function useAppetiteMatrix() {
  return useMemo(() => {
    const seen = new Set<string>();
    const syndicates: { key: string; name: string; number: string; appetite: Record<CoverageType, AppetiteLevel>; contacts: typeof syndicateContacts }[] = [];
    for (const c of syndicateContacts) {
      const key = `${c.syndicateName} (${c.syndicateNumber})`;
      if (seen.has(key)) {
        const existing = syndicates.find((s) => s.key === key);
        if (existing) existing.contacts.push(c);
        continue;
      }
      seen.add(key);
      syndicates.push({
        key,
        name: c.syndicateName,
        number: c.syndicateNumber,
        appetite: c.appetite,
        contacts: [c],
      });
    }
    return syndicates;
  }, []);
}

const COVERAGE_ORDER: CoverageType[] = [
  "ai_content_ip",
  "deepfake_liability",
  "copyright_infringement",
  "nilp_protection",
  "comprehensive",
];

export default function PositioningPage() {
  const syndicates = useAppetiteMatrix();
  const [detailCell, setDetailCell] = useState<{
    coverage: CoverageType;
    syndicateKey: string;
    appetite: AppetiteLevel;
    contacts: typeof syndicateContacts;
  } | null>(null);
  const [strategyNotes, setStrategyNotes] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    syndicateRelationshipScores.forEach((s) => {
      o[s.syndicateKey] = "";
    });
    return o;
  });

  const capacityChartData = useMemo(
    () =>
      capacityByCoverage.map((r) => ({
        name: r.label,
        placed: r.placedCapacity,
        remaining: r.availableCapacity - r.placedCapacity,
        pctFilled: Math.round((r.placedCapacity / r.availableCapacity) * 100),
      })),
    []
  );

  const handleCellClick = (coverage: CoverageType, synd: (typeof syndicates)[0]) => {
    setDetailCell({
      coverage,
      syndicateKey: synd.key,
      appetite: synd.appetite[coverage],
      contacts: synd.contacts,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Positioning
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Syndicate appetite, capacity, relationship scores and strategy notes
        </p>
      </div>

      {/* 1. Syndicate Appetite Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Syndicate appetite matrix</CardTitle>
          <CardDescription>
            Rows = coverage types, columns = syndicates. Click a cell for detail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border/50 bg-muted/30 px-2 py-2 text-left font-medium sticky left-0 z-10 min-w-[140px]">
                    Coverage
                  </th>
                  {syndicates.map((s) => (
                    <th
                      key={s.key}
                      className="border border-border/50 bg-muted/30 px-2 py-2 text-center font-medium min-w-[100px]"
                    >
                      {s.name} ({s.number})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COVERAGE_ORDER.map((cov) => (
                  <tr key={cov}>
                    <td className="border border-border/50 px-2 py-1.5 font-medium sticky left-0 bg-background z-10">
                      {COVERAGE_LABELS[cov]}
                    </td>
                    {syndicates.map((synd) => {
                      const appetite = synd.appetite[cov];
                      return (
                        <td
                          key={synd.key}
                          className="border border-border/50 px-1 py-1 text-center"
                        >
                          <button
                            type="button"
                            onClick={() => handleCellClick(cov, synd)}
                            className={cn(
                              "inline-flex min-w-[72px] items-center justify-center rounded px-2 py-1 text-xs font-medium capitalize transition-opacity hover:opacity-90",
                              APPETITE_STYLES[appetite]
                            )}
                            title={`${COVERAGE_LABELS[cov]} × ${synd.key}: ${appetite}`}
                          >
                            {appetite.replace("_", " ")}
                          </button>
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

      <Dialog open={!!detailCell} onOpenChange={(open) => !open && setDetailCell(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appetite detail</DialogTitle>
            <DialogDescription>
              {detailCell && (
                <>
                  {COVERAGE_LABELS[detailCell.coverage]} × {detailCell.syndicateKey}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {detailCell && (
            <div className="space-y-3">
              <p>
                <span className="font-medium">Appetite:</span>{" "}
                <span
                  className={cn(
                    "inline-block rounded px-2 py-0.5 text-xs font-medium capitalize",
                    APPETITE_STYLES[detailCell.appetite]
                  )}
                >
                  {detailCell.appetite.replace("_", " ")}
                </span>
              </p>
              <p className="text-sm font-medium">Contacts at this syndicate:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {detailCell.contacts.map((c) => (
                  <li key={c.id}>
                    {c.name} – {c.role} ({c.territories.join(", ")})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 2. Market Capacity Tracker */}
      <ThemedChartWrapper>
        {(theme) => (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market capacity tracker</CardTitle>
              <CardDescription>
                Total available vs placed capacity per coverage type; % filled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <BarChart
                    data={capacityChartData}
                    layout="vertical"
                    margin={{ top: 8, right: 8, left: 100, bottom: 0 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fill: theme.textColor, fontSize: 12 }}
                      axisLine={{ stroke: theme.gridColor }}
                      tickLine={{ stroke: theme.gridColor }}
                      tickFormatter={(v) => `£${((v ?? 0) / 1_000_000).toFixed(0)}M`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={96}
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
                      formatter={(value: number | undefined, name: string, props: { payload: { placed: number; remaining: number; pctFilled: number } }) => {
                        if (name === "placed")
                          return [`£${((props.payload.placed ?? 0) / 1_000_000).toFixed(1)}M placed`, "Placed"];
                        if (name === "remaining")
                          return [`£${((props.payload.remaining ?? 0) / 1_000_000).toFixed(1)}M remaining`, "Remaining"];
                        return [value, name];
                      }}
                      labelFormatter={(_, payloads) =>
                        payloads?.[0]?.payload?.pctFilled != null
                          ? `${(payloads[0].payload as { pctFilled: number }).pctFilled}% filled`
                          : ""
                      }
                    />
                    <Bar dataKey="placed" stackId="a" fill={theme.chart1} name="Placed" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="remaining" stackId="a" fill={theme.gridColor} name="Remaining" radius={[0, 4, 4, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                {capacityChartData.map((r) => (
                  <span key={r.name} className="text-muted-foreground">
                    <strong className="text-foreground">{r.name}:</strong> {r.pctFilled}% filled
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </ThemedChartWrapper>

      {/* 3. Syndicate Relationship Scores */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Syndicate relationship scores</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {syndicateRelationshipScores.map((row) => (
            <Card key={row.syndicateKey}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {row.syndicateName} ({row.syndicateNumber})
                </CardTitle>
                <CardDescription>Key contact: {row.keyContact}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Responsiveness</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i <= row.responsivenessScore
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted/50"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Avg quote turnaround:</span>{" "}
                  <span className="font-mono">{row.avgQuoteTurnaround} days</span>
                </p>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Claim handling rating</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-2 flex-1 rounded-full max-w-[32px]",
                          i <= row.claimHandlingRating
                            ? "bg-primary"
                            : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Strategy Notes */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Strategy notes</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Broker notes and positioning strategy per syndicate (editable).
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {syndicateRelationshipScores.map((row) => (
            <Card key={row.syndicateKey}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {row.syndicateName} ({row.syndicateNumber})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-border bg-background/80 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  placeholder="Broker notes, strategy, positioning…"
                  value={strategyNotes[row.syndicateKey] ?? ""}
                  onChange={(e) =>
                    setStrategyNotes((prev) => ({
                      ...prev,
                      [row.syndicateKey]: e.target.value,
                    }))
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
