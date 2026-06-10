import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="footnote" style={{ padding: "40px 24px", textAlign: "center", color: "var(--ink-500)", borderTop: "1px solid var(--line)", marginTop: "auto", background: "transparent" }}>
      <p style={{ maxWidth: "800px", margin: "0 auto", fontSize: "0.85rem", lineHeight: "1.6" }}>
        <strong>Safety Notice:</strong> SecondSight Pro supports understanding conflicting medical opinions and does not replace
        licensed medical care. If symptoms are urgent or worsening, seek emergency help immediately.
        <br/><br/>
        &copy; {new Date().getFullYear()} SecondSight Pro AI. All rights reserved. Built for Healthcare.
      </p>
    </footer>
  );
};
