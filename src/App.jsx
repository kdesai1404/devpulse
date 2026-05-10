import { useState, useEffect, useRef } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell, ReferenceLine
} from "recharts";

// ── DATA ─────────────────────────────────────────────────────────────────────
const DEVELOPERS = {
  "DEV-001": { name: "Arjun Sharma",  manager: "Rina Kapoor",  team: "Payments API",   type: "backend",  level: "SDE2" },
  "DEV-002": { name: "Neha Patel",    manager: "Rina Kapoor",  team: "Payments API",   type: "backend",  level: "SDE1" },
  "DEV-006": { name: "Ishan Mehta",   manager: "Rina Kapoor",  team: "Payments API",   type: "backend",  level: "SDE3" },
  "DEV-003": { name: "Meera Iyer",    manager: "Samir Gupta",  team: "Checkout Web",   type: "frontend", level: "SDE1" },
  "DEV-004": { name: "Lakshay Rawat", manager: "Samir Gupta",  team: "Checkout Web",   type: "frontend", level: "SDE2" },
  "DEV-008": { name: "Zara Khan",     manager: "Samir Gupta",  team: "Checkout Web",   type: "frontend", level: "SDE1" },
  "DEV-005": { name: "Eesha Roy",     manager: "Priya Nair",   team: "Mobile Growth",  type: "mobile",   level: "SDE1" },
  "DEV-007": { name: "Om Bhatia",     manager: "Priya Nair",   team: "Mobile Growth",  type: "mobile",   level: "SDE2" },
};

