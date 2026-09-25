import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, LogOut, Menu, X, MessageSquare, History, Activity, PlusCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, continueAsGuest } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`nav-pill ${isOpen ? "mobile-open" : ""}`} aria-label="Main Navigation">
      <div className="nav-header">
        <Link to="/" onClick={handleLinkClick} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/secondsight-icon.png"
            alt="SecondSight Pro Emblem"
            style={{
              width: "34px",
              height: "34px",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 6px rgba(13, 124, 115, 0.25))"
            }}
          />
          <span style={{ fontSize: "1.18rem", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--ink-900)" }}>
            <span style={{ color: "var(--teal)" }}>Second</span>Sight <span style={{ fontSize: "0.72rem", background: "rgba(13, 124, 115, 0.12)", color: "var(--teal)", padding: "2px 7px", borderRadius: "6px", verticalAlign: "middle", fontWeight: 800, letterSpacing: "0.04em" }}>PRO</span>
          </span>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <div className={`nav-links ${isOpen ? "show" : ""}`}>
        <Link
          to="/"
          onClick={handleLinkClick}
          className={`nav-link-item ${isActive("/") ? "active" : ""}`}
        >
          Home
        </Link>

        <Link
          to="/case/new"
          onClick={handleLinkClick}
          className={`nav-link-item ${isActive("/case") ? "active" : ""}`}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <PlusCircle size={15} />
          <span>New Case</span>
        </Link>

        <Link
          to="/chat"
          onClick={handleLinkClick}
          className={`nav-link-item ${isActive("/chat") ? "active" : ""}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            position: "relative"
          }}
        >
          <MessageSquare size={15} />
          <span>AI Chat</span>
          <span className="nav-voice-badge">
            Voice
          </span>
        </Link>

        <Link
          to="/dashboard"
          onClick={handleLinkClick}
          className={`nav-link-item ${isActive("/dashboard") ? "active" : ""}`}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <History size={15} />
          <span>History</span>
        </Link>

        <Link
          to="/doctor"
          onClick={handleLinkClick}
          className={`nav-link-item ${isActive("/doctor") ? "active" : ""}`}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Activity size={15} />
          <span>Doctor Portal</span>
        </Link>
      </div>

      <div className={`nav-actions ${isOpen ? "show" : ""}`}>
        <button
          onClick={() => { toggleTheme(); handleLinkClick(); }}
          className="button ghost theme-toggle-btn"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          aria-label="Toggle theme"
          data-cursor={theme === "light" ? "dark mode" : "light mode"}
          style={{ padding: "8px", borderRadius: "50%", minWidth: "36px", height: "36px", display: "grid", placeItems: "center", border: "1px solid var(--line)", background: "transparent", color: "var(--ink-700)" }}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        {user ? (
          <button
            onClick={() => { signOut(); handleLinkClick(); }}
            className="button ghost signout-btn"
            data-cursor="sign out"
            style={{ padding: "6px 14px", fontSize: "0.85rem", height: "36px", display: "flex", alignItems: "center", gap: "6px", borderRadius: "999px", border: "1px solid var(--line)", color: "var(--ink-700)" }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => { continueAsGuest(); handleLinkClick(); }}
            className="nav-demo-btn"
            data-cursor="demo access"
            style={{
              padding: "6px 16px",
              fontSize: "0.85rem",
              fontWeight: 600,
              height: "36px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "999px",
              background: "var(--teal)",
              color: "#ffffff",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 2px 8px rgba(13, 124, 115, 0.25)",
              transition: "transform 0.15s ease"
            }}
          >
            <span>Demo Access</span>
          </button>
        )}
      </div>
    </nav>
  );
};
