import { useEffect, useEffectEvent, useRef, useState } from "react";

import {
  getElementClientHeight,
  getElementScrollHeight,
  getElementScrollTop,
  getElementScrollTopWithinContainer,
} from "@/shared/lib/dom/scroll-element";
import { fromNullable, isSome, none, some, type Option } from "@/shared/lib/monads/option";

import { useResizeObserver } from "@/shared/lib/layout/useResizeObserver";

import { useArticleDom } from "../context/article-dom.context";
import {
  TOC_ACTIVATION_LINE_RATIO,
  TOC_SCROLLABLE_EPSILON,
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

function areSameElementOption(
  left: Option<HTMLElement>,
  right: Option<HTMLElement>,
): boolean {
  if (!isSome(left) || !isSome(right)) {
    return !isSome(left) && !isSome(right);
  }

  return left.value === right.value;
}

function areHeadingMetricsEqual(
  previousMetrics: HeadingMetric[],
  nextMetrics: HeadingMetric[],
): boolean {
  return (
    previousMetrics.length === nextMetrics.length &&
    previousMetrics.every((previousMetric, index) => {
      const nextMetric = nextMetrics[index];

      return (
        nextMetric !== undefined &&
        previousMetric.id === nextMetric.id &&
        previousMetric.element === nextMetric.element &&
        Math.abs(previousMetric.offsetTop - nextMetric.offsetTop) <= 0.5 &&
        Math.abs(previousMetric.targetScrollTop - nextMetric.targetScrollTop) <= 0.5
      );
    })
  );
}

function resolveHeadingIdForActivationLine(
  headingMetrics: HeadingMetric[],
  activationLine: number,
): Option<string> {
  const currentHeading = headingMetrics
    .filter((metric) => metric.offsetTop <= activationLine)
    .at(-1);

  return currentHeading === undefined ? none() : some(currentHeading.id);
}

export function useHeadingLayout({
  enabled,
}: UseHeadingLayoutOptions): UseHeadingLayoutResult {
  const { articleBody, bottomSentinel, headings, scrollContainer } = useArticleDom();
  const [layoutVersion, setLayoutVersion] = useState(0);
  const headingMetricsRef = useRef<HeadingMetric[]>([]);
  const headingByIdRef = useRef<Record<string, HTMLElement>>({});
  const bottomSentinelRef = useRef<Option<HTMLElement>>(none());
  const targetScrollTopByIdRef = useRef<Record<string, number>>({});

  const refreshLayout = useEffectEvent(() => {
    if (!enabled || !isSome(scrollContainer)) {
      const hadLayout =
        headingMetricsRef.current.length > 0 ||
        Object.keys(headingByIdRef.current).length > 0 ||
        isSome(bottomSentinelRef.current);

      if (!hadLayout) {
        return;
      }

      headingMetricsRef.current = [];
      headingByIdRef.current = {};
      bottomSentinelRef.current = none();
      targetScrollTopByIdRef.current = {};
      setLayoutVersion((version) => version + 1);
      return;
    }

    const scrollContainerElement = scrollContainer.value;

    const nextMetrics: HeadingMetric[] = [];
    const nextHeadingById: Record<string, HTMLElement> = {};
    const nextTargetScrollTopById: Record<string, number> = {};

    for (const heading of headings) {
      const offsetTop = getElementScrollTopWithinContainer(
        scrollContainerElement,
        heading.element,
      );
      const targetScrollTop = Math.max(
        0,
        offsetTop - getElementClientHeight(scrollContainerElement) * TOC_ACTIVATION_LINE_RATIO,
      );

      nextMetrics.push({
        id: heading.id,
        element: heading.element,
        offsetTop,
        targetScrollTop,
      });
      nextHeadingById[heading.id] = heading.element;
      nextTargetScrollTopById[heading.id] = targetScrollTop;
    }
    const layoutChanged =
      !areHeadingMetricsEqual(headingMetricsRef.current, nextMetrics) ||
      !areSameElementOption(bottomSentinelRef.current, bottomSentinel);

    if (!layoutChanged) {
      return;
    }

    headingMetricsRef.current = nextMetrics;
    headingByIdRef.current = nextHeadingById;
    bottomSentinelRef.current = bottomSentinel;
    targetScrollTopByIdRef.current = nextTargetScrollTopById;
    setLayoutVersion((version) => version + 1);
  });

  useEffect(() => {
    refreshLayout();
    // Effect Events are intentionally non-reactive here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    articleBody,
    bottomSentinel,
    enabled,
    headings,
    scrollContainer,
  ]);

  useResizeObserver({
    disabled: !enabled,
    dependencyToken: isSome(articleBody) ? articleBody.value : scrollContainer,
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
    return fromNullable(headingByIdRef.current[headingId]);
  });

  const getHeadingTargetScrollTop = useEffectEvent((headingId: string) => {
    return targetScrollTopByIdRef.current[headingId] ?? 0;
  });

  const hasScrollableContent = useEffectEvent(() => {
    if (!isSome(scrollContainer)) {
      return false;
    }

    return (
      getElementScrollHeight(scrollContainer.value) - getElementClientHeight(scrollContainer.value) >
      TOC_SCROLLABLE_EPSILON
    );
  });

  const getHeadingIdForCurrentScrollPosition = useEffectEvent(() => {
    const headingMetrics = headingMetricsRef.current;

    if (!isSome(scrollContainer) || headingMetrics.length === 0) {
      return none();
    }

    const firstHeadingMetric = headingMetrics[0];

    if (firstHeadingMetric === undefined) {
      return none();
    }

    const activationLine =
      getElementScrollTop(scrollContainer.value) +
      getElementClientHeight(scrollContainer.value) * TOC_ACTIVATION_LINE_RATIO;

    return resolveHeadingIdForActivationLine(
      headingMetrics,
      activationLine,
    );
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
