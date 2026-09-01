import { FullAnalysisResponse, PatientCaseInput, RiskTier } from "../types/domain";
import { runRuleEngine } from "./conflictEngine";
import { generateAiInsight } from "./llmInsight";
import { runRiskModel } from "./riskModel";

function toRiskTier(score: number): RiskTier {
  if (score >= 66) {
    return "high";
  }

  if (score >= 36) {
    return "moderate";
  }

  return "low";
}

export async function runFullAnalysis(caseData: PatientCaseInput): Promise<FullAnalysisResponse> {
  const ruleAnalysis = runRuleEngine(caseData);
  const riskModel = runRiskModel(ruleAnalysis);

  const finalScore = Math.round(ruleAnalysis.conflictScore * 0.7 + riskModel.modelScore * 0.3);
  const finalRiskTier = toRiskTier(finalScore);

  const aiInsight = await generateAiInsight(caseData, ruleAnalysis, riskModel);

  return {
    generatedAt: new Date().toISOString(),
    ruleAnalysis,
    riskModel,
    finalScore,
    finalRiskTier,
    aiInsight
  };
}
