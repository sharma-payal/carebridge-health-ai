# Security and threat model

## Non-negotiable boundaries

- This repository contains synthetic data only.
- PHI is session-scoped and never sent to logs, metrics, tags, traces, DLQs, analytics, or model prompts before redaction.
- AI output is advisory. Human approval is required for escalation acknowledgment, EHR mutation, or patient communication.
- Every access is tenant-scoped, purpose-bound, time-limited, and attributable to a workforce identity.

## Threat model

| Threat | Control | Verification |
|---|---|---|
| Cross-tenant data access | Tenant in principal claims and partition key; authorization repeated in service | Negative integration tests and IAM Access Analyzer |
| Prompt injection in transcript/EHR | Retrieved text treated as data; fixed schema; allowlisted tools; output validation | Adversarial prompt corpus in CI |
| Sensitive data in model or logs | Deterministic redaction, field allowlist, no body logging | Canary tokens and log scans |
| Hallucinated clinical fact | Evidence span resolves to source context; unsupported fields rejected | Contract and property tests |
| Duplicate escalation | Idempotency key and conditional write | Retry and concurrent-request tests |
| Unauthorized policy change | Signed artifact, two-person review, separated deployment role | CloudTrail alert and approval record |
| Confused deputy | `aws:SourceArn` and `aws:SourceAccount` constraints | IAM policy tests |
| EHR outage or stale context | Circuit breaker, source timestamp, blocked write path, manual workflow | Fault-injection game day |
| Audit tampering | S3 Object Lock, KMS, digest chain, isolated write role | Scheduled integrity verification |

## Data protection

- TLS 1.2 minimum in transit and KMS customer-managed keys at rest; separate keys and grants per environment.
- Secrets in Secrets Manager with automatic rotation; no credentials in source or environment examples.
- Tokenize patient identifiers outside the EHR boundary. The operational store uses opaque references.
- Set retention per record type. TTL is cleanup, not proof of deletion; use lifecycle controls and deletion evidence.
- Restrict production access through IAM Identity Center, MFA, just-in-time elevation, and quarterly access review.

## Compliance posture

HIPAA eligibility is not automatic compliance. A production owner must execute an AWS BAA, classify data, document flows and retention, validate vendors, perform risk assessment, test incident response, and secure all customer-managed configuration. Clinical safety review is independent from security review.

## Secure development lifecycle

Pull requests require unit/contract tests, secret scanning, dependency review, static analysis, and policy-as-code checks. High-risk changes require security and clinical-safety reviewers. Deploy immutable artifacts through staged environments, automatic rollback alarms, and a documented break-glass procedure.
