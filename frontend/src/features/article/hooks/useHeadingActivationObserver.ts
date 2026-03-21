import { useEffect, useRef, type RefObject } from "react";

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

function getHeadingId(heading: HTMLElement): string {
  return heading.dataset.tocId ?? "";
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

    const bandHeight = 4;
    const activationTop = scrollContainer.clientHeight * activationLineRatio;
    const rootMarginTop = -activationTop;
    const rootMarginBottom =
      -(scrollContainer.clientHeight - activationTop - bandHeight);
    const headingObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const headingId = getHeadingId(entry.target as HTMLElement);

          if (headingId === "") {
            continue;
          }

          if (entry.isIntersecting) {
            intersectingHeadingIds.add(headingId);
            continue;
          }

          intersectingHeadingIds.delete(headingId);
        }

        if (intersectingHeadingIds.size === 0) {
          return;
        }

        let activeHeadingId = "";

        for (const heading of headings) {
          const headingId = getHeadingId(heading);

          if (!intersectingHeadingIds.has(headingId)) {
            continue;
          }

          activeHeadingId = headingId;
        }

        if (activeHeadingId !== "") {
          onActiveHeadingChangeRef.current(activeHeadingId);
        }
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
