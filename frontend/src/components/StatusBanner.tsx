interface StatusBannerProps {
  message: string;
  tone: "info" | "success" | "error";
}

export function StatusBanner({ message, tone }: StatusBannerProps) {
  if (!message) {
    return null;
  }

  return <div className={`status-banner ${tone}`}>{message}</div>;
}
