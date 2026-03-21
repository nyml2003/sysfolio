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
  const onActiveHeadingChangeRef = useRef(onActiveHeadingChange);
  const onBottomVisibilityChangeRef = useRef(onBottomVisibilityChange);
  const intersectingHeadingIdsRef = useRef<Record<string, true>>({});

  onActiveHeadingChangeRef.current = onActiveHeadingChange;
  onBottomVisibilityChangeRef.current = onBottomVisibilityChange;

  useEffect(() => {
    const observedHeadings = headings;
    const intersectingHeadingIds = intersectingHeadingIdsRef.current;

    if (disabled || !isSome(scrollContainer) || observedHeadings.length === 0) {
      intersectingHeadingIdsRef.current = {};
      onBottomVisibilityChangeRef.current(false);
      return undefined;
    }

    const scrollContainerElement = scrollContainer.value;

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
          isSome(bottomSentinel) && isBottomVisible(scrollContainerElement),
        );
      };

      syncFallbackState();
      scrollContainerElement.addEventListener("scroll", syncFallbackState, { passive: true });
      window.addEventListener("resize", syncFallbackState);

      return () => {
        intersectingHeadingIdsRef.current = {};
        scrollContainerElement.removeEventListener("scroll", syncFallbackState);
        window.removeEventListener("resize", syncFallbackState);
      };
    }

    const emitActiveHeadingChange = () => {
      if (Object.keys(intersectingHeadingIds).length === 0) {
        return;
      }

      let activeHeadingId: Option<string> = none();

      for (const heading of observedHeadings) {
        if (intersectingHeadingIds[heading.id] !== true) {
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
    const headingObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const headingId = observedHeadings.find(
            (heading) => heading.element === entry.target,
          )?.id;

          if (headingId === undefined) {
            continue;
          }

          if (entry.isIntersecting) {
            intersectingHeadingIds[headingId] = true;
            continue;
          }

          delete intersectingHeadingIds[headingId];
        }

        emitActiveHeadingChange();
      },
      {
        root: scrollContainerElement,
        rootMargin: `${rootMarginTop}px 0px ${rootMarginBottom}px 0px`,
        threshold: 0,
      },
    );
    const bottomObserver = isSome(bottomSentinel)
      ? some(
          new IntersectionObserver(
            (entries) => {
              const entry = entries[0];

              onBottomVisibilityChangeRef.current(
                entry === undefined ? false : entry.isIntersecting,
              );
            },
            {
              root: scrollContainerElement,
              threshold: 1,
            },
          ),
        )
      : none();

    for (const heading of observedHeadings) {
      headingObserver.observe(heading.element);
    }

    if (isSome(bottomObserver) && isSome(bottomSentinel)) {
      bottomObserver.value.observe(bottomSentinel.value);
    }

    return () => {
      intersectingHeadingIdsRef.current = {};

      for (const heading of observedHeadings) {
        headingObserver.unobserve(heading.element);
      }

      if (isSome(bottomObserver) && isSome(bottomSentinel)) {
        bottomObserver.value.unobserve(bottomSentinel.value);
      }

      headingObserver.disconnect();
      if (isSome(bottomObserver)) {
        bottomObserver.value.disconnect();
      }
    };
  }, [
    activationLineRatio,
    bottomSentinel,
    disabled,
    headings,
    layoutVersion,
    scrollContainer,
  ]);
}
