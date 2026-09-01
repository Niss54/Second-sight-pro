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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17A5.8 5.8 0 0 0 19 5.5a5.9 5.9 0 0 0-.5-3.5s-1.5-.5-4.5 1.5a15.7 15.7 0 0 0-8 0c-3-2-4.5-1.5-4.5-1.5a5.9 5.9 0 0 0-.5 3.5 5.8 5.8 0 0 0-2 2.31c0 5.77 3.35 6.79 6.5 7.17A4.8 4.8 0 0 0 5 18v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a href="https://linkedin.com/in/nishanthsharma" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://x.com/Niss54" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
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
