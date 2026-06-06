import { useState, useCallback } from "react";
import { UploadCloud, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadMedicalReportPdf, uploadPrescriptionImage } from "../services/api";

interface DocumentUploadPanelProps {
  onExtractionComplete: (type: "ocr" | "report", data: any) => void;
}

export function DocumentUploadPanel({ onExtractionComplete }: DocumentUploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      if (file.type === "application/pdf") {
        const data = await uploadMedicalReportPdf(file);
        onExtractionComplete("report", data);
      } else if (file.type.startsWith("image/")) {
        const data = await uploadPrescriptionImage(file);
        onExtractionComplete("ocr", data);
      } else {
        setError("Unsupported file format. Please upload a PDF or an Image.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to process the document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel mb-6 overflow-hidden relative">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        className={`p-8 border-2 border-dashed rounded-xl text-center transition-all duration-300 ${
          isDragging ? "border-primary-400 bg-primary-50/10" : "border-slate-700/50 hover:border-slate-600/70"
        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          type="file"
          id="document-upload"
          className="hidden"
          accept="application/pdf,image/png,image/jpeg,image/jpg"
          onChange={handleChange}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <Loader2 className="w-12 h-12 text-primary-400 animate-spin" />
            <h3 className="text-lg font-medium text-slate-200">AI is extracting medical data...</h3>
            <p className="text-sm text-slate-400">This may take a few seconds.</p>
          </div>
        ) : (
          <label htmlFor="document-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-2 shadow-inner border border-slate-700/50">
              <UploadCloud className="w-8 h-8 text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-1">Drag & Drop Documents</h3>
              <p className="text-sm text-slate-400 mb-4">Upload PDFs for medical reports or images for prescriptions</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 text-blue-300 border border-blue-900/30">
                <FileText className="w-3.5 h-3.5" /> PDF Reports
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 text-emerald-300 border border-emerald-900/30">
                <ImageIcon className="w-3.5 h-3.5" /> Image Prescriptions
              </span>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg max-w-md">
                {error}
              </div>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
