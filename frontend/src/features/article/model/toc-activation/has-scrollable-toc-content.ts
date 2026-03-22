import { getElementClientHeight, getElementScrollHeight } from '@/shared/lib/dom/scroll-element';

import { TOC_SCROLLABLE_EPSILON } from '../../constant';

export function hasScrollableTocContent(scrollContainer: HTMLElement): boolean {
  return (
    getElementScrollHeight(scrollContainer) - getElementClientHeight(scrollContainer) >
    TOC_SCROLLABLE_EPSILON
  );
}
