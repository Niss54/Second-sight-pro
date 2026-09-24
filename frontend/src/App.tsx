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
import { InteractiveCursor } from "./components/InteractiveCursor";
import "./App.css";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: "40px 20px" }}>
        <AuthPanel />
      </div>
    );
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", fontSize: "1.1rem", fontWeight: 600, color: "var(--teal)" }}>
        Loading SecondSight Pro...
      </div>
    );
  }

  return (
    <>
      <InteractiveCursor />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="case/new" element={<ProtectedRoute><IntakePage /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="doctor" element={<DoctorDashboardPage />} />
        </Route>
        {/* Full screen layout for chat, no standard navbar/footer */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </>
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
