// ─── Core Entities ───

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "quoted"
  | "bound"
  | "declined"
  | "expired";
export type PolicyStatus =
  | "active"
  | "expired"
  | "cancelled"
  | "pending_renewal";
export type RiskGrade = "A" | "B" | "C" | "D" | "E" | "F";
export type AppetiteLevel = "hot" | "warm" | "cold" | "declined";
export type WordingStatus =
  | "draft"
  | "under_review"
  | "approved"
  | "superseded";
export type ProcessStage =
  | "intake"
  | "risk_assessment"
  | "market_approach"
  | "quote"
  | "negotiate"
  | "bind"
  | "issue";
export type Territory = "UK" | "EU" | "US" | "APAC" | "MEA" | "LATAM";
export type CoverageType =
  | "ai_content_ip"
  | "deepfake_liability"
  | "copyright_infringement"
  | "nilp_protection"
  | "comprehensive";
export type PortfolioMixType =
  | "Pure Human"
  | "AI-Assisted"
  | "Hybrid"
  | "AI-Generated";

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  territory: Territory;
  riskGrade: RiskGrade;
  activePolicies: number;
  totalLimit: number;
  gwp: number;
  renewalDate: string;
  brokerHandler: string;
  totalAssets: number;
  aiAssetPercentage: number;
  portfolioMix: { type: PortfolioMixType; percentage: number }[];
}

export interface Submission {
  id: string;
  clientId: string;
  clientName: string;
  coverageType: CoverageType;
  limitRequested: number;
  premiumIndication: number;
  status: SubmissionStatus;
  syndicates: string[];
  dateSubmitted: string;
  daysOpen: number;
  riskGrade: RiskGrade;
  territory: Territory;
}

export interface Quote {
  id: string;
  submissionId: string;
  syndicateName: string;
  syndicateId: string;
  leadOrFollow: "lead" | "follow";
  lineSize: number;
  premiumQuoted: number;
  deductible: number;
  keyExclusions: string[];
  subjectivities: string[];
  expiryDate: string;
  status: "pending" | "accepted" | "declined" | "expired";
}

export interface Policy {
  id: string;
  policyNumber: string;
  clientId: string;
  clientName: string;
  syndicateName: string;
  coverageType: CoverageType;
  limit: number;
  premium: number;
  deductible: number;
  inceptionDate: string;
  expiryDate: string;
  status: PolicyStatus;
  territory: Territory;
}

export interface Claim {
  id: string;
  policyId: string;
  clientName: string;
  claimType: string;
  incurredAmount: number;
  paidAmount: number;
  reserveAmount: number;
  dateReported: string;
  status: "open" | "closed" | "reserved";
}

export interface Wording {
  id: string;
  name: string;
  version: string;
  status: WordingStatus;
  coverageType: CoverageType;
  lastModified: string;
  author: string;
  syndicateRequirements: string[];
  endorsements: string[];
}

export interface SyndicateContact {
  id: string;
  name: string;
  syndicateName: string;
  syndicateNumber: string;
  role: string;
  email: string;
  phone: string;
  relationshipStrength: "strong" | "moderate" | "new";
  appetite: Record<CoverageType, AppetiteLevel>;
  territories: Territory[];
  avgQuoteTurnaround: number;
}

export interface BrokerTeamMember {
  id: string;
  name: string;
  role: string;
  specialization: CoverageType[];
  clientCount: number;
  gwpHandled: number;
  hitRatio: number;
  avatar?: string;
}

export interface ProcessStep {
  stage: ProcessStage;
  label: string;
  avgDays: number;
  slaDays: number;
  activeCount: number;
  overdueCount: number;
}

export interface LimitBand {
  band: string;
  accountCount: number;
  totalGwp: number;
  avgPremium: number;
}

export interface HistoricYear {
  year: number;
  gwp: number;
  accountCount: number;
  renewalRate: number;
  lossRatio: number;
  incurredClaims: number;
  paidClaims: number;
  largestAccount: { name: string; limit: number; premium: number };
  smallestAccount: { name: string; limit: number; premium: number };
  avgAccountSize: number;
}

export interface RiskScores {
  documentation: number;
  toolSafety: number;
  copyrightCheck: number;
  aiModelTrust: number;
  trainingDataQuality: number;
}

export interface ExposureAggregate {
  category: string;
  totalExposure: number;
  accountCount: number;
  percentageOfBook: number;
  concentrationFlag: boolean;
}

export interface ActivityItem {
  id: string;
  type: "submission" | "quote" | "policy" | "renewal" | "claim";
  description: string;
  entityId: string;
  entityLabel: string;
  timestamp: string;
  userId?: string;
}

export interface AlertItem {
  id: string;
  type: "expiring_policy" | "overdue_renewal" | "declined_submission" | "overdue_quote";
  title: string;
  description: string;
  entityId: string;
  dueDate?: string;
  severity: "high" | "medium" | "low";
}
