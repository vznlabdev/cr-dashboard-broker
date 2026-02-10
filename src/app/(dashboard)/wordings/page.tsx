"use client";

import { useMemo, useState } from "react";
import { History, FileEdit, Send, Check, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Wording, WordingStatus } from "@/types";
import { wordings as allWordings } from "@/lib/mock-data/wordings";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "under_review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "superseded", label: "Superseded" },
];

const COVERAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All coverage types" },
  { value: "ai_content_ip", label: "AI Content IP" },
  { value: "deepfake_liability", label: "Deepfake Liability" },
  { value: "copyright_infringement", label: "Copyright Infringement" },
  { value: "nilp_protection", label: "NILP Protection" },
  { value: "comprehensive", label: "Comprehensive" },
];

const wordingStatusClasses: Record<WordingStatus, string> = {
  draft: "text-slate-500 bg-slate-500/10",
  under_review: "text-amber-600 bg-amber-500/10",
  approved: "text-emerald-600 bg-emerald-500/10",
  superseded: "text-slate-500 bg-slate-500/10",
};

// Mock version history and detail content per wording
const mockVersionHistory: Record<string, { version: string; date: string; author: string; note: string }[]> = {
  "w-001": [
    { version: "2.1", date: "2025-01-15", author: "James Walsh", note: "Approved" },
    { version: "2.0", date: "2024-11-01", author: "James Walsh", note: "Schedule 2 update" },
    { version: "1.0", date: "2024-06-15", author: "James Walsh", note: "Initial" },
  ],
  "w-002": [
    { version: "1.3", date: "2024-11-20", author: "Elena Vasquez", note: "Approved" },
    { version: "1.2", date: "2024-09-10", author: "Elena Vasquez", note: "Consent warranty" },
  ],
  "w-003": [
    { version: "3.0", date: "2024-10-01", author: "James Walsh", note: "Approved" },
  ],
  "w-004": [
    { version: "0.9", date: "2025-02-01", author: "Michael Torres", note: "Under review" },
  ],
  "w-005": [
    { version: "1.2", date: "2024-12-10", author: "Elena Vasquez", note: "Approved" },
  ],
  "w-006": [
    { version: "1.0", date: "2024-09-15", author: "Priya Sharma", note: "Approved" },
  ],
  "w-007": [
    { version: "2.0", date: "2025-01-05", author: "Michael Torres", note: "Approved" },
  ],
  "w-008": [
    { version: "1.1", date: "2024-06-01", author: "James Walsh", note: "Superseded" },
  ],
};

const mockKeyTerms: Record<string, string> = {
  ai_content_ip: "Coverage for IP infringement arising from AI-generated or AI-assisted content. Includes copyright, trademark and passing off where caused by use of approved AI tools.",
  deepfake_liability: "Coverage for claims arising from deepfake or synthetic media. Requires documented consent and likeness policy.",
  copyright_infringement: "Coverage for copyright infringement in musical, visual and literary content. Mechanical and sync rights as per schedule.",
  nilp_protection: "Non-invalidating litigation protection. Territory and regulatory exclusions apply.",
  comprehensive: "Combined AI E&O and content liability. Includes AI content IP, deepfake and copyright under one form.",
};

const mockExclusions: Record<string, string[]> = {
  ai_content_ip: ["Pre-2022 training data", "Unlicensed model output", "Open-source model IP", "Knowingly infringing content"],
  deepfake_liability: ["Political deepfake", "Defamation", "Without consent documentation"],
  copyright_infringement: ["Orphan works", "Mechanical rights (see endorsement)", "Stock library claims"],
  nilp_protection: ["Territorial limits", "EU AI Act carve-back", "US state law variations"],
  comprehensive: ["As per underlying sections", "NILP carve-back", "Territory schedule"],
};

