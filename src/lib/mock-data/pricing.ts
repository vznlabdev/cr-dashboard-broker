import type { LimitBand } from "@/types";

export interface RateTableRow {
  territory: string;
  riskGrade: string;
  ratePerMillion: number;
  minPremium: number;
}

export interface LossRatioRow {
  year: number;
  incurred: number;
  paid: number;
  premium: number;
  lossRatio: number;
  /** Combined ratio (loss + expense), e.g. lossRatio + expenseRatio */
  combinedRatio?: number;
}

export interface SyndicateRateRow {
  syndicate: string;
  avgRatePct: number;
}

export interface YoYRateChangeRow {
  year: number;
  rateChangePct: number;
}

export const rateTable: RateTableRow[] = [
  { territory: "UK", riskGrade: "A", ratePerMillion: 45, minPremium: 25_000 },
  { territory: "UK", riskGrade: "B", ratePerMillion: 65, minPremium: 35_000 },
  { territory: "UK", riskGrade: "C", ratePerMillion: 85, minPremium: 45_000 },
  { territory: "EU", riskGrade: "A", ratePerMillion: 50, minPremium: 28_000 },
  { territory: "EU", riskGrade: "B", ratePerMillion: 72, minPremium: 38_000 },
  { territory: "US", riskGrade: "A", ratePerMillion: 55, minPremium: 32_000 },
  { territory: "US", riskGrade: "B", ratePerMillion: 78, minPremium: 42_000 },
  { territory: "APAC", riskGrade: "A", ratePerMillion: 58, minPremium: 30_000 },
  { territory: "APAC", riskGrade: "B", ratePerMillion: 82, minPremium: 45_000 },
];

const expenseRatio = 0.28;
export const lossRatioByYear: LossRatioRow[] = [
  { year: 2020, incurred: 120_000, paid: 95_000, premium: 1_200_000, lossRatio: 0.10, combinedRatio: 0.10 + expenseRatio },
  { year: 2021, incurred: 180_000, paid: 140_000, premium: 1_450_000, lossRatio: 0.124, combinedRatio: 0.124 + expenseRatio },
  { year: 2022, incurred: 220_000, paid: 175_000, premium: 1_680_000, lossRatio: 0.131, combinedRatio: 0.131 + expenseRatio },
  { year: 2023, incurred: 195_000, paid: 155_000, premium: 1_520_000, lossRatio: 0.128, combinedRatio: 0.128 + expenseRatio },
  { year: 2024, incurred: 85_000, paid: 62_000, premium: 1_350_000, lossRatio: 0.063, combinedRatio: 0.063 + expenseRatio },
];

export const avgRateBySyndicate: SyndicateRateRow[] = [
  { syndicate: "Beazley (2623)", avgRatePct: 4.2 },
  { syndicate: "Hiscox (33)", avgRatePct: 4.8 },
  { syndicate: "Brit (2987)", avgRatePct: 4.5 },
  { syndicate: "Chaucer (1084)", avgRatePct: 5.1 },
  { syndicate: "Tokio Marine Kiln (510)", avgRatePct: 4.9 },
];

export const yoyRateChange: YoYRateChangeRow[] = [
  { year: 2020, rateChangePct: 2.1 },
  { year: 2021, rateChangePct: 5.3 },
  { year: 2022, rateChangePct: 8.0 },
  { year: 2023, rateChangePct: 4.2 },
  { year: 2024, rateChangePct: -1.5 },
];

export const limitBandsPricing: LimitBand[] = [
  { band: "£0-100k", accountCount: 4, totalGwp: 95_000, avgPremium: 23_750 },
  { band: "£100k-500k", accountCount: 12, totalGwp: 420_000, avgPremium: 35_000 },
  { band: "£500k-1M", accountCount: 8, totalGwp: 520_000, avgPremium: 65_000 },
  { band: "£1M+", accountCount: 6, totalGwp: 1_065_000, avgPremium: 177_500 },
];
