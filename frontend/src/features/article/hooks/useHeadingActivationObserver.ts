import { useEffect, useRef, type RefObject } from "react";

import { isSome, none, type Option } from "@/shared/lib/monads/option";

import {
  TOC_BOTTOM_EPSILON,
  TOC_OBSERVER_BAND_HEIGHT,
  getElementScrollTopWithinContainer,
} from "../model/toc-activation";
import { getTocHeadingId } from "../model/toc-heading-id";

type UseHeadingActivationObserverOptions = {
  scrollContainerRef: RefObject<HTMLElement | null>;
  getHeadings: () => HTMLElement[];
  getBottomSentinel: () => HTMLElement | null;
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
  scrollContainerRef,
  getHeadings,
  getBottomSentinel,
  layoutVersion,
  activationLineRatio,
  disabled,
  onActiveHeadingChange,
  onBottomVisibilityChange,
}: UseHeadingActivationObserverOptions) {
  const onActiveHeadingChangeRef = useRef(onActiveHeadingChange);
  const onBottomVisibilityChangeRef = useRef(onBottomVisibilityChange);
  const getHeadingsRef = useRef(getHeadings);
  const getBottomSentinelRef = useRef(getBottomSentinel);
  const intersectingHeadingIdsRef = useRef<Set<string>>(new Set());

  onActiveHeadingChangeRef.current = onActiveHeadingChange;
  onBottomVisibilityChangeRef.current = onBottomVisibilityChange;
  getHeadingsRef.current = getHeadings;
  getBottomSentinelRef.current = getBottomSentinel;

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const headings = getHeadingsRef.current();
    const bottomSentinel = getBottomSentinelRef.current();
    const intersectingHeadingIds = intersectingHeadingIdsRef.current;

    if (disabled || scrollContainer === null || headings.length === 0) {
      intersectingHeadingIds.clear();
      onBottomVisibilityChangeRef.current(false);
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      const syncFallbackState = () => {
        const activationLine =
          scrollContainer.scrollTop + scrollContainer.clientHeight * activationLineRatio;
        let activeHeadingId: Option<string> = none();

        for (const heading of headings) {
          const headingId = getTocHeadingId(heading);

          if (!isSome(headingId)) {
            continue;
          }

          if (getElementScrollTopWithinContainer(scrollContainer, heading) <= activationLine) {
            activeHeadingId = headingId;
            continue;
          }

          break;
        }

        if (isSome(activeHeadingId)) {
          onActiveHeadingChangeRef.current(activeHeadingId.value);
        }

        onBottomVisibilityChangeRef.current(
          bottomSentinel !== null && isBottomVisible(scrollContainer),
        );
      };

      syncFallbackState();
      scrollContainer.addEventListener("scroll", syncFallbackState, { passive: true });
      window.addEventListener("resize", syncFallbackState);

      return () => {
        intersectingHeadingIds.clear();
        scrollContainer.removeEventListener("scroll", syncFallbackState);
        window.removeEventListener("resize", syncFallbackState);
      };
    }

    const emitActiveHeadingChange = () => {
      if (intersectingHeadingIds.size === 0) {
        return;
      }

      let activeHeadingId: Option<string> = none();

      for (const heading of headings) {
        const headingId = getTocHeadingId(heading);

        if (!isSome(headingId) || !intersectingHeadingIds.has(headingId.value)) {
          continue;
        }

        activeHeadingId = headingId;
      }

      if (isSome(activeHeadingId)) {
        onActiveHeadingChangeRef.current(activeHeadingId.value);
      }
    };

    const bandHeight = TOC_OBSERVER_BAND_HEIGHT;
    const activationTop = scrollContainer.clientHeight * activationLineRatio;
    const rootMarginTop = -activationTop;
    const rootMarginBottom =
      -(scrollContainer.clientHeight - activationTop - bandHeight);
    const headingObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const headingId = getTocHeadingId(entry.target as HTMLElement);

          if (!isSome(headingId)) {
            continue;
          }

          if (entry.isIntersecting) {
            intersectingHeadingIds.add(headingId.value);
            continue;
          }

          intersectingHeadingIds.delete(headingId.value);
        }

        emitActiveHeadingChange();
      },
      {
        root: scrollContainer,
        rootMargin: `${rootMarginTop}px 0px ${rootMarginBottom}px 0px`,
        threshold: 0,
      },
    );
    const bottomObserver =
      bottomSentinel === null
        ? null
        : new IntersectionObserver(
            (entries) => {
              const entry = entries[0];

              onBottomVisibilityChangeRef.current(entry?.isIntersecting ?? false);
            },
            {
              root: scrollContainer,
              threshold: 1,
            },
          );

    for (const heading of headings) {
      headingObserver.observe(heading);
    }

    if (bottomObserver !== null && bottomSentinel !== null) {
      bottomObserver.observe(bottomSentinel);
    }

    return () => {
      intersectingHeadingIds.clear();

      for (const heading of headings) {
        headingObserver.unobserve(heading);
      }

      if (bottomObserver !== null && bottomSentinel !== null) {
        bottomObserver.unobserve(bottomSentinel);
      }

      headingObserver.disconnect();
      bottomObserver?.disconnect();
    };
  }, [
    activationLineRatio,
    disabled,
    layoutVersion,
    scrollContainerRef,
  ]);
}
