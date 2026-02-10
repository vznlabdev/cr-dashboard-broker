import type { BrokerTeamMember, SyndicateContact } from "@/types";
import type { CoverageType, Territory } from "@/types";

export const brokerTeam: BrokerTeamMember[] = [
  {
    id: "br-001",
    name: "James Walsh",
    role: "Senior Broker",
    specialization: ["comprehensive", "ai_content_ip", "copyright_infringement"],
    clientCount: 5,
    gwpHandled: 512_000,
    hitRatio: 0.88,
  },
  {
    id: "br-002",
    name: "Elena Vasquez",
    role: "Broker",
    specialization: ["deepfake_liability", "nilp_protection", "comprehensive"],
    clientCount: 4,
    gwpHandled: 340_000,
    hitRatio: 0.82,
  },
  {
    id: "br-003",
    name: "Michael Torres",
    role: "Broker",
    specialization: ["ai_content_ip", "comprehensive"],
    clientCount: 3,
    gwpHandled: 205_000,
    hitRatio: 0.85,
  },
  {
    id: "br-004",
    name: "Priya Sharma",
    role: "Broker",
    specialization: ["ai_content_ip", "deepfake_liability"],
    clientCount: 2,
    gwpHandled: 86_000,
    hitRatio: 0.79,
  },
  {
    id: "br-005",
    name: "David Chen",
    role: "Assistant Broker",
    specialization: ["copyright_infringement"],
    clientCount: 1,
    gwpHandled: 28_000,
    hitRatio: 0.75,
  },
  {
    id: "br-006",
    name: "Sarah Mitchell",
    role: "Broker",
    specialization: ["comprehensive", "deepfake_liability"],
    clientCount: 2,
    gwpHandled: 129_000,
    hitRatio: 0.81,
  },
];

const defaultAppetite: Record<CoverageType, "warm" | "hot" | "cold" | "declined"> = {
  ai_content_ip: "hot",
  deepfake_liability: "warm",
  copyright_infringement: "hot",
  nilp_protection: "cold",
  comprehensive: "hot",
};

export const syndicateContacts: SyndicateContact[] = [
  {
    id: "sc-001",
    name: "Emma Richardson",
    syndicateName: "Beazley",
    syndicateNumber: "2623",
    role: "Underwriter",
    email: "e.richardson@beazley.com",
    phone: "+44 20 7667 0623",
    relationshipStrength: "strong",
    appetite: { ...defaultAppetite },
    territories: ["UK", "EU", "US"],
    avgQuoteTurnaround: 5,
  },
  {
    id: "sc-002",
    name: "Oliver Grant",
    syndicateName: "Hiscox",
    syndicateNumber: "33",
    role: "Senior Underwriter",
    email: "o.grant@hiscox.com",
    phone: "+44 20 7448 6000",
    relationshipStrength: "strong",
    appetite: { ...defaultAppetite, nilp_protection: "warm" },
    territories: ["UK", "EU", "US", "APAC"],
    avgQuoteTurnaround: 7,
  },
  {
    id: "sc-003",
    name: "Sophie Williams",
    syndicateName: "Brit",
    syndicateNumber: "2987",
    role: "Underwriter",
    email: "s.williams@britinsurance.com",
    phone: "+44 20 7984 8000",
    relationshipStrength: "moderate",
    appetite: { ...defaultAppetite, nilp_protection: "declined" },
    territories: ["UK", "EU"],
    avgQuoteTurnaround: 9,
  },
  {
    id: "sc-004",
    name: "Thomas Clarke",
    syndicateName: "Chaucer",
    syndicateNumber: "1084",
    role: "Underwriter",
    email: "t.clarke@chaucer.com",
    phone: "+44 20 7398 7800",
    relationshipStrength: "strong",
    appetite: { ...defaultAppetite },
    territories: ["UK", "EU", "US"],
    avgQuoteTurnaround: 6,
  },
  {
    id: "sc-005",
    name: "Yuki Nakamura",
    syndicateName: "Tokio Marine Kiln",
    syndicateNumber: "510",
    role: "Underwriter",
    email: "y.nakamura@tokiomarinekiln.com",
    phone: "+44 20 7950 5100",
    relationshipStrength: "moderate",
    appetite: { ...defaultAppetite, deepfake_liability: "hot" },
    territories: ["UK", "APAC"],
    avgQuoteTurnaround: 8,
  },
  {
    id: "sc-006",
    name: "Rachel Foster",
    syndicateName: "Canopius",
    syndicateNumber: "4444",
    role: "Senior Underwriter",
    email: "r.foster@canopius.com",
    phone: "+44 20 7562 4444",
    relationshipStrength: "new",
    appetite: { ...defaultAppetite },
    territories: ["UK", "EU", "US"],
    avgQuoteTurnaround: 10,
  },
  {
    id: "sc-007",
    name: "James Liu",
    syndicateName: "Beazley",
    syndicateNumber: "2623",
    role: "Deputy Underwriter",
    email: "j.liu@beazley.com",
    phone: "+44 20 7667 0623",
    relationshipStrength: "moderate",
    appetite: { ...defaultAppetite },
    territories: ["APAC"],
    avgQuoteTurnaround: 6,
  },
  {
    id: "sc-008",
    name: "Anna Kowalski",
    syndicateName: "Hiscox",
    syndicateNumber: "33",
    role: "Underwriter",
    email: "a.kowalski@hiscox.com",
    phone: "+44 20 7448 6000",
    relationshipStrength: "new",
    appetite: { ...defaultAppetite },
    territories: ["EU"],
    avgQuoteTurnaround: 8,
  },
];

export interface DelegatedAuthorityRow {
  id: string;
  authorityHolder: string;
  syndicate: string;
  maxLimit: string;
  coverageTypes: string;
  territories: string;
  expiryDate: string;
  status: "active" | "expiring_soon" | "expired";
}

export const delegatedAuthority: DelegatedAuthorityRow[] = [
  { id: "da-001", authorityHolder: "James Walsh", syndicate: "Beazley (2623)", maxLimit: "£2M", coverageTypes: "AI Content IP, Comprehensive", territories: "UK, EU, US", expiryDate: "2025-12-31", status: "active" },
  { id: "da-002", authorityHolder: "Elena Vasquez", syndicate: "Hiscox (33)", maxLimit: "£1.5M", coverageTypes: "All", territories: "UK, EU", expiryDate: "2025-03-15", status: "expiring_soon" },
  { id: "da-003", authorityHolder: "Michael Torres", syndicate: "Brit (2987)", maxLimit: "£1M", coverageTypes: "AI Content IP, Copyright", territories: "UK", expiryDate: "2024-11-01", status: "expired" },
  { id: "da-004", authorityHolder: "Priya Sharma", syndicate: "Chaucer (1084)", maxLimit: "£500k", coverageTypes: "AI Content IP", territories: "UK, EU", expiryDate: "2025-06-30", status: "active" },
  { id: "da-005", authorityHolder: "James Walsh", syndicate: "Tokio Marine Kiln (510)", maxLimit: "£750k", coverageTypes: "Comprehensive, Deepfake", territories: "UK, APAC", expiryDate: "2025-09-01", status: "active" },
];
