import axios from "axios";
import type {
  CaseSummary,
  ReconciliationOutput,
  PatientCaseInput,
  StoredCase,
  VoiceAssistantResponse
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

export async function analyzeCase(caseData: PatientCaseInput): Promise<ReconciliationOutput> {
  const response = await http.post<{ ok: boolean; analysis: ReconciliationOutput }>("/reconciliation/compare", {
    caseData
  });

  return response.data.analysis;
}

export async function listCases(): Promise<CaseSummary[]> {
  const response = await http.get<{ ok: boolean; cases: CaseSummary[] }>("/cases");
  return response.data.cases;
}

export async function getCaseById(id: string): Promise<StoredCase> {
  const response = await http.get<{ ok: boolean; case: StoredCase }>(`/cases/${id}`);
  return response.data.case;
}

export async function createCase(caseData: PatientCaseInput): Promise<StoredCase> {
  const response = await http.post<{ ok: boolean; case: StoredCase }>("/cases", { caseData });
  return response.data.case;
}

export async function updateCase(id: string, caseData: PatientCaseInput): Promise<StoredCase> {
  const response = await http.put<{ ok: boolean; case: StoredCase }>(`/cases/${id}`, { caseData });
  return response.data.case;
}

export async function deleteCase(id: string): Promise<void> {
  await http.delete(`/cases/${id}`);
}

export async function reanalyzeCase(id: string): Promise<StoredCase> {
  const response = await http.post<{ ok: boolean; case: StoredCase }>(`/cases/${id}/reanalyze`);
  return response.data.case;
}

export async function speakMedicalSummary(
  caseData: PatientCaseInput,
  analysis?: ReconciliationOutput
): Promise<VoiceAssistantResponse> {
  const response = await http.post<{ ok: boolean; result: VoiceAssistantResponse }>("/voice/summary", {
    caseData,
    analysis
  });

  return response.data.result;
}

export async function askFollowupQuestion(
  caseData: PatientCaseInput,
  question: string,
  analysis?: ReconciliationOutput
): Promise<VoiceAssistantResponse> {
  const response = await http.post<{ ok: boolean; result: VoiceAssistantResponse }>("/voice/followup", {
    caseData,
    analysis,
    question
  });

  return response.data.result;
}
