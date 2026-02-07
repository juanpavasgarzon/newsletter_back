export function toISOString(value: Date | string | undefined): string {
  if (value == null) {
    return new Date().toISOString();
  }
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
