import { useState } from "react";
import { Card } from "../components/UI.jsx";
import { MiniLineChart, BarChart, DualBarChart } from "../components/Charts.jsx";
import { useTrendData } from "../hooks/useHospiti.js";
import { generateBarData } from "../utils/helpers.js";

const DUAL_GROUPS = [
  { v1: 72, v2: 50, label: "F&B" },
  { v1: 62, v2: 35, label: "H.K." },
  { v1: 90, v2: 32, label: "F.D." },
  { v1: 58, v2: 78, label: "Maint" },
];

export default function Reports() {
  const weekData   = useTrendData(14, 60, 20);
  const [barData]  = useState(() => generateBarData(10, 65, 22));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>

      {/*  Export Row  */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {["Export PDF", "Export CSV", "Share Report"].map(label => (
          <button key={label} style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "8px 18px", color: "var(--text-primary)",
            fontSize: 13, fontWeight: 600,
          }}>
            {label}
          </button>
        ))}
      </div>

      {/*  Chart Row  */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

        {/* Daily Summary */}
        <Card>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1.5, marginBottom: 6 }}>DAILY SUMMARY</div>
          <div style={{ fontWeight: 600, fontSize: 20, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 14 }}>Today's Reviews</div>
          <BarChart data={barData} color="var(--accent)" height={130} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            <span>1am</span><span>6pm</span><span>9pm</span>
          </div>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1.5, marginBottom: 6 }}>WEEKLY TRENDS</div>
          <div style={{ fontWeight: 600, fontSize: 20, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 14 }}>7-Day Happiness</div>
          <MiniLineChart data={weekData} color="var(--warn)" height={130} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
          </div>
        </Card>

        {/* Dept Performance */}
        <Card>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1.5, marginBottom: 6 }}>DEPT PERFORMANCE</div>
          <div style={{ fontWeight: 600, fontSize: 20, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 14 }}>This Week vs Last Week</div>
          <DualBarChart groups={DUAL_GROUPS} colorA="var(--danger)" colorB="var(--accent)" height={130} />
          <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "center" }}>
            {[["var(--danger)", "This week"], ["var(--accent)", "Last week"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "var(--text-muted)" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} /> {l}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/*  Summary Table  */}
      <Card style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 16, fontFamily: "var(--font-display)" }}>
          Department Performance Summary
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Department", "Score", "Reviews", "Issues", "Response Time", "Trend"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 14px", fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1.5, borderBottom: "1px solid var(--border)", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { dept: "Housekeeping", score: 4.2, reviews: 31, issues: 4, rt: "12 min", trend: "↓", tc: "var(--danger)" },
              { dept: "Front Desk",   score: 4.8, reviews: 18, issues: 1, rt: "5 min",  trend: "↑", tc: "var(--accent)" },
              { dept: "Maintenance",  score: 3.9, reviews: 22, issues: 6, rt: "28 min", trend: "↓", tc: "var(--danger)" },
              { dept: "F&B",          score: 4.5, reviews: 27, issues: 2, rt: "9 min",  trend: "→", tc: "var(--warn)" },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "11px 14px", fontSize: 13, color: "var(--text-primary)", fontWeight: 600 }}>{row.dept}</td>
                <td style={{ padding: "11px 14px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{row.score}</td>
                <td style={{ padding: "11px 14px", fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{row.reviews}</td>
                <td style={{ padding: "11px 14px", fontSize: 13, color: row.issues > 3 ? "var(--danger)" : "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{row.issues}</td>
                <td style={{ padding: "11px 14px", fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{row.rt}</td>
                <td style={{ padding: "11px 14px", fontSize: 16, color: row.tc, fontWeight: 700 }}>{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
