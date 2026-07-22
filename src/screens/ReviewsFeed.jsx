import { useState } from "react";
import { Card, LiveBadge, PriorityBadge } from "../components/UI.jsx";
import { useReviews } from "../context/ReviewsContext.jsx";
import { SENTIMENT_COLOR, PRIORITY_COLOR } from "../utils/helpers.js";

const FILTER_OPTS = {
  sentiment: ["All", "Positive", "Negative", "Neutral"],
  dept:      ["All", "Housekeeping", "F&B", "Front Desk", "Maintenance", "IT"],
  priority:  ["All", "HIGH", "MEDIUM", "LOW"],
};

export default function ReviewsFeed() {
  const { reviews } = useReviews();
  const [filter, setFilter]     = useState({ sentiment: "All", dept: "All", priority: "All" });
  const [expanded, setExpanded] = useState(null);

  const filtered = reviews.filter(r =>
    (filter.sentiment === "All" || r.sentiment === filter.sentiment) &&
    (filter.dept === "All"      || r.department === filter.dept) &&
    (filter.priority === "All"  || r.priority === filter.priority)
  );

  const counts = {
    positive: reviews.filter(r => r.sentiment === "Positive").length,
    negative: reviews.filter(r => r.sentiment === "Negative").length,
    high:     reviews.filter(r => r.priority === "HIGH").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>

      {/*  Stats Row  */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Positive Reviews", val: counts.positive, color: "var(--accent)" },
          { label: "Negative Reviews", val: counts.negative, color: "var(--danger)" },
          { label: "High Priority", val: counts.high, color: "var(--warn)" },
        ].map(s => (
          <Card key={s.label} style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
            <span style={{ fontSize: 30, fontWeight: 600, fontFamily: "var(--font-display)", color: s.color }}>{s.val}</span>
          </Card>
        ))}
      </div>

      {/*  Filters + Live Badge  */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {Object.entries(FILTER_OPTS).map(([key, opts]) => (
          <select
            key={key}
            value={filter[key]}
            onChange={e => setFilter(p => ({ ...p, [key]: e.target.value }))}
          >
            {opts.map(o => (
              <option key={o} value={o}>
                {o === "All" ? { sentiment: "Sentiment", dept: "Department", priority: "Priority" }[key] : o}
              </option>
            ))}
          </select>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <LiveBadge label={`${filtered.length} reviews`} />
        </div>
      </div>

      {/*  Feed  */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(r => {
          const isOpen = expanded === r.id;
          return (
            <Card
              key={r.id}
              onClick={() => setExpanded(isOpen ? null : r.id)}
              style={{
                cursor: "pointer",
                borderColor: isOpen ? "var(--accent-glow)" : "var(--border)",
                transition: "all 0.2s",
                background: isOpen ? "#0c1f12" : "var(--bg-card)",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{r.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1.5 }}>
                      [NEW REVIEW]
                    </span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.time}</span>
                      <PriorityBadge level={r.priority} />
                    </div>
                  </div>
                  <div style={{ color: "var(--text-primary)", fontSize: 14, lineHeight: 1.6 }}>
                    "{r.text}"
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{
                  marginTop: 14, paddingTop: 14,
                  borderTop: "1px solid var(--border)",
                  display: "flex", gap: 24, flexWrap: "wrap",
                  animation: "fadeSlideIn 0.2s ease",
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 3 }}>SENTIMENT</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: SENTIMENT_COLOR[r.sentiment] }}>→ {r.sentiment}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 3 }}>DEPARTMENT</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--warn)" }}>→ {r.department}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 3 }}>PRIORITY</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: PRIORITY_COLOR[r.priority] }}>→ {r.priority}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 3 }}>ROOM</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>→ {r.room}</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
