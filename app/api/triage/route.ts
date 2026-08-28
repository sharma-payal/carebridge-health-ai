import { evaluateTriage, type TriageInput } from "../../../lib/triage-policy";
import { redactPhi } from "../../../lib/redaction";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  try {
    const body = await request.json() as TriageInput & { transcript?: string };
    if (!Array.isArray(body.symptoms)) return Response.json({ requestId, error: "symptoms must be an array" }, { status: 400 });
    const decision = evaluateTriage(body);
    const transcript = body.transcript ? redactPhi(body.transcript) : undefined;
    return Response.json({ requestId, decision, transcript, evaluatedAt: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ requestId, error: "invalid JSON body" }, { status: 400 });
  }
}
