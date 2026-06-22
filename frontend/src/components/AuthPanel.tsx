import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, Sparkles, Languages, CheckCircle2, Search } from "lucide-react";

export const AuthPanel: React.FC = () => {
  const { signInWithGoogle, continueAsGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");

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
    <div className="auth-wrapper">
      {/* Background network pattern */}
      <div className="auth-bg-pattern"></div>

      <div className="auth-container">
        {/* Left Side: Branding & Illustration */}
        <div className="auth-left">
          {/* Top Logo */}
          <div className="auth-brand">
            <Sparkles className="auth-brand-icon" />
            <h1 className="auth-brand-text">
              <span>Second</span>Sight Pro
            </h1>
          </div>

          {/* Center Illustration Area */}
          <div className="auth-illustration-container">
            <div className="auth-illustration-card">
              <img src="/auth-hero.png" alt="Patient getting conflicting medical advice" className="auth-hero-img" />
              
              {/* Floating feature pills */}
              <div className="auth-pill pill-top-right">
                <CheckCircle2 size={14} className="pill-icon green" />
                <span>AI Reconciliation</span>
              </div>
              <div className="auth-pill pill-mid-right">
                <Search size={14} className="pill-icon blue" />
                <span>Evidence Backed</span>
              </div>
              <div className="auth-pill pill-bottom-right">
                <Languages size={14} className="pill-icon purple" />
                <span>Hindi Voice STT</span>
              </div>
            </div>

            <div className="auth-left-footer">
              <h3 className="auth-footer-title">Medical Consensus</h3>
              <p className="auth-footer-desc">with advanced AI guidelines</p>
            </div>
          </div>
          
          {/* Decorative background waves */}
          <div className="auth-waves"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <h2 className="auth-title">Get the Right Medical Opinion</h2>
            <p className="auth-subtitle">Log in to manage patient cases, analyze conflicts, and get evidence-backed AI second opinions.</p>

            {errorMsg && (
              <div className="status-banner error" style={{ marginBottom: "20px" }}>
                {errorMsg}
              </div>
            )}

            <button
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
              {isLoading ? "Signing in..." : "Continue with Google"}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <div className="auth-input-group">
              <label>Email <span className="required">*</span></label>
              <input 
                type="email" 
                placeholder="Enter Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-password-link">
              <a href="#">Login via Password</a>
            </div>

            <button className="auth-otp-btn" disabled>
              Continue with OTP
            </button>

            <button
              className="auth-guest-btn"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  continueAsGuest();
                }, 500);
              }}
              disabled={isLoading}
            >
              <Sparkles size={16} /> Continue as Guest (Hackathon Demo)
            </button>

            <p className="auth-terms">
              By signing in, you accept the <a href="#">Terms of Service</a> and acknowledge our <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
