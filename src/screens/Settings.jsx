import { useState } from "react";
import { Card, Toggle, Button } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Settings({ apiKey, setApiKey }) {
  const { user, updateProfile } = useAuth();

  // Profile state
  const [name,     setName]     = useState(user?.name     || "");
  const [email,    setEmail]    = useState(user?.email    || "");
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || "");
  const [role,     setRole]     = useState(user?.role     || "Staff");

  // Password state
  const [curPass,  setCurPass]  = useState("");
  const [newPass,  setNewPass]  = useState("");
  const [conPass,  setConPass]  = useState("");
  const [passMsg,  setPassMsg]  = useState(null); // { type: "ok"|"err", text }

  // Language state
  const [uiLang,   setUiLang]   = useState("English");
  const [dataLang, setDataLang] = useState("Thai");

  // Privacy state
  const [maskGuest,    setMaskGuest]    = useState(true);
  const [anonFeedback, setAnonFeedback] = useState(false);
  const [autoReply,    setAutoReply]    = useState(false);

  // Save state
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({ name, email, jobTitle, role });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleResetPassword = () => {
    if (!curPass) { setPassMsg({ type: "err", text: "Please enter your current password." }); return; }
    if (newPass.length < 6) { setPassMsg({ type: "err", text: "New password must be at least 6 characters." }); return; }
    if (newPass !== conPass) { setPassMsg({ type: "err", text: "New passwords do not match." }); return; }
    setPassMsg({ type: "ok", text: "Password updated successfully!" });
    setCurPass(""); setNewPass(""); setConPass("");
    setTimeout(() => setPassMsg(null), 3000);
  };

  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeSlideIn 0.35s ease" }}>

      {profileSaved && (
        <div style={{ padding: "12px 20px", borderRadius: 10, fontSize: 13, background: "var(--accent-bg)", border: "1px solid var(--accent-glow)", color: "var(--accent)", textAlign: "center", fontWeight: 600, animation: "fadeSlideIn 0.2s ease" }}>
          ✓ Profile saved successfully
        </div>
      )}

      {/*  Row 1: Profile + Password + Language  */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

        {/* Profile Settings */}
        <Card>
          <SectionHead icon="👤" title="Profile" sub="Your account details" />

          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "var(--accent-bg)", border: "2px solid var(--accent-glow)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "var(--accent)",
              fontFamily: "var(--font-mono)", flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{name || "Your Name"}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{jobTitle || "Job Title"}</div>
              <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)", marginTop: 2 }}>● {role}</div>
            </div>
          </div>

          {[
            { label: "Full Name",  val: name,     set: setName,     placeholder: "Your full name" },
            { label: "Email",      val: email,    set: setEmail,    placeholder: "you@hotel.com",  type: "email" },
            { label: "Job Title",  val: jobTitle, set: setJobTitle, placeholder: "e.g. Hotel Manager" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{f.label}</div>
              <input
                type={f.type || "text"}
                value={f.val}
                onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>Role</div>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: "100%" }}>
              {["Manager", "Supervisor", "Staff", "Admin"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <Button variant="primary" onClick={handleSaveProfile} style={{ width: "100%" }}>
            Save Profile
          </Button>
        </Card>

        {/* Reset Password */}
        <Card>
          <SectionHead icon="🔑" title="Reset Password" sub="Change your login password" />

          {[
            { label: "Current Password", val: curPass, set: setCurPass, placeholder: "Enter current password" },
            { label: "New Password",     val: newPass, set: setNewPass, placeholder: "Min. 6 characters" },
            { label: "Confirm Password", val: conPass, set: setConPass, placeholder: "Repeat new password" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{f.label}</div>
              <input
                type="password"
                value={f.val}
                onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
          ))}

          {passMsg && (
            <div style={{
              padding: "9px 13px", borderRadius: 8, fontSize: 12, marginBottom: 12, lineHeight: 1.5,
              background: passMsg.type === "ok" ? "var(--accent-bg)" : "var(--danger-bg)",
              border: `1px solid ${passMsg.type === "ok" ? "var(--accent-glow)" : "#ef444440"}`,
              color: passMsg.type === "ok" ? "var(--accent)" : "var(--danger)",
              animation: "fadeSlideIn 0.2s ease",
            }}>
              {passMsg.type === "ok" ? "✓" : "⚠"} {passMsg.text}
            </div>
          )}

          <Button variant="ghost" onClick={handleResetPassword} style={{ width: "100%" }}>
            Update Password
          </Button>

          <div style={{ marginTop: 14, padding: "10px 12px", background: "var(--bg-elevated)", borderRadius: 8, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
            🔐 Use at least 6 characters. Your password is never stored in plain text.
          </div>
        </Card>

        {/* Language */}
        <Card>
          <SectionHead icon="🌐" title="Language" sub="Display & data language" />
          {[
            { label: "UI Language",     val: uiLang,   set: setUiLang,   opts: ["English", "Thai", "Japanese", "Chinese", "Russian", "Arabic"] },
            { label: "Review Language", val: dataLang, set: setDataLang, opts: ["Thai", "English", "Japanese", "Korean", "Auto-detect"] },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{f.label}</div>
              <select value={f.val} onChange={e => f.set(e.target.value)} style={{ width: "100%" }}>
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ padding: "10px 12px", background: "var(--bg-elevated)", borderRadius: 8, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
            💡 Gemini AI auto-translates reviews to your chosen UI language
          </div>
        </Card>
      </div>

      {/*  Row 2: Privacy Controls + About  */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>

        {/* Privacy Controls */}
        <Card>
          <SectionHead icon="🔒" title="Privacy Controls" sub="Guest data protection" />
          {[
            { label: "Mask Guest Info",    sub: "Hide names & contact details",    val: maskGuest,    set: setMaskGuest },
            { label: "Anonymous Feedback", sub: "Remove identifiers from exports", val: anonFeedback, set: setAnonFeedback },
            { label: "Auto-Reply Mode",    sub: "Send AI responses automatically", val: autoReply,    set: setAutoReply },
          ].map(ctrl => (
            <div key={ctrl.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{ctrl.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{ctrl.sub}</div>
                {ctrl.val && <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)", marginTop: 2 }}>● Active</div>}
              </div>
              <Toggle checked={ctrl.val} onChange={ctrl.set} />
            </div>
          ))}
        </Card>

        <div style={{ textAlign: "right" }}>
      <div style={{
        fontSize: 30,
        fontWeight: 800,
        fontFamily: "var(--font-display)",
        color: "var(--text-primary)",
      }}>
        <span style={{ color: "var(--accent)" }}>Hospiti</span>Sense
      </div>
    </div>

        
      </div>
    </div>
  );
}

function SectionHead({ icon, title, sub }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}