const METRICS = {
  "DEV-001": {
    "2026-01": { cycle_time: 5.2, pr_throughput: 2, lead_time: 3.8, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-02": { cycle_time: 4.7, pr_throughput: 2, lead_time: 3.1, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
    "2026-03": { cycle_time: 4.0, pr_throughput: 2, lead_time: 2.4, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
    "2026-04": { cycle_time: 3.9, pr_throughput: 3, lead_time: 2.2, deployment_frequency: 3, bug_rate: 0.0, bug_count: 0, issues_completed: 3 },
  },
  "DEV-002": {
    "2026-01": { cycle_time: 7.1, pr_throughput: 1, lead_time: 5.5, deployment_frequency: 1, bug_rate: 1.0, bug_count: 1, issues_completed: 1 },
    "2026-02": { cycle_time: 6.5, pr_throughput: 2, lead_time: 4.8, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-03": { cycle_time: 5.9, pr_throughput: 2, lead_time: 4.3, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
    "2026-04": { cycle_time: 5.4, pr_throughput: 2, lead_time: 3.8, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
  },
  "DEV-006": {
    "2026-01": { cycle_time: 4.1, pr_throughput: 3, lead_time: 2.8, deployment_frequency: 3, bug_rate: 0.0, bug_count: 0, issues_completed: 3 },
    "2026-02": { cycle_time: 3.9, pr_throughput: 3, lead_time: 2.5, deployment_frequency: 3, bug_rate: 0.0, bug_count: 0, issues_completed: 3 },
    "2026-03": { cycle_time: 3.8, pr_throughput: 2, lead_time: 2.3, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
    "2026-04": { cycle_time: 3.7, pr_throughput: 3, lead_time: 2.4, deployment_frequency: 3, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
  },
  "DEV-003": {
    "2026-01": { cycle_time: 5.0, pr_throughput: 2, lead_time: 4.5, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-02": { cycle_time: 4.6, pr_throughput: 2, lead_time: 4.2, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-03": { cycle_time: 4.0, pr_throughput: 2, lead_time: 3.8, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-04": { cycle_time: 3.0, pr_throughput: 2, lead_time: 3.6, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
  },
  "DEV-004": {
    "2026-01": { cycle_time: 4.5, pr_throughput: 2, lead_time: 3.0, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
    "2026-02": { cycle_time: 4.2, pr_throughput: 2, lead_time: 2.7, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
    "2026-03": { cycle_time: 3.8, pr_throughput: 2, lead_time: 2.1, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
    "2026-04": { cycle_time: 3.6, pr_throughput: 3, lead_time: 2.9, deployment_frequency: 3, bug_rate: 0.0, bug_count: 0, issues_completed: 3 },
  },
  "DEV-008": {
    "2026-01": { cycle_time: 4.9, pr_throughput: 2, lead_time: 4.0, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-02": { cycle_time: 4.5, pr_throughput: 2, lead_time: 3.7, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
    "2026-03": { cycle_time: 3.8, pr_throughput: 2, lead_time: 3.2, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
    "2026-04": { cycle_time: 3.8, pr_throughput: 2, lead_time: 3.4, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
  },
  "DEV-005": {
    "2026-01": { cycle_time: 7.8, pr_throughput: 1, lead_time: 6.2, deployment_frequency: 1, bug_rate: 1.0, bug_count: 1, issues_completed: 1 },
    "2026-02": { cycle_time: 7.0, pr_throughput: 2, lead_time: 5.8, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-03": { cycle_time: 5.9, pr_throughput: 2, lead_time: 5.0, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-04": { cycle_time: 6.5, pr_throughput: 2, lead_time: 4.7, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
  },
  "DEV-007": {
    "2026-01": { cycle_time: 5.5, pr_throughput: 2, lead_time: 5.2, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-02": { cycle_time: 5.2, pr_throughput: 2, lead_time: 4.8, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-03": { cycle_time: 4.6, pr_throughput: 2, lead_time: 4.3, deployment_frequency: 2, bug_rate: 0.5, bug_count: 1, issues_completed: 2 },
    "2026-04": { cycle_time: 4.8, pr_throughput: 2, lead_time: 3.6, deployment_frequency: 2, bug_rate: 0.0, bug_count: 0, issues_completed: 2 },
  },
};

const MONTHS = ["2026-01", "2026-02", "2026-03", "2026-04"];
const MONTH_LABELS = { "2026-01": "Jan", "2026-02": "Feb", "2026-03": "Mar", "2026-04": "Apr" };
const MONTH_FULL = { "2026-01": "Jan 2026", "2026-02": "Feb 2026", "2026-03": "Mar 2026", "2026-04": "Apr 2026" };

const TYPE_COLOR = { backend: "#4f8ef7", frontend: "#a78bfa", mobile: "#34d399" };

// ── INTERPRETATION ENGINE ─────────────────────────────────────────────────────
function interpret(devId, month) {
  const m = METRICS[devId][month];
  const allMonths = MONTHS.filter(mo => mo <= month);
  const prev = allMonths.length > 1 ? METRICS[devId][allMonths[allMonths.length - 2]] : null;
  const insights = [];
  const actions = [];

  if (m.cycle_time > 5.5) {
    insights.push({ icon: "⏳", color: "#f97316", text: `Cycle time of ${m.cycle_time}d is elevated — work items take long from start to done. This often means large scope, blockers, or context-switching.` });
    actions.push({ priority: "high", label: "Break down large issues", detail: "Aim for issues completable in 1–3 days. Smaller batches reduce cycle time and make progress visible to reviewers sooner." });
  } else if (m.cycle_time < 4.0) {
    insights.push({ icon: "⚡", color: "#22c55e", text: `Cycle time of ${m.cycle_time}d is strong — issues move quickly from start to done. You're executing at a healthy pace.` });
  } else {
    insights.push({ icon: "📋", color: "#94a3b8", text: `Cycle time of ${m.cycle_time}d is on par with the team average. There's room to push this slightly lower.` });
  }

  if (m.lead_time > 4.0) {
    insights.push({ icon: "🚢", color: "#f97316", text: `Lead time of ${m.lead_time}d suggests a slow path from PR open to production. Review wait time or CI pipeline may be the bottleneck.` });
    actions.push({ priority: "medium", label: "Reduce PR review wait time", detail: "Tag reviewers earlier or request reviews proactively. Aim to merge within 2 days of opening. Smaller PRs also attract faster reviews." });
  } else if (m.lead_time <= 2.5) {
    insights.push({ icon: "🚀", color: "#22c55e", text: `Lead time of ${m.lead_time}d is excellent — code reaches production very quickly after opening.` });
  } else {
    insights.push({ icon: "🚀", color: "#22c55e", text: `Lead time of ${m.lead_time}d — code reaches production reasonably quickly after merging.` });
  }

  if (m.bug_rate > 0.3) {
    insights.push({ icon: "🐛", color: "#ef4444", text: `Bug rate of ${(m.bug_rate * 100).toFixed(0)}% — ${m.bug_count} escaped bug${m.bug_count > 1 ? "s" : ""} out of ${m.issues_completed} completed issues. Production escapes need attention.` });
    actions.push({ priority: "high", label: "Increase test coverage on edge cases", detail: "Review the root cause of escaped bugs. Add regression tests and consider a pre-merge checklist. Pair with a senior for a code-quality session." });
  } else {
    insights.push({ icon: "✅", color: "#22c55e", text: "Zero production bugs this month — quality discipline is working well. Keep this standard." });
  }

  if (m.pr_throughput >= 3) {
    insights.push({ icon: "🔁", color: "#6366f1", text: `${m.pr_throughput} PRs merged this month — high output. Ensure PR size stays small so reviewers can keep up.` });
  }

  if (prev) {
    const cycleImproved = m.cycle_time < prev.cycle_time;
    const leadImproved  = m.lead_time  < prev.lead_time;
    if (cycleImproved && leadImproved) {
      insights.push({ icon: "📈", color: "#6366f1", text: "Both cycle time and lead time improved from last month — delivery is trending in the right direction." });
    } else if (!cycleImproved && !leadImproved) {
      insights.push({ icon: "📉", color: "#f97316", text: "Both cycle time and lead time worsened from last month. A short personal retro might surface what changed." });
      actions.push({ priority: "medium", label: "Run a brief personal retro", detail: "Ask: What slowed you down this month that didn't last month? One root cause is often enough to fix. Time-box it to 20 minutes." });
    }
  }

  if (actions.length === 0) {
    actions.push({ priority: "low", label: "Keep the momentum", detail: "Metrics look solid. Consider helping teammates, writing docs, or reviewing team bottlenecks to level up impact beyond your own tickets." });
  }

  return { insights, actions };
}

// ── SCORE ─────────────────────────────────────────────────────────────────────
function healthScore(m) {
  let score = 100;
  if (m.cycle_time > 5.5) score -= 20;
  else if (m.cycle_time > 4.5) score -= 10;
  if (m.lead_time > 4.0) score -= 20;
  else if (m.lead_time > 3.0) score -= 8;
  if (m.bug_rate > 0.3) score -= 25;
  return Math.max(0, Math.min(100, score));
}
function scoreColor(s) { return s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444"; }
function scoreLabel(s) { return s >= 80 ? "Healthy" : s >= 60 ? "Watch" : "At Risk"; }

// ── RADAR DATA ────────────────────────────────────────────────────────────────
function radarData(devId, month) {
  const m = METRICS[devId][month];
  return [
    { metric: "Cycle Time",  value: Math.round(Math.max(0, 100 - ((m.cycle_time - 2) / 6) * 100)) },
    { metric: "Lead Time",   value: Math.round(Math.max(0, 100 - ((m.lead_time  - 1) / 6) * 100)) },
    { metric: "Quality",     value: Math.round(Math.max(0, 100 - (m.bug_rate * 200))) },
    { metric: "PR Output",   value: Math.min(100, Math.round((m.pr_throughput / 4) * 100)) },
    { metric: "Deploy Freq", value: Math.min(100, Math.round((m.deployment_frequency / 4) * 100)) },
  ];
}

// ── TREND DATA ────────────────────────────────────────────────────────────────
function trendData(devId) {
  return MONTHS.map(m => ({
    month: MONTH_LABELS[m],
    "Cycle Time": METRICS[devId][m].cycle_time,
    "Lead Time":  METRICS[devId][m].lead_time,
    "Bug Rate %": Math.round(METRICS[devId][m].bug_rate * 100),
  }));
}

// ── TEAM COMPARISON ───────────────────────────────────────────────────────────
function teamComparison(devId, month) {
  const dev = DEVELOPERS[devId];
  const teamIds = Object.entries(DEVELOPERS)
    .filter(([id, d]) => d.team === dev.team)
    .map(([id]) => id);

  const avg = (key) => {
    const vals = teamIds.map(id => METRICS[id][month][key]);
    return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
  };

  const me = METRICS[devId][month];
  return [
    { label: "Cycle Time", me: me.cycle_time, team: avg("cycle_time"), unit: "d", lowerBetter: true },
    { label: "Lead Time",  me: me.lead_time,  team: avg("lead_time"),  unit: "d", lowerBetter: true },
    { label: "Bug Rate",   me: parseFloat((me.bug_rate * 100).toFixed(0)), team: parseFloat((avg("bug_rate") * 100).toFixed(0)), unit: "%", lowerBetter: true },
    { label: "PR Output",  me: me.pr_throughput, team: avg("pr_throughput"), unit: " PRs", lowerBetter: false },
    { label: "Deploys",    me: me.deployment_frequency, team: avg("deployment_frequency"), unit: "", lowerBetter: false },
  ];
}

// ── MANAGER ROWS ──────────────────────────────────────────────────────────────
function managerRows(month) {
  return Object.entries(DEVELOPERS).map(([id, dev]) => {
    const m = METRICS[id][month];
    const score = healthScore(m);
    const prev = METRICS[id]["2026-03"];
    const trend = score - healthScore(prev);
    return { id, dev, m, score, trend };
  }).sort((a, b) => a.score - b.score);
}

// ── AI INSIGHT CALL ───────────────────────────────────────────────────────────
async function fetchAIInsight(devId, month) {
  const dev = DEVELOPERS[devId];
  const m = METRICS[devId][month];
  const prev = METRICS[devId]["2026-03"];
  const score = healthScore(m);
  const monthLabel = MONTH_FULL[month];

  const prompt = `You are a developer productivity coach. A ${dev.level} ${dev.type} engineer named ${dev.name} on the ${dev.team} team has the following metrics for ${monthLabel}:

- Cycle Time: ${m.cycle_time} days (time from issue start to done)
- Lead Time: ${m.lead_time} days (time from PR opened to production)
- Bug Rate: ${(m.bug_rate * 100).toFixed(0)}% (${m.bug_count} escaped bugs out of ${m.issues_completed} completed issues)
- Deployment Frequency: ${m.deployment_frequency} deploys this month
- PR Throughput: ${m.pr_throughput} merged PRs this month
- Overall Health Score: ${score}/100 (${scoreLabel(score)})

Previous month comparison: Cycle time was ${prev.cycle_time}d, Lead time was ${prev.lead_time}d.

Give a 3-paragraph coaching insight:
1. What the data pattern most likely reveals about this developer's working style or context (be specific to their level and type)
2. The single most important thing they should focus on to improve, with a concrete actionable technique
3. A positive observation about something they are clearly doing well

Keep it encouraging, practical, and under 200 words total. Speak directly to the developer as "you". Do not use bullet points.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error("API request failed");
  const data = await response.json();
  return data.content.map(b => b.text || "").join("").trim();
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c12;
    --surface: #111420;
    --surface2: #181d2e;
    --surface3: #1e2438;
    --border: #232840;
    --accent: #4f8ef7;
    --accent2: #a78bfa;
    --accent3: #34d399;
    --text: #e2e8f0;
    --muted: #5a6480;
    --muted2: #8892b0;
    --green: #22c55e;
    --red: #ef4444;
    --orange: #f97316;
    --yellow: #f59e0b;
    --mono: 'Space Mono', monospace;
    --sans: 'DM Sans', sans-serif;
    --radius: 14px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    padding: 14px 32px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 20px;
    background: rgba(17,20,32,0.95);
    backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 100;
  }
  .nav-logo {
    font-family: var(--mono); font-size: 15px; font-weight: 700;
    color: var(--accent); letter-spacing: -0.5px;
    display: flex; align-items: center; gap: 8px;
  }
  .nav-logo-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
    box-shadow: 0 0 8px var(--accent); animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
  .nav-logo span { color: var(--accent2); }
  .nav-tagline { font-size: 11px; color: var(--muted); font-family: var(--mono); letter-spacing: 0.3px; }
  .nav-tabs { display: flex; gap: 4px; margin-left: auto; }
  .nav-tab {
    padding: 7px 18px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: 1px solid transparent; background: transparent;
    color: var(--muted2); font-family: var(--sans); transition: all 0.2s;
  }
  .nav-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .nav-tab:hover:not(.active) { color: var(--text); background: var(--surface2); border-color: var(--border); }

  /* LAYOUT */
  .container { max-width: 1280px; margin: 0 auto; padding: 28px 32px; width: 100%; }

  /* SELECTORS */
  .select-row { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
  .select-label { font-size: 10px; font-family: var(--mono); color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; min-width: 80px; }
  .select-pill {
    padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface); color: var(--muted2); font-size: 12px;
    cursor: pointer; font-family: var(--sans); font-weight: 500; transition: all 0.15s;
  }
  .select-pill.active { border-color: var(--accent); color: var(--accent); background: rgba(79,142,247,0.1); }
  .select-pill:hover:not(.active) { border-color: var(--muted2); color: var(--text); }

  /* METRIC GRID */
  .metric-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
  @media (max-width: 900px) { .metric-grid { grid-template-columns: repeat(3, 1fr); } }
  .metric-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 16px 14px; display: flex; flex-direction: column; gap: 6px;
    transition: all 0.2s; position: relative; overflow: hidden;
  }
  .metric-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--card-accent, var(--border)); transition: opacity 0.2s;
  }
  .metric-card:hover { border-color: var(--muted); transform: translateY(-1px); }
  .metric-name { font-size: 10px; font-family: var(--mono); color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .metric-value { font-size: 28px; font-family: var(--mono); font-weight: 700; line-height: 1; }
  .metric-unit { font-size: 10px; color: var(--muted); }
  .metric-delta { font-size: 10px; font-family: var(--mono); margin-top: 2px; }

  /* MAIN GRID */
  .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  @media (max-width: 860px) { .main-grid { grid-template-columns: 1fr; } }

  /* PANEL */
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .panel-title { font-size: 10px; font-family: var(--mono); color: var(--muted); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 16px; }

  /* SCORE */
  .score-row { display: flex; align-items: center; gap: 18px; margin-bottom: 20px; }
  .score-ring { position: relative; width: 76px; height: 76px; flex-shrink: 0; }
  .score-ring svg { position: absolute; top: 0; left: 0; transform: rotate(-90deg); }
  .score-ring-inner {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .score-num { font-family: var(--mono); font-size: 20px; font-weight: 700; line-height: 1; }
  .score-lbl { font-size: 9px; font-family: var(--mono); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  .dev-name { font-size: 21px; font-weight: 600; letter-spacing: -0.3px; }
  .dev-meta { font-size: 12px; color: var(--muted2); margin-top: 3px; }
  .type-badge {
    display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px;
    border-radius: 10px; font-size: 10px; font-family: var(--mono); font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid;
    margin-top: 4px;
  }

  /* INSIGHTS */
  .insight-list { display: flex; flex-direction: column; gap: 8px; }
  .insight-item {
    display: flex; gap: 10px; align-items: flex-start;
    padding: 10px 12px; border-radius: 8px; background: var(--surface2);
    border-left: 3px solid; font-size: 12.5px; line-height: 1.55;
  }
  .insight-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }

  /* ACTIONS */
  .action-list { display: flex; flex-direction: column; gap: 8px; }
  .action-item { border-radius: 10px; overflow: hidden; border: 1px solid var(--border); }
  .action-header {
    display: flex; align-items: center; gap: 8px; padding: 10px 14px;
    background: var(--surface2); cursor: pointer; transition: background 0.15s;
  }
  .action-header:hover { background: var(--surface3); }
  .action-priority {
    font-size: 9px; font-family: var(--mono); text-transform: uppercase;
    padding: 2px 7px; border-radius: 10px; font-weight: 700; letter-spacing: 0.3px;
  }
  .priority-high   { background: rgba(239,68,68,0.15);  color: #ef4444; }
  .priority-medium { background: rgba(249,115,22,0.15); color: #f97316; }
  .priority-low    { background: rgba(34,197,94,0.15);  color: #22c55e; }
  .action-label { font-size: 13px; font-weight: 500; }
  .action-detail { font-size: 12px; color: var(--muted2); padding: 10px 14px 12px; background: var(--surface); line-height: 1.6; }

  /* AI INSIGHT PANEL */
  .ai-panel {
    border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden; transition: all 0.3s;
  }
  .ai-panel.active { border-color: rgba(167,139,250,0.4); }
  .ai-btn {
    width: 100%; padding: 12px 18px; background: var(--surface2);
    border: none; cursor: pointer; font-family: var(--sans); font-size: 13px;
    font-weight: 500; color: var(--text); display: flex; align-items: center; gap: 10px;
    transition: background 0.2s;
  }
  .ai-btn:hover { background: var(--surface3); }
  .ai-btn .ai-icon { font-size: 16px; }
  .ai-btn .ai-label { flex: 1; text-align: left; }
  .ai-btn .ai-tag {
    font-size: 9px; font-family: var(--mono); padding: 2px 8px; border-radius: 10px;
    background: rgba(167,139,250,0.15); color: var(--accent2); border: 1px solid rgba(167,139,250,0.3);
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .ai-content { padding: 16px 18px; background: var(--surface); font-size: 13px; line-height: 1.7; color: var(--muted2); }
  .ai-content p { margin-bottom: 10px; }
  .ai-content p:last-child { margin-bottom: 0; }
  .ai-loading { display: flex; align-items: center; gap: 10px; padding: 16px 18px; color: var(--muted); font-size: 12px; font-family: var(--mono); }
  .ai-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); animation: blink 1.2s ease-in-out infinite; }
  .ai-dot:nth-child(2) { animation-delay: 0.2s; }
  .ai-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,100%{opacity:0.2} 50%{opacity:1} }

  /* TEAM COMPARISON */
  .compare-row { display: flex; flex-direction: column; gap: 10px; }
  .compare-item { display: flex; flex-direction: column; gap: 4px; }
  .compare-label-row { display: flex; justify-content: space-between; align-items: center; }
  .compare-label { font-size: 11px; font-family: var(--mono); color: var(--muted); text-transform: uppercase; letter-spacing: 0.3px; }
  .compare-vals { font-size: 11px; font-family: var(--mono); color: var(--muted2); display: flex; gap: 10px; }
  .compare-val-me { color: var(--accent); }
  .compare-bar-bg { height: 6px; border-radius: 3px; background: var(--surface2); position: relative; overflow: visible; }
  .compare-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
  .compare-team-mark { position: absolute; top: -3px; width: 2px; height: 12px; border-radius: 1px; background: var(--muted); }

  /* GOAL TRACKER */
  .goal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .goal-card { background: var(--surface2); border-radius: 10px; padding: 14px; }
  .goal-card-label { font-size: 10px; font-family: var(--mono); color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .goal-progress-row { display: flex; align-items: center; gap: 10px; }
  .goal-bar-wrap { flex: 1; height: 8px; background: var(--surface3); border-radius: 4px; overflow: hidden; }
  .goal-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
  .goal-pct { font-size: 11px; font-family: var(--mono); }
  .goal-numbers { display: flex; justify-content: space-between; font-size: 10px; font-family: var(--mono); color: var(--muted); margin-top: 4px; }
  .goal-input-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
  .goal-input {
    flex: 1; background: var(--surface3); border: 1px solid var(--border);
    border-radius: 6px; padding: 5px 10px; font-size: 12px; font-family: var(--mono);
    color: var(--text); outline: none;
  }
  .goal-input:focus { border-color: var(--accent); }
  .goal-set-btn {
    padding: 5px 12px; background: var(--accent); border: none; border-radius: 6px;
    font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; font-family: var(--sans);
    transition: opacity 0.15s;
  }
  .goal-set-btn:hover { opacity: 0.85; }

  /* MANAGER TABLE */
  .manager-header { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
  .manager-title { font-size: 19px; font-weight: 600; letter-spacing: -0.3px; }
  .manager-table { width: 100%; border-collapse: collapse; }
  .manager-table th {
    text-align: left; font-size: 10px; font-family: var(--mono); color: var(--muted);
    text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 12px;
    border-bottom: 1px solid var(--border);
  }
  .manager-table td { padding: 11px 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .manager-table tr:hover td { background: var(--surface2); }
  .manager-table tr:last-child td { border-bottom: none; }
  .badge {
    display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 10px;
    font-size: 10px; font-family: var(--mono); font-weight: 700;
  }
  .badge-healthy { background: rgba(34,197,94,0.12);  color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
  .badge-watch   { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
  .badge-risk    { background: rgba(239,68,68,0.12);  color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
  .trend-arrow { font-size: 13px; margin-left: 4px; }
  .team-chip {
    display: inline-flex; padding: 2px 8px; border-radius: 10px; font-size: 10px;
    font-family: var(--mono); background: var(--surface2); color: var(--muted2);
    border: 1px solid var(--border);
  }

  /* RECHARTS OVERRIDES */
  .recharts-polar-grid-concentric-polygon { stroke: var(--border) !important; }
  .recharts-polar-angle-axis-tick text { fill: var(--muted) !important; font-size: 10px; font-family: 'Space Mono'; }
  .recharts-cartesian-axis-tick text { fill: var(--muted) !important; font-family: 'Space Mono'; font-size: 10px; }
  .recharts-tooltip-wrapper { outline: none !important; }
  .recharts-legend-item-text { color: var(--muted) !important; font-family: 'Space Mono'; font-size: 11px; }

  /* TOOLTIP */
  .custom-tooltip {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 14px; font-family: var(--mono); font-size: 11px;
  }
  .custom-tooltip .label { color: var(--muted); margin-bottom: 4px; }

  /* SECTION DIVIDER */
  .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  @media (max-width: 860px) { .section-grid { grid-template-columns: 1fr; } }

  /* ANIMATION */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.28s ease forwards; }

  /* SPARKLINE container in manager table */
  .sparkline-wrap { display: flex; align-items: center; gap: 2px; height: 24px; }
  .spark-bar { width: 5px; border-radius: 2px; transition: height 0.3s; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

// ── CUSTOM TOOLTIP ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginTop: 2 }}>
          {p.name}: {typeof p.value === "number" && p.name.includes("%") ? p.value + "%" : p.value + (p.name.includes("Time") ? "d" : "")}
        </div>
      ))}
    </div>
  );
};

// ── SCORE RING ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const color = scoreColor(score);
  const label = scoreLabel(score);
  const r = 32, cx = 38, cy = 38, strokeW = 5;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="score-ring">
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface2)" strokeWidth={strokeW} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeW}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      </svg>
      <div className="score-ring-inner">
        <span className="score-num" style={{ color }}>{score}</span>
        <span className="score-lbl" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

// ── AI INSIGHT PANEL ──────────────────────────────────────────────────────────
function AIInsightPanel({ devId, month }) {
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [text, setText] = useState("");
  const cacheRef = useRef({});
  const key = `${devId}-${month}`;

  useEffect(() => { setState("idle"); setText(""); }, [devId, month]);

  async function handleClick() {
    if (state === "loading") return;
    if (cacheRef.current[key]) { setText(cacheRef.current[key]); setState("done"); return; }
    setState("loading");
    try {
      const result = await fetchAIInsight(devId, month);
      cacheRef.current[key] = result;
      setText(result);
      setState("done");
    } catch {
      setState("error");
    }
  }

  const paragraphs = text.split(/\n+/).filter(Boolean);

  return (
    <div className={`ai-panel ${state === "done" ? "active" : ""}`}>
      <button className="ai-btn" onClick={handleClick}>
        <span className="ai-icon">✦</span>
        <span className="ai-label">
          {state === "idle" ? "Get AI coaching insight for this developer" :
           state === "loading" ? "Generating insight…" :
           state === "done" ? "AI coaching insight" : "Retry AI insight"}
        </span>
        <span className="ai-tag">Claude AI</span>
      </button>
      {state === "loading" && (
        <div className="ai-loading">
          <div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" />
          <span>Analysing metrics…</span>
        </div>
      )}
      {state === "done" && (
        <div className="ai-content">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}
      {state === "error" && (
        <div className="ai-content" style={{ color: "var(--red)" }}>
          Could not load AI insight. Please try again.
        </div>
      )}
    </div>
  );
}

// ── GOAL TRACKER ──────────────────────────────────────────────────────────────
function GoalTracker({ devId, month }) {
  const m = METRICS[devId][month];
  const [cycleGoal, setCycleGoal] = useState(3.5);
  const [leadGoal, setLeadGoal]   = useState(2.5);
  const [cycleInput, setCycleInput] = useState("");
  const [leadInput, setLeadInput]   = useState("");

  const cyclePct = Math.min(100, Math.round((cycleGoal / m.cycle_time) * 100));
  const leadPct  = Math.min(100, Math.round((leadGoal  / m.lead_time)  * 100));
  const cycleColor = m.cycle_time <= cycleGoal ? "#22c55e" : m.cycle_time <= cycleGoal * 1.2 ? "#f59e0b" : "#ef4444";
  const leadColor  = m.lead_time  <= leadGoal  ? "#22c55e" : m.lead_time  <= leadGoal  * 1.2 ? "#f59e0b" : "#ef4444";

  return (
    <div className="panel">
      <div className="panel-title">Personal Goal Tracker</div>
      <div className="goal-grid">
        <div className="goal-card">
          <div className="goal-card-label">Cycle Time Goal</div>
          <div className="goal-progress-row">
            <div className="goal-bar-wrap">
              <div className="goal-bar-fill" style={{ width: `${cyclePct}%`, background: cycleColor }} />
            </div>
            <span className="goal-pct" style={{ color: cycleColor }}>
              {m.cycle_time <= cycleGoal ? "✓" : `${m.cycle_time}d`}
            </span>
          </div>
          <div className="goal-numbers">
            <span>Current: {m.cycle_time}d</span>
            <span>Target: {cycleGoal}d</span>
          </div>
          <div className="goal-input-row">
            <input className="goal-input" type="number" step="0.5" min="1" max="10"
              placeholder={String(cycleGoal)} value={cycleInput}
              onChange={e => setCycleInput(e.target.value)} />
            <button className="goal-set-btn" onClick={() => { if (cycleInput) { setCycleGoal(parseFloat(cycleInput)); setCycleInput(""); } }}>Set</button>
          </div>
        </div>
        <div className="goal-card">
          <div className="goal-card-label">Lead Time Goal</div>
          <div className="goal-progress-row">
            <div className="goal-bar-wrap">
              <div className="goal-bar-fill" style={{ width: `${leadPct}%`, background: leadColor }} />
            </div>
            <span className="goal-pct" style={{ color: leadColor }}>
              {m.lead_time <= leadGoal ? "✓" : `${m.lead_time}d`}
            </span>
          </div>
          <div className="goal-numbers">
            <span>Current: {m.lead_time}d</span>
            <span>Target: {leadGoal}d</span>
          </div>
          <div className="goal-input-row">
            <input className="goal-input" type="number" step="0.5" min="1" max="10"
              placeholder={String(leadGoal)} value={leadInput}
              onChange={e => setLeadInput(e.target.value)} />
            <button className="goal-set-btn" onClick={() => { if (leadInput) { setLeadGoal(parseFloat(leadInput)); setLeadInput(""); } }}>Set</button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 11, fontFamily: "var(--mono)", color: "var(--muted)", lineHeight: 1.5 }}>
        {m.cycle_time <= cycleGoal && m.lead_time <= leadGoal
          ? "🎯 Both goals met! Time to set a more ambitious target."
          : `Gap to close: ${Math.max(0, m.cycle_time - cycleGoal).toFixed(1)}d cycle · ${Math.max(0, m.lead_time - leadGoal).toFixed(1)}d lead`}
      </div>
    </div>
  );
}

// ── TEAM COMPARISON PANEL ────────────────────────────────────────────────────
function TeamComparisonPanel({ devId, month }) {
  const rows = teamComparison(devId, month);
  return (
    <div className="panel">
      <div className="panel-title">You vs Team Average — {MONTH_FULL[month]}</div>
      <div className="compare-row">
        {rows.map(row => {
          const maxVal = Math.max(row.me, row.team) * 1.3 || 1;
          const mePct = Math.min(100, (row.me / maxVal) * 100);
          const teamPct = Math.min(100, (row.team / maxVal) * 100);
          const isBetter = row.lowerBetter ? row.me <= row.team : row.me >= row.team;
          const meColor = isBetter ? "#22c55e" : "#f59e0b";
          return (
            <div key={row.label} className="compare-item">
              <div className="compare-label-row">
                <span className="compare-label">{row.label}</span>
                <div className="compare-vals">
                  <span className="compare-val-me" style={{ color: meColor }}>{row.me}{row.unit}</span>
                  <span style={{ color: "var(--muted)" }}>/ avg {row.team}{row.unit}</span>
                </div>
              </div>
              <div className="compare-bar-bg">
                <div className="compare-bar-fill" style={{ width: `${mePct}%`, background: meColor }} />
                <div className="compare-team-mark" style={{ left: `calc(${teamPct}% - 1px)` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontSize: 10, fontFamily: "var(--mono)", color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "inline-block", width: 12, height: 2, background: "var(--muted)", borderRadius: 1 }} />
        vertical mark = team average
      </div>
    </div>
  );
}

// ── IC VIEW ───────────────────────────────────────────────────────────────────
function ICView() {
  const [devId, setDevId]             = useState("DEV-001");
  const [month, setMonth]             = useState("2026-04");
  const [expandedAction, setExpandedAction] = useState(null);

  const dev   = DEVELOPERS[devId];
  const m     = METRICS[devId][month];
  const score = healthScore(m);
  const { insights, actions } = interpret(devId, month);
  const radar = radarData(devId, month);
  const trend = trendData(devId);
  const typeColor = TYPE_COLOR[dev.type];

  // Month-over-month delta
  const prevMonthIdx = MONTHS.indexOf(month) - 1;
  const prev = prevMonthIdx >= 0 ? METRICS[devId][MONTHS[prevMonthIdx]] : null;
  const cycleDelta = prev ? (m.cycle_time - prev.cycle_time).toFixed(1) : null;
  const leadDelta  = prev ? (m.lead_time  - prev.lead_time).toFixed(1)  : null;

  return (
    <div className="container fade-up">
      {/* Developer selector */}
      <div className="select-row">
        <span className="select-label">Developer</span>
        {Object.entries(DEVELOPERS).map(([id, d]) => (
          <button key={id}
            className={`select-pill ${devId === id ? "active" : ""}`}
            onClick={() => { setDevId(id); setExpandedAction(null); }}>
            {d.name}
          </button>
        ))}
      </div>

      <div className="select-row">
        <span className="select-label">Month</span>
        {MONTHS.map(mo => (
          <button key={mo} className={`select-pill ${month === mo ? "active" : ""}`} onClick={() => setMonth(mo)}>
            {MONTH_FULL[mo]}
          </button>
        ))}
      </div>

      {/* Metric cards */}
      <div className="metric-grid">
        {[
          {
            name: "Cycle Time", value: m.cycle_time, unit: "days",
            color: m.cycle_time > 5.5 ? "var(--orange)" : m.cycle_time < 4 ? "var(--green)" : "var(--text)",
            accent: m.cycle_time > 5.5 ? "#f97316" : "#22c55e",
            delta: cycleDelta ? `${cycleDelta > 0 ? "+" : ""}${cycleDelta}d` : null,
            deltaGood: cycleDelta < 0,
          },
          {
            name: "Lead Time", value: m.lead_time, unit: "days",
            color: m.lead_time > 4 ? "var(--orange)" : "var(--green)",
            accent: m.lead_time > 4 ? "#f97316" : "#22c55e",
            delta: leadDelta ? `${leadDelta > 0 ? "+" : ""}${leadDelta}d` : null,
            deltaGood: leadDelta < 0,
          },
          {
            name: "Bug Rate", value: `${(m.bug_rate * 100).toFixed(0)}%`, unit: `${m.bug_count} escaped`,
            color: m.bug_rate > 0 ? "var(--red)" : "var(--green)",
            accent: m.bug_rate > 0 ? "#ef4444" : "#22c55e",
          },
          {
            name: "Deploy Freq", value: m.deployment_frequency, unit: "deploys",
            color: "var(--accent)", accent: "#4f8ef7",
          },
          {
            name: "PR Throughput", value: m.pr_throughput, unit: "merged PRs",
            color: "var(--accent2)", accent: "#a78bfa",
          },
        ].map(card => (
          <div key={card.name} className="metric-card" style={{ "--card-accent": card.accent }}>
            <div className="metric-name">{card.name}</div>
            <div className="metric-value" style={{ color: card.color }}>{card.value}</div>
            <div className="metric-unit">{card.unit}</div>
            {card.delta && (
              <div className="metric-delta" style={{ color: card.deltaGood ? "var(--green)" : "var(--orange)" }}>
                {card.delta} vs last month
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main top grid */}
      <div className="main-grid">
        {/* Left: Dev profile + insights */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="panel">
            <div className="score-row">
              <ScoreRing score={score} />
              <div>
                <div className="dev-name">{dev.name}</div>
                <div className="dev-meta">{dev.level} · {dev.team}</div>
                <div className="dev-meta">Manager: {dev.manager}</div>
                <div className="type-badge" style={{ color: typeColor, borderColor: typeColor + "44", background: typeColor + "11" }}>
                  {dev.type}
                </div>
              </div>
            </div>

            <div className="panel-title">What the data says</div>
            <div className="insight-list">
              {insights.map((ins, i) => (
                <div key={i} className="insight-item" style={{ borderLeftColor: ins.color }}>
                  <span className="insight-icon">{ins.icon}</span>
                  <span>{ins.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">Suggested next steps</div>
            <div className="action-list">
              {actions.map((a, i) => (
                <div key={i} className="action-item">
                  <div className="action-header" onClick={() => setExpandedAction(expandedAction === i ? null : i)}>
                    <span className={`action-priority priority-${a.priority}`}>{a.priority}</span>
                    <span className="action-label">{a.label}</span>
                    <span style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 11 }}>
                      {expandedAction === i ? "▲" : "▼"}
                    </span>
                  </div>
                  {expandedAction === i && <div className="action-detail">{a.detail}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* AI insight */}
          <AIInsightPanel devId={devId} month={month} />
        </div>

        {/* Right: Charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="panel">
            <div className="panel-title">Performance radar</div>
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={radar} cx="50%" cy="50%" outerRadius={78}>
                <PolarGrid stroke="#232840" />
                <PolarAngleAxis dataKey="metric" />
                <Radar dataKey="value" stroke="#4f8ef7" fill="#4f8ef7" fillOpacity={0.15} strokeWidth={2}
                  dot={{ fill: "#4f8ef7", r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="panel">
            <div className="panel-title">4-Month trend</div>
            <ResponsiveContainer width="100%" height={185}>
              <LineChart data={trend} margin={{ top: 5, right: 20, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#232840" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#5a6480", fontSize: 10, fontFamily: "Space Mono" }} />
                <YAxis tick={{ fill: "#5a6480", fontSize: 10, fontFamily: "Space Mono" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Cycle Time" stroke="#4f8ef7" strokeWidth={2}
                  dot={{ r: 4, fill: "#4f8ef7" }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Lead Time"  stroke="#a78bfa" strokeWidth={2}
                  dot={{ r: 4, fill: "#a78bfa" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {[{ c: "#4f8ef7", l: "Cycle Time" }, { c: "#a78bfa", l: "Lead Time" }].map(x => (
                <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: "var(--mono)", color: "var(--muted)" }}>
                  <span style={{ width: 14, height: 2, background: x.c, display: "inline-block", borderRadius: 1 }} />
                  {x.l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section: Team comparison + Goal tracker */}
      <div className="section-grid">
        <TeamComparisonPanel devId={devId} month={month} />
        <GoalTracker devId={devId} month={month} />
      </div>
    </div>
  );
}

// ── MANAGER VIEW ──────────────────────────────────────────────────────────────
function ManagerView() {
  const [month, setMonth] = useState("2026-04");
  const rows = managerRows(month);

  const teamCounts = {};
  rows.forEach(r => {
    const s = scoreLabel(r.score);
    teamCounts[r.dev.team] = teamCounts[r.dev.team] || { Healthy: 0, Watch: 0, "At Risk": 0 };
    teamCounts[r.dev.team][s]++;
  });

  // Team avg health
  const teamAvgScore = {};
  rows.forEach(r => {
    if (!teamAvgScore[r.dev.team]) teamAvgScore[r.dev.team] = [];
    teamAvgScore[r.dev.team].push(r.score);
  });

  return (
    <div className="container fade-up">
      <div className="manager-header">
        <div>
          <div className="manager-title">Team Overview</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>All developers · ranked by health score (low to high)</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {MONTHS.map(mo => (
            <button key={mo} className={`select-pill ${month === mo ? "active" : ""}`} onClick={() => setMonth(mo)}>
              {MONTH_FULL[mo]}
            </button>
          ))}
        </div>
      </div>

      {/* Team summary chips */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(teamCounts).map(([team, counts]) => {
          const avgScores = teamAvgScore[team];
          const avg = Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length);
          return (
            <div key={team} className="panel" style={{ padding: "14px 18px", flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--muted)", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{team}</span>
                <span style={{ color: scoreColor(avg) }}>avg {avg}</span>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                {[["Healthy", "#22c55e"], ["Watch", "#f59e0b"], ["At Risk", "#ef4444"]].map(([lbl, color]) => (
                  <div key={lbl} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontFamily: "var(--mono)", fontWeight: 700, color: counts[lbl] > 0 ? color : "var(--border)" }}>{counts[lbl]}</div>
                    <div style={{ fontSize: 9, color: "var(--muted)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel">
        <table className="manager-table">
          <thead>
            <tr>
              <th>Developer</th>
              <th>Team</th>
              <th>Level</th>
              <th>Health</th>
              <th>Trend</th>
              <th>Cycle Time</th>
              <th>Lead Time</th>
              <th>Bug Rate</th>
              <th>PRs</th>
              <th>Deploys</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ id, dev, m, score, trend }) => {
              const sl = scoreLabel(score);
              const badgeCls = sl === "Healthy" ? "badge-healthy" : sl === "Watch" ? "badge-watch" : "badge-risk";
              const trendArrow = trend > 0 ? "▲" : trend < 0 ? "▼" : "—";
              const trendColor = trend > 0 ? "var(--green)" : trend < 0 ? "var(--red)" : "var(--muted)";
              const typeColor = TYPE_COLOR[dev.type];

              // Mini sparkline data: scores over all months
              const sparkScores = MONTHS.map(mo => healthScore(METRICS[id][mo]));
              const maxSpark = Math.max(...sparkScores);

              return (
                <tr key={id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{dev.name}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--mono)", marginTop: 2 }}>
                      <span style={{ color: typeColor }}>●</span> {dev.type} · {dev.manager}
                    </div>
                  </td>
                  <td><span className="team-chip">{dev.team}</span></td>
                  <td><span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--muted2)" }}>{dev.level}</span></td>
                  <td>
                    <span className={`badge ${badgeCls}`}>{score} · {sl}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 24 }}>
                      {sparkScores.map((s, i) => (
                        <div key={i} className="spark-bar"
                          style={{ height: `${Math.round((s / maxSpark) * 100)}%`, background: scoreColor(s) }} />
                      ))}
                    </div>
                  </td>
                  <td style={{ fontFamily: "var(--mono)", color: m.cycle_time > 5.5 ? "var(--orange)" : "var(--text)" }}>
                    {m.cycle_time}d
                  </td>
                  <td style={{ fontFamily: "var(--mono)", color: m.lead_time > 4 ? "var(--orange)" : "var(--text)" }}>
                    {m.lead_time}d
                  </td>
                  <td style={{ fontFamily: "var(--mono)", color: m.bug_rate > 0 ? "var(--red)" : "var(--green)" }}>
                    {(m.bug_rate * 100).toFixed(0)}%
                  </td>
                  <td style={{ fontFamily: "var(--mono)" }}>{m.pr_throughput}</td>
                  <td style={{ fontFamily: "var(--mono)" }}>{m.deployment_frequency}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("ic");
  return (
    <>
      <style>{style}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-dot" />
            Dev<span>Pulse</span>
          </div>
          <div className="nav-tagline">Developer Productivity MVP</div>
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === "ic" ? "active" : ""}`} onClick={() => setTab("ic")}>IC View</button>
            <button className={`nav-tab ${tab === "mgr" ? "active" : ""}`} onClick={() => setTab("mgr")}>Manager View</button>
          </div>
        </nav>
        {tab === "ic" ? <ICView key="ic" /> : <ManagerView key="mgr" />}
      </div>
    </>
  );
}
