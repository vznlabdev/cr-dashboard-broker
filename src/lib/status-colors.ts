import type { SubmissionStatus } from "@/types";

export const statusColors: Record<
  SubmissionStatus | "pending" | "accepted" | "expired",
  string
> = {
  draft: "text-slate-500 bg-slate-500/10",
  submitted: "text-blue-600 bg-blue-500/10",
  quoted: "text-amber-600 bg-amber-500/10",
  bound: "text-emerald-600 bg-emerald-500/10",
  declined: "text-red-600 bg-red-500/10",
  expired: "text-slate-500 bg-slate-500/10",
  pending: "text-amber-600 bg-amber-500/10",
  accepted: "text-emerald-600 bg-emerald-500/10",
};

export const riskGradeColors: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  A: { text: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
  B: { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  C: { text: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  D: { text: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  E: { text: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  F: { text: "text-red-700", bg: "bg-red-700/10", border: "border-red-700/20" },
};
