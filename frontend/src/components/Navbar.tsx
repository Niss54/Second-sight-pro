import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <nav style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      padding: "16px 24px",
      background: "var(--card)",
      borderBottom: "1px solid var(--line)",
      backdropFilter: "blur(20px)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "var(--ink-900)" }}>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontFamily: "ui-serif, Georgia, serif", letterSpacing: "-0.03em" }}>
            <span style={{ color: "var(--teal)" }}>Second</span>Sight Pro
          </h1>
        </Link>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/" style={{ 
            textDecoration: "none", 
            color: location.pathname === "/" ? "var(--teal)" : "var(--ink-500)",
            fontWeight: location.pathname === "/" ? 700 : 500
          }}>Home</Link>
          <Link to="/case/new" style={{ 
            textDecoration: "none", 
            color: location.pathname.startsWith("/case") ? "var(--teal)" : "var(--ink-500)",
            fontWeight: location.pathname.startsWith("/case") ? 700 : 500
          }}>Active Case</Link>
          <Link to="/dashboard" style={{ 
            textDecoration: "none", 
            color: location.pathname === "/dashboard" ? "var(--teal)" : "var(--ink-500)",
            fontWeight: location.pathname === "/dashboard" ? 700 : 500
          }}>History</Link>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={toggleTheme} className="button ghost" style={{ padding: "8px", borderRadius: "50%" }}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button onClick={signOut} className="button ghost" style={{ padding: "8px 12px", fontSize: "0.85rem" }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </nav>
  );
};
