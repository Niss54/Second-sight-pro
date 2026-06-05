import type { VoiceAssistantContext } from "./types";

export function buildSummaryPrompt(context: VoiceAssistantContext): string {
  const { caseData, analysis } = context;
  const opinions = caseData.opinions
    .map((opinion, index) => [
      `Opinion ${index + 1}:`,
      `Doctor: ${opinion.doctorName}`,
      `Specialty: ${opinion.specialty}`,
      `Urgency: ${opinion.urgency}`,
      `Diagnosis: ${opinion.diagnosis}`,
      `Treatment: ${opinion.treatment}`,
      `Prescriptions: ${opinion.prescriptions.join(", ") || "None"}`,
      `Tests: ${opinion.tests.join(", ") || "None"}`
    ].join(" "))
    .join("\n");

  return [
    "Create a short spoken summary for a patient using calm, empathetic, medically responsible language.",
    "Never diagnose, prescribe, or tell the patient to ignore a doctor.",
    "Keep sentences short and easy to speak aloud.",
    "Use simple wording and avoid jargon unless it helps safety.",
    `Condition: ${caseData.primaryCondition}`,
    `Case label: ${caseData.caseLabel ?? "Untitled case"}`,
    `Language: ${caseData.language ?? "en"}`,
    analysis
      ? [
          `Final score: ${analysis.finalScore}`,
          `Final risk tier: ${analysis.finalRiskTier}`,
          `Conflict findings: ${analysis.ruleAnalysis.findings.join(" | ")}`,
          `Recommended actions: ${analysis.ruleAnalysis.recommendedActions.join(" | ")}`,
          `Specialist questions: ${analysis.ruleAnalysis.specialistQuestions.join(" | ")}`
        ].join("\n")
      : "",
    `Doctor opinions:\n${opinions}`,
    "Write 3 to 5 short paragraphs max.",
    "Include a gentle recommendation to seek specialist review when opinions conflict.",
    "If urgent symptoms are present, say to seek immediate medical care."
  ].join("\n");
}

export function buildFollowUpPrompt(context: VoiceAssistantContext): string {
  const question = context.userQuestion ?? "Follow-up question not provided.";
  const { caseData, analysis } = context;

  return [
    "Answer the patient's follow-up question in a calm, empathetic, medically responsible voice.",
    "Do not diagnose or prescribe.",
    "Use evidence-grounded, safe, plain language.",
    `Patient question: ${question}`,
    `Condition: ${caseData.primaryCondition}`,
    `Language: ${caseData.language ?? "en"}`,
    analysis
      ? [
          `Final score: ${analysis.finalScore}`,
          `Final risk tier: ${analysis.finalRiskTier}`,
          `Conflict findings: ${analysis.ruleAnalysis.findings.join(" | ")}`,
          `Recommended actions: ${analysis.ruleAnalysis.recommendedActions.join(" | ")}`
        ].join("\n")
      : "",
    "If the question is unsafe or asks for diagnosis/prescription, redirect to a clinician and explain why.",
    "If the question is about urgency, give a clear emergency escalation answer."
  ].join("\n");
}

