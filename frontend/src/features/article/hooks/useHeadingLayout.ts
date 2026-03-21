import { useEffect, useEffectEvent, useRef, useState } from "react";

import { fromNullable, isSome, none, some, type Option } from "@/shared/lib/monads/option";

import { useResizeObserver } from "@/shared/lib/layout/useResizeObserver";

import { useArticleDom } from "../context/article-dom.context";
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
  enabled: boolean;
};

type UseHeadingLayoutResult = {
  layoutVersion: number;
  getHeadingMetrics: () => HeadingMetric[];
  getHeadingById: (headingId: string) => Option<HTMLElement>;
  getFirstHeadingId: () => Option<string>;
  getLastHeadingId: () => Option<string>;
  getHeadingTargetScrollTop: (headingId: string) => number;
  getHeadingIdForCurrentScrollPosition: () => Option<string>;
  hasScrollableContent: () => boolean;
  getBottomSentinel: () => Option<HTMLElement>;
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
  enabled,
}: UseHeadingLayoutOptions): UseHeadingLayoutResult {
  const { articleBody, bottomSentinel, headings, scrollContainer } = useArticleDom();
  const articleBodyDependency = isSome(articleBody) ? articleBody.value : false;
  const bottomSentinelDependency = isSome(bottomSentinel) ? bottomSentinel.value : false;
  const scrollContainerDependency = isSome(scrollContainer) ? scrollContainer.value : false;
  const [layoutVersion, setLayoutVersion] = useState(0);
  const headingMetricsRef = useRef<HeadingMetric[]>([]);
  const headingByIdRef = useRef<Map<string, HTMLElement>>(new Map());
  const bottomSentinelRef = useRef<Option<HTMLElement>>(none());
  const targetScrollTopCacheRef = useRef<WeakMap<HTMLElement, number>>(new WeakMap());

  const refreshLayout = useEffectEvent(() => {
    if (!enabled || !isSome(scrollContainer)) {
      const hadLayout =
        headingMetricsRef.current.length > 0 ||
        headingByIdRef.current.size > 0 ||
        isSome(bottomSentinelRef.current);

      if (!hadLayout) {
        return;
      }

      headingMetricsRef.current = [];
      headingByIdRef.current = new Map();
      bottomSentinelRef.current = none();
      targetScrollTopCacheRef.current = new WeakMap();
      setLayoutVersion((version) => version + 1);
      return;
    }

    const scrollContainerElement = scrollContainer.value;

    const nextMetrics: HeadingMetric[] = [];
    const nextHeadingById = new Map<string, HTMLElement>();
    const nextTargetScrollTopCache = new WeakMap<HTMLElement, number>();

    for (const heading of headings) {
      const offsetTop = getElementScrollTopWithinContainer(
        scrollContainerElement,
        heading.element,
      );
      const targetScrollTop = Math.max(
        0,
        offsetTop - scrollContainerElement.clientHeight * TOC_ACTIVATION_LINE_RATIO,
      );

      nextMetrics.push({
        id: heading.id,
        element: heading.element,
        offsetTop,
        targetScrollTop,
      });
      nextHeadingById.set(heading.id, heading.element);
      nextTargetScrollTopCache.set(heading.element, targetScrollTop);
    }
    const layoutChanged =
      !areHeadingMetricsEqual(headingMetricsRef.current, nextMetrics) ||
      bottomSentinelRef.current !== bottomSentinel;

    if (!layoutChanged) {
      return;
    }

    headingMetricsRef.current = nextMetrics;
    headingByIdRef.current = nextHeadingById;
    bottomSentinelRef.current = bottomSentinel;
    targetScrollTopCacheRef.current = nextTargetScrollTopCache;
    setLayoutVersion((version) => version + 1);
  });

  useEffect(() => {
    refreshLayout();
    // Effect Events are intentionally non-reactive here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    articleBodyDependency,
    bottomSentinelDependency,
    enabled,
    headings,
    scrollContainerDependency,
  ]);

  useResizeObserver({
    disabled: !enabled,
    dependencyToken: isSome(articleBody)
      ? articleBody.value
      : isSome(scrollContainer)
        ? scrollContainer.value
        : enabled,
    getTargets: () => {
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
    return fromNullable(headingByIdRef.current.get(headingId));
  });

  const getHeadingTargetScrollTop = useEffectEvent((headingId: string) => {
    const heading = headingByIdRef.current.get(headingId);

    if (heading === undefined) {
      return 0;
    }

    return targetScrollTopCacheRef.current.get(heading) ?? 0;
  });

  const hasScrollableContent = useEffectEvent(() => {
    if (!isSome(scrollContainer)) {
      return false;
    }

    return (
      scrollContainer.value.scrollHeight - scrollContainer.value.clientHeight >
      TOC_SCROLLABLE_EPSILON
    );
  });

  const getHeadingIdForCurrentScrollPosition = useEffectEvent(() => {
    const headingMetrics = headingMetricsRef.current;

    if (!isSome(scrollContainer) || headingMetrics.length === 0) {
      return none();
    }

    const activationLine =
      scrollContainer.value.scrollTop +
      scrollContainer.value.clientHeight * TOC_ACTIVATION_LINE_RATIO;
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
