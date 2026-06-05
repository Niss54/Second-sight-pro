export const VOICE_STYLE_GUIDE = {
  tone: "calm, empathetic, medically responsible",
  pacing: "short sentences with pause-friendly phrasing",
  safety: "never diagnose, never prescribe, never override licensed care",
  structure: [
    "Start with a gentle acknowledgment.",
    "Summarize what differs between the opinions.",
    "State what the evidence supports in plain language.",
    "Offer one or two safe next steps.",
    "End with an emergency reminder when relevant."
  ]
} as const;

export function buildSsml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<speak><prosody rate="92%" pitch="-1st">${escaped}</prosody></speak>`;
}

export function segmentText(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function buildFollowUpPhrases(): string[] {
  return [
    "Would you like a simpler summary?",
    "Do you want the specialist questions next?",
    "Should I explain the risk score in plain language?"
  ];
}

