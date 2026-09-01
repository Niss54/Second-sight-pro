import React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = {
  id: string;
  message: string;
  tone: "info" | "success" | "error";
};

interface ToastContainerProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-message toast-${toast.tone}`}>
          <div className="toast-icon">
            {toast.tone === "success" && <CheckCircle size={20} />}
            {toast.tone === "error" && <AlertCircle size={20} />}
            {toast.tone === "info" && <Info size={20} />}
          </div>
          <div className="toast-content">{toast.message}</div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
