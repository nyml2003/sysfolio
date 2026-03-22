import { fromNullable, type Option } from '@/shared/lib/monads/option';

export function getDocumentElementOption(): Option<HTMLElement> {
  return fromNullable(typeof document === 'undefined' ? null : document.documentElement);
}
