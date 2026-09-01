# Prescription OCR Microservice

This module is the lightweight prescription OCR engine for SecondSight Pro.

## What it does
- runs OCR inference on prescription images
- applies light input preprocessing and text normalization
- extracts medicines, dosage lines, tests, and doctor notes
- returns structured JSON for downstream analysis

## Public API

```ts
import { extractPrescription } from "./modules/prescription-ocr";

const result = await extractPrescription(imageBuffer);
```

## Output

```json
{
  "medicines": [],
  "dosage": [],
  "tests": [],
  "doctor_notes": ""
}
```

The internal service also computes OCR metadata:
- `rawText`
- `confidence`
- `needsManualReview`
- `source`

## Supported inputs
- image buffers
- base64 encoded images
- uploaded files using `multer`

## Production note
This module is intentionally narrow. It does not include training code, notebooks, datasets, or experimental UI.

