import { useState } from "react";
import "./styles/globals.css";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ReviewsProvider }       from "./context/ReviewsContext.jsx";

// Layout components
import Sidebar from "./components/Sidebar.jsx";
import TopBar  from "./components/TopBar.jsx";

// Screens
import AuthPage       from "./screens/AuthPage.jsx";
import Dashboard      from "./screens/Dashboard.jsx";
import Departments    from "./screens/Departments.jsx";
import ActionMap      from "./screens/ActionMap.jsx";
import ReviewsFeed    from "./screens/ReviewsFeed.jsx";
import AIAssistant    from "./screens/AIAssistant.jsx";
import SmartResponder from "./screens/SmartResponder.jsx";
import Reports        from "./screens/Reports.jsx";
import Settings       from "./screens/Settings.jsx";



const SCREENS = {
  dashboard:   Dashboard,
  departments: Departments,
  actionmap:   ActionMap,
  reviews:     ReviewsFeed,
  ai:          AIAssistant,
  responder:   SmartResponder,
  reports:     Reports,
  settings:    Settings,
};

//  Inner app (has access to AuthContext) 
function AppInner() {
  const { user, logout } = useAuth();
  const [screen,           setScreen]           = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [apiKey,           setApiKey]           = useState("");

  // Show login page if not authenticated
  if (!user) return <AuthPage />;

  const ActiveScreen = SCREENS[screen] || Dashboard;
  const aiScreenProps = (screen === "ai" || screen === "responder" || screen === "settings")
    ? { apiKey, ...(screen === "settings" ? { setApiKey } : {}) }
    : {};

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      background: "var(--bg-base)",
    }}>
      <Sidebar
        active={screen}
        onNavigate={setScreen}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: 0,
      }}>
        <TopBar
          screen={screen}
          onToggleSidebar={() => setSidebarCollapsed(v => !v)}
          onNavigateSettings={() => setScreen("settings")}
        />

        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "22px 24px",
          background: "var(--bg-base)",
        }}>
          <ActiveScreen {...aiScreenProps} />
        </main>
      </div>
    </div>
  );
}

//  Root: wrap with providers 
export default function App() {
  return (
    <AuthProvider>
      <ReviewsProvider>
        <AppInner />
      </ReviewsProvider>
    </AuthProvider>
  );
}
