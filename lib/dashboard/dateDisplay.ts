export function formatSubmissionDateValue(value: string): string {
  const raw = value.trim();
  if (!raw) return value;

  const isIsoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  const isIsoDateTime = /^\d{4}-\d{2}-\d{2}T/.test(raw);
  if (!isIsoDateOnly && !isIsoDateTime) return value;

  const parsed = new Date(isIsoDateOnly ? `${raw}T00:00:00` : raw);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function isDateLikeField(fieldName: string, fieldType?: string): boolean {
  if (fieldType?.toLowerCase() === "date") return true;
  const normalized = fieldName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    normalized === "birthdate" ||
    normalized === "dateofbirth" ||
    normalized === "dob" ||
    normalized.endsWith("date")
  );
}
