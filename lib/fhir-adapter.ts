type FhirCoding = { system?: string; code?: string; display?: string };
type FhirResource = { resourceType?: string; id?: string; name?: { text?: string }[]; code?: { coding?: FhirCoding[]; text?: string }; medicationCodeableConcept?: { text?: string }; clinicalStatus?: { coding?: FhirCoding[] } };
type FhirBundle = { resourceType?: string; entry?: { resource?: FhirResource }[] };

export type PatientContext = { patientId: string; displayName: string; conditions: string[]; medications: string[]; warnings: string[] };

export function normalizeFhirBundle(bundle: FhirBundle): PatientContext {
  if (bundle.resourceType !== "Bundle" || !Array.isArray(bundle.entry)) throw new Error("Expected a FHIR Bundle");
  const resources = bundle.entry.map((entry) => entry.resource).filter((resource): resource is FhirResource => Boolean(resource));
  const patient = resources.find((resource) => resource.resourceType === "Patient");
  if (!patient?.id) throw new Error("FHIR Bundle is missing Patient identity");
  const conditions = resources.filter((resource) => resource.resourceType === "Condition").map((resource) => resource.code?.text ?? resource.code?.coding?.[0]?.display ?? "Unknown condition");
  const medications = resources.filter((resource) => resource.resourceType === "MedicationRequest").map((resource) => resource.medicationCodeableConcept?.text ?? "Unknown medication");
  return { patientId: patient.id, displayName: patient.name?.[0]?.text ?? "Unknown patient", conditions, medications, warnings: conditions.length ? [] : ["No active conditions returned"] };
}
