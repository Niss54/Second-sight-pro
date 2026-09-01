import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { reconcileOpinions } from "../services/opinionReconciliationEngine";
import { analyzeRequestSchema } from "../utils/validation";

export const reconciliationRouter = Router();

reconciliationRouter.post(
  "/compare",
  asyncHandler(async (req, res) => {
    const parsed = analyzeRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: "Invalid request payload",
        details: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const language = (req.query.lang as any) || "en";
    const analysis = await reconcileOpinions(parsed.data.caseData, language);

    res.json({
      ok: true,
      analysis
    });
  })
);
