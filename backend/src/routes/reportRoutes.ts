import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { findCaseById } from "../store/caseStore";
import { caseIdParamSchema } from "../utils/validation";

function buildCaseSummary(id: string, entry: Awaited<ReturnType<typeof findCaseById>>): string {
  if (!entry) {
    return "";
  }

  const lines = [
    `SecondSight Case Report`,
    `Case ID: ${id}`,
    `Case Label: ${entry.input.caseLabel || "Untitled case"}`,
    `Condition: ${entry.input.primaryCondition}`,
    `Final Score: ${entry.analysis.finalScore}/100`,
    `Final Risk Tier: ${entry.analysis.finalRiskTier}`,
    `Rule Score: ${entry.analysis.ruleAnalysis.conflictScore}/100`,
    `ML Score: ${entry.analysis.riskModel.modelScore}/100`,
    ``,
    `Executive Summary:`,
    entry.analysis.aiInsight.executiveSummary,
    ``,
    `Recommended Actions:`,
    ...entry.analysis.ruleAnalysis.recommendedActions.map((item, index) => `${index + 1}. ${item}`),
    ``,
    `Specialist Questions:`,
    ...entry.analysis.ruleAnalysis.specialistQuestions.map((item, index) => `${index + 1}. ${item}`)
  ];

  return lines.join("\n");
}

export const reportsRouter = Router();

reportsRouter.get(
  "/:id/summary",
  asyncHandler(async (req, res) => {
    const params = caseIdParamSchema.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({ error: "Invalid case id" });
      return;
    }

    const target = await findCaseById(params.data.id);
    if (!target) {
      res.status(404).json({ error: "Case not found" });
      return;
    }

    const report = buildCaseSummary(params.data.id, target);

    res.json({
      ok: true,
      caseId: params.data.id,
      generatedAt: new Date().toISOString(),
      report
    });
  })
);
