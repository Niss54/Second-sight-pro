import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { AuthPanel } from "./components/AuthPanel";
import { HomePage } from "./pages/HomePage";
import { IntakePage } from "./pages/IntakePage";
import { DashboardPage } from "./pages/DashboardPage";
import { DoctorDashboardPage } from "./pages/DoctorDashboardPage";
import { ChatPage } from "./pages/ChatPage";
import "./App.css";

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="ambient-bg" aria-hidden="true" />
        <AuthPanel />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="case/new" element={<IntakePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="doctor" element={<DoctorDashboardPage />} />
      </Route>
      {/* Full screen layout for chat, no standard navbar/footer */}
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
