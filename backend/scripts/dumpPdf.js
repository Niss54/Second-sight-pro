const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

async function run() {
  const file = path.resolve(__dirname, "../data/corpus/WHO_Hypertension_Guideline.pdf");
  if (!fs.existsSync(file)) return;
  const buffer = fs.readFileSync(file);
  const data = await pdfParse(buffer);
  fs.writeFileSync(path.resolve(__dirname, "../data/corpus/WHO_Hypertension_Guideline.txt"), data.text);
  console.log("Done dumping text");
}

run();
