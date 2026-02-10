import type { AlertItem } from "@/types";

export const alerts: AlertItem[] = [
  {
    id: "al-001",
    type: "expiring_policy",
    title: "Policy expiring in 18 days",
    description: "Summit Sports Network – CR-2024-005",
    entityId: "pol-005",
    dueDate: "2025-02-28",
    severity: "high",
  },
  {
    id: "al-002",
    type: "overdue_renewal",
    title: "Renewal overdue",
    description: "Velocity Sports Media – lapsed 2024-07-04",
    entityId: "pol-007",
    dueDate: "2024-07-04",
    severity: "medium",
  },
  {
    id: "al-003",
    type: "declined_submission",
    title: "Submission declined",
    description: "Horizon Pictures – NILP Protection (Brit)",
    entityId: "sub-007",
    severity: "medium",
  },
  {
    id: "al-004",
    type: "overdue_quote",
    title: "Quote expiring in 4 days",
    description: "Summit Sports – Chaucer quote",
    entityId: "q-009",
    dueDate: "2025-02-15",
    severity: "high",
  },
  {
    id: "al-005",
    type: "expiring_policy",
    title: "Policy expiring in 45 days",
    description: "Apex Media Studios – CR-2024-004",
    entityId: "pol-004",
    dueDate: "2025-06-14",
    severity: "low",
  },
];
