export interface CursorListResponse<T> {
  items: T[];
  nextCursor?: string;
}

export type CursorPayload = Record<string, string | number>;
