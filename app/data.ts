export type RiskLevel = "urgent" | "review" | "routine";

export type Patient = {
  id: string; initials: string; name: string; pronouns: string; age: number;
  reason: string; channel: "Voice" | "Chat" | "Portal"; wait: string;
  risk: RiskLevel; score: number; status: string; mrn: string; dob: string; callback: string;
  summary: string; signal: string; evidence: string[]; medications: string[]; conditions: string[];
  transcript: { speaker: "patient" | "agent"; text: string; time: string }[];
};

export const patients: Patient[] = [
  {
    id: "cx-1048", initials: "MR", name: "Maya Reynolds", pronouns: "she/her", age: 67,
    reason: "Post-discharge concern", channel: "Voice", wait: "02:14", risk: "urgent", score: 92,
    status: "Needs clinical review", mrn: "••• 4831", dob: "Mar 12, 1959", callback: "(206) •••-0187",
    summary: "Maya reports increasing shortness of breath 48 hours after discharge for heart failure. Weight is up 2.1 kg from her recorded baseline.",
    signal: "Possible fluid overload",
    evidence: ["Weight gain >2 kg in 48 hours", "New dyspnea at rest", "Recent heart-failure discharge", "No chest pain reported"],
    medications: ["Furosemide 40 mg", "Lisinopril 10 mg", "Metoprolol ER 50 mg"],
    conditions: ["Heart failure with reduced EF", "Hypertension", "Type 2 diabetes"],
    transcript: [
      { speaker: "patient", text: "I came home two days ago, but today I get winded just walking to the kitchen.", time: "9:41 AM" },
      { speaker: "agent", text: "I’m sorry you’re feeling worse. Are you short of breath while sitting still?", time: "9:42 AM" },
      { speaker: "patient", text: "A little. My scale says I’m about five pounds heavier than at discharge.", time: "9:42 AM" },
    ],
  },
  {
    id: "cx-1047", initials: "JT", name: "James Thompson", pronouns: "he/him", age: 54,
    reason: "Medication question", channel: "Chat", wait: "05:42", risk: "review", score: 63,
    status: "Pharmacist review", mrn: "••• 2910", dob: "Nov 8, 1971", callback: "(425) •••-9921",
    summary: "James asks whether a newly prescribed antibiotic can be taken with warfarin. The medication list indicates a potential interaction requiring pharmacist confirmation.",
    signal: "Medication interaction check",
    evidence: ["Warfarin on active medication list", "New trimethoprim-sulfamethoxazole prescription", "No bleeding symptoms reported"],
    medications: ["Warfarin 5 mg", "Atorvastatin 20 mg", "TMP-SMX 160/800 mg"], conditions: ["Atrial fibrillation", "Hyperlipidemia"],
    transcript: [
      { speaker: "patient", text: "Urgent care gave me an antibiotic. Can I take it with my blood thinner?", time: "9:38 AM" },
      { speaker: "agent", text: "I’ll review your active medications and have a pharmacist confirm before your first dose.", time: "9:39 AM" },
    ],
  },
  {
    id: "cx-1046", initials: "AL", name: "Ava Lee", pronouns: "she/her", age: 34,
    reason: "Follow-up scheduling", channel: "Portal", wait: "08:07", risk: "routine", score: 18,
    status: "Scheduling", mrn: "••• 8774", dob: "Jul 21, 1992", callback: "(360) •••-6610",
    summary: "Ava needs a six-week post-operative follow-up. No new symptoms or recovery concerns were reported.",
    signal: "Standard scheduling pathway",
    evidence: ["Follow-up due within 8 days", "No red-flag symptoms", "Preferred clinic has availability"],
    medications: ["Acetaminophen 500 mg PRN"], conditions: ["Status post ACL repair"],
    transcript: [
      { speaker: "patient", text: "I need to schedule my six-week check. Mornings work best.", time: "9:35 AM" },
      { speaker: "agent", text: "I can help with that. Have you had any new swelling, fever, or severe pain?", time: "9:36 AM" },
      { speaker: "patient", text: "No, recovery is going well.", time: "9:36 AM" },
    ],
  },
  {
    id: "cx-1045", initials: "DB", name: "Daniel Brooks", pronouns: "he/him", age: 72,
    reason: "Abnormal home reading", channel: "Voice", wait: "11:29", risk: "review", score: 71,
    status: "Nurse callback", mrn: "••• 1038", dob: "Jan 3, 1954", callback: "(206) •••-2240",
    summary: "Daniel reports two blood-pressure readings above his usual range without headache, chest pain, weakness, or vision change.",
    signal: "Elevated blood pressure",
    evidence: ["Two readings above 170 systolic", "No neurologic symptoms", "Antihypertensive dose taken"],
    medications: ["Amlodipine 10 mg", "Losartan 50 mg"], conditions: ["Hypertension", "Chronic kidney disease stage 3"],
    transcript: [
      { speaker: "patient", text: "My machine read 174 over 96 twice. I feel okay, though.", time: "9:31 AM" },
      { speaker: "agent", text: "Thank you for rechecking. I’m going to ask a nurse to call you shortly.", time: "9:32 AM" },
    ],
  },
];

export const auditEvents = [
  { time: "09:43:18", event: "Escalation policy evaluated", actor: "Policy engine", detail: "HF-DISCHARGE-v3 → urgent" },
  { time: "09:43:17", event: "Clinical brief generated", actor: "Care Copilot", detail: "4 evidence spans retained" },
  { time: "09:42:51", event: "FHIR context retrieved", actor: "EHR adapter", detail: "Patient, Condition, MedicationRequest" },
  { time: "09:41:03", event: "Patient identity verified", actor: "Morgan Chen", detail: "2-factor verification" },
];

export const weeklyVolume = [58, 71, 66, 84, 92, 79, 96, 105, 99, 116, 128, 138];
