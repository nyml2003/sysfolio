import {
  getElementClientHeight,
  getElementScrollTop,
} from "@/shared/lib/dom/scroll-element";

import { TOC_ACTIVATION_LINE_RATIO } from "../../constant";

export function getTocActivationLine(scrollContainer: HTMLElement): number {
  return (
    getElementScrollTop(scrollContainer) +
    getElementClientHeight(scrollContainer) * TOC_ACTIVATION_LINE_RATIO
  );
}
