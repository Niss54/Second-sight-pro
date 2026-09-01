import { Router, type Request } from "express";
import multer from "multer";
import { asyncHandler } from "../middleware/asyncHandler";
import { extractMedicalReport } from "../modules/medical-report-parser";
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
    `Final Conflict Score: ${entry.analysis.conflict_score}`,
    `Agreement Score: ${entry.analysis.agreement_score}`,
    ``,
    `Summary:`,
    entry.analysis.summary,
    ``,
    `Disagreement Reasons:`,
    ...entry.analysis.disagreement_reason.map((item, index) => `${index + 1}. ${item}`),
    ``,
    `Specialist Questions:`,
    ...entry.analysis.specialist_questions.map((item, index) => `${index + 1}. ${item}`)
  ];

  return lines.join("\n");
}

export const reportsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 12 * 1024 * 1024
  }
});

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

reportsRouter.post(
  "/extract",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const request = req as Request & {
      file?: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
      };
    };

    if (!request.file) {
      res.status(400).json({
        ok: false,
        error: "Upload a file named 'file' to extract a medical report."
      });
      return;
    }

    const result = await extractMedicalReport({
      buffer: request.file.buffer,
      mimetype: request.file.mimetype,
      originalname: request.file.originalname
    });

    res.json({
      ok: true,
      result
    });
  })
);
