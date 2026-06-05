# Medical Report Parser

This module is the lightweight report parser for SecondSight Pro.

## What it does
- extracts text from PDFs and scanned report images
- preprocesses images before OCR
- parses structured medical report fields

## Public API

```ts
import { extractMedicalReport } from "./modules/medical-report-parser";

const report = await extractMedicalReport(fileBuffer);
```

## Output

```json
{
  "report_type": "",
  "diagnosis": "",
  "medicines": [],
  "tests": [],
  "observations": []
}
```

## Notes
- Training code, notebooks, demo files, and unused UI are intentionally excluded.
- This module is designed to plug into SecondSight Pro as a focused parser service.

