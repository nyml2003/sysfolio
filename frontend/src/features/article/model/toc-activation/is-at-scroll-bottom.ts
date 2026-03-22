import {
  getElementClientHeight,
  getElementScrollHeight,
  getElementScrollTop,
} from '@/shared/lib/dom/scroll-element';

import { TOC_BOTTOM_EPSILON } from '../../constant';

export function isAtScrollBottom(scrollContainer: HTMLElement): boolean {
  return (
    getElementScrollTop(scrollContainer) + getElementClientHeight(scrollContainer) >=
    getElementScrollHeight(scrollContainer) - TOC_BOTTOM_EPSILON
  );
}
