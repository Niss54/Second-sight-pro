import type { EvidenceCitation, FullAnalysisResponse, PatientCaseInput } from "../../types/domain";

export interface VoiceAssistantContext {
  caseData: PatientCaseInput;
  analysis?: FullAnalysisResponse;
  userQuestion?: string;
}

export interface VoiceAssistantOutput {
  text: string;
  ssml: string;
  style: "calm" | "empathetic" | "medical";
  interruptible: boolean;
  segmentBreaks: string[];
  followUpPhrases: string[];
  safetyNotice: string;
  citations: EvidenceCitation[];
}

