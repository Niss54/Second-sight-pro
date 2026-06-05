import { Router, type Request } from "express";
import multer from "multer";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { extractPrescription } from "../modules/prescription-ocr";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const base64BodySchema = z.object({
  image: z.string().min(12)
});

export const ocrRouter = Router();

ocrRouter.post(
  "/prescription",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const request = req as Request & {
      file?: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
      };
    };

    if (!request.file) {
      const parsed = base64BodySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          ok: false,
          error: "Provide an uploaded image file named 'image' or a base64 image string in the request body."
        });
        return;
      }

      const result = await extractPrescription(parsed.data.image);
      res.json({
        ok: true,
        result: {
          medicines: result.medicines,
          dosage: result.dosage,
          tests: result.tests,
          doctor_notes: result.doctor_notes
        },
        meta: {
          rawText: result.rawText,
          confidence: result.confidence,
          needsManualReview: result.needsManualReview,
          source: result.source
        }
      });
      return;
    }

    const result = await extractPrescription({
      buffer: request.file.buffer,
      mimetype: request.file.mimetype,
      originalname: request.file.originalname
    });

    res.json({
      ok: true,
      result: {
        medicines: result.medicines,
        dosage: result.dosage,
        tests: result.tests,
        doctor_notes: result.doctor_notes
      },
      meta: {
        rawText: result.rawText,
        confidence: result.confidence,
        needsManualReview: result.needsManualReview,
        source: result.source
      }
    });
  })
);
