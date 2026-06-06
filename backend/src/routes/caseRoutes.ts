import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createCase, deleteCase, findCaseById, listCases, updateCase } from "../store/caseStore";
import {
  caseIdParamSchema,
  createCaseRequestSchema,
  updateCaseRequestSchema
} from "../utils/validation";
import { reconcileOpinions } from "../services/opinionReconciliationEngine";

export const casesRouter = Router();

casesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const cases = await listCases();

    const summaries = cases.map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      caseLabel: entry.input.caseLabel || "Untitled case",
      primaryCondition: entry.input.primaryCondition,
      opinionsCount: entry.input.opinions.length,
      finalScore: entry.analysis.conflict_score,
      finalRiskTier: "moderate" // Simplified for now or mapped properly
    }));

    res.json({
      ok: true,
      total: summaries.length,
      cases: summaries
    });
  })
);

casesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = createCaseRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid request payload",
        details: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const analysis = await reconcileOpinions(parsed.data.caseData);
    const created = await createCase(parsed.data.caseData, analysis);

    res.status(201).json({
      ok: true,
      case: created
    });
  })
);

casesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const params = caseIdParamSchema.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({
        error: "Invalid case id"
      });
      return;
    }

    const target = await findCaseById(params.data.id);
    if (!target) {
      res.status(404).json({
        error: "Case not found"
      });
      return;
    }

    res.json({
      ok: true,
      case: target
    });
  })
);

casesRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const params = caseIdParamSchema.safeParse(req.params);
    const body = updateCaseRequestSchema.safeParse(req.body);

    if (!params.success) {
      res.status(400).json({
        error: "Invalid case id"
      });
      return;
    }

    if (!body.success) {
      res.status(400).json({
        error: "Invalid request payload",
        details: body.error.flatten().fieldErrors
      });
      return;
    }

    const analysis = await reconcileOpinions(body.data.caseData);
    const updated = await updateCase(params.data.id, body.data.caseData, analysis);

    if (!updated) {
      res.status(404).json({
        error: "Case not found"
      });
      return;
    }

    res.json({
      ok: true,
      case: updated
    });
  })
);

casesRouter.post(
  "/:id/reanalyze",
  asyncHandler(async (req, res) => {
    const params = caseIdParamSchema.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({
        error: "Invalid case id"
      });
      return;
    }

    const existing = await findCaseById(params.data.id);
    if (!existing) {
      res.status(404).json({
        error: "Case not found"
      });
      return;
    }

    const analysis = await reconcileOpinions(existing.input);
    const updated = await updateCase(existing.id, existing.input, analysis);

    res.json({
      ok: true,
      case: updated
    });
  })
);

casesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const params = caseIdParamSchema.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({
        error: "Invalid case id"
      });
      return;
    }

    const removed = await deleteCase(params.data.id);

    if (!removed) {
      res.status(404).json({
        error: "Case not found"
      });
      return;
    }

    res.status(204).send();
  })
);
