import { useEffect, useEffectEvent, useRef } from "react";

import { getWindowOption } from "@/shared/lib/dom/browser-globals";
import {
  getElementClientHeight,
  getElementScrollHeight,
  getElementScrollTop,
  getElementScrollTopWithinContainer,
} from "@/shared/lib/dom/scroll-element";
import { useEventListener } from "@/shared/lib/dom/useEventListener";
import {
  hasIntersectionObserverSupport,
  useIntersectionObserver,
} from "@/shared/lib/dom/useIntersectionObserver";
import { isSome, none, some, type Option } from "@/shared/lib/monads/option";

import {
  TOC_BOTTOM_EPSILON,
  TOC_BOTTOM_SENTINEL_THRESHOLD,
  TOC_HEADING_OBSERVER_THRESHOLD,
  TOC_OBSERVER_BAND_HEIGHT,
} from "../constant";
import { useArticleDom } from "../context/article-dom.context";

type UseHeadingActivationObserverOptions = {
  layoutVersion: number;
  activationLineRatio: number;
  disabled: boolean;
  onActiveHeadingChange: (headingId: string) => void;
  onBottomVisibilityChange: (visible: boolean) => void;
};

function isBottomVisible(scrollContainer: HTMLElement): boolean {
  return (
    getElementScrollTop(scrollContainer) + getElementClientHeight(scrollContainer) >=
    getElementScrollHeight(scrollContainer) - TOC_BOTTOM_EPSILON
  );
}

function resolveActiveHeadingIdForActivationLine(
  observedHeadings: ReadonlyArray<{ id: string; element: HTMLElement }>,
  scrollContainerElement: HTMLElement,
  activationLineRatio: number,
): Option<string> {
  const activationLine =
    getElementScrollTop(scrollContainerElement) +
    getElementClientHeight(scrollContainerElement) * activationLineRatio;
  const activeHeading = observedHeadings
    .filter(
      (heading) =>
        getElementScrollTopWithinContainer(scrollContainerElement, heading.element) <=
        activationLine,
    )
    .at(-1);

  return activeHeading === undefined ? none() : some(activeHeading.id);
}

function resolveIntersectingActiveHeadingId(
  observedHeadings: ReadonlyArray<{ id: string; element: HTMLElement }>,
  intersectingHeadingIds: Record<string, true>,
): Option<string> {
  const activeHeading = observedHeadings
    .filter((heading) => intersectingHeadingIds[heading.id] === true)
    .at(-1);

  return activeHeading === undefined ? none() : some(activeHeading.id);
}

export function useHeadingActivationObserver({
  layoutVersion,
  activationLineRatio,
  disabled,
  onActiveHeadingChange,
  onBottomVisibilityChange,
}: UseHeadingActivationObserverOptions) {
  const { bottomSentinel, headings, scrollContainer } = useArticleDom();
  const onActiveHeadingChangeRef = useRef(onActiveHeadingChange);
  const onBottomVisibilityChangeRef = useRef(onBottomVisibilityChange);
  const intersectingHeadingIdsRef = useRef<Record<string, true>>({});
  const intersectionObserverSupported = hasIntersectionObserverSupport();
  const shouldUseFallback =
    !intersectionObserverSupported &&
    !disabled &&
    isSome(scrollContainer) &&
    headings.length > 0;

  onActiveHeadingChangeRef.current = onActiveHeadingChange;
  onBottomVisibilityChangeRef.current = onBottomVisibilityChange;

  const syncFallbackState = useEffectEvent(() => {
    if (!shouldUseFallback || !isSome(scrollContainer)) {
      return;
    }

    const activeHeadingId = resolveActiveHeadingIdForActivationLine(
      headings,
      scrollContainer.value,
      activationLineRatio,
    );

    if (isSome(activeHeadingId)) {
      onActiveHeadingChangeRef.current(activeHeadingId.value);
    }

    onBottomVisibilityChangeRef.current(
      isSome(bottomSentinel) && isBottomVisible(scrollContainer.value),
    );
  });

  useEffect(() => {
    if (!shouldUseFallback) {
      intersectingHeadingIdsRef.current = {};
      onBottomVisibilityChangeRef.current(false);
      return;
    }

    syncFallbackState();
  }, [
    activationLineRatio,
    bottomSentinel,
    headings,
    scrollContainer,
    shouldUseFallback,
    syncFallbackState,
  ]);

  useEventListener({
    target: shouldUseFallback ? scrollContainer : none(),
    type: "scroll",
    listener: syncFallbackState,
    options: { passive: true },
    disabled: !shouldUseFallback,
  });

  useEventListener({
    target: shouldUseFallback ? getWindowOption() : none(),
    type: "resize",
    listener: syncFallbackState,
    options: undefined,
    disabled: !shouldUseFallback,
  });

  useIntersectionObserver({
    root: scrollContainer,
    getTargets: () => headings.map((heading) => some(heading.element)),
    onIntersect: (entries) => {
      const intersectingHeadingIds = intersectingHeadingIdsRef.current;

      for (const entry of entries) {
        const headingId = headings.find((heading) => heading.element === entry.target)?.id;

        if (headingId === undefined) {
          continue;
        }

        if (entry.isIntersecting) {
          intersectingHeadingIds[headingId] = true;
          continue;
        }

        delete intersectingHeadingIds[headingId];
      }

      const activeHeadingId = resolveIntersectingActiveHeadingId(
        headings,
        intersectingHeadingIds,
      );

      if (isSome(activeHeadingId)) {
        onActiveHeadingChangeRef.current(activeHeadingId.value);
      }
    },
    rootMargin: isSome(scrollContainer)
      ? (() => {
          const bandHeight = TOC_OBSERVER_BAND_HEIGHT;
          const activationTop = getElementClientHeight(scrollContainer.value) * activationLineRatio;
          const rootMarginTop = -activationTop;
          const rootMarginBottom =
            -(getElementClientHeight(scrollContainer.value) - activationTop - bandHeight);

          return `${rootMarginTop}px 0px ${rootMarginBottom}px 0px`;
        })()
      : "0px 0px 0px 0px",
    threshold: TOC_HEADING_OBSERVER_THRESHOLD,
    disabled: disabled || !intersectionObserverSupported || !isSome(scrollContainer) || headings.length === 0,
    dependencyToken: layoutVersion,
  });

  useIntersectionObserver({
    root: scrollContainer,
    getTargets: () => [bottomSentinel],
    onIntersect: (entries) => {
      const entry = entries[0];

      onBottomVisibilityChangeRef.current(
        entry === undefined ? false : entry.isIntersecting,
      );
    },
    rootMargin: "0px",
    threshold: TOC_BOTTOM_SENTINEL_THRESHOLD,
    disabled: disabled || !intersectionObserverSupported || !isSome(scrollContainer) || !isSome(bottomSentinel),
    dependencyToken: layoutVersion,
  });
}
