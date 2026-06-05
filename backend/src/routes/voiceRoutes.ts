import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { runFullAnalysis } from "../services/analysisPipeline";
import { speakMedicalSummary, askFollowupQuestion } from "../modules/medical-voice-assistant";
import type { PatientCaseInput } from "../types/domain";

const voiceRequestSchema = z.object({
  caseData: z.any(),
  analysis: z.any().optional(),
  question: z.string().optional()
});

export const voiceRouter = Router();

voiceRouter.post(
  "/summary",
  asyncHandler(async (req, res) => {
    const parsed = voiceRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: "Invalid request payload",
        details: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const caseData = parsed.data.caseData as PatientCaseInput;
    const analysis = parsed.data.analysis ?? (await runFullAnalysis(caseData));
    const result = await speakMedicalSummary({ caseData, analysis });

    res.json({
      ok: true,
      result
    });
  })
);

voiceRouter.post(
  "/followup",
  asyncHandler(async (req, res) => {
    const parsed = voiceRequestSchema.safeParse(req.body);

    if (!parsed.success || !parsed.data.question) {
      res.status(400).json({
        ok: false,
        error: "Invalid request payload",
        details: parsed.success ? { question: ["Question is required"] } : parsed.error.flatten().fieldErrors
      });
      return;
    }

    const caseData = parsed.data.caseData as PatientCaseInput;
    const analysis = parsed.data.analysis ?? (await runFullAnalysis(caseData));
    const result = await askFollowupQuestion({
      caseData,
      analysis,
      userQuestion: parsed.data.question
    });

    res.json({
      ok: true,
      result
    });
  })
);

