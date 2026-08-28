"use client";

import { useMemo, useState } from "react";
import { auditEvents, patients, weeklyVolume, type Patient, type RiskLevel } from "./data";

type View = "overview" | "conversations" | "quality";
type Filter = "all" | RiskLevel;

const nav: { id: View; label: string; icon: string }[] = [
  { id: "overview", label: "Operations overview", icon: "⌂" },
  { id: "conversations", label: "Care conversations", icon: "◌" },
  { id: "quality", label: "Quality & safety", icon: "✓" },
];

function RiskBadge({ risk }: { risk: RiskLevel }) {
  return <span className={`risk ${risk}`}>{risk}</span>;
}

function Queue({ selected, onSelect, filter, onFilter }: { selected: Patient; onSelect: (patient: Patient) => void; filter: Filter; onFilter: (filter: Filter) => void }) {
  const visible = filter === "all" ? patients : patients.filter((patient) => patient.risk === filter);
  return (
    <section className="panel queue-panel" aria-label="Patient conversation queue">
      <div className="section-heading queue-heading">
        <div><p className="eyebrow">LIVE QUEUE</p><h2>Needs attention</h2></div><span className="live-pill"><i /> Live</span>
      </div>
      <div className="filters" aria-label="Queue filters">
        {(["all", "urgent", "review", "routine"] as Filter[]).map((item) => <button className={filter === item ? "active" : ""} onClick={() => onFilter(item)} type="button" key={item}>{item === "all" ? `All ${patients.length}` : item}</button>)}
      </div>
      <div className="queue-list">
        {visible.map((patient) => <button className={`queue-row ${selected.id === patient.id ? "selected" : ""}`} onClick={() => onSelect(patient)} type="button" key={patient.id}>
          <span className="patient-avatar">{patient.initials}</span><span className="patient-copy"><strong>{patient.name}</strong><span>{patient.reason} · {patient.channel}</span></span><RiskBadge risk={patient.risk} /><time>{patient.wait}</time>
        </button>)}
      </div>
    </section>
  );
}

function CareCopilot({ patient }: { patient: Patient }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  return (
    <aside className="panel ai-card" aria-label="AI clinical decision support">
      <div className="ai-header"><span className="ai-spark">✦</span><div><p className="eyebrow">CARE COPILOT</p><h2>Clinical brief ready</h2></div><span className="confidence">{patient.score}% match</span></div>
      <p className="ai-summary">{patient.summary}</p>
      <div className={`signal signal-${patient.risk}`}><span>{patient.risk === "urgent" ? "HIGH-PRIORITY SIGNAL" : "SUGGESTED PATHWAY"}</span><strong>{patient.signal}</strong><p>{patient.evidence[0]}. Human verification is required before action.</p></div>
      <button className="evidence-toggle" type="button" onClick={() => setShowEvidence(!showEvidence)} aria-expanded={showEvidence}><span>Evidence used ({patient.evidence.length})</span><span>{showEvidence ? "−" : "+"}</span></button>
      {showEvidence && <ul className="evidence-list">{patient.evidence.map((item) => <li key={item}>{item}</li>)}</ul>}
      <div className="ai-actions">
        <button className={acknowledged ? "acknowledged" : "primary"} onClick={() => setAcknowledged(!acknowledged)} type="button">{acknowledged ? "✓ Escalation acknowledged" : patient.risk === "urgent" ? "Acknowledge escalation" : "Accept suggested pathway"}</button>
        <button type="button">Request clinician review</button>
      </div>
      <p className="ai-disclaimer">AI-generated support, not medical advice. Verify against the source record.</p>
    </aside>
  );
}

