"use client";

import { useMemo, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Quote } from "@/types";
import { submissions } from "@/lib/mock-data/submissions";
import { quotes as allQuotes } from "@/lib/mock-data/quotes";

// Submissions that have at least one quote
const submissionsWithQuotes = submissions.filter((s) =>
  allQuotes.some((q) => q.submissionId === s.id)
);

export default function PipelineQuotesPage() {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(
    submissionsWithQuotes[0]?.id ?? ""
  );
  const [recommendedId, setRecommendedId] = useState<string | null>(null);

  const selectedSubmission = useMemo(
    () => submissions.find((s) => s.id === selectedSubmissionId),
    [selectedSubmissionId]
  );

  const submissionQuotes = useMemo(() => {
    if (!selectedSubmissionId) return [];
    return allQuotes.filter((q) => q.submissionId === selectedSubmissionId);
  }, [selectedSubmissionId]);

  const { rows, bestPremiumId, bestDeductibleId } = useMemo(() => {
    if (submissionQuotes.length === 0) {
      return { rows: [], bestPremiumId: null, bestDeductibleId: null };
    }
    const validQuotes = submissionQuotes.filter((q) => q.status === "pending" || q.status === "accepted");
    const bestPremium = Math.min(...validQuotes.map((q) => q.premiumQuoted));
    const bestDeductible = Math.max(...validQuotes.map((q) => q.deductible));
    const bestPremiumId = validQuotes.find((q) => q.premiumQuoted === bestPremium)?.id ?? null;
    const bestDeductibleId = validQuotes.find((q) => q.deductible === bestDeductible)?.id ?? null;

    const fieldRows: { key: string; label: string; getValue: (q: Quote) => string | number }[] = [
      { key: "premium", label: "Premium (£)", getValue: (q) => q.premiumQuoted },
      { key: "deductible", label: "Deductible (£)", getValue: (q) => q.deductible },
      { key: "lineSize", label: "Line size (%)", getValue: (q) => q.lineSize },
      { key: "leadFollow", label: "Lead / Follow", getValue: (q) => q.leadOrFollow },
      { key: "expiry", label: "Expiry", getValue: (q) => q.expiryDate },
      { key: "status", label: "Status", getValue: (q) => q.status },
    ];
    const rows = fieldRows.map((r) => ({
      ...r,
      values: submissionQuotes.map((q) => ({
        quoteId: q.id,
        value: r.getValue(q),
        isBest:
          (r.key === "premium" && q.id === bestPremiumId) ||
          (r.key === "deductible" && q.id === bestDeductibleId),
      })),
    }));

    // Exclusions and subjectivities: one row per quote (different structure)
    return {
      rows,
      bestPremiumId,
      bestDeductibleId,
    };
  }, [submissionQuotes]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Quote Comparison
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Compare syndicate responses side by side
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground">
          Submission
        </label>
        <Select
          value={selectedSubmissionId}
          onValueChange={setSelectedSubmissionId}
        >
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="Select a submission" />
          </SelectTrigger>
          <SelectContent>
            {submissionsWithQuotes.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.id} — {s.clientName} · £{(s.limitRequested / 1000).toFixed(0)}k
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSubmission && submissionQuotes.length > 0 && (
        <>
          <div className="rounded-xl border border-border/50 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px] sticky left-0 bg-muted/50 z-10">
                    Field
                  </TableHead>
                  {submissionQuotes.map((q) => (
                    <TableHead
                      key={q.id}
                      className="min-w-[140px] px-3 py-1.5 font-medium"
                    >
                      <div className="flex flex-col gap-1">
                        <span>{q.syndicateName}</span>
                        <span className="text-[10px] font-normal text-muted-foreground">
                          {q.leadOrFollow}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.key}
                    className="border-b border-border/10 h-8"
                  >
                    <TableCell className="px-3 py-1 font-medium sticky left-0 bg-background z-10">
                      {row.label}
                    </TableCell>
                    {row.values.map(({ quoteId, value, isBest }) => (
                      <TableCell
                        key={quoteId}
                        className={cn(
                          "px-3 py-1 font-mono text-[11px]",
                          isBest && "bg-green-500/10 text-green-600 dark:text-green-400 font-semibold"
                        )}
                      >
                        {typeof value === "number"
                          ? value.toLocaleString()
                          : value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow className="border-b border-border/10">
                  <TableCell className="px-3 py-1 font-medium sticky left-0 bg-background z-10">
                    Key exclusions
                  </TableCell>
                  {submissionQuotes.map((q) => (
                    <TableCell
                      key={q.id}
                      className="px-3 py-1 text-[11px] text-muted-foreground align-top max-w-[180px]"
                    >
                      <ul className="list-disc list-inside space-y-0.5">
                        {q.keyExclusions.slice(0, 3).map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-b border-border/10">
                  <TableCell className="px-3 py-1 font-medium sticky left-0 bg-background z-10">
                    Subjectivities
                  </TableCell>
                  {submissionQuotes.map((q) => (
                    <TableCell
                      key={q.id}
                      className="px-3 py-1 text-[11px] text-muted-foreground align-top max-w-[180px]"
                    >
                      <ul className="list-disc list-inside space-y-0.5">
                        {q.subjectivities.slice(0, 3).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="px-3 py-2 font-medium sticky left-0 bg-background z-10">
                    Recommend to client
                  </TableCell>
                  {submissionQuotes.map((q) => (
                    <TableCell key={q.id} className="px-3 py-2">
                      <Button
                        size="sm"
                        variant={recommendedId === q.id ? "default" : "outline"}
                        className="gap-1.5"
                        onClick={() =>
                          setRecommendedId((prev) => (prev === q.id ? null : q.id))
                        }
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Recommend
                      </Button>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {recommendedId && (
            <p className="text-sm text-muted-foreground">
              Recommended quote:{" "}
              <span className="font-medium text-foreground">
                {submissionQuotes.find((q) => q.id === recommendedId)?.syndicateName}
              </span>
            </p>
          )}
        </>
      )}

      {selectedSubmissionId && submissionQuotes.length === 0 && (
        <p className="text-muted-foreground py-8">
          No quotes for this submission yet.
        </p>
      )}

      {!selectedSubmissionId && (
        <p className="text-muted-foreground py-8">
          Select a submission to compare quotes.
        </p>
      )}
    </div>
  );
}
