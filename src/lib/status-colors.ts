import type { SubmissionStatus } from "@/types";

/** KYA-style: green=success/bound, purple=AI/quoted, blue=info, orange=pending, red=declined */
export const statusColors: Record<
  SubmissionStatus | "pending" | "accepted" | "expired",
  string
> = {
  draft: "text-zinc-500 bg-zinc-500/10",
  submitted: "text-[#007bff] bg-[#007bff]/10",
  quoted: "text-[#6f42c1] bg-[#6f42c1]/10",
  bound: "text-[#28a745] bg-[#28a745]/10",
  declined: "text-[#dc3545] bg-[#dc3545]/10",
  expired: "text-zinc-500 bg-zinc-500/10",
  pending: "text-[#ffc107] bg-[#ffc107]/15",
  accepted: "text-[#28a745] bg-[#28a745]/10",
};

/** KYA-style: Low=green, Medium=orange, High/Critical=red; A/B=green/teal, C/D=orange, E/F=red */
export const riskGradeColors: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  A: { text: "text-[#28a745]", bg: "bg-[#28a745]/10", border: "border-[#28a745]/20" },
  B: { text: "text-[#00bfff]", bg: "bg-[#00bfff]/10", border: "border-[#00bfff]/20" },
  C: { text: "text-[#ffc107]", bg: "bg-[#ffc107]/15", border: "border-[#ffc107]/30" },
  D: { text: "text-[#fd7e14]", bg: "bg-[#fd7e14]/10", border: "border-[#fd7e14]/20" },
  E: { text: "text-[#dc3545]", bg: "bg-[#dc3545]/10", border: "border-[#dc3545]/20" },
  F: { text: "text-[#dc3545]", bg: "bg-[#dc3545]/10", border: "border-[#dc3545]/20" },
};
