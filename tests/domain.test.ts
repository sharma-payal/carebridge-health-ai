import assert from "node:assert/strict";
import test from "node:test";
import { normalizeFhirBundle } from "../lib/fhir-adapter.ts";
import { redactPhi } from "../lib/redaction.ts";
import { evaluateTriage } from "../lib/triage-policy.ts";

test("escalates post-discharge heart-failure signals deterministically", () => {
  const decision = evaluateTriage({ symptoms: ["shortness of breath"], weightGainKg48h: 2.1, dischargedDaysAgo: 2 });
  assert.equal(decision.level, "urgent");
  assert.equal(decision.policyId, "HF-DISCHARGE-v3");
  assert.equal(decision.requiresHumanReview, true);
  assert.equal(decision.reasons.length, 2);
});

test("prioritizes emergency symptom phrases", () => {
  const decision = evaluateTriage({ symptoms: ["severe shortness of breath", "chest pain"] });
  assert.deepEqual(decision, { level: "urgent", policyId: "EMERGENCY-SYMPTOM-v4", reasons: ["Emergency symptom phrase detected"], requiresHumanReview: true });
});

test("routes high-risk medication changes for pharmacist review", () => {
  const decision = evaluateTriage({ symptoms: [], medications: ["Warfarin 5 mg"], newMedication: "TMP-SMX" });
  assert.equal(decision.level, "review");
  assert.equal(decision.policyId, "MED-INTERACTION-v5");
});

test("redacts common PHI categories without persisting input", () => {
  const result = redactPhi("Call 206-555-0187 or maya@example.org; MRN: ZX-48319; SSN 123-45-6789");
  assert.equal(result.redacted.includes("206-555-0187"), false);
  assert.equal(result.redacted.includes("maya@example.org"), false);
  assert.deepEqual(result.categories.sort(), ["email", "medical-record-number", "phone", "ssn"]);
});

test("normalizes a FHIR R4-style bundle", () => {
  const context = normalizeFhirBundle({ resourceType: "Bundle", entry: [
    { resource: { resourceType: "Patient", id: "pt-1", name: [{ text: "Synthetic Patient" }] } },
    { resource: { resourceType: "Condition", code: { text: "Heart failure" } } },
    { resource: { resourceType: "MedicationRequest", medicationCodeableConcept: { text: "Furosemide 40 mg" } } },
  ] });
  assert.deepEqual(context, { patientId: "pt-1", displayName: "Synthetic Patient", conditions: ["Heart failure"], medications: ["Furosemide 40 mg"], warnings: [] });
});

test("rejects bundles without patient identity", () => {
  assert.throws(() => normalizeFhirBundle({ resourceType: "Bundle", entry: [] }), /missing Patient identity/);
});
