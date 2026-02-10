"use client";

import type { Submission } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { statusColors } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

type SubmissionCardProps = {
  submission: Submission;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, submission: Submission) => void;
};

export function SubmissionCard({
  submission,
  draggable = true,
  onDragStart,
}: SubmissionCardProps) {
  return (
    <Card
      className={cn(
        "cursor-grab active:cursor-grabbing transition-shadow",
        draggable && "hover:shadow-modern-lg"
      )}
      draggable={draggable}
      onDragStart={(e) => {
        if (draggable && onDragStart) {
          e.dataTransfer.setData("application/json", JSON.stringify(submission));
          e.dataTransfer.effectAllowed = "move";
          onDragStart(e, submission);
        }
      }}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            {submission.id}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
              statusColors[submission.status] ?? "bg-muted text-muted-foreground"
            )}
          >
            {submission.status}
          </span>
        </div>
        <p className="font-medium text-sm truncate mt-1">
          {submission.clientName}
        </p>
      </CardHeader>
      <CardContent className="p-3 pt-1 text-xs text-muted-foreground space-y-0.5">
        <p>{submission.coverageType.replace(/_/g, " ")}</p>
        <p>
          £{(submission.limitRequested / 1000).toFixed(0)}k · £
          {(submission.premiumIndication / 1000).toFixed(0)}k
        </p>
        {submission.daysOpen > 0 && (
          <p>{submission.daysOpen} days open</p>
        )}
      </CardContent>
    </Card>
  );
}
