# CareBridge Health

CareBridge Health is a safety-first, AI-assisted care-operations system modeled on the engineering problems behind Amazon Connect Health. It turns contact-center interactions into explainable clinical briefs, applies deterministic escalation policy, retrieves normalized FHIR context, and records a reviewable audit trail—while keeping every care decision under human control.

> Portfolio demonstration only. All names and clinical records are synthetic. This project is not a medical device and does not provide medical advice.

## Why this project exists

| Role signal | Concrete evidence in this repository |
|---|---|
| Scalable healthcare services | Stateless triage API, event-driven AWS reference architecture, explicit SLOs and failure modes |
| High-quality, tested code | Typed domain boundaries, deterministic policy engine, PHI-redaction tests, FHIR validation, server-render test |
| AI/ML systems | Human-in-the-loop clinical brief with evidence provenance; policy rules are separate from probabilistic inference |
| Operational excellence | SLOs, alarms, runbooks, idempotency strategy, replay/DLQ design, graceful degradation |
| Compliance and security | Least privilege, session-scoped PHI, encryption, audit events, retention boundaries, synthetic demo data |
| Technical design | Architecture, API contract, threat model, trade-offs, and evolution plan |

## Product capabilities

- Live care queue with urgent/review/routine prioritization and role-oriented workflows
- Evidence-backed AI clinical briefs with visible confidence and mandatory human acknowledgment
- Secure conversation surface with identity-verification state and source-aware patient context
- FHIR R4-style adapter that normalizes Patient, Condition, and MedicationRequest resources
- Deterministic safety policy engine covering emergency symptoms, post-discharge heart failure, blood pressure, and medication review
- PHI redaction for phone numbers, email, MRN, and SSN before downstream model use
- Immutable-style decision timeline, versioned policy controls, and service-level health dashboard
- Responsive, keyboard-accessible clinician UI with no real patient data

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use the left navigation to move among Operations, Care conversations, and Quality & safety. Select different patients, filter the queue, inspect evidence, acknowledge an escalation, and change active policy views.

## Verify

```bash
npm run lint
npm test
```

The suite covers safety-rule precedence, medication routing, PHI redaction, malformed FHIR input, valid FHIR normalization, the production build, and the server-rendered product shell.

## API example

`POST /api/triage`

```json
{
  "symptoms": ["shortness of breath"],
  "weightGainKg48h": 2.1,
  "dischargedDaysAgo": 2,
  "transcript": "Call me at 206-555-0187"
}
```

The response includes a request ID, versioned policy decision, reason list, human-review requirement, timestamp, and redacted transcript. The endpoint uses `Cache-Control: no-store`.

## Engineering documents

- [System architecture](docs/ARCHITECTURE.md)
- [Security and threat model](docs/SECURITY.md)
- [Operational readiness](docs/OPERATIONS.md)
- [Resume and interview guide](docs/RESUME.md)

## Design basis

The architecture follows the [AWS Healthcare Industry Lens](https://docs.aws.amazon.com/wellarchitected/latest/healthcare-industry-lens/healthcare-industry-lens.html), especially traceability, least privilege, defense in depth, explicit reliability requirements, and managed-service operations. It also reflects Amazon Connect Health's documented [zero-persistence approach to PHI](https://docs.aws.amazon.com/connecthealth/latest/userguide/compliance-validation.html) and [data-protection guidance](https://docs.aws.amazon.com/connecthealth/latest/userguide/data-protection.html). A production deployment still requires an executed BAA, organizational risk assessment, legal/compliance review, clinical validation, and configured retention policy.

## Deliberate scope

The deployed demo uses synthetic in-memory records so no patient data is stored. `docs/ARCHITECTURE.md` defines the production AWS target and its boundaries. The AI panel demonstrates the control plane and user experience; it does not call a foundation model from the public demo.
