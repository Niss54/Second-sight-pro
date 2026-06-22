import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Github, Linkedin, Twitter } from "lucide-react";

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
            <li><a href="https://github.com/Niss54/Second-sight-pro#team" target="_blank" rel="noreferrer">About Us</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Technology</h4>
          <ul>
            <li><a href="https://vitejs.dev/" target="_blank" rel="noreferrer">React & Vite</a></li>
            <li><a href="https://bhashini.gov.in/" target="_blank" rel="noreferrer">Bhashini STT</a></li>
            <li><a href="https://github.com/pgvector/pgvector" target="_blank" rel="noreferrer">pgvector RAG</a></li>
            <li><a href="https://sarvam.ai/" target="_blank" rel="noreferrer">Sarvam AI Indic</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="https://www.who.int/publications/i" target="_blank" rel="noreferrer">WHO Guidelines</a></li>
            <li><a href="https://icmr.nic.in/" target="_blank" rel="noreferrer">ICMR Guidelines</a></li>
            <li><a href="https://github.com/Niss54/Second-sight-pro" target="_blank" rel="noreferrer">API Documentation</a></li>
            <li><a href="https://github.com/Niss54/Second-sight-pro" target="_blank" rel="noreferrer">Open Source (Free)</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <div className="footer-socials">
            <a href="https://github.com/Niss54" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/nishanthsharma" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="https://x.com/Niss54" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Twitter">
              <Twitter size={20} />
            </a>
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
            <a href="https://github.com/Niss54/Second-sight-pro/blob/main/LICENSE" target="_blank" rel="noreferrer">Terms of Service</a>
            <a href="https://github.com/Niss54/Second-sight-pro" target="_blank" rel="noreferrer">Privacy Policy</a>
            <a href="https://github.com/Niss54/Second-sight-pro" target="_blank" rel="noreferrer">Cookies</a>
          </div>
          <div style={{ marginTop: "4px" }}>
            Designed & Built with <span style={{ color: "var(--teal)" }}>♥</span> by SecondSight (@Niss54)
          </div>
        </div>
      </div>
    </footer>
  );
};
