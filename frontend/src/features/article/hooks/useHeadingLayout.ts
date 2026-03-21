import { useEffect, useEffectEvent, useRef, useState, type RefObject } from "react";

import { useResizeObserver } from "@/shared/lib/layout/useResizeObserver";

import {
  TOC_ACTIVATION_LINE_RATIO,
  TOC_SCROLLABLE_EPSILON,
  getElementScrollTopWithinContainer,
} from "../model/toc-activation";

type HeadingMetric = {
  id: string;
  element: HTMLElement;
  offsetTop: number;
  targetScrollTop: number;
};

type UseHeadingLayoutOptions = {
  scrollContainerRef: RefObject<HTMLElement | null>;
  enabled: boolean;
};

type UseHeadingLayoutResult = {
  layoutVersion: number;
  getHeadingMetrics: () => HeadingMetric[];
  getHeadingById: (headingId: string) => HTMLElement | null;
  getFirstHeadingId: () => string;
  getLastHeadingId: () => string;
  getHeadingTargetScrollTop: (headingId: string) => number;
  getHeadingIdForCurrentScrollPosition: () => string;
  hasScrollableContent: () => boolean;
  getBottomSentinel: () => HTMLElement | null;
  refreshLayout: () => void;
};

function getHeadingId(heading: HTMLElement): string {
  return heading.dataset.tocId ?? "";
}

export function useHeadingLayout({
  scrollContainerRef,
  enabled,
}: UseHeadingLayoutOptions): UseHeadingLayoutResult {
  const [layoutVersion, setLayoutVersion] = useState(0);
  const headingMetricsRef = useRef<HeadingMetric[]>([]);
  const headingByIdRef = useRef<Map<string, HTMLElement>>(new Map());
  const bottomSentinelRef = useRef<HTMLElement | null>(null);
  const targetScrollTopCacheRef = useRef<WeakMap<HTMLElement, number>>(new WeakMap());

  const refreshLayout = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!enabled || scrollContainer === null) {
      headingMetricsRef.current = [];
      headingByIdRef.current = new Map();
      bottomSentinelRef.current = null;
      targetScrollTopCacheRef.current = new WeakMap();
      setLayoutVersion((version) => version + 1);
      return;
    }

    const nextMetrics: HeadingMetric[] = [];
    const nextHeadingById = new Map<string, HTMLElement>();
    const nextTargetScrollTopCache = new WeakMap<HTMLElement, number>();
    const headings = Array.from(
      scrollContainer.querySelectorAll<HTMLElement>("[data-toc-id]"),
    );

    for (const heading of headings) {
      const headingId = getHeadingId(heading);

      if (headingId === "") {
        continue;
      }

      const offsetTop = getElementScrollTopWithinContainer(scrollContainer, heading);
      const targetScrollTop = Math.max(
        0,
        offsetTop - scrollContainer.clientHeight * TOC_ACTIVATION_LINE_RATIO,
      );

      nextMetrics.push({
        id: headingId,
        element: heading,
        offsetTop,
        targetScrollTop,
      });
      nextHeadingById.set(headingId, heading);
      nextTargetScrollTopCache.set(heading, targetScrollTop);
    }

    headingMetricsRef.current = nextMetrics;
    headingByIdRef.current = nextHeadingById;
    bottomSentinelRef.current = scrollContainer.querySelector<HTMLElement>(
      "[data-toc-bottom-sentinel]",
    );
    targetScrollTopCacheRef.current = nextTargetScrollTopCache;
    setLayoutVersion((version) => version + 1);
  });

  useEffect(() => {
    refreshLayout();
    // Effect Events are intentionally non-reactive here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useResizeObserver({
    disabled: !enabled,
    dependencyToken: enabled,
    getTargets: () => {
      const scrollContainer = scrollContainerRef.current;
      const articleBody =
        scrollContainer?.querySelector<HTMLElement>("[data-article-body]") ?? null;

      return [scrollContainer, articleBody];
    },
    onResize: () => {
      refreshLayout();
    },
  });

  const getFirstHeadingId = useEffectEvent(() => {
    return headingMetricsRef.current[0]?.id ?? "";
  });

  const getLastHeadingId = useEffectEvent(() => {
    return headingMetricsRef.current.at(-1)?.id ?? "";
  });

  const getHeadingById = useEffectEvent((headingId: string) => {
    return headingByIdRef.current.get(headingId) ?? null;
  });

  const getHeadingTargetScrollTop = useEffectEvent((headingId: string) => {
    const heading = headingByIdRef.current.get(headingId);

    if (heading === undefined) {
      return 0;
    }

    return targetScrollTopCacheRef.current.get(heading) ?? 0;
  });

  const hasScrollableContent = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return false;
    }

    return (
      scrollContainer.scrollHeight - scrollContainer.clientHeight >
      TOC_SCROLLABLE_EPSILON
    );
  });

  const getHeadingIdForCurrentScrollPosition = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;
    const headingMetrics = headingMetricsRef.current;

    if (scrollContainer === null || headingMetrics.length === 0) {
      return "";
    }

    const activationLine =
      scrollContainer.scrollTop +
      scrollContainer.clientHeight * TOC_ACTIVATION_LINE_RATIO;
    let currentHeadingId = headingMetrics[0].id;

    for (const metric of headingMetrics) {
      if (metric.offsetTop <= activationLine) {
        currentHeadingId = metric.id;
        continue;
      }

      break;
    }

    return currentHeadingId;
  });

  const getBottomSentinel = useEffectEvent(() => {
    return bottomSentinelRef.current;
  });

  return {
    layoutVersion,
    getHeadingMetrics() {
      return headingMetricsRef.current;
    },
    getHeadingById(headingId) {
      return getHeadingById(headingId);
    },
    getFirstHeadingId() {
      return getFirstHeadingId();
    },
    getLastHeadingId() {
      return getLastHeadingId();
    },
    getHeadingTargetScrollTop(headingId) {
      return getHeadingTargetScrollTop(headingId);
    },
    getHeadingIdForCurrentScrollPosition() {
      return getHeadingIdForCurrentScrollPosition();
    },
    hasScrollableContent() {
      return hasScrollableContent();
    },
    getBottomSentinel() {
      return getBottomSentinel();
    },
    refreshLayout() {
      refreshLayout();
    },
  };
}
