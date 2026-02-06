import type { CursorListResponse } from '../../../shared/contracts';

export const SUBSCRIBER_LANGS = ['es', 'en'] as const;
export type SubscriberLang = (typeof SUBSCRIBER_LANGS)[number];

export interface SubscribeInput {
  email: string;
  lang: SubscriberLang;
}

export interface SubscribeResult {
  ok: true;
  message?: string;
}

export interface SubscriberCountResponse {
  count: number;
}

export interface SubscriberListItem {
  id: string;
  email: string;
  lang: SubscriberLang;
  createdAt: string;
}

export type SubscribersListResponse = CursorListResponse<SubscriberListItem>;
