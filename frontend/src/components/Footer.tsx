import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-col" style={{ paddingRight: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ background: "var(--teal)", color: "white", padding: "6px", borderRadius: "8px" }}>
              <Stethoscope size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: "1.2rem", fontFamily: "ui-serif, Georgia, serif" }}>
              SecondSight Pro
            </h1>
          </div>
          <p style={{ color: "var(--ink-500)", lineHeight: "1.6", fontSize: "0.95rem" }}>
            Building intelligent healthcare experiences that make a difference. Empowering doctors and patients with AI-driven conflict resolution.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/case/new">Active Case</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Technology</h4>
          <ul>
            <li><a href="#">React & Vite</a></li>
            <li><a href="#">LiveKit WebRTC</a></li>
            <li><a href="#">pgvector RAG</a></li>
            <li><a href="#">Sarvam AI Indic</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">WHO Guidelines</a></li>
            <li><a href="#">API Documentation</a></li>
            <li><a href="#">Case Studies</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <div className="footer-socials">
            <a href="#" className="footer-social-icon">Twitter</a>
            <a href="#" className="footer-social-icon">LinkedIn</a>
            <a href="https://github.com/Niss54/Second-sight-pro" target="_blank" rel="noreferrer" className="footer-social-icon">GitHub</a>
            <a href="#" className="footer-social-icon">Mail</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-legal">
          By using this medical platform, you agree to our Terms of Service. SecondSight Pro supports understanding conflicting medical opinions and does not replace licensed medical care. If symptoms are urgent or worsening, seek emergency help immediately.
          <br /><br />
          &copy; {new Date().getFullYear()} SecondSight AI. All rights reserved.
        </div>
        <div className="footer-bottom-links">
          <div>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookies</a>
          </div>
          <div style={{ marginTop: "4px" }}>
            Designed & Built with <span style={{ color: "var(--teal)" }}>♥</span> by Team
          </div>
        </div>
      </div>
    </footer>
  );
};