function Overview({ patient, onSelect }: { patient: Patient; onSelect: (patient: Patient) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  return <>
    <div className="metrics" aria-label="Today’s operational metrics">
      <article><span>Active conversations</span><strong>24</strong><small>6 need clinical review</small></article><article><span>Median response</span><strong>1m 42s</strong><small className="positive">↓ 18% vs target</small></article><article><span>Resolved today</span><strong>138</strong><small>92% first-contact</small></article><article><span>Safety escalations</span><strong>3</strong><small>All acknowledged</small></article>
    </div>
    <div className="overview-grid"><Queue selected={patient} onSelect={onSelect} filter={filter} onFilter={setFilter} /><CareCopilot patient={patient} /></div>
    <div className="lower-grid">
      <section className="panel trend-card"><div className="section-heading"><div><p className="eyebrow">THROUGHPUT</p><h2>Resolved interactions</h2></div><span className="metric-delta">+12.4%</span></div><div className="bars" aria-label="Interaction volume over 12 time periods">{weeklyVolume.map((value, index) => <span style={{ height: `${value / 1.5}px` }} className={index === weeklyVolume.length - 1 ? "current" : ""} key={`${value}-${index}`}><i>{value}</i></span>)}</div><div className="chart-labels"><span>6 AM</span><span>9 AM</span><span>12 PM</span><span>Now</span></div></section>
      <section className="panel pathway-card"><div className="section-heading"><div><p className="eyebrow">QUALITY SIGNALS</p><h2>Pathway adherence</h2></div><strong>96.8%</strong></div><div className="progress-row"><span>Identity verification</span><b>99.2%</b><i><em style={{ width: "99.2%" }} /></i></div><div className="progress-row"><span>Medication reconciliation</span><b>95.7%</b><i><em style={{ width: "95.7%" }} /></i></div><div className="progress-row"><span>Escalation acknowledgment</span><b>94.8%</b><i><em style={{ width: "94.8%" }} /></i></div></section>
    </div>
  </>;
}

function Conversations({ patient, onSelect }: { patient: Patient; onSelect: (patient: Patient) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [tab, setTab] = useState<"context" | "audit">("context");
  return <div className="conversation-layout">
    <Queue selected={patient} onSelect={onSelect} filter={filter} onFilter={setFilter} />
    <section className="panel transcript-panel">
      <header className="patient-header"><div className="patient-avatar large">{patient.initials}</div><div><h2>{patient.name}</h2><p>{patient.age} · {patient.pronouns} · MRN {patient.mrn}</p></div><RiskBadge risk={patient.risk} /></header>
      <div className="verification-banner"><span>✓</span><div><strong>Identity verified</strong><small>Two-factor verification completed at 9:41 AM</small></div></div>
      <div className="transcript" aria-label="Conversation transcript">{patient.transcript.map((message, index) => <div className={`message ${message.speaker}`} key={`${message.time}-${index}`}><span>{message.speaker === "patient" ? patient.name.split(" ")[0] : "Morgan"} · {message.time}</span><p>{message.text}</p></div>)}</div>
      <div className="composer"><label htmlFor="reply">Secure reply</label><div><input id="reply" placeholder="Type a response…" /><button type="button">Send</button></div><small>Messages are encrypted and retained per organization policy.</small></div>
    </section>
    <aside className="context-column"><CareCopilot patient={patient} /><section className="panel record-card">
      <div className="tab-list" role="tablist"><button className={tab === "context" ? "active" : ""} onClick={() => setTab("context")} type="button">Patient context</button><button className={tab === "audit" ? "active" : ""} onClick={() => setTab("audit")} type="button">Audit</button></div>
      {tab === "context" ? <div className="record-content"><h3>Active conditions</h3>{patient.conditions.map((item) => <p key={item}>{item}</p>)}<h3>Medication list</h3>{patient.medications.map((item) => <p key={item}>{item}</p>)}<div className="source-note">Source: EHR · FHIR R4 · refreshed 38s ago</div></div> : <div className="audit-list compact">{auditEvents.slice(0, 3).map((event) => <div key={event.time}><time>{event.time}</time><p><strong>{event.event}</strong><span>{event.actor}</span></p></div>)}</div>}
    </section></aside>
  </div>;
}

function Quality() {
  const [policy, setPolicy] = useState("HF-DISCHARGE-v3");
  const policies = useMemo(() => ({ "HF-DISCHARGE-v3": ["Dyspnea at rest", "Weight gain ≥2 kg / 48h", "Discharged ≤7 days"], "MED-INTERACTION-v5": ["High-risk medication present", "New prescription detected", "Pharmacist confirmation absent"], "BP-ESCALATION-v2": ["Systolic ≥180 or diastolic ≥120", "Neurologic symptom check", "Repeat measurement requested"] }), []);
  return <div className="quality-grid">
    <section className="panel audit-card"><div className="section-heading"><div><p className="eyebrow">IMMUTABLE EVENT STREAM</p><h2>Decision audit trail</h2></div><button type="button">Export evidence</button></div><div className="audit-list">{auditEvents.map((event) => <div key={event.time}><time>{event.time}</time><span className="audit-dot" /><p><strong>{event.event}</strong><span>{event.actor} · {event.detail}</span></p><code>verified</code></div>)}</div></section>
    <aside className="panel policy-card"><div className="section-heading"><div><p className="eyebrow">POLICY AS CODE</p><h2>Active safety rules</h2></div><span className="version-pill">3 active</span></div><label htmlFor="policy-select">Policy version</label><select id="policy-select" value={policy} onChange={(event) => setPolicy(event.target.value)}>{Object.keys(policies).map((item) => <option key={item}>{item}</option>)}</select><ul>{policies[policy as keyof typeof policies].map((rule) => <li key={rule}><span>✓</span>{rule}</li>)}</ul><div className="policy-meta"><p><span>Last validated</span><strong>Aug 26, 2026</strong></p><p><span>Owner</span><strong>Clinical Safety</strong></p><p><span>Change approval</span><strong>2 reviewers</strong></p></div></aside>
    <section className="panel reliability-card"><div className="section-heading"><div><p className="eyebrow">SERVICE LEVELS</p><h2>Operational health</h2></div><span className="healthy"><i /> Healthy</span></div><div className="slo-grid"><article><span>Availability</span><strong>99.98%</strong><small>SLO 99.95%</small></article><article><span>Triage latency p95</span><strong>684 ms</strong><small>SLO &lt; 1,000 ms</small></article><article><span>FHIR success rate</span><strong>99.91%</strong><small>SLO 99.9%</small></article><article><span>Safety-rule coverage</span><strong>100%</strong><small>27 / 27 paths</small></article></div></section>
  </div>;
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [patient, setPatient] = useState(patients[0]);
  return <main className="app-shell"><aside className="sidebar"><div className="brand-mark" aria-label="CareBridge Health home">CB</div><nav aria-label="Primary navigation">{nav.map((item) => <button className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)} type="button" aria-label={item.label} title={item.label} key={item.id}>{item.icon}</button>)}</nav><button className="help-button" type="button" aria-label="Help">?</button><div className="avatar" aria-label="Signed in as Morgan Chen">MC</div></aside><section className="workspace"><header className="topbar"><div><p className="eyebrow">CARE OPERATIONS · NORTHWEST REGION</p><h1>{view === "overview" ? "Good morning, Morgan" : view === "conversations" ? "Care conversations" : "Quality & safety"}</h1></div><div className="topbar-actions"><div className="system-status"><span /> All systems operational</div><button type="button" aria-label="Notifications">○<i>3</i></button></div></header>{view === "overview" && <Overview patient={patient} onSelect={setPatient} />}{view === "conversations" && <Conversations patient={patient} onSelect={setPatient} />}{view === "quality" && <Quality />}<footer><span>CareBridge Health · Demonstration environment</span><span>No real patient data · Synthetic records only</span></footer></section></main>;
}
