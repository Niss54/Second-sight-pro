import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { AccessToken } from "livekit-server-sdk";
import { env } from "../config/env";
import { reconcileOpinions } from "../services/opinionReconciliationEngine";
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
    const analysis = parsed.data.analysis ?? (await reconcileOpinions(caseData));
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
    const analysis = parsed.data.analysis ?? (await reconcileOpinions(caseData));
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

voiceRouter.get(
  "/token",
  asyncHandler(async (req, res) => {
    const roomName = req.query.room as string || "medical-room";
    const participantName = req.query.participant as string || "user";

    if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET) {
      res.status(500).json({ error: "LiveKit credentials not configured" });
      return;
    }

    const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity: participantName,
    });
    at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });

    res.json({ token: await at.toJwt() });
  })
);

