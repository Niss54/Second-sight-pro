import OpenAI from "openai";
import { env } from "../../config/env";
import type { EvidenceCitation, FullAnalysisResponse, PatientCaseInput } from "../../types/domain";
import { createMedicalEvidenceEngine } from "../medical-evidence-engine";
import { buildSsml, buildFollowUpPhrases, segmentText } from "./style";
import { buildFollowUpPrompt, buildSummaryPrompt } from "./prompts";
import type { VoiceAssistantContext, VoiceAssistantOutput } from "./types";

const openaiClient = env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: env.OPENAI_BASE_URL
    })
  : null;

const evidenceEngine = createMedicalEvidenceEngine();

function safeSummaryFallback(context: VoiceAssistantContext, citations: EvidenceCitation[]): string {
  const analysis = context.analysis;
  const caseLabel = context.caseData.caseLabel ?? "this case";

  if (!analysis) {
    return `I can help explain ${caseLabel}. The safest next step is to review the different doctor opinions together and ask a specialist to clarify what is most likely and what should happen next.`;
  }

  const lead =
    analysis.finalRiskTier === "high"
      ? "The opinions disagree in an important way, so a specialist review is a good next step."
      : analysis.finalRiskTier === "moderate"
        ? "The opinions differ enough that clarification would be helpful before moving ahead."
        : "The opinions are somewhat aligned, but a few details still deserve a careful review.";

  const evidenceLine = citations.length
    ? `Trusted guidance in the background supports careful review and, when needed, confirmatory testing.`
    : "The safest approach is to keep the discussion focused on what each doctor is sure about and what still needs confirmation.";

  return `${lead} ${evidenceLine} If symptoms are getting worse quickly, seek urgent medical help right away.`;
}

function safeFollowUpFallback(context: VoiceAssistantContext, citations: EvidenceCitation[]): string {
  const question = context.userQuestion ?? "";
  const analysis = context.analysis;

  if (/diagnos|what do i have|what is it/i.test(question)) {
    return "I can’t diagnose, but I can help you compare the opinions and prepare the right questions for a specialist.";
  }

  if (/medicine|prescribe|dose/i.test(question)) {
    return "I can explain the medicine differences, but I can’t prescribe or choose a treatment for you. A specialist or pharmacist should reconcile the final plan.";
  }

  if (/emergency|urgent|danger|worse/i.test(question)) {
    return "If breathing, chest pain, sudden weakness, confusion, or severe worsening is happening, seek emergency care now.";
  }

  if (analysis?.finalRiskTier === "high") {
    return "Because the opinions differ strongly, I would suggest a specialist review and a clear question list before any irreversible step.";
  }

  return citations.length
    ? "The safest next step is to use the evidence-backed questions and ask the specialist to explain what confirms the diagnosis and what changes the treatment plan."
    : "The safest next step is to ask the specialist which test, exam, or follow-up would best resolve the uncertainty.";
}

async function fetchRelevantCitations(query: string): Promise<EvidenceCitation[]> {
  const bundle = await evidenceEngine.getCitations({
    query,
    limit: 4
  });

  return bundle;
}

async function generateVoiceText(prompt: string, fallback: string): Promise<string> {
  if (!openaiClient) {
    return fallback;
  }

  try {
    const response = await openaiClient.responses.create({
      model: env.OPENAI_MODEL,
      instructions:
        "You are a calm, empathetic medical voice assistant for patients. You never diagnose, prescribe, or override licensed medical care. Speak in short sentences that are easy to read aloud. Be clear about uncertainty and emergency escalation.",
      input: prompt
    });

    const output = response.output_text?.trim();
    return output || fallback;
  } catch {
    return fallback;
  }
}

function toVoiceOutput(text: string, citations: EvidenceCitation[], style: VoiceAssistantOutput["style"]): VoiceAssistantOutput {
  return {
    text,
    ssml: buildSsml(text),
    style,
    interruptible: true,
    segmentBreaks: segmentText(text),
    followUpPhrases: buildFollowUpPhrases(),
    safetyNotice: "This assistant supports understanding conflicting medical opinions and does not replace licensed medical care.",
    citations
  };
}

export async function speakMedicalSummary(context: VoiceAssistantContext): Promise<VoiceAssistantOutput> {
  const citations = await fetchRelevantCitations(
    [
      context.caseData.primaryCondition,
      context.analysis?.ruleAnalysis.findings.join(" "),
      context.analysis?.ruleAnalysis.recommendedActions.join(" ")
    ]
      .filter(Boolean)
      .join(" ")
  );

  const prompt = buildSummaryPrompt(context);
  const fallback = safeSummaryFallback(context, citations);
  const text = await generateVoiceText(prompt, fallback);

  return toVoiceOutput(text, citations, "calm");
}

export async function askFollowupQuestion(context: VoiceAssistantContext): Promise<VoiceAssistantOutput> {
  const citations = await fetchRelevantCitations(
    [
      context.caseData.primaryCondition,
      context.userQuestion,
      context.analysis?.ruleAnalysis.findings.join(" ")
    ]
      .filter(Boolean)
      .join(" ")
  );

  const prompt = buildFollowUpPrompt(context);
  const fallback = safeFollowUpFallback(context, citations);
  const text = await generateVoiceText(prompt, fallback);

  return toVoiceOutput(text, citations, "empathetic");
}

