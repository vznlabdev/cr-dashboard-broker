"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SubmissionCard } from "@/components/broker/SubmissionCard";
import { statusColors } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import type { Submission, SubmissionStatus, Territory } from "@/types";
import { submissions as initialSubmissions } from "@/lib/mock-data/submissions";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "quoted", label: "Quoted" },
  { value: "bound", label: "Bound" },
  { value: "declined", label: "Declined" },
  { value: "expired", label: "Expired" },
];

const TERRITORY_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All territories" },
  { value: "UK", label: "UK" },
  { value: "EU", label: "EU" },
  { value: "US", label: "US" },
  { value: "APAC", label: "APAC" },
  { value: "MEA", label: "MEA" },
  { value: "LATAM", label: "LATAM" },
];

const KANBAN_COLUMNS: { status: SubmissionStatus; label: string }[] = [
  { status: "draft", label: "Draft" },
  { status: "submitted", label: "Submitted" },
  { status: "quoted", label: "Quoted" },
  { status: "bound", label: "Bound" },
  { status: "declined", label: "Declined" },
  { status: "expired", label: "Expired" },
];

export default function PipelineSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>(() => [...initialSubmissions]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [territoryFilter, setTerritoryFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "kanban">("table");
  const [draggedSubmission, setDraggedSubmission] = useState<Submission | null>(null);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (territoryFilter !== "all" && s.territory !== territoryFilter) return false;
      if (dateFrom && s.dateSubmitted && s.dateSubmitted < dateFrom) return false;
      if (dateTo && s.dateSubmitted && s.dateSubmitted > dateTo) return false;
      if (
        search &&
        !s.clientName.toLowerCase().includes(search.toLowerCase()) &&
        !s.id.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [submissions, statusFilter, territoryFilter, dateFrom, dateTo, search]);

  const kanbanBuckets = useMemo(() => {
    const buckets: Record<SubmissionStatus, Submission[]> = {
      draft: [],
      submitted: [],
      quoted: [],
      bound: [],
      declined: [],
      expired: [],
    };
    filtered.forEach((s) => {
      buckets[s.status].push(s);
    });
    return buckets;
  }, [filtered]);

  const handleDragStart = useCallback((_e: React.DragEvent, submission: Submission) => {
    setDraggedSubmission(submission);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedSubmission(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, newStatus: SubmissionStatus) => {
      e.preventDefault();
      if (!draggedSubmission) return;
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === draggedSubmission.id ? { ...s, status: newStatus } : s
        )
      );
      setDraggedSubmission(null);
    },
    [draggedSubmission]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Submissions
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track client applications through placement
          </p>
        </div>
        <Button className="w-full sm:w-auto sm:shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          New Submission
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search client or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={territoryFilter} onValueChange={setTerritoryFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Territory" />
          </SelectTrigger>
          <SelectContent>
            {TERRITORY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          placeholder="From"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-[140px] h-9"
        />
        <Input
          type="date"
          placeholder="To"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-[140px] h-9"
        />
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "table" | "kanban")}
          className="ml-auto"
        >
          <TabsList className="h-9">
            <TabsTrigger value="table" className="gap-1.5">
              <List className="h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="gap-1.5">
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "table" && (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Coverage Type</TableHead>
                <TableHead>Limit</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Syndicates</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Days Open</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
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
                  <TableCell className="px-3 py-1 font-mono text-[11px]">
                    £{(s.premiumIndication / 1000).toFixed(0)}k
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
                  <TableCell className="px-3 py-1 text-muted-foreground text-[11px] truncate max-w-[120px]">
                    {s.syndicates.length ? s.syndicates.join(", ") : "—"}
                  </TableCell>
                  <TableCell className="px-3 py-1 text-muted-foreground text-[11px]">
                    {s.dateSubmitted || "—"}
                  </TableCell>
                  <TableCell className="px-3 py-1">{s.daysOpen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {view === "kanban" && (
        <div
          className="flex gap-4 overflow-x-auto pb-2"
          onDragEnd={handleDragEnd}
        >
          {KANBAN_COLUMNS.map(({ status, label }) => (
            <div
              key={status}
              className={cn(
                "flex-shrink-0 w-[280px] rounded-lg border border-border/50 bg-muted/20 p-2 min-h-[400px] transition-colors",
                draggedSubmission && "ring-2 ring-primary/30"
              )}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">
                  {kanbanBuckets[status].length}
                </span>
              </div>
              <div className="space-y-2">
                {kanbanBuckets[status].map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    submission={sub}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No submissions match your filters.
        </p>
      )}
    </div>
  );
}
