
// Temporary type utilities to fix build issues

export function safeJsonCast<T>(value: any, fallback: T): T {
  try {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return value as T;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export function safeStringArrayCast(value: any): string[] {
  if (Array.isArray(value)) return value.filter(v => typeof v === 'string');
  if (typeof value === 'string') return [value];
  return [];
}

export function safeEmailExtract(preferences: any): string | undefined {
  if (!preferences) return undefined;
  if (typeof preferences === 'object' && preferences.email) {
    return typeof preferences.email === 'string' ? preferences.email : undefined;
  }
  return undefined;
}