export default function WordingsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [coverageFilter, setCoverageFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    return allWordings.filter((w) => {
      if (statusFilter !== "all" && w.status !== statusFilter) return false;
      if (coverageFilter !== "all" && w.coverageType !== coverageFilter) return false;
      return true;
    });
  }, [statusFilter, coverageFilter]);

  const selected = useMemo(
    () => (selectedId ? allWordings.find((w) => w.id === selectedId) : null),
    [selectedId]
  );

  const versionHistory = selectedId ? (mockVersionHistory[selectedId] ?? []) : [];
  const keyTerms = selected ? (mockKeyTerms[selected.coverageType] ?? "—") : "";
  const exclusions = selected ? (mockExclusions[selected.coverageType] ?? []) : [];

  const openDetail = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setSheetOpen(true);
    }
  };

  const closeSheet = () => {
    setSheetOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Wordings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Policy language and clause libraries
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left panel: list */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9">
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
            <Select value={coverageFilter} onValueChange={setCoverageFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Coverage" />
              </SelectTrigger>
              <SelectContent>
                {COVERAGE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ul className="space-y-1">
            {filtered.map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(w.id);
                    openDetail(w.id);
                  }}
                  className={cn(
                    "w-full text-left rounded-lg border px-3 py-2.5 transition-colors",
                    selectedId === w.id
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/50 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{w.name}</span>
                    <span
                      className={cn(
                        "shrink-0 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        wordingStatusClasses[w.status]
                      )}
                    >
                      {w.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>v{w.version}</span>
                    <span>·</span>
                    <span>{w.lastModified}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">No wordings match filters.</p>
          )}
        </div>

        {/* Right panel: detail (desktop) */}
        <div className="hidden lg:block lg:col-span-2">
          {selected ? (
            <WordingDetail
              wording={selected}
              versionHistory={versionHistory}
              keyTerms={keyTerms}
              exclusions={exclusions}
            />
          ) : (
            <Card className="flex items-center justify-center min-h-[320px]">
              <CardContent className="py-12 text-center text-muted-foreground">
                <PanelRightOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a wording from the list</p>
                <p className="text-sm mt-1">Or use the list on mobile and open the detail panel</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile: Sheet for detail */}
      <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto lg:hidden">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  v{selected.version} · {selected.status.replace(/_/g, " ")} · {selected.author}
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 pb-6">
                <WordingDetail
                  wording={selected}
                  versionHistory={versionHistory}
                  keyTerms={keyTerms}
                  exclusions={exclusions}
                  compact
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}

function WordingDetail({
  wording,
  versionHistory,
  keyTerms,
  exclusions,
  compact,
}: {
  wording: Wording;
  versionHistory: { version: string; date: string; author: string; note: string }[];
  keyTerms: string;
  exclusions: string[];
  compact?: boolean;
}) {
  const statusClass = wordingStatusClasses[wording.status];
  const padding = compact ? "py-3" : "py-4";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{wording.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Version {wording.version} · {wording.author}
          </p>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mt-2",
              statusClass
            )}
          >
            {wording.status.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileEdit className="h-3.5 w-3.5" />
            Edit Draft
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Send className="h-3.5 w-3.5" />
            Submit for Review
          </Button>
          <Button size="sm" className="gap-1.5">
            <Check className="h-3.5 w-3.5" />
            Approve
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <History className="h-3.5 w-3.5" />
            View History
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className={padding}>
          <CardTitle className="text-base">Coverage summary</CardTitle>
        </CardHeader>
        <CardContent className={padding}>
          <p className="text-sm text-muted-foreground">
            {wording.coverageType.replace(/_/g, " ")} — Standard policy wording for this coverage type.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={padding}>
          <CardTitle className="text-base">Key terms</CardTitle>
        </CardHeader>
        <CardContent className={padding}>
          <p className="text-sm text-muted-foreground">{keyTerms}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={padding}>
          <CardTitle className="text-base">Exclusions list</CardTitle>
        </CardHeader>
        <CardContent className={padding}>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {exclusions.length > 0 ? exclusions.map((e, i) => <li key={i}>{e}</li>) : <li>None specified</li>}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={padding}>
          <CardTitle className="text-base">Endorsements</CardTitle>
        </CardHeader>
        <CardContent className={padding}>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {wording.endorsements.length > 0
              ? wording.endorsements.map((e, i) => <li key={i}>{e}</li>)
              : <li>None</li>}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={padding}>
          <CardTitle className="text-base">Syndicate requirements</CardTitle>
        </CardHeader>
        <CardContent className={padding}>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {wording.syndicateRequirements.length > 0
              ? wording.syndicateRequirements.map((r, i) => <li key={i}>{r}</li>)
              : <li>None</li>}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={padding}>
          <CardTitle className="text-base">Version history</CardTitle>
          <CardDescription>Timeline of changes</CardDescription>
        </CardHeader>
        <CardContent className={padding}>
          <div className="relative space-y-4">
            {versionHistory.length > 0 ? (
              versionHistory.map((v, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary shrink-0 mt-1.5" />
                    {i < versionHistory.length - 1 && (
                      <div className="w-px flex-1 min-h-[24px] bg-border/50 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-sm">Version {v.version}</p>
                    <p className="text-xs text-muted-foreground">{v.date} · {v.author}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{v.note}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No version history.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
