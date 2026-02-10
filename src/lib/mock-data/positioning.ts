import type { CoverageType } from "@/types";

export interface CapacityByCoverage {
  coverageType: CoverageType;
  label: string;
  availableCapacity: number;
  placedCapacity: number;
}

export const capacityByCoverage: CapacityByCoverage[] = [
  { coverageType: "ai_content_ip", label: "AI Content IP", availableCapacity: 25_000_000, placedCapacity: 14_200_000 },
  { coverageType: "deepfake_liability", label: "Deepfake Liability", availableCapacity: 12_000_000, placedCapacity: 5_800_000 },
  { coverageType: "copyright_infringement", label: "Copyright Infringement", availableCapacity: 18_000_000, placedCapacity: 11_500_000 },
  { coverageType: "nilp_protection", label: "NILP Protection", availableCapacity: 8_000_000, placedCapacity: 2_100_000 },
  { coverageType: "comprehensive", label: "Comprehensive", availableCapacity: 30_000_000, placedCapacity: 18_600_000 },
];

export interface SyndicateRelationshipRow {
  syndicateKey: string;
  syndicateName: string;
  syndicateNumber: string;
  keyContact: string;
  responsivenessScore: number; // 1-5
  avgQuoteTurnaround: number; // days
  claimHandlingRating: number; // 1-5
}

export const syndicateRelationshipScores: SyndicateRelationshipRow[] = [
  { syndicateKey: "Beazley (2623)", syndicateName: "Beazley", syndicateNumber: "2623", keyContact: "Emma Richardson", responsivenessScore: 5, avgQuoteTurnaround: 5, claimHandlingRating: 5 },
  { syndicateKey: "Hiscox (33)", syndicateName: "Hiscox", syndicateNumber: "33", keyContact: "Oliver Grant", responsivenessScore: 4, avgQuoteTurnaround: 7, claimHandlingRating: 4 },
  { syndicateKey: "Brit (2987)", syndicateName: "Brit", syndicateNumber: "2987", keyContact: "Sophie Williams", responsivenessScore: 4, avgQuoteTurnaround: 9, claimHandlingRating: 4 },
  { syndicateKey: "Chaucer (1084)", syndicateName: "Chaucer", syndicateNumber: "1084", keyContact: "Thomas Clarke", responsivenessScore: 5, avgQuoteTurnaround: 6, claimHandlingRating: 5 },
  { syndicateKey: "Tokio Marine Kiln (510)", syndicateName: "Tokio Marine Kiln", syndicateNumber: "510", keyContact: "Yuki Nakamura", responsivenessScore: 3, avgQuoteTurnaround: 8, claimHandlingRating: 4 },
  { syndicateKey: "Canopius (4444)", syndicateName: "Canopius", syndicateNumber: "4444", keyContact: "Rachel Foster", responsivenessScore: 3, avgQuoteTurnaround: 10, claimHandlingRating: 3 },
];
