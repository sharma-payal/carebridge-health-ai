# Resume and interview guide

## Project entry

**CareBridge Health — AI-assisted healthcare operations platform**  
TypeScript, React, Next-compatible RSC, REST, FHIR R4, AWS reference architecture

Use these only after you can explain and demonstrate each claim:

- Designed and built a safety-first healthcare contact-center platform that converts synthetic patient interactions into evidence-backed clinical briefs, versioned triage decisions, and human-reviewed escalation workflows.
- Implemented a typed FHIR normalization boundary, deterministic policy engine, and PHI-redaction pipeline with automated tests for safety precedence, malformed data, medication review, and sensitive identifiers.
- Defined an event-driven AWS architecture using Amazon Connect, Connect Health, Bedrock, Lambda, EventBridge/SQS, DynamoDB, and append-only audit storage, with idempotency, DLQs, graceful degradation, and tenant isolation.
- Established operational readiness with availability/latency SLOs, error-budget alarms, canary rollback criteria, dependency runbooks, and correction-of-error procedures.

Do not claim real production traffic, clinical accuracy, HIPAA compliance, cost reduction, or healthcare outcomes. After load testing, replace architecture targets with measured results and include workload, environment, and percentile.

## 60-second walkthrough

“I built CareBridge to explore the boundary between generative AI and safety-critical healthcare workflows. A model can summarize a conversation and cite evidence, but a deterministic, versioned policy engine owns the escalation floor and a clinician owns every action. The demo shows the care queue, source-aware brief, FHIR context, human acknowledgment, and audit trail. Behind that, I designed an at-least-once event architecture with idempotent writes, session-scoped PHI, tenant isolation, DLQs, explicit SLOs, and degraded modes. The key trade-off was limiting AI autonomy to make the system explainable, testable, and operationally safe.”

## Questions to expect

### Why not let the model determine urgency?

Model output can contribute structured facts and evidence, but urgency has deterministic minimums. Boundary cases remain testable, model drift cannot silently lower safety, and clinical owners get a versioned change process.

### How does the system handle duplicate events?

Every request has a tenant-scoped idempotency key. The service conditionally writes the state transition and outbox record in one transaction. Consumers are idempotent and store processed event IDs for the retention window.

### What happens when Bedrock is unavailable?

The manual workflow and deterministic safety rules remain available. The UI labels the brief unavailable; it never substitutes fabricated context. Reserved safety capacity and dependency-specific circuit breakers contain failure.

### What happens when the EHR is unavailable?

The workspace shows source freshness, marks context unavailable, blocks high-risk write-back, and supports manual escalation. Failures are isolated per tenant.

### How would you prove the design scales?

Define peak traffic and fan-out, benchmark each stage, load test at 2× forecast, and inject throttles, latency, duplicates, partial dependency loss, and replay. Publish measured p50/p95/p99, saturation, queue age, error rate, and cost per interaction.

## Leadership Principle hooks

- **Customer Obsession:** Human-readable evidence and degraded modes protect the clinician workflow.
- **Ownership:** SLOs, alarms, runbooks, and correction-of-error thinking cover the full lifecycle.
- **Dive Deep:** Policy precedence, FHIR validation, idempotency, and queue-age scaling go beyond UI work.
- **Invent and Simplify:** Separate probabilistic summarization from deterministic safety policy.
- **Highest Standards:** Make no unsupported outcomes claims; keep clear validation gates and synthetic-only data.
