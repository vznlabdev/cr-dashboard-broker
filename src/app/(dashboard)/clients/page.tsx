"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { riskGradeColors } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import type { Client } from "@/types";
import { clients as allClients } from "@/lib/mock-data/clients";
import { historicYears } from "@/lib/mock-data/historic-results";

const GRADE_ORDER = { A: 6, B: 5, C: 4, D: 3, E: 2, F: 1 };
function avgRiskGradeLabel(clients: Client[]): string {
  if (clients.length === 0) return "—";
  const sum = clients.reduce((a, c) => a + (GRADE_ORDER[c.riskGrade] ?? 0), 0);
  const avg = sum / clients.length;
  const letter = (["F", "E", "D", "C", "B", "A"] as const)[Math.round(avg) - 1] ?? "—";
  return letter;
}

type SortKey = "name" | "industry" | "activePolicies" | "totalLimit" | "gwp" | "riskGrade" | "renewalDate" | "brokerHandler";

export default function ClientsPortfolioPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    return allClients.filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.brokerHandler.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "industry":
          cmp = a.industry.localeCompare(b.industry);
          break;
        case "activePolicies":
          cmp = a.activePolicies - b.activePolicies;
          break;
        case "totalLimit":
          cmp = a.totalLimit - b.totalLimit;
          break;
        case "gwp":
          cmp = a.gwp - b.gwp;
          break;
        case "riskGrade":
          cmp = (GRADE_ORDER[a.riskGrade] ?? 0) - (GRADE_ORDER[b.riskGrade] ?? 0);
          break;
        case "renewalDate":
          cmp = a.renewalDate.localeCompare(b.renewalDate);
          break;
        case "brokerHandler":
          cmp = a.brokerHandler.localeCompare(b.brokerHandler);
          break;
        default:
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = useCallback((key: SortKey) => {
    setSortKey(key);
    setSortDir((d) => (sortKey === key ? (d === "asc" ? "desc" : "asc") : "asc"));
  }, [sortKey]);

  const totalGwp = useMemo(() => filtered.reduce((s, c) => s + c.gwp, 0), [filtered]);
  const renewalRate = historicYears.find((y) => y.year === 2024)?.renewalRate ?? 0.84;
  const avgGrade = avgRiskGradeLabel(filtered);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Portfolio
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Full book of business overview
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-lg">Total GWP</CardTitle>
            <CardDescription>Gross written premium</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              £{(totalGwp / 1_000_000).toFixed(2)}M
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-lg">Client Count</CardTitle>
            <CardDescription>Active clients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-lg">Avg Risk Grade</CardTitle>
            <CardDescription>Portfolio average</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgGrade}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-lg">Renewal Rate</CardTitle>
            <CardDescription>Last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(renewalRate * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, industry, handler..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("name")}
                >
                  Client Name
                  {sortKey === "name" ? sortDir === "asc" ? <ArrowUp className="h-3.5 w-3" /> : <ArrowDown className="h-3.5 w-3" /> : <ArrowUpDown className="h-3.5 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("industry")}
                >
                  Industry
                  {sortKey === "industry" ? sortDir === "asc" ? <ArrowUp className="h-3.5 w-3" /> : <ArrowDown className="h-3.5 w-3" /> : <ArrowUpDown className="h-3.5 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("activePolicies")}
                >
                  Policies
                  {sortKey === "activePolicies" ? sortDir === "asc" ? <ArrowUp className="h-3.5 w-3" /> : <ArrowDown className="h-3.5 w-3" /> : <ArrowUpDown className="h-3.5 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("totalLimit")}
                >
                  Total Limit
                  {sortKey === "totalLimit" ? sortDir === "asc" ? <ArrowUp className="h-3.5 w-3" /> : <ArrowDown className="h-3.5 w-3" /> : <ArrowUpDown className="h-3.5 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("gwp")}
                >
                  GWP
                  {sortKey === "gwp" ? sortDir === "asc" ? <ArrowUp className="h-3.5 w-3" /> : <ArrowDown className="h-3.5 w-3" /> : <ArrowUpDown className="h-3.5 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("riskGrade")}
                >
                  Risk Grade
                  {sortKey === "riskGrade" ? sortDir === "asc" ? <ArrowUp className="h-3.5 w-3" /> : <ArrowDown className="h-3.5 w-3" /> : <ArrowUpDown className="h-3.5 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("renewalDate")}
                >
                  Renewal Date
                  {sortKey === "renewalDate" ? sortDir === "asc" ? <ArrowUp className="h-3.5 w-3" /> : <ArrowDown className="h-3.5 w-3" /> : <ArrowUpDown className="h-3.5 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("brokerHandler")}
                >
                  Handler
                  {sortKey === "brokerHandler" ? sortDir === "asc" ? <ArrowUp className="h-3.5 w-3" /> : <ArrowDown className="h-3.5 w-3" /> : <ArrowUpDown className="h-3.5 w-3 opacity-50" />}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((c) => {
              const gradeStyle = riskGradeColors[c.riskGrade];
              return (
                <TableRow
                  key={c.id}
                  className="border-b border-border/10 hover:bg-muted/30 transition-colors cursor-pointer h-8"
                  onClick={() => router.push(`/clients/${c.id}`)}
                >
                  <TableCell className="px-3 py-1 font-medium truncate max-w-[160px]">
                    {c.name}
                  </TableCell>
                  <TableCell className="px-3 py-1 text-muted-foreground text-[11px]">
                    {c.industry}
                  </TableCell>
                  <TableCell className="px-3 py-1">{c.activePolicies}</TableCell>
                  <TableCell className="px-3 py-1 font-mono text-[11px]">
                    £{(c.totalLimit / 1000).toFixed(0)}k
                  </TableCell>
                  <TableCell className="px-3 py-1 font-mono text-[11px]">
                    £{(c.gwp / 1000).toFixed(0)}k
                  </TableCell>
                  <TableCell className="px-3 py-1">
                    {gradeStyle ? (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          gradeStyle.bg,
                          gradeStyle.text
                        )}
                      >
                        {c.riskGrade}
                      </span>
                    ) : (
                      c.riskGrade
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-1 text-muted-foreground text-[11px]">
                    {c.renewalDate}
                  </TableCell>
                  <TableCell className="px-3 py-1 text-[11px]">
                    {c.brokerHandler}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {sorted.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No clients match your search.
        </p>
      )}
    </div>
  );
}
