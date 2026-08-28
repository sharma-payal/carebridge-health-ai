const patterns = [
  { name: "phone", expression: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g },
  { name: "email", expression: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { name: "ssn", expression: /\b\d{3}-\d{2}-\d{4}\b/g },
  { name: "medical-record-number", expression: /\bMRN[:\s#-]*[A-Z0-9-]{5,}\b/gi },
] as const;

export function redactPhi(text: string): { redacted: string; categories: string[] } {
  const categories = new Set<string>();
  let redacted = text;
  for (const pattern of patterns) {
    redacted = redacted.replace(pattern.expression, () => {
      categories.add(pattern.name);
      return `[REDACTED_${pattern.name.toUpperCase().replaceAll("-", "_")}]`;
    });
  }
  return { redacted, categories: [...categories] };
}
