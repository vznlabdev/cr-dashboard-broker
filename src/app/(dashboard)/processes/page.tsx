"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Check, Circle } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  processPipelineSteps,
  referralTriggers,
  authorityMatrix,
  documentChecklistByStage,
} from "@/lib/mock-data/processes";
import type { ProcessStep } from "@/types";

function slaCompliancePct(step: ProcessStep): number {
  if (step.activeCount === 0) return 100;
  return Math.round(((step.activeCount - step.overdueCount) / step.activeCount) * 100);
}

function slaIndicatorStatus(step: ProcessStep): "green" | "amber" | "red" {
  const pct = slaCompliancePct(step);
  if (pct >= 90) return "green";
  if (pct >= 70) return "amber";
  return "red";
}

const SLA_COLORS = {
  green: "bg-[#28a745]",
  amber: "bg-[#ffc107]",
  red: "bg-[#dc3545]",
};

export default function ProcessesPage() {
  const [checklist, setChecklist] = useState(() =>
    documentChecklistByStage.map((s) => ({
      stage: s.stage,
      documents: s.documents.map((d) => ({ ...d })),
    }))
  );
  const [openChecklistStage, setOpenChecklistStage] = useState<number | null>(0);

  const toggleDoc = (stageIndex: number, docIndex: number) => {
    setChecklist((prev) => {
      const next = prev.map((s, i) =>
        i === stageIndex
          ? {
              ...s,
              documents: s.documents.map((d, j) =>
                j === docIndex ? { ...d, checked: !d.checked } : d
              ),
            }
          : s
      );
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Processes
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Pipeline, stage performance, referral triggers, authority and document checklist
        </p>
      </div>

      {/* 1. Process Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Process pipeline</CardTitle>
          <CardDescription>
            Intake → Risk Assessment → Market Approach → Quote → Negotiate → Bind → Issue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-stretch gap-0 min-w-max">
              {processPipelineSteps.map((step, i) => {
                const status = slaIndicatorStatus(step);
                return (
                  <div key={step.stage} className="flex items-center">
                    <div
                      className={cn(
                        "flex flex-col rounded-lg border border-border/50 bg-card p-3 text-center min-w-[120px]",
                        "shadow-modern"
                      )}
                    >
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {step.label}
                      </p>
                      <p className="text-xl font-bold mt-1">{step.activeCount}</p>
                      <p className="text-xs text-muted-foreground">active</p>
                      <p className="text-sm font-mono mt-1">{step.avgDays}d avg</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            SLA_COLORS[status]
                          )}
                          title={`SLA compliance ${slaCompliancePct(step)}%`}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          SLA {step.slaDays}d
                        </span>
                      </div>
                    </div>
                    {i < processPipelineSteps.length - 1 && (
                      <div className="flex-shrink-0 w-6 sm:w-8 flex items-center" aria-hidden>
                        <div className="h-px flex-1 bg-border/70" />
                        <span className="text-muted-foreground/60 text-xs">→</span>
                        <div className="h-px flex-1 bg-border/70" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Stage Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stage performance</CardTitle>
          <CardDescription>Active count, avg days, SLA, overdue and compliance %</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Active count</TableHead>
                <TableHead className="text-right">Avg days</TableHead>
                <TableHead className="text-right">SLA days</TableHead>
                <TableHead className="text-right">Overdue count</TableHead>
                <TableHead className="text-right">SLA compliance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processPipelineSteps.map((step) => {
                const status = slaIndicatorStatus(step);
                return (
                  <TableRow key={step.stage}>
                    <TableCell className="font-medium">{step.label}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {step.activeCount}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {step.avgDays}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {step.slaDays}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {step.overdueCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
                          status === "green" && "bg-[#28a745]/10 text-[#28a745]",
                          status === "amber" && "bg-[#ffc107]/15 text-[#e6a800]",
                          status === "red" && "bg-[#dc3545]/10 text-[#dc3545]"
                        )}
                      >
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", SLA_COLORS[status])}
                        />
                        {slaCompliancePct(step)}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 3. Referral Triggers */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Referral triggers</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {referralTriggers.map((t, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t.triggerCondition}</CardTitle>
                <CardDescription className="text-xs">
                  Authority: {t.authorityLevelRequired}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">Escalation: {t.escalationPath}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Authority Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Authority matrix</CardTitle>
          <CardDescription>Role, max binding limit, coverage, territory and expiry</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Max binding limit</TableHead>
                <TableHead>Coverage types</TableHead>
                <TableHead>Territory restrictions</TableHead>
                <TableHead>Expiry date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authorityMatrix.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.role}</TableCell>
                  <TableCell className="font-mono text-sm">{row.maxBindingLimit}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.coverageTypes}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.territoryRestrictions}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{row.expiryDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 5. Document Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document checklist</CardTitle>
          <CardDescription>Required documents per process stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {documentChecklistByStage.map((stage, stageIndex) => {
              const state = checklist[stageIndex];
              const docs = state?.documents ?? stage.documents;
              const isOpen = openChecklistStage === stageIndex;
              return (
                <Collapsible
                  key={stage.stage}
                  open={isOpen}
                  onOpenChange={(open) => setOpenChecklistStage(open ? stageIndex : null)}
                >
                  <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 text-left font-medium hover:bg-muted/30 transition-colors">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                    <span>{stage.label}</span>
                    <span className="text-xs text-muted-foreground font-normal ml-auto">
                      {docs.filter((d) => d.checked).length} / {docs.length}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="mt-1 ml-6 space-y-1.5 pb-2">
                      {docs.map((doc, docIndex) => (
                        <li
                          key={docIndex}
                          className="flex items-center gap-2 text-sm"
                        >
                          <button
                            type="button"
                            onClick={() => toggleDoc(stageIndex, docIndex)}
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border transition-colors",
                              doc.checked
                                ? "bg-primary border-primary text-primary-foreground"
                                : "hover:bg-muted/50"
                            )}
                          >
                            {doc.checked ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Circle className="h-3 w-3 text-muted-foreground/50" />
                            )}
                          </button>
                          <span
                            className={cn(
                              doc.checked && "text-muted-foreground line-through"
                            )}
                          >
                            {doc.name}
                          </span>
                          {doc.required && (
                            <span className="text-[10px] text-muted-foreground">
                              Required
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
