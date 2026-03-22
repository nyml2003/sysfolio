import { getElementScrollTop } from '@/shared/lib/dom/scroll-element';

import { TOC_TARGET_EPSILON } from '../../constant';

import { getTocTargetScrollTop } from './get-toc-target-scroll-top';
import { isAtScrollBottom } from './is-at-scroll-bottom';

export function isTocTargetScrollReached(
  scrollContainer: HTMLElement,
  element: HTMLElement
): boolean {
  return (
    Math.abs(
      getElementScrollTop(scrollContainer) - getTocTargetScrollTop(scrollContainer, element)
    ) <= TOC_TARGET_EPSILON || isAtScrollBottom(scrollContainer)
  );
}
