import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogIn } from "lucide-react";

export const AuthPanel: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in with Google.");
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        width: "100%",
        padding: "20px"
      }}
    >
      <div className="panel" style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
        <h2 style={{ fontFamily: "ui-serif, Georgia, serif", margin: "0 0 10px", fontSize: "2rem", letterSpacing: "-0.03em" }}>
          Welcome Back
        </h2>
        <p style={{ color: "var(--ink-500)", marginBottom: "30px", fontSize: "1rem" }}>
          Sign in to access your secure medical dashboard and manage patient cases.
        </p>

        {errorMsg && (
          <div className="status-banner error" style={{ marginBottom: "20px" }}>
            {errorMsg}
          </div>
        )}

        <button
          className="button primary"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{ width: "100%", padding: "14px", fontSize: "1.05rem" }}
        >
          <LogIn size={20} />
          {isLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="footnote" style={{ marginTop: "24px", fontSize: "0.85rem", opacity: 0.8 }}>
          By signing in, you agree to the SecondSight Pro Terms of Service and Privacy Policy. All medical data is encrypted and securely stored.
        </p>
      </div>
    </div>
  );
};
