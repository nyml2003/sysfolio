import { useEffect, useEffectEvent, useRef, useState, type RefObject } from "react";

import { isSome, none, some, type Option } from "@/shared/lib/monads/option";

import { useResizeObserver } from "@/shared/lib/layout/useResizeObserver";

import {
  TOC_ACTIVATION_LINE_RATIO,
  TOC_SCROLLABLE_EPSILON,
  getElementScrollTopWithinContainer,
} from "../model/toc-activation";
import { getTocHeadingId } from "../model/toc-heading-id";

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
  getFirstHeadingId: () => Option<string>;
  getLastHeadingId: () => Option<string>;
  getHeadingTargetScrollTop: (headingId: string) => number;
  getHeadingIdForCurrentScrollPosition: () => Option<string>;
  hasScrollableContent: () => boolean;
  getBottomSentinel: () => HTMLElement | null;
  refreshLayout: () => void;
};

function areHeadingMetricsEqual(
  previousMetrics: HeadingMetric[],
  nextMetrics: HeadingMetric[],
): boolean {
  if (previousMetrics.length !== nextMetrics.length) {
    return false;
  }

  for (let index = 0; index < previousMetrics.length; index += 1) {
    const previousMetric = previousMetrics[index];
    const nextMetric = nextMetrics[index];

    if (
      previousMetric.id !== nextMetric.id ||
      previousMetric.element !== nextMetric.element ||
      Math.abs(previousMetric.offsetTop - nextMetric.offsetTop) > 0.5 ||
      Math.abs(previousMetric.targetScrollTop - nextMetric.targetScrollTop) > 0.5
    ) {
      return false;
    }
  }

  return true;
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
      const hadLayout =
        headingMetricsRef.current.length > 0 ||
        headingByIdRef.current.size > 0 ||
        bottomSentinelRef.current !== null;

      if (!hadLayout) {
        return;
      }

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
      const headingId = getTocHeadingId(heading);

      if (!isSome(headingId)) {
        continue;
      }

      const offsetTop = getElementScrollTopWithinContainer(scrollContainer, heading);
      const targetScrollTop = Math.max(
        0,
        offsetTop - scrollContainer.clientHeight * TOC_ACTIVATION_LINE_RATIO,
      );

      nextMetrics.push({
        id: headingId.value,
        element: heading,
        offsetTop,
        targetScrollTop,
      });
      nextHeadingById.set(headingId.value, heading);
      nextTargetScrollTopCache.set(heading, targetScrollTop);
    }

    const nextBottomSentinel = scrollContainer.querySelector<HTMLElement>(
      "[data-toc-bottom-sentinel]",
    );
    const layoutChanged =
      !areHeadingMetricsEqual(headingMetricsRef.current, nextMetrics) ||
      bottomSentinelRef.current !== nextBottomSentinel;

    if (!layoutChanged) {
      return;
    }

    headingMetricsRef.current = nextMetrics;
    headingByIdRef.current = nextHeadingById;
    bottomSentinelRef.current = nextBottomSentinel;
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
    dependencyToken:
      scrollContainerRef.current?.querySelector<HTMLElement>("[data-article-body]") ?? enabled,
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
    const firstHeadingMetric = headingMetricsRef.current[0];

    return firstHeadingMetric === undefined ? none() : some(firstHeadingMetric.id);
  });

  const getLastHeadingId = useEffectEvent(() => {
    const lastHeadingMetric = headingMetricsRef.current.at(-1);

    return lastHeadingMetric === undefined ? none() : some(lastHeadingMetric.id);
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
      return none();
    }

    const activationLine =
      scrollContainer.scrollTop +
      scrollContainer.clientHeight * TOC_ACTIVATION_LINE_RATIO;
    let currentHeadingId = headingMetrics[0]?.id;

    for (const metric of headingMetrics) {
      if (metric.offsetTop <= activationLine) {
        currentHeadingId = metric.id;
        continue;
      }

      break;
    }

    return currentHeadingId === undefined ? none() : some(currentHeadingId);
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
