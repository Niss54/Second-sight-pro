import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, LogOut, Menu, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`nav-pill ${isOpen ? 'mobile-open' : ''}`}>
      <div className="nav-header">
        <Link to="/" onClick={handleLinkClick} style={{ textDecoration: "none", color: "var(--ink-900)" }}>
          <h1 style={{ margin: 0, fontSize: "1.2rem", fontFamily: "ui-serif, Georgia, serif", letterSpacing: "-0.03em" }}>
            <span style={{ color: "var(--teal)" }}>Second</span>Sight Pro
          </h1>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <div className={`nav-links ${isOpen ? 'show' : ''}`}>
        <Link to="/" onClick={handleLinkClick} style={{ 
          textDecoration: "none", 
          color: location.pathname === "/" ? "var(--teal)" : "var(--ink-500)",
          fontWeight: location.pathname === "/" ? 700 : 500,
          fontSize: "0.95rem"
        }}>Home</Link>
        <Link to="/case/new" onClick={handleLinkClick} style={{ 
          textDecoration: "none", 
          color: location.pathname.startsWith("/case") ? "var(--teal)" : "var(--ink-500)",
          fontWeight: location.pathname.startsWith("/case") ? 700 : 500,
          fontSize: "0.95rem"
        }}>Active Case</Link>
        <Link to="/dashboard" onClick={handleLinkClick} style={{ 
          textDecoration: "none", 
          color: location.pathname === "/dashboard" ? "var(--teal)" : "var(--ink-500)",
          fontWeight: location.pathname === "/dashboard" ? 700 : 500,
          fontSize: "0.95rem"
        }}>History</Link>
        <Link
          to="/doctor"
          onClick={handleLinkClick}
          style={{
            textDecoration: "none",
            color: location.pathname === "/doctor" ? "var(--teal)" : "var(--ink-500)",
            fontWeight: location.pathname === "/doctor" ? 700 : 500,
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: location.pathname === "/doctor" ? "var(--teal)" : "rgba(13,124,115,0.15)",
              color: location.pathname === "/doctor" ? "#fff" : "var(--teal)",
              fontSize: "9px",
              fontWeight: 700,
              borderRadius: "4px",
              padding: "2px 5px",
              letterSpacing: "0.04em"
            }}
          >
            Dr
          </span>
          Doctor View
        </Link>
      </div>

      <div className={`nav-actions ${isOpen ? 'show' : ''}`}>
        <button onClick={() => { toggleTheme(); handleLinkClick(); }} className="button ghost" style={{ padding: "8px", borderRadius: "50%", minWidth: "36px", height: "36px" }}>
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <button onClick={() => { signOut(); handleLinkClick(); }} className="button ghost" style={{ padding: "6px 12px", fontSize: "0.85rem", height: "36px" }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </nav>
  );
};
