import { getElementClientHeight } from "@/shared/lib/dom/scroll-element";

import { TOC_ACTIVATION_LINE_RATIO } from "../../constant";

import { getElementScrollTopWithinContainer } from "./get-element-scroll-top-within-container";

export function getTocTargetScrollTop(
  scrollContainer: HTMLElement,
  element: HTMLElement,
): number {
  return Math.max(
    0,
    getElementScrollTopWithinContainer(scrollContainer, element) -
      getElementClientHeight(scrollContainer) * TOC_ACTIVATION_LINE_RATIO,
  );
}
