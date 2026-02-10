import type { ProcessStep, ProcessStage } from "@/types";

export const processPipelineSteps: ProcessStep[] = [
  { stage: "intake", label: "Intake", avgDays: 2, slaDays: 3, activeCount: 4, overdueCount: 0 },
  { stage: "risk_assessment", label: "Risk Assessment", avgDays: 5, slaDays: 7, activeCount: 6, overdueCount: 1 },
  { stage: "market_approach", label: "Market Approach", avgDays: 8, slaDays: 10, activeCount: 5, overdueCount: 0 },
  { stage: "quote", label: "Quote", avgDays: 6, slaDays: 7, activeCount: 8, overdueCount: 2 },
  { stage: "negotiate", label: "Negotiate", avgDays: 4, slaDays: 5, activeCount: 3, overdueCount: 0 },
  { stage: "bind", label: "Bind", avgDays: 3, slaDays: 5, activeCount: 2, overdueCount: 0 },
  { stage: "issue", label: "Issue", avgDays: 2, slaDays: 3, activeCount: 1, overdueCount: 0 },
];

export interface ReferralTriggerRow {
  triggerCondition: string;
  authorityLevelRequired: string;
  escalationPath: string;
}

export const referralTriggers: ReferralTriggerRow[] = [
  { triggerCondition: "Limit > £2M", authorityLevelRequired: "Senior Broker", escalationPath: "Line manager → Binding authority" },
  { triggerCondition: "Risk grade D or below", authorityLevelRequired: "Underwriting referral", escalationPath: "Syndicate UW → Line slip" },
  { triggerCondition: "Territory outside UK/EU/US", authorityLevelRequired: "International desk", escalationPath: "International team → Local compliance" },
  { triggerCondition: "NILP or complex wording", authorityLevelRequired: "Wording committee", escalationPath: "Legal → Wording sign-off" },
  { triggerCondition: "Premium discount > 15%", authorityLevelRequired: "Pricing committee", escalationPath: "Pricing → Technical sign-off" },
];

export interface AuthorityMatrixRow {
  role: string;
  maxBindingLimit: string;
  coverageTypes: string;
  territoryRestrictions: string;
  expiryDate: string;
}

export const authorityMatrix: AuthorityMatrixRow[] = [
  { role: "Senior Broker", maxBindingLimit: "£5M", coverageTypes: "All", territoryRestrictions: "UK, EU, US, APAC", expiryDate: "2025-12-31" },
  { role: "Broker", maxBindingLimit: "£1M", coverageTypes: "AI Content IP, Copyright", territoryRestrictions: "UK, EU", expiryDate: "2025-12-31" },
  { role: "Assistant Broker", maxBindingLimit: "£250k", coverageTypes: "AI Content IP only", territoryRestrictions: "UK", expiryDate: "2025-06-30" },
  { role: "Trainee", maxBindingLimit: "—", coverageTypes: "—", territoryRestrictions: "No binding", expiryDate: "—" },
];

export interface DocumentChecklistItem {
  name: string;
  required: boolean;
  checked: boolean;
}

export interface DocumentChecklistStage {
  stage: ProcessStage;
  label: string;
  documents: DocumentChecklistItem[];
}

export const documentChecklistByStage: DocumentChecklistStage[] = [
  {
    stage: "intake",
    label: "Intake",
    documents: [
      { name: "Signed broker slip", required: true, checked: true },
      { name: "Client KYC summary", required: true, checked: true },
      { name: "Cover note / schedule", required: true, checked: false },
    ],
  },
  {
    stage: "risk_assessment",
    label: "Risk Assessment",
    documents: [
      { name: "Risk questionnaire", required: true, checked: true },
      { name: "Portfolio mix breakdown", required: true, checked: true },
      { name: "Prior claims summary", required: false, checked: false },
    ],
  },
  {
    stage: "market_approach",
    label: "Market Approach",
    documents: [
      { name: "Market selection rationale", required: true, checked: true },
      { name: "Slip / submission pack", required: true, checked: true },
    ],
  },
  {
    stage: "quote",
    label: "Quote",
    documents: [
      { name: "Quote comparison sheet", required: true, checked: true },
      { name: "Recommendation memo", required: true, checked: false },
    ],
  },
  {
    stage: "negotiate",
    label: "Negotiate",
    documents: [
      { name: "Subjectivity log", required: true, checked: true },
      { name: "Endorsement list", required: true, checked: true },
    ],
  },
  {
    stage: "bind",
    label: "Bind",
    documents: [
      { name: "Signed slip", required: true, checked: true },
      { name: "Premium confirmation", required: true, checked: true },
    ],
  },
  {
    stage: "issue",
    label: "Issue",
    documents: [
      { name: "Policy wording", required: true, checked: true },
      { name: "Schedule", required: true, checked: true },
      { name: "Certificate of insurance", required: true, checked: true },
    ],
  },
];
