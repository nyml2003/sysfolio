import { useEffect, useRef } from "react";

import { isSome, none, some, type Option } from "@/shared/lib/monads/option";

import {
  TOC_BOTTOM_EPSILON,
  TOC_OBSERVER_BAND_HEIGHT,
  getElementScrollTopWithinContainer,
} from "../model/toc-activation";
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
    scrollContainer.scrollTop + scrollContainer.clientHeight >=
    scrollContainer.scrollHeight - TOC_BOTTOM_EPSILON
  );
}

export function useHeadingActivationObserver({
  layoutVersion,
  activationLineRatio,
  disabled,
  onActiveHeadingChange,
  onBottomVisibilityChange,
}: UseHeadingActivationObserverOptions) {
  const { bottomSentinel, headings, scrollContainer } = useArticleDom();
  const bottomSentinelDependency = isSome(bottomSentinel) ? bottomSentinel.value : false;
  const scrollContainerDependency = isSome(scrollContainer) ? scrollContainer.value : false;
  const onActiveHeadingChangeRef = useRef(onActiveHeadingChange);
  const onBottomVisibilityChangeRef = useRef(onBottomVisibilityChange);
  const intersectingHeadingIdsRef = useRef<Set<string>>(new Set());

  onActiveHeadingChangeRef.current = onActiveHeadingChange;
  onBottomVisibilityChangeRef.current = onBottomVisibilityChange;

  useEffect(() => {
    const observedHeadings = headings;
    const intersectingHeadingIds = intersectingHeadingIdsRef.current;

    if (disabled || scrollContainerDependency === false || observedHeadings.length === 0) {
      intersectingHeadingIds.clear();
      onBottomVisibilityChangeRef.current(false);
      return undefined;
    }

    const scrollContainerElement = scrollContainerDependency;

    if (typeof IntersectionObserver === "undefined") {
      const syncFallbackState = () => {
        const activationLine =
          scrollContainerElement.scrollTop +
          scrollContainerElement.clientHeight * activationLineRatio;
        let activeHeadingId: Option<string> = none();

        for (const heading of observedHeadings) {
          if (
            getElementScrollTopWithinContainer(scrollContainerElement, heading.element) <=
            activationLine
          ) {
            activeHeadingId = some(heading.id);
            continue;
          }

          break;
        }

        if (isSome(activeHeadingId)) {
          onActiveHeadingChangeRef.current(activeHeadingId.value);
        }

        onBottomVisibilityChangeRef.current(
          bottomSentinelDependency !== false && isBottomVisible(scrollContainerElement),
        );
      };

      syncFallbackState();
      scrollContainerElement.addEventListener("scroll", syncFallbackState, { passive: true });
      window.addEventListener("resize", syncFallbackState);

      return () => {
        intersectingHeadingIds.clear();
        scrollContainerElement.removeEventListener("scroll", syncFallbackState);
        window.removeEventListener("resize", syncFallbackState);
      };
    }

    const emitActiveHeadingChange = () => {
      if (intersectingHeadingIds.size === 0) {
        return;
      }

      let activeHeadingId: Option<string> = none();

      for (const heading of observedHeadings) {
        if (!intersectingHeadingIds.has(heading.id)) {
          continue;
        }

        activeHeadingId = some(heading.id);
      }

      if (isSome(activeHeadingId)) {
        onActiveHeadingChangeRef.current(activeHeadingId.value);
      }
    };

    const bandHeight = TOC_OBSERVER_BAND_HEIGHT;
    const activationTop = scrollContainerElement.clientHeight * activationLineRatio;
    const rootMarginTop = -activationTop;
    const rootMarginBottom =
      -(scrollContainerElement.clientHeight - activationTop - bandHeight);
    const headingIdsByElement = new Map(
      observedHeadings.map((heading) => [heading.element, heading.id]),
    );
    const headingObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const headingId = headingIdsByElement.get(entry.target as HTMLElement);

          if (headingId === undefined) {
            continue;
          }

          if (entry.isIntersecting) {
            intersectingHeadingIds.add(headingId);
            continue;
          }

          intersectingHeadingIds.delete(headingId);
        }

        emitActiveHeadingChange();
      },
      {
        root: scrollContainerElement,
        rootMargin: `${rootMarginTop}px 0px ${rootMarginBottom}px 0px`,
        threshold: 0,
      },
    );
    const bottomObserver =
      bottomSentinelDependency === false
        ? null
        : new IntersectionObserver(
            (entries) => {
              const entry = entries[0];

              onBottomVisibilityChangeRef.current(entry?.isIntersecting ?? false);
            },
            {
              root: scrollContainerElement,
              threshold: 1,
            },
          );

    for (const heading of observedHeadings) {
      headingObserver.observe(heading.element);
    }

    if (bottomObserver !== null && bottomSentinelDependency !== false) {
      bottomObserver.observe(bottomSentinelDependency);
    }

    return () => {
      intersectingHeadingIds.clear();

      for (const heading of observedHeadings) {
        headingObserver.unobserve(heading.element);
      }

      if (bottomObserver !== null && bottomSentinelDependency !== false) {
        bottomObserver.unobserve(bottomSentinelDependency);
      }

      headingObserver.disconnect();
      bottomObserver?.disconnect();
    };
  }, [
    activationLineRatio,
    bottomSentinelDependency,
    disabled,
    headings,
    layoutVersion,
    scrollContainerDependency,
  ]);
}
