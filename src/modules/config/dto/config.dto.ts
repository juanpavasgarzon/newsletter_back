import type { ConfigLang } from '../contracts';

export function normalizeConfigLang(lang?: string): ConfigLang {
  if (lang === 'es' || lang === 'en') {
    return lang;
  }
  return 'es';
}
