import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode,     setMode]     = useState("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [role,     setRole]     = useState("Front Desk");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const STORAGE_KEY = "hospitisense_accounts";

  const getAccounts = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
  };

  const saveAccount = (acc) => {
    const accounts = getAccounts();
    accounts.push(acc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  };

  const avatar = name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (mode === "login") {
        const accounts = getAccounts();
        const found = accounts.find(a => a.email === email.trim().toLowerCase() && a.password === password);
        const DEMO = [
          { email: "admin@hospitisense.ai", password: "admin123", name: "Sammy B.", role: "Hotel Manager", avatar: "S" },
        ];
        const demo = DEMO.find(d => d.email === email.trim().toLowerCase() && d.password === password);
        if (found) {
          login({ name: found.name, role: found.role, avatar: found.avatar, email: found.email });
        } else if (demo) {
          login(demo);
        } else {
          setError("Invalid email or password.");
        }
      } else {
        if (!name.trim())        { setError("Please enter your name.");                   setLoading(false); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters.");  setLoading(false); return; }
        if (password !== confirm) { setError("Passwords do not match.");                  setLoading(false); return; }
        const accounts = getAccounts();
        if (accounts.find(a => a.email === email.trim().toLowerCase())) {
          setError("An account with this email already exists."); setLoading(false); return;
        }
        const newUser = { email: email.trim().toLowerCase(), password, name: name.trim(), role, avatar };
        saveAccount(newUser);
        login({ name: newUser.name, role: newUser.role, avatar: newUser.avatar, email: newUser.email });
      }
      setLoading(false);
    }, 600);
  };

  const switchMode = (m) => {
    setMode(m); setError("");
    setEmail(""); setPassword(""); setName(""); setConfirm("");
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", width: "100vw",
      background: "var(--bg-base)", fontFamily: "var(--font-body)",
    }}>
      {/* Glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 500,
        background: "radial-gradient(ellipse, rgba(45,140,158,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 440, padding: "0 20px", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>🏨</div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800,
            color: "var(--text-primary)", letterSpacing: 0.5,
          }}>
            HospitiSense <span style={{ color: "var(--accent)" }}>AI</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 5, fontFamily: "var(--font-mono)", letterSpacing: 1.5 }}>
            HOTEL COMMAND CENTER
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex", background: "var(--bg-surface)",
          border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
          padding: 4, marginBottom: 20, gap: 4,
        }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              flex: 1, padding: "9px 0",
              background: mode === m ? "var(--accent)" : "transparent",
              border: "none", borderRadius: 9,
              color: mode === m ? "#fff" : "var(--text-secondary)",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              fontFamily: "var(--font-body)", transition: "all 0.2s",
              letterSpacing: 0.3,
            }}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "28px 32px",
          boxShadow: "var(--shadow-card)",
        }}>
          <form onSubmit={handleSubmit}>

            {mode === "signup" && (
              <Field label="Full Name">
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" required />
              </Field>
            )}

            {mode === "signup" && (
              <Field label="Role">
                <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
                  {["Hotel Manager","Front Desk","Housekeeping","F&B Manager","Concierge","Revenue Manager","IT Admin"].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Field>
            )}

            <Field label="Email">
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@hospitisense.ai" required />
            </Field>

            <Field label="Password">
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </Field>

            {mode === "signup" && (
              <Field label="Confirm Password">
                <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required />
              </Field>
            )}

            {error && (
              <div style={{
                background: "var(--danger-bg)", border: "1px solid var(--danger)",
                borderRadius: "var(--radius-sm)", padding: "10px 14px",
                color: "var(--danger)", fontSize: 13, marginBottom: 16,
              }}>{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "11px",
                background: loading ? "var(--accent-dim)" : "var(--accent)",
                border: "none", borderRadius: "var(--radius-sm)",
                color: "#fff", fontSize: 14, fontWeight: 700,
                fontFamily: "var(--font-body)", cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s", letterSpacing: 0.3, marginTop: 4,
              }}
            >
              {loading
                ? (mode === "login" ? "Signing in…" : "Creating account…")
                : (mode === "login" ? "Sign In" : "Create Account")}
            </button>
          </form>
        </div>

        {mode === "signup" && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12, marginTop: 16 }}>
            Already have an account?{" "}
            <span onClick={() => switchMode("login")} style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>
              Sign in
            </span>
          </p>
        )}

        {mode === "login" && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12, marginTop: 16 }}>
            Don't have an account?{" "}
            <span onClick={() => switchMode("signup")} style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>
              Create one
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", padding: "10px 14px",
  background: "var(--bg-input)", border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
  fontSize: 14, fontFamily: "var(--font-body)", outline: "none",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, color: "var(--text-secondary)", marginBottom: 6, fontFamily: "var(--font-mono)", letterSpacing: 1, textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ type = "text", value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle, borderColor: focused ? "var(--accent)" : "var(--border)", transition: "border-color 0.2s" }}
    />
  );
}
