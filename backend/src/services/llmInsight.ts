import OpenAI from "openai";
import { env } from "../config/env";
import { AiInsight, PatientCaseInput, RiskModelOutput, RuleAnalysis } from "../types/domain";

const openaiClient = env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: env.OPENAI_BASE_URL
    })
  : null;

function fallbackInsight(caseData: PatientCaseInput, ruleAnalysis: RuleAnalysis): AiInsight {
  const condition = caseData.primaryCondition;
  const tier = ruleAnalysis.riskTier;

  const executiveSummary =
    tier === "high"
      ? `High conflict across opinions for ${condition}. Fast specialist reconciliation is strongly advised.`
      : tier === "moderate"
        ? `Moderate conflict across opinions for ${condition}. Clarification is needed before final treatment.`
        : `Low conflict across opinions for ${condition}. Plans are relatively aligned with manageable variation.`;

  const patientSummary =
    tier === "high"
      ? "Doctors are giving materially different directions. You should seek an advanced specialist review quickly before any irreversible step."
      : tier === "moderate"
        ? "Doctors agree on some points but differ on important details. A focused specialist visit can safely resolve uncertainty."
        : "Most doctor recommendations point in a similar direction. Continue with a coordinated plan and monitor progress.";

  const triageAdvice =
    "If any current symptom is severe or rapidly worsening, follow the highest urgency recommendation and seek emergency care immediately.";

  const conversationScript = [
    "Please explain in simple terms what diagnosis you believe is most likely and why.",
    "Which evidence in my reports supports your plan over the alternatives?",
    "What exact warning signs should trigger immediate emergency care?",
    "Can you finalize one unified next-step plan including tests and medication schedule?"
  ];

  return {
    status: "fallback",
    executiveSummary,
    patientSummary,
    triageAdvice,
    conversationScript
  };
}

function extractJson(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return text.slice(start, end + 1);
}

export async function generateAiInsight(
  caseData: PatientCaseInput,
  ruleAnalysis: RuleAnalysis,
  riskModel: RiskModelOutput
): Promise<AiInsight> {
  if (!env.ENABLE_LLM) {
    return {
      ...fallbackInsight(caseData, ruleAnalysis),
      status: "disabled"
    };
  }

  if (!openaiClient) {
    return fallbackInsight(caseData, ruleAnalysis);
  }

  const prompt = [
    "Analyze this second-opinion conflict case and produce a practical patient-facing reconciliation brief.",
    `Condition: ${caseData.primaryCondition}`,
    `Case label: ${caseData.caseLabel ?? "N/A"}`,
    `Risk tier: ${ruleAnalysis.riskTier}`,
    `Rule score: ${ruleAnalysis.conflictScore}`,
    `ML score: ${riskModel.modelScore}`,
    `Findings: ${ruleAnalysis.findings.join(" | ")}`,
    `Actions: ${ruleAnalysis.recommendedActions.join(" | ")}`,
    `Questions: ${ruleAnalysis.specialistQuestions.join(" | ")}`,
    "Respond strictly as JSON with keys: executiveSummary, patientSummary, triageAdvice, conversationScript (array of 4 strings)."
  ].join("\n");

  try {
    const response = await openaiClient.responses.create({
      model: env.OPENAI_MODEL,
      instructions:
        "You are a medical decision-support assistant. You never diagnose. You summarize differences, safety flags, and next questions in plain language.",
      input: prompt
    });

    const output = response.output_text?.trim();
    if (!output) {
      return fallbackInsight(caseData, ruleAnalysis);
    }

    const rawJson = extractJson(output);
    if (!rawJson) {
      return {
        ...fallbackInsight(caseData, ruleAnalysis),
        executiveSummary: output,
        status: "live"
      };
    }

    const parsed = JSON.parse(rawJson) as {
      executiveSummary?: string;
      patientSummary?: string;
      triageAdvice?: string;
      conversationScript?: string[];
    };

    const safeFallback = fallbackInsight(caseData, ruleAnalysis);

    return {
      status: "live",
      executiveSummary: parsed.executiveSummary?.trim() || safeFallback.executiveSummary,
      patientSummary: parsed.patientSummary?.trim() || safeFallback.patientSummary,
      triageAdvice: parsed.triageAdvice?.trim() || safeFallback.triageAdvice,
      conversationScript:
        parsed.conversationScript?.filter((line) => typeof line === "string" && line.trim()).slice(0, 6) ||
        safeFallback.conversationScript
    };
  } catch {
    return fallbackInsight(caseData, ruleAnalysis);
  }
}
