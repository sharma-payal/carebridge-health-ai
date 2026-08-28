# Operational readiness

## Service-level objectives

| Signal | Target | Page when |
|---|---:|---:|
| Triage-path availability | 99.95% / 30 days | 2% budget burn in 1 hour or 5% in 6 hours |
| API latency excluding EHR, p95 | < 1,000 ms | > 1,000 ms for 10 minutes |
| Safety-event delivery | 99.9% < 60 seconds | Oldest message > 60 seconds |
| FHIR retrieval success | 99.9% | < 99.5% for 5 minutes |
| Unsupported AI claims | < 0.1% sampled briefs | Any critical unsupported claim |

Dashboards segment by tenant, region, workflow, dependency, policy version, and deployment version. Dimensions are opaque and bounded to avoid PHI and high-cardinality cost.

## Alarm response: safety queue age

1. Acknowledge the page and identify affected tenant/region without opening message bodies.
2. Check consumer throttles, reserved concurrency, dependency latency, error codes, and deployment markers.
3. If backlog threatens the SLO, enable manual routing and pause non-safety consumers.
4. Roll back the latest artifact if error rate correlates with deployment.
5. Redrive only after fixing the consumer, using an approved tool with event range and dry-run count.
6. Confirm queue age, DLQ growth, latency, and acknowledgments return to normal.
7. Record the timeline and begin correction-of-error review for patient impact or recurrence.

## Alarm response: EHR dependency failure

1. Separate auth, throttling, timeout, and malformed-data failures.
2. Trip the tenant-specific circuit breaker if the source is failing; never spread one tenant's failure.
3. Mark context unavailable/stale and block write-back while keeping manual contact usable.
4. Contact the integration owner, then restore gradually with probe requests.

## Deployment safety

- Unit, contract, authorization, load, and synthetic canary tests gate production.
- Deploy one immutable artifact through dev, pre-production, then a 5% canary.
- Roll back on error rate, p95 latency, queue age, or critical policy-evaluation mismatch.
- Policy versions deploy independently from model versions and remain instantly reversible.
- Database changes use expand/migrate/contract and support two adjacent application versions.

## Capacity model

Start with peak interactions per second × fan-out × worst-case processing time. Load test at 2× forecast peak and inject EHR latency, model throttling, duplicate events, partial regional loss, and DLQ replay. Scale safety paths separately so reporting cannot starve patient workflows.

## Correction of errors template

Capture customer/patient impact, detection gap, exact timeline, contributing conditions, why safeguards did not prevent the event, immediate mitigation, corrective actions with owners/dates, and measurable prevention signals. Focus on system causes rather than individual blame.
