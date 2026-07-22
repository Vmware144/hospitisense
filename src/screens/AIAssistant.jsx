import { useState } from "react";
import { Card, Button, AILabel } from "../components/UI.jsx";
import { useChatMessages, useScrollToBottom } from "../hooks/useHospiti.js";
import { callAI, HOTEL_CONTEXT } from "../utils/helpers.js";
import { AI_ACTIONS } from "../data/mockData.js";

const INITIAL_MESSAGES = [
  { role: "bot", text: "Hello! I'm HospitiSense AI. I have full visibility into your hotel's current status. Ask me anything or use a Quick Action below." },
  { role: "user", text: "What should I fix first?" },
  { role: "bot", text: "Focus on Room 302 (AC broken — guest is very angry) and Room 305 (leaking faucet). Both are HIGH priority. The elevator complaints are also mounting — 3 guests in the last hour." },
];

const QUICK_ACTIONS = ["Generate Daily Summary", "Suggest Improvements", "Draft Response for elevator", "What's the worst department?"];

export default function AIAssistant({ apiKey }) {
  const { messages, loading, addMessage, setTyping } = useChatMessages(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const endRef = useScrollToBottom([messages]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    addMessage({ role: "user", text });
    setInput("");
    setTyping(true);
    try {
      const prompt = `${HOTEL_CONTEXT}\n\nUser question: ${text}`;
      const reply  = await callAI(apiKey, prompt);
      addMessage({ role: "bot", text: reply });
    } catch {
      addMessage({ role: "bot", text: "Sorry, I couldn't reach the AI engine. Please check your API key in Settings, or I'll work with my local knowledge." });
    }
    setTyping(false);
  };

  return (
    <div style={{ display: "flex", gap: 20, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>

      {/* ── Chat ── */}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "var(--accent-bg)", border: "1px solid var(--accent-glow)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>
            🤖
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>AI Assistant</div>
            <div style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>Online · Real-time hotel data</div>
          </div>
          <AILabel />
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              flexDirection: m.role === "user" ? "row-reverse" : "row",
              gap: 10, alignItems: "flex-end",
              animation: "fadeSlideIn 0.25s ease",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: m.role === "bot" ? "var(--accent-bg)" : "var(--bg-elevated)",
                border: `1px solid ${m.role === "bot" ? "var(--accent-glow)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              }}>
                {m.role === "bot" ? "💡" : "👤"}
              </div>
              <div style={{
                maxWidth: "72%",
                background: m.role === "user" ? "var(--bg-elevated)" : "var(--accent-bg)",
                border: `1px solid ${m.role === "user" ? "var(--border)" : "var(--accent-glow)"}`,
                borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                padding: "11px 15px",
                fontSize: 13, color: "var(--text-primary)", lineHeight: 1.65,
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-bg)", border: "1px solid var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💡</div>
              <div style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-glow)", borderRadius: "14px 14px 14px 4px", padding: "11px 16px", display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: `blink 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-mono)", letterSpacing: 1 }}>
            QUICK ACTIONS
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK_ACTIONS.map(a => (
              <button key={a} onClick={() => send(a)} style={{
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "7px 12px", fontSize: 12,
                color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.15s",
              }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="Ask about hotel operations, issues, or get suggestions…"
            style={{ flex: 1, padding: "11px 15px", borderRadius: 10, fontSize: 13 }}
          />
          <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{
            background: "var(--accent)", border: "none", borderRadius: 10,
            padding: "0 18px", color: "#000", fontSize: 16, fontWeight: 700,
            opacity: loading || !input.trim() ? 0.4 : 1,
          }}>
            ➤
          </button>
        </div>
      </Card>

      {/* ── AI Actions Log ── */}
      <div style={{ width: 250 }}>
        <Card style={{ height: "100%" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 16 }}>AI Actions Log</div>
          {AI_ACTIONS.map((a, i) => (
            <div key={i} style={{
              paddingBottom: 14, marginBottom: 14,
              borderBottom: i < AI_ACTIONS.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{a.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, fontFamily: "var(--font-mono)" }}>{a.time}</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: 12, background: "var(--bg-elevated)", borderRadius: 10, border: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
            💡 All AI suggestions are labeled and require human approval before action.
          </div>
        </Card>
      </div>
    </div>
  );
}
