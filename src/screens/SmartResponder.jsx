import { useState, useEffect } from "react";
import { Card, Button, AILabel, PriorityBadge } from "../components/UI.jsx";
import { useReviews } from "../context/ReviewsContext.jsx";
import { callAI, SENTIMENT_COLOR, PRIORITY_COLOR } from "../utils/helpers.js";

const EDITOR_TOOLBAR = ["B", "I", "U", "</>", "≡", "≣"];

export default function SmartResponder({ apiKey }) {
  const { reviews }                   = useReviews();
  const [selectedId,   setSelectedId] = useState(null);
  const [response,     setResponse]   = useState("");
  const [editing,      setEditing]    = useState(false);
  const [loading,      setLoading]    = useState(false);
  const [sent,         setSent]       = useState(false);
  const [filter,       setFilter]     = useState("All");

  // Auto-select first review on load
  useEffect(() => {
    if (!selectedId && reviews.length > 0) {
      setSelectedId(reviews[0].id);
    }
  }, [reviews]);

  const filteredReviews = filter === "All"
    ? reviews
    : reviews.filter(r => r.sentiment === filter);

  const selectedReview = reviews.find(r => r.id === selectedId) || reviews[0];

  const selectReview = (r) => {
    setSelectedId(r.id);
    setSent(false);
    setEditing(false);
    setResponse("Click Regenerate to generate a fresh AI response…");
  };

  const regenerate = async () => {
    if (!selectedReview) return;
    setLoading(true);
    setSent(false);
    try {
      const prompt = `You are a professional hotel manager writing an empathetic, sincere response to a guest review.
Review: "${selectedReview.text}"
Sentiment: ${selectedReview.sentiment}
Department: ${selectedReview.department}

Write a warm, professional 2-3 sentence response. Be specific to the complaint or compliment. Do not use robotic corporate language. Start with an empathetic acknowledgment.`;
      const reply = await callAI(apiKey, prompt);
      setResponse(reply);
    } catch {
      setResponse("We sincerely apologize for this experience and take your feedback very seriously. Our team has been immediately notified and will work to resolve this issue as quickly as possible. Thank you for helping us improve.");
    }
    setLoading(false);
  };

  const handleSend = () => {
    setSent(true);
    setEditing(false);
    setTimeout(() => setSent(false), 3000);
  };

  const dept = selectedReview?.department || "—";
  const sentimentColor = selectedReview
    ? (SENTIMENT_COLOR[selectedReview.sentiment] || "var(--text-muted)")
    : "var(--text-muted)";

  return (
    <div style={{ display: "flex", gap: 20, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>

      {/*  Left: Review Selector + Incoming  */}
      <div style={{ width: 340, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Review Picker */}
        <Card style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1.5 }}>
              SELECT REVIEW
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="live-dot" />
              <span style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                {reviews.length} live
              </span>
            </div>
          </div>

          {/* Sentiment filter tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {["All", "Negative", "Positive"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 11,
                fontWeight: filter === f ? 700 : 400,
                background: filter === f
                  ? f === "Negative" ? "#ef444420" : f === "Positive" ? "#22c55e20" : "var(--bg-elevated)"
                  : "transparent",
                color: filter === f
                  ? f === "Negative" ? "var(--danger)" : f === "Positive" ? "var(--accent)" : "var(--text-primary)"
                  : "var(--text-muted)",
                cursor: "pointer",
              }}>
                {f === "Negative" ? "😡" : f === "Positive" ? "😊" : "·"} {f}
              </button>
            ))}
          </div>

          {/* Scrollable review list */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {filteredReviews.length === 0 && (
              <div style={{ color: "var(--text-muted)", fontSize: 12, textAlign: "center", padding: 20 }}>
                No reviews yet
              </div>
            )}
            {filteredReviews.map(r => {
              const isSelected = r.id === selectedId;
              return (
                <button
                  key={r.id}
                  onClick={() => selectReview(r)}
                  style={{
                    width: "100%", display: "flex", gap: 10, alignItems: "center",
                    padding: "10px 12px", borderRadius: 8, border: "1px solid",
                    borderColor: isSelected ? "var(--accent-glow)" : "transparent",
                    background: isSelected ? "var(--accent-bg)" : "var(--bg-elevated)",
                    cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{r.emoji}</span>
                  <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, color: "var(--text-primary)",
                      fontWeight: isSelected ? 600 : 400,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      "{r.text}"
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                      {r.department} · {r.time}
                    </div>
                  </div>
                  <PriorityBadge level={r.priority} />
                </button>
              );
            })}
          </div>
        </Card>

        {/* Incoming Review Detail */}
        {selectedReview && (
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 14 }}>
              Incoming Review
            </div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-mono)", letterSpacing: 1 }}>
                NEW GUEST REVIEW
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6 }}>
                <span style={{ flexShrink: 0 }}>{selectedReview.emoji}</span>
                <span>"{selectedReview.text}"</span>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span style={{ fontSize: 12, color: sentimentColor, background: sentimentColor + "20", border: `1px solid ${sentimentColor}30`, borderRadius: 6, padding: "3px 10px" }}>
                {selectedReview.sentiment}
              </span>
              <span style={{ fontSize: 12, color: "var(--warn)", background: "var(--warn-bg)", border: "1px solid #f59e0b30", borderRadius: 6, padding: "3px 10px" }}>
                {dept}
              </span>
              <PriorityBadge level={selectedReview.priority} />
              {selectedReview.room && (
                <span style={{ fontSize: 12, color: "var(--text-secondary)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px" }}>
                  {selectedReview.room}
                </span>
              )}
            </div>
          </Card>
        )}
      </div>

      {/*  Right: AI Response  */}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>AI Suggested Response</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Review before sending</div>
          </div>
          <AILabel />
        </div>

        {/* Toolbar */}
        <div style={{ background: "var(--bg-elevated)", borderRadius: "8px 8px 0 0", padding: "8px 12px", display: "flex", gap: 6, borderBottom: "1px solid var(--border)" }}>
          {EDITOR_TOOLBAR.map(t => (
            <button key={t} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: 13, padding: "2px 6px", borderRadius: 4 }}>
              {t}
            </button>
          ))}
          {editing && <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>EDITING</span>}
        </div>

        {/* Response textarea */}
        <textarea
          value={loading ? "Generating AI response…" : (response || "Select a review and click Regenerate to draft an AI response.")}
          onChange={e => setResponse(e.target.value)}
          readOnly={!editing || loading}
          style={{
            flex: 1, width: "100%",
            background: loading ? "var(--bg-elevated)" : "var(--bg-input)",
            border: "1px solid var(--accent-glow)", borderTop: "none",
            borderRadius: "0 0 10px 10px",
            padding: 16, fontSize: 14, lineHeight: 1.75,
            color: loading ? "var(--text-muted)" : "var(--text-primary)",
            resize: "none", fontFamily: "var(--font-body)",
          }}
        />

        {sent && (
          <div style={{ marginTop: 10, padding: "10px 16px", borderRadius: 8, background: "var(--accent-bg)", border: "1px solid var(--accent-glow)", fontSize: 13, color: "var(--accent)", textAlign: "center", animation: "fadeSlideIn 0.2s ease" }}>
            ✓ Response sent to guest successfully
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <Button variant="ghost" onClick={regenerate} style={{ flex: 1 }} disabled={loading || !selectedReview}>
            {loading ? "Generating…" : "🔄 Regenerate"}
          </Button>
          <Button variant="secondary" onClick={() => setEditing(!editing)} style={{ flex: 1 }} disabled={!response || loading}>
            ✏️ {editing ? "Lock" : "Edit"}
          </Button>
          <Button variant="primary" onClick={handleSend} style={{ flex: 1.5 }} disabled={loading || !response}>
            ✓ Send Response
          </Button>
        </div>
      </Card>
    </div>
  );
}
