export type TriageInput = {
  symptoms: string[];
  weightGainKg48h?: number;
  systolicBp?: number;
  diastolicBp?: number;
  dischargedDaysAgo?: number;
  medications?: string[];
  newMedication?: string;
};

export type TriageDecision = {
  level: "urgent" | "review" | "routine";
  policyId: string;
  reasons: string[];
  requiresHumanReview: true;
};

const normalized = (values: string[] = []) => values.map((value) => value.toLowerCase());

export function evaluateTriage(input: TriageInput): TriageDecision {
  const symptoms = normalized(input.symptoms);
  const medications = normalized(input.medications);
  const reasons: string[] = [];

  if (symptoms.some((item) => item.includes("chest pain") || item.includes("severe shortness of breath"))) {
    reasons.push("Emergency symptom phrase detected");
    return { level: "urgent", policyId: "EMERGENCY-SYMPTOM-v4", reasons, requiresHumanReview: true };
  }

  const recentHeartFailureDischarge = (input.dischargedDaysAgo ?? 99) <= 7;
  const fluidOverloadSignals = (input.weightGainKg48h ?? 0) >= 2 && symptoms.some((item) => item.includes("shortness of breath"));
  if (recentHeartFailureDischarge && fluidOverloadSignals) {
    reasons.push("Weight gain ≥2 kg in 48 hours", "Dyspnea after a recent discharge");
    return { level: "urgent", policyId: "HF-DISCHARGE-v3", reasons, requiresHumanReview: true };
  }

  if ((input.systolicBp ?? 0) >= 180 || (input.diastolicBp ?? 0) >= 120) {
    reasons.push("Blood pressure meets escalation threshold");
    return { level: "urgent", policyId: "BP-ESCALATION-v2", reasons, requiresHumanReview: true };
  }

  const highRiskMedication = medications.some((item) => item.includes("warfarin"));
  if (highRiskMedication && input.newMedication) {
    reasons.push("New medication with high-risk therapy requires pharmacist review");
    return { level: "review", policyId: "MED-INTERACTION-v5", reasons, requiresHumanReview: true };
  }

  return { level: symptoms.length ? "review" : "routine", policyId: "GENERAL-INTAKE-v2", reasons: symptoms.length ? ["Symptoms require clinical review"] : ["No safety signals detected"], requiresHumanReview: true };
}
