import type { CursorPayload } from '../contracts';

export function encodeCursor(data: CursorPayload): string {
  return Buffer.from(JSON.stringify(data)).toString('base64url');
}

export function decodeCursor<T extends CursorPayload = CursorPayload>(cursor: string): T | null {
  try {
    const json = Buffer.from(cursor, 'base64url').toString('utf-8');
    const data = JSON.parse(json) as T;
    if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
      return data as unknown as T;
    }
    return null;
  } catch {
    return null;
  }
}
