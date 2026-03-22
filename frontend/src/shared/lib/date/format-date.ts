import type { AppLocale } from '@/shared/lib/i18n/locale.types';

export function formatDate(dateIso: string, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateIso));
}
