import type { RiskScores } from "@/types";

/**
 * Mock risk scores per client (CR scoring model: documentation, tool safety,
 * copyright check, AI model trust, training data quality). Scale 0–100.
 */
export const clientRiskScores: Record<string, RiskScores> = {
  "cl-001": {
    documentation: 88,
    toolSafety: 82,
    copyrightCheck: 90,
    aiModelTrust: 78,
    trainingDataQuality: 85,
  },
  "cl-002": {
    documentation: 72,
    toolSafety: 68,
    copyrightCheck: 75,
    aiModelTrust: 70,
    trainingDataQuality: 65,
  },
  "cl-003": {
    documentation: 92,
    toolSafety: 88,
    copyrightCheck: 95,
    aiModelTrust: 85,
    trainingDataQuality: 90,
  },
  "cl-004": {
    documentation: 58,
    toolSafety: 62,
    copyrightCheck: 55,
    aiModelTrust: 60,
    trainingDataQuality: 52,
  },
  "cl-005": {
    documentation: 85,
    toolSafety: 80,
    copyrightCheck: 82,
    aiModelTrust: 78,
    trainingDataQuality: 88,
  },
  "cl-006": {
    documentation: 75,
    toolSafety: 72,
    copyrightCheck: 78,
    aiModelTrust: 68,
    trainingDataQuality: 70,
  },
  "cl-007": {
    documentation: 90,
    toolSafety: 85,
    copyrightCheck: 88,
    aiModelTrust: 82,
    trainingDataQuality: 86,
  },
  "cl-008": {
    documentation: 65,
    toolSafety: 60,
    copyrightCheck: 62,
    aiModelTrust: 58,
    trainingDataQuality: 55,
  },
  "cl-009": {
    documentation: 78,
    toolSafety: 74,
    copyrightCheck: 70,
    aiModelTrust: 72,
    trainingDataQuality: 68,
  },
  "cl-010": {
    documentation: 88,
    toolSafety: 82,
    copyrightCheck: 85,
    aiModelTrust: 80,
    trainingDataQuality: 84,
  },
  "cl-011": {
    documentation: 92,
    toolSafety: 88,
    copyrightCheck: 90,
    aiModelTrust: 85,
    trainingDataQuality: 90,
  },
  "cl-012": {
    documentation: 48,
    toolSafety: 52,
    copyrightCheck: 45,
    aiModelTrust: 50,
    trainingDataQuality: 42,
  },
};

export function getClientRiskScores(clientId: string): RiskScores | null {
  return clientRiskScores[clientId] ?? null;
}
