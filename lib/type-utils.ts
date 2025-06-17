
// Type utility functions for converting Prisma JsonValue to expected types

export function jsonToStringArray(value: any): string[] {
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string');
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function ensureStringArray(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(item => String(item)) : [value];
    } catch {
      return [value];
    }
  }
  return [];
}

export function safeJsonToStringArray(value: any): string[] {
  try {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(String) : [value];
      } catch {
        // If JSON parsing fails, treat as a single string value
        return [value];
      }
    }
    return [];
  } catch {
    return [];
  }
}
