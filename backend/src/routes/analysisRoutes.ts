import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { runFullAnalysis } from "../services/analysisPipeline";
import { analyzeRequestSchema } from "../utils/validation";

export const analysisRouter = Router();

analysisRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = analyzeRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid request payload",
        details: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const analysis = await runFullAnalysis(parsed.data.caseData);

    res.json({
      ok: true,
      analysis
    });
  })
);
