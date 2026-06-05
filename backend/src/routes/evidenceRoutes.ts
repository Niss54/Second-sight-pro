import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { createMedicalEvidenceEngine } from "../modules/medical-evidence-engine";

const urgencySchema = z.enum(["routine", "soon", "urgent", "emergency"]);

const evidenceRequestSchema = z.object({
  query: z.string().min(2),
  limit: z.coerce.number().int().min(1).max(10).optional(),
  disease: z.string().optional(),
  specialty: z.string().optional(),
  urgency: urgencySchema.optional(),
  condition: z.string().optional(),
  sources: z.array(z.string()).optional()
});

const engine = createMedicalEvidenceEngine();

export const evidenceRouter = Router();

evidenceRouter.post(
  "/search",
  asyncHandler(async (req, res) => {
    const parsed = evidenceRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: "Invalid request payload",
        details: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const bundle = await engine.getMedicalEvidence(parsed.data);

    res.json({
      ok: true,
      ...bundle
    });
  })
);

evidenceRouter.post(
  "/citations",
  asyncHandler(async (req, res) => {
    const parsed = evidenceRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: "Invalid request payload",
        details: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const citations = await engine.getCitations(parsed.data);

    res.json({
      ok: true,
      query: parsed.data.query,
      citations,
      generatedAt: new Date().toISOString()
    });
  })
);
