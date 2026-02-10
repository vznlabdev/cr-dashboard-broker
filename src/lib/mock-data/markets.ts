import type { Territory, AppetiteLevel } from "@/types";

export interface TerritoryBreakdown {
  territory: Territory;
  gwp: number;
  accountCount: number;
  avgPremium: number;
  avgLimit: number;
  dominantSyndicate: string;
}

export interface LimitBandMarket {
  band: string;
  accountCount: number;
  totalGwp: number;
}

export interface PremiumBandMarket {
  band: string;
  accountCount: number;
}

export interface RegulatoryFlagRow {
  territory: Territory;
  keyRegulations: string;
  complianceStatus: "Compliant" | "In review" | "Pending" | "Not applicable";
  notes: string;
}

export interface SyndicateAppetiteCell {
  syndicate: string;
  territory: Territory;
  appetite: AppetiteLevel;
}

export const territoryBreakdown: TerritoryBreakdown[] = [
  {
    territory: "UK",
    gwp: 582_500,
    accountCount: 6,
    avgPremium: 97_083,
    avgLimit: 1_458_333,
    dominantSyndicate: "Beazley (2623)",
  },
  {
    territory: "EU",
    gwp: 280_000,
    accountCount: 4,
    avgPremium: 70_000,
    avgLimit: 937_500,
    dominantSyndicate: "Brit (2987)",
  },
  {
    territory: "US",
    gwp: 205_000,
    accountCount: 3,
    avgPremium: 68_333,
    avgLimit: 733_333,
    dominantSyndicate: "Hiscox (33)",
  },
  {
    territory: "APAC",
    gwp: 58_000,
    accountCount: 1,
    avgPremium: 58_000,
    avgLimit: 800_000,
    dominantSyndicate: "Tokio Marine Kiln (510)",
  },
  {
    territory: "MEA",
    gwp: 0,
    accountCount: 0,
    avgPremium: 0,
    avgLimit: 0,
    dominantSyndicate: "—",
  },
  {
    territory: "LATAM",
    gwp: 0,
    accountCount: 0,
    avgPremium: 0,
    avgLimit: 0,
    dominantSyndicate: "—",
  },
];

export const limitBandsMarket: LimitBandMarket[] = [
  { band: "£0-100k", accountCount: 2, totalGwp: 44_000 },
  { band: "£100k-500k", accountCount: 5, totalGwp: 175_000 },
  { band: "£500k-1M", accountCount: 3, totalGwp: 215_000 },
  { band: "£1M-5M", accountCount: 3, totalGwp: 420_000 },
  { band: "£5M+", accountCount: 1, totalGwp: 271_500 },
];

export const premiumBandsMarket: PremiumBandMarket[] = [
  { band: "£0-10k", accountCount: 1 },
  { band: "£10k-50k", accountCount: 5 },
  { band: "£50k-100k", accountCount: 4 },
  { band: "£100k+", accountCount: 4 },
];

export const regulatoryFlags: RegulatoryFlagRow[] = [
  { territory: "UK", keyRegulations: "UK AI Regulation, GDPR (post-Brexit)", complianceStatus: "Compliant", notes: "Pro-innovation approach" },
  { territory: "EU", keyRegulations: "EU AI Act, GDPR", complianceStatus: "In review", notes: "Tiered compliance by risk class" },
  { territory: "US", keyRegulations: "State-by-state (NY, CA, etc.)", complianceStatus: "Pending", notes: "No federal framework yet" },
  { territory: "APAC", keyRegulations: "Local data/AI laws", complianceStatus: "Not applicable", notes: "Varies by jurisdiction" },
  { territory: "MEA", keyRegulations: "—", complianceStatus: "Not applicable", notes: "Limited AI-specific regulation" },
  { territory: "LATAM", keyRegulations: "—", complianceStatus: "Not applicable", notes: "Emerging frameworks" },
];

const TERRITORIES: Territory[] = ["UK", "EU", "US", "APAC", "MEA", "LATAM"];
const SYNDICATES = ["Beazley (2623)", "Hiscox (33)", "Brit (2987)", "Chaucer (1084)", "Tokio Marine Kiln (510)", "Canopius (4444)"];

/** Build syndicate × territory appetite matrix (hot/warm/cold/declined) */
function buildAppetiteMatrix(): SyndicateAppetiteCell[] {
  const cells: SyndicateAppetiteCell[] = [];
  const appetiteByKey: Record<string, Record<Territory, AppetiteLevel>> = {
    "Beazley (2623)": { UK: "hot", EU: "hot", US: "warm", APAC: "cold", MEA: "declined", LATAM: "declined" },
    "Hiscox (33)": { UK: "hot", EU: "warm", US: "hot", APAC: "warm", MEA: "cold", LATAM: "declined" },
    "Brit (2987)": { UK: "hot", EU: "hot", US: "cold", APAC: "declined", MEA: "declined", LATAM: "declined" },
    "Chaucer (1084)": { UK: "warm", EU: "warm", US: "warm", APAC: "cold", MEA: "declined", LATAM: "declined" },
    "Tokio Marine Kiln (510)": { UK: "warm", EU: "cold", US: "cold", APAC: "hot", MEA: "declined", LATAM: "declined" },
    "Canopius (4444)": { UK: "hot", EU: "warm", US: "cold", APAC: "declined", MEA: "declined", LATAM: "declined" },
  };
  for (const syndicate of SYNDICATES) {
    const row = appetiteByKey[syndicate];
    if (!row) continue;
    for (const territory of TERRITORIES) {
      cells.push({ syndicate, territory, appetite: row[territory] ?? "declined" });
    }
  }
  return cells;
}

export const syndicateAppetiteMatrix: SyndicateAppetiteCell[] = buildAppetiteMatrix();
