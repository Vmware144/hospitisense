import { Card, LiveBadge, AlertRow, AILabel } from "../components/UI.jsx";
import { MiniLineChart } from "../components/Charts.jsx";
import { useLiveScore, useTrendData } from "../hooks/useHospiti.js";
import { LIVE_ALERTS, DEPT_SCORECARDS } from "../data/mockData.js";

export default function Dashboard() {
  const { score, pulsing } = useLiveScore(78);
  const trendData = useTrendData(28, 66, 14);

  return (
    <div style={{ display: "flex", gap: 20, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>

      {/*  Left Column  */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Happiness Score */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase" }}>
                Guest Happiness Score
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
                <span style={{
                  fontSize: 60, fontWeight: 600, color: "var(--text-primary)",
                  fontFamily: "var(--font-display)", lineHeight: 1,
                  transition: "all 0.4s",
                  filter: pulsing ? "drop-shadow(0 0 16px var(--accent))" : "none",
                }}>
                  {score}
                </span>
                <span style={{ fontSize: 22, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>/100</span>
              </div>
              <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, marginTop: 2, fontFamily: "var(--font-mono)" }}>
                ↑ +5 today
              </div>
            </div>
            <LiveBadge />
          </div>
          <MiniLineChart data={trendData} color="var(--accent)" height={96} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            <span>1am</span><span>6am</span><span>12pm</span><span>6pm</span><span>9pm</span>
          </div>
        </Card>

        {/* AI Daily Brief */}
        <Card style={{ borderColor: "var(--accent-glow)", background: "linear-gradient(135deg, var(--bg-card) 0%, var(--accent-bg) 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "var(--accent-bg)", border: "1px solid var(--accent-glow)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
            }}>
              💡
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>AI Daily Brief</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Updated just now</div>
            </div>
            <AILabel />
          </div>
          {[
            "3 guests complained about slow elevators — contact Maintenance",
            "2 urgent issues flagged in Room 302 & 305 requiring immediate action",
            "Housekeeping score dropped 0.3 pts today — check staffing levels",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: "var(--accent)", fontSize: 14, marginTop: 1, flexShrink: 0 }}>–</span>
              <span style={{ color: "var(--text-primary)", fontSize: 13, lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </Card>

        {/* Dept Scorecards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {DEPT_SCORECARDS.map(d => (
            <Card key={d.name} style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}>
                {d.name}
              </div>
              <div style={{ fontSize: 40, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)", display: "flex", alignItems: "baseline", gap: 6 }}>
                {d.score}
                <span style={{ fontSize: 20, color: d.color }}>{d.trend}</span>
              </div>
              <div style={{
                marginTop: 8, height: 3, borderRadius: 2,
                background: `linear-gradient(to right, ${d.color}55, ${d.color})`,
                width: `${(d.score / 5) * 100}%`,
              }} />
            </Card>
          ))}
        </div>
      </div>

      {/*  Right Panel: Live Alerts  */}
      <div style={{ width: 250 }}>
        <Card style={{ height: "100%" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
            <span>Live Alerts</span>
            <div className="live-dot" style={{ marginLeft: "auto" }} />
          </div>
          {LIVE_ALERTS.map((a, i) => (
            <AlertRow key={i} {...a} />
          ))}
          <div style={{ marginTop: 16, padding: "12px", background: "var(--bg-elevated)", borderRadius: 10, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>QUICK STATS</div>
            {[["Total Reviews Today", "24"], ["Avg Response Time", "8 min"], ["Issues Resolved", "11/14"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
