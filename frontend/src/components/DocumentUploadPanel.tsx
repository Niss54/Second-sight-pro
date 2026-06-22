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
    <div style={{ marginBottom: "24px" }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        style={{
          padding: "32px 24px",
          border: `2px dashed ${isDragging ? "var(--teal)" : "rgba(0,0,0,0.15)"}`,
          borderRadius: "16px",
          textAlign: "center",
          backgroundColor: isDragging ? "rgba(13, 124, 115, 0.05)" : "var(--bg-0)",
          transition: "all 0.3s ease",
          opacity: isUploading ? 0.6 : 1,
          pointerEvents: isUploading ? "none" : "auto",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <input
          type="file"
          id="document-upload"
          style={{ display: "none" }}
          accept="application/pdf,image/png,image/jpeg,image/jpg"
          onChange={handleChange}
        />
        
        {isUploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "16px 0" }}>
            <Loader2 size={48} color="var(--teal)" style={{ animation: "spin 1s linear infinite" }} />
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--ink-900)" }}>AI is extracting medical data...</h3>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--ink-500)" }}>This may take a few seconds.</p>
          </div>
        ) : (
          <label htmlFor="document-upload" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(13, 124, 115, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <UploadCloud size={32} color="var(--teal)" />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", fontWeight: 600, color: "var(--ink-900)" }}>Drag & Drop Documents</h3>
            <p style={{ margin: "0 0 20px", fontSize: "0.9rem", color: "var(--ink-500)" }}>Upload PDFs for medical reports or images for prescriptions</p>
            
            <div style={{ display: "flex", gap: "12px", fontSize: "0.85rem", fontWeight: 500 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#2563eb", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                <FileText size={14} /> PDF Reports
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <ImageIcon size={14} /> Image Prescriptions
              </span>
            </div>
            
            {error && (
              <div style={{ marginTop: "16px", padding: "10px 16px", backgroundColor: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", color: "#dc2626", fontSize: "0.85rem", borderRadius: "8px", maxWidth: "400px" }}>
                {error}
              </div>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
