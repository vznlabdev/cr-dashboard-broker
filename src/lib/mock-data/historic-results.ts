import type { HistoricYear, LimitBand } from "@/types";

export const historicYears: HistoricYear[] = [
  {
    year: 2020,
    gwp: 1_200_000,
    accountCount: 18,
    renewalRate: 0.82,
    lossRatio: 0.10,
    incurredClaims: 120_000,
    paidClaims: 95_000,
    largestAccount: { name: "Apex Media Studios", limit: 2_000_000, premium: 140_000 },
    smallestAccount: { name: "Verve Fashion House", limit: 150_000, premium: 15_000 },
    avgAccountSize: 1_050_000,
  },
  {
    year: 2021,
    gwp: 1_450_000,
    accountCount: 22,
    renewalRate: 0.85,
    lossRatio: 0.124,
    incurredClaims: 180_000,
    paidClaims: 140_000,
    largestAccount: { name: "Apex Media Studios", limit: 2_500_000, premium: 175_000 },
    smallestAccount: { name: "Echo Records", limit: 300_000, premium: 22_000 },
    avgAccountSize: 1_180_000,
  },
  {
    year: 2022,
    gwp: 1_680_000,
    accountCount: 24,
    renewalRate: 0.88,
    lossRatio: 0.131,
    incurredClaims: 220_000,
    paidClaims: 175_000,
    largestAccount: { name: "Horizon Pictures", limit: 2_000_000, premium: 148_000 },
    smallestAccount: { name: "Verve Fashion House", limit: 200_000, premium: 18_000 },
    avgAccountSize: 1_220_000,
  },
  {
    year: 2023,
    gwp: 1_520_000,
    accountCount: 23,
    renewalRate: 0.86,
    lossRatio: 0.128,
    incurredClaims: 195_000,
    paidClaims: 155_000,
    largestAccount: { name: "Pulse Music Group", limit: 3_000_000, premium: 225_000 },
    smallestAccount: { name: "Verve Fashion House", limit: 250_000, premium: 20_000 },
    avgAccountSize: 1_250_000,
  },
  {
    year: 2024,
    gwp: 1_350_000,
    accountCount: 20,
    renewalRate: 0.84,
    lossRatio: 0.063,
    incurredClaims: 85_000,
    paidClaims: 62_000,
    largestAccount: { name: "Apex Media Studios", limit: 2_500_000, premium: 187_500 },
    smallestAccount: { name: "Verve Fashion House", limit: 250_000, premium: 22_000 },
    avgAccountSize: 1_275_000,
  },
];

export const limitBandsHistoric: LimitBand[] = [
  { band: "£0-100k", accountCount: 3, totalGwp: 66_000, avgPremium: 22_000 },
  { band: "£100k-500k", accountCount: 6, totalGwp: 210_000, avgPremium: 35_000 },
  { band: "£500k-1M", accountCount: 5, totalGwp: 340_000, avgPremium: 68_000 },
  { band: "£1M+", accountCount: 6, totalGwp: 734_000, avgPremium: 122_333 },
];

export const pipelineConversion = {
  submissionsTotal: 48,
  quotesReceived: 38,
  binds: 32,
  declineRate: 0.12,
  avgDaysToBind: 28,
};

export const declineRateBySyndicate: { syndicate: string; declineRate: number }[] = [
  { syndicate: "Beazley (2623)", declineRate: 0.08 },
  { syndicate: "Hiscox (33)", declineRate: 0.10 },
  { syndicate: "Brit (2987)", declineRate: 0.15 },
  { syndicate: "Chaucer (1084)", declineRate: 0.07 },
  { syndicate: "Tokio Marine Kiln (510)", declineRate: 0.12 },
  { syndicate: "Canopius (4444)", declineRate: 0.11 },
];
