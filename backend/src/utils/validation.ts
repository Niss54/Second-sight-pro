import { z } from "zod";

const urgencyEnum = z.enum(["routine", "soon", "urgent", "emergency"]);

const opinionSchema = z.object({
  doctorName: z.string().trim().min(1),
  specialty: z.string().trim().min(1),
  urgency: urgencyEnum,
  diagnosis: z.string().trim().min(3),
  treatment: z.string().trim().min(3),
  prescriptions: z.array(z.string().trim().min(1)).default([]),
  tests: z.array(z.string().trim().min(1)).default([]),
  notes: z.string().trim().optional()
});

export const patientCaseSchema = z.object({
  caseLabel: z.string().trim().max(120).optional(),
  primaryCondition: z.string().trim().min(3),
  patientAge: z.number().int().min(0).max(120).nullable().optional(),
  comorbidities: z.array(z.string().trim().min(1)).default([]),
  symptoms: z.array(z.string().trim().min(1)).default([]),
  opinions: z.array(opinionSchema).min(2).max(5),
  abha_id: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // optional, undefined is fine
        // Accept 14-digit numeric ABHA ID or username@abdm format
        return /^\d{14}$/.test(val) || /^[a-zA-Z0-9._]+@abdm$/.test(val);
      },
      {
        message: "ABHA ID must be a 14-digit number or username@abdm format"
      }
    )
});

export const analyzeRequestSchema = z.object({
  caseData: patientCaseSchema
});

export const createCaseRequestSchema = z.object({
  caseData: patientCaseSchema
});

export const updateCaseRequestSchema = z.object({
  caseData: patientCaseSchema
});

export const caseIdParamSchema = z.object({
  id: z.string().trim().min(1)
});

export type PatientCaseRequest = z.infer<typeof patientCaseSchema>;
