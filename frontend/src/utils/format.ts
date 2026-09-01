import type { RiskTier } from "../types";

export function toLines(value: string): string[] {
  return value
    .split(/\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function linesToText(lines: string[]): string {
  return lines.join("\n");
}

export function riskTierLabel(tier: RiskTier): string {
  if (tier === "high") {
    return "High Conflict";
  }

  if (tier === "moderate") {
    return "Moderate Conflict";
  }

  return "Low Conflict";
}

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function riskBandClass(tier: RiskTier): string {
  if (tier === "high") {
    return "risk-band risk-high";
  }

  if (tier === "moderate") {
    return "risk-band risk-moderate";
  }

  return "risk-band risk-low";
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

