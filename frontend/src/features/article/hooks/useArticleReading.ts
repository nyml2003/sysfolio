import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type RefObject,
} from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

import type { ArticleDocument } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";

import {
  TOC_ACTIVATION_LINE_RATIO,
  TOC_TARGET_EPSILON,
  getElementScrollTopWithinContainer,
  getFirstTocHeadingId,
  getTocActivationLine,
  getTocHeadingElements,
  hasScrollableTocContent,
  isAtScrollBottom,
  type TocReadingState,
} from "../model/toc-activation";

type UseArticleReadingOptions = {
  path: string;
  document: ArticleDocument | null;
  scrollContainerRef: RefObject<HTMLElement | null>;
};

type UseArticleReadingResult = {
  activeHeadingId: string;
  restoreNoticeVisible: boolean;
  scrollToHeading: (headingId: string) => void;
  scrollToTop: () => void;
};

const READING_PROGRESS_DEBOUNCE_MS = 180;
const USER_SCROLL_INTENT_WINDOW_MS = 240;
const PROGRAMMATIC_SCROLL_DURATION_S = 0.38;
const NAVIGATING_TIMEOUT_MS = 2_000;
const SCROLL_SYNC_EPSILON = 1;

function clampScrollTop(scrollContainer: HTMLElement, scrollTop: number): number {
  return Math.max(
    0,
    Math.min(scrollTop, scrollContainer.scrollHeight - scrollContainer.clientHeight),
  );
}

function getHeadingId(heading: HTMLElement): string {
  return heading.dataset.tocId ?? "";
}

export function useArticleReading({
  path,
  document,
  scrollContainerRef,
}: UseArticleReadingOptions): UseArticleReadingResult {
  const repository = useContentRepository();
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [restoreNoticeVisible, setRestoreNoticeVisible] = useState(false);
  const scrollTopValue = useMotionValue(0);
  const tocStateRef = useRef<TocReadingState>("idle");
  const programmaticTargetIdRef = useRef("");
  const programmaticScrollActiveRef = useRef(false);
  const programmaticAnimationRef = useRef<{ stop: () => void } | null>(null);
  const programmaticDomWriteRef = useRef(false);
  const userScrollIntentAtRef = useRef(0);
  const saveTimeoutIdRef = useRef(0);
  const navigatingTimeoutIdRef = useRef(0);
  const headingElementsRef = useRef<HTMLElement[]>([]);
  const headingByIdRef = useRef<Map<string, HTMLElement>>(new Map());
  const headingOffsetTopCacheRef = useRef<WeakMap<HTMLElement, number>>(new WeakMap());
  const headingTargetScrollTopCacheRef = useRef<WeakMap<HTMLElement, number>>(new WeakMap());

  const setTocState = useEffectEvent((nextState: TocReadingState) => {
    tocStateRef.current = nextState;
  });

  const setCurrentHeadingImmediate = useEffectEvent((headingId: string) => {
    setActiveHeadingId((currentId) => (currentId === headingId ? currentId : headingId));
  });

  const setCurrentHeadingDeferred = useEffectEvent((headingId: string) => {
    startTransition(() => {
      setActiveHeadingId((currentId) => (currentId === headingId ? currentId : headingId));
    });
  });

  const setRestoreNotice = useEffectEvent((visible: boolean) => {
    startTransition(() => {
      setRestoreNoticeVisible(visible);
    });
  });

  const clearNavigatingTimeout = useEffectEvent(() => {
    window.clearTimeout(navigatingTimeoutIdRef.current);
    navigatingTimeoutIdRef.current = 0;
  });

  const stopProgrammaticScroll = useEffectEvent(() => {
    clearNavigatingTimeout();
    programmaticAnimationRef.current?.stop();
    programmaticAnimationRef.current = null;
    programmaticScrollActiveRef.current = false;
  });

  const rebuildHeadingCache = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      headingElementsRef.current = [];
      headingByIdRef.current = new Map();
      headingOffsetTopCacheRef.current = new WeakMap();
      headingTargetScrollTopCacheRef.current = new WeakMap();
      return;
    }

    const nextHeadingById = new Map<string, HTMLElement>();
    const nextOffsetTopCache = new WeakMap<HTMLElement, number>();
    const nextTargetScrollTopCache = new WeakMap<HTMLElement, number>();
    const nextHeadings = getTocHeadingElements(scrollContainer).filter((heading) => {
      return getHeadingId(heading) !== "";
    });

    for (const heading of nextHeadings) {
      const headingId = getHeadingId(heading);
      const offsetTop = getElementScrollTopWithinContainer(scrollContainer, heading);

      nextHeadingById.set(headingId, heading);
      nextOffsetTopCache.set(heading, offsetTop);
      nextTargetScrollTopCache.set(
        heading,
        Math.max(0, offsetTop - scrollContainer.clientHeight * TOC_ACTIVATION_LINE_RATIO),
      );
    }

    headingElementsRef.current = nextHeadings;
    headingByIdRef.current = nextHeadingById;
    headingOffsetTopCacheRef.current = nextOffsetTopCache;
    headingTargetScrollTopCacheRef.current = nextTargetScrollTopCache;
  });

  const getHeadings = useEffectEvent(() => {
    if (headingElementsRef.current.length === 0) {
      rebuildHeadingCache();
    }

    return headingElementsRef.current;
  });

  const getHeadingElementById = useEffectEvent((headingId: string) => {
    const heading = headingByIdRef.current.get(headingId) ?? null;

    if (heading !== null) {
      return heading;
    }

    rebuildHeadingCache();
    return headingByIdRef.current.get(headingId) ?? null;
  });

  const getHeadingOffsetTop = useEffectEvent((heading: HTMLElement) => {
    const cachedOffsetTop = headingOffsetTopCacheRef.current.get(heading);

    if (cachedOffsetTop !== undefined) {
      return cachedOffsetTop;
    }

    rebuildHeadingCache();
    return headingOffsetTopCacheRef.current.get(heading) ?? 0;
  });

  const getHeadingTargetScrollTop = useEffectEvent((heading: HTMLElement) => {
    const cachedTargetScrollTop = headingTargetScrollTopCacheRef.current.get(heading);

    if (cachedTargetScrollTop !== undefined) {
      return cachedTargetScrollTop;
    }

    rebuildHeadingCache();
    return headingTargetScrollTopCacheRef.current.get(heading) ?? 0;
  });

  const getFirstHeadingId = useEffectEvent(() => getFirstTocHeadingId(getHeadings()));

  const getReadingHeadingId = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;
    const headings = getHeadings();

    if (scrollContainer === null || headings.length === 0) {
      return "";
    }

    if (isAtScrollBottom(scrollContainer)) {
      return getHeadingId(headings.at(-1) ?? headings[0]);
    }

    const activationLine = getTocActivationLine(scrollContainer);
    let currentHeading = headings[0];

    for (const heading of headings) {
      if (getHeadingOffsetTop(heading) <= activationLine) {
        currentHeading = heading;
        continue;
      }

      break;
    }

    return getHeadingId(currentHeading);
  });

  const isTargetReached = useEffectEvent((heading: HTMLElement) => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return true;
    }

    return (
      Math.abs(scrollContainer.scrollTop - getHeadingTargetScrollTop(heading)) <=
        TOC_TARGET_EPSILON || isAtScrollBottom(scrollContainer)
    );
  });

  const markUserScrollIntent = useEffectEvent(() => {
    userScrollIntentAtRef.current = performance.now();

    if (programmaticScrollActiveRef.current) {
      stopProgrammaticScroll();
    }
  });

  const hasRecentUserScrollIntent = useEffectEvent(() => {
    return performance.now() - userScrollIntentAtRef.current <= USER_SCROLL_INTENT_WINDOW_MS;
  });

  const shouldEnterReadingFromInitial = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return false;
    }

    return hasRecentUserScrollIntent() || scrollContainer.scrollTop > 0;
  });

  const shouldEnterReadingFromNavigation = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return false;
    }

    if (hasRecentUserScrollIntent()) {
      return true;
    }

    const targetHeadingId = programmaticTargetIdRef.current;

    if (targetHeadingId === "") {
      return false;
    }

    const targetHeading = getHeadingElementById(targetHeadingId);

    return targetHeading !== null && !isTargetReached(targetHeading);
  });

  const scheduleReadingProgressSave = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    window.clearTimeout(saveTimeoutIdRef.current);
    saveTimeoutIdRef.current = window.setTimeout(() => {
      void repository.saveReadingProgress(path, {
        scrollTop: scrollContainer.scrollTop,
        updatedAt: new Date().toISOString(),
      });
    }, READING_PROGRESS_DEBOUNCE_MS);
  });

  const enterReadingState = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    if (!hasScrollableTocContent(scrollContainer)) {
      setTocState("short_content");
      setCurrentHeadingDeferred(getFirstHeadingId());
      return;
    }

    setTocState("reading");
    setCurrentHeadingImmediate(getReadingHeadingId());
  });

  const scheduleNavigatingTimeout = useEffectEvent(() => {
    clearNavigatingTimeout();
    navigatingTimeoutIdRef.current = window.setTimeout(() => {
      if (tocStateRef.current !== "navigating" || !programmaticScrollActiveRef.current) {
        return;
      }

      stopProgrammaticScroll();
      enterReadingState();
    }, NAVIGATING_TIMEOUT_MS);
  });

  const resetTocState = useEffectEvent(() => {
    stopProgrammaticScroll();
    window.clearTimeout(saveTimeoutIdRef.current);
    programmaticTargetIdRef.current = "";
    userScrollIntentAtRef.current = 0;
    headingElementsRef.current = [];
    headingByIdRef.current = new Map();
    headingOffsetTopCacheRef.current = new WeakMap();
    headingTargetScrollTopCacheRef.current = new WeakMap();
    setTocState("idle");
    setRestoreNotice(false);
    setCurrentHeadingDeferred("");
  });

  const reconcileLayoutState = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    rebuildHeadingCache();

    const firstHeadingId = getFirstHeadingId();

    if (firstHeadingId === "") {
      return;
    }

    if (!hasScrollableTocContent(scrollContainer)) {
      stopProgrammaticScroll();
      programmaticTargetIdRef.current = "";
      setTocState("short_content");
      setCurrentHeadingDeferred(firstHeadingId);
      return;
    }

    if (tocStateRef.current === "short_content" || tocStateRef.current === "idle") {
      setTocState("initial");
      setCurrentHeadingDeferred(firstHeadingId);
      return;
    }

    if (tocStateRef.current === "initial") {
      setCurrentHeadingDeferred(firstHeadingId);
      return;
    }

    if (tocStateRef.current === "navigating") {
      setCurrentHeadingDeferred(programmaticTargetIdRef.current || firstHeadingId);
      return;
    }

    setCurrentHeadingDeferred(getReadingHeadingId());
  });

  const applyEntryState = useEffectEvent((requestedScrollTop: number) => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    rebuildHeadingCache();

    const firstHeadingId = getFirstHeadingId();

    if (firstHeadingId === "") {
      setTocState("idle");
      setCurrentHeadingDeferred("");
      return;
    }

    if (!hasScrollableTocContent(scrollContainer)) {
      stopProgrammaticScroll();
      scrollContainer.scrollTop = 0;
      programmaticTargetIdRef.current = "";
      setTocState("short_content");
      setCurrentHeadingDeferred(firstHeadingId);
      return;
    }

    const nextScrollTop = clampScrollTop(scrollContainer, requestedScrollTop);

    if (nextScrollTop > 0) {
      stopProgrammaticScroll();
      scrollContainer.scrollTop = nextScrollTop;
      programmaticTargetIdRef.current = getReadingHeadingId();
      setTocState("navigating");
      setCurrentHeadingDeferred(programmaticTargetIdRef.current);
      return;
    }

    programmaticTargetIdRef.current = "";
    stopProgrammaticScroll();
    setTocState("initial");
    setCurrentHeadingDeferred(firstHeadingId);
  });

  const syncProgrammaticScroll = useEffectEvent((latest: number) => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return;
    }

    const nextScrollTop = clampScrollTop(scrollContainer, latest);

    if (Math.abs(scrollContainer.scrollTop - nextScrollTop) <= SCROLL_SYNC_EPSILON) {
      return;
    }

    programmaticDomWriteRef.current = true;
    scrollContainer.scrollTop = nextScrollTop;
  });

  const startProgrammaticScroll = useEffectEvent((targetScrollTop: number) => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    stopProgrammaticScroll();

    const nextScrollTop = clampScrollTop(scrollContainer, targetScrollTop);

    scrollTopValue.jump(scrollContainer.scrollTop);

    if (Math.abs(nextScrollTop - scrollContainer.scrollTop) <= SCROLL_SYNC_EPSILON) {
      syncProgrammaticScroll(nextScrollTop);
      return;
    }

    programmaticScrollActiveRef.current = true;
    scheduleNavigatingTimeout();
    programmaticAnimationRef.current = animate(scrollTopValue, nextScrollTop, {
      duration: PROGRAMMATIC_SCROLL_DURATION_S,
      ease: [0.22, 1, 0.36, 1],
    });
  });

  const handleReadingScroll = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    const firstHeadingId = getFirstHeadingId();

    if (firstHeadingId === "") {
      return;
    }

    if (programmaticScrollActiveRef.current) {
      return;
    }

    if (!hasScrollableTocContent(scrollContainer)) {
      if (tocStateRef.current !== "short_content") {
        setTocState("short_content");
      }

      setCurrentHeadingImmediate(firstHeadingId);
      scheduleReadingProgressSave();
      return;
    }

    if (
      tocStateRef.current === "navigating" &&
      shouldEnterReadingFromNavigation()
    ) {
      setTocState("reading");
      setCurrentHeadingImmediate(getReadingHeadingId());
      scheduleReadingProgressSave();
      return;
    }

    if (tocStateRef.current === "initial" && shouldEnterReadingFromInitial()) {
      setTocState("reading");
      setCurrentHeadingImmediate(getReadingHeadingId());
      scheduleReadingProgressSave();
      return;
    }

    if (tocStateRef.current === "reading") {
      setCurrentHeadingImmediate(getReadingHeadingId());
      scheduleReadingProgressSave();
    }
  });

  const handleScrollToHeading = useEffectEvent((headingId: string) => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    rebuildHeadingCache();

    const heading = getHeadingElementById(headingId);

    if (heading === null) {
      return;
    }

    if (!hasScrollableTocContent(scrollContainer) || tocStateRef.current === "short_content") {
      stopProgrammaticScroll();
      setTocState("short_content");
      setCurrentHeadingDeferred(getFirstHeadingId());
      scrollContainer.scrollTop = getHeadingTargetScrollTop(heading);
      return;
    }

    programmaticTargetIdRef.current = headingId;
    setTocState("navigating");
    setCurrentHeadingImmediate(headingId);
    startProgrammaticScroll(getHeadingTargetScrollTop(heading));
  });

  const handleScrollToTop = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    rebuildHeadingCache();

    const firstHeadingId = getFirstHeadingId();
    const isScrollable = hasScrollableTocContent(scrollContainer);

    programmaticTargetIdRef.current = firstHeadingId;
    setTocState(isScrollable ? "navigating" : "short_content");
    setCurrentHeadingDeferred(firstHeadingId);
    setRestoreNotice(false);

    if (!isScrollable) {
      stopProgrammaticScroll();
      scrollContainer.scrollTop = 0;
      return;
    }

    startProgrammaticScroll(0);
  });

  useMotionValueEvent(scrollTopValue, "change", (latest) => {
    if (!programmaticScrollActiveRef.current) {
      return;
    }

    syncProgrammaticScroll(latest);
  });

  useMotionValueEvent(scrollTopValue, "animationComplete", () => {
    clearNavigatingTimeout();
    programmaticAnimationRef.current = null;
    programmaticScrollActiveRef.current = false;
  });

  useMotionValueEvent(scrollTopValue, "animationCancel", () => {
    clearNavigatingTimeout();
    programmaticAnimationRef.current = null;
    programmaticScrollActiveRef.current = false;
  });

  useEffect(() => {
    let cancelled = false;
    let frameId = 0;

    if (document === null) {
      resetTocState();
      return undefined;
    }

    const restoreReadingProgress = async () => {
      const progressResource = await repository.getSavedReadingProgress(path);

      if (cancelled) {
        return;
      }

      const nextScrollTop =
        progressResource.tag === "ready" &&
        progressResource.value.tag === "some" &&
        progressResource.value.value.scrollTop > 0
          ? progressResource.value.value.scrollTop
          : 0;

      frameId = window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        rebuildHeadingCache();
        setRestoreNotice(nextScrollTop > 0);
        applyEntryState(nextScrollTop);
      });
    };

    void restoreReadingProgress();

    return () => {
      cancelled = true;
      stopProgrammaticScroll();
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(saveTimeoutIdRef.current);
    };
    // Effect Events are intentionally non-reactive here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, path, repository]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return undefined;
    }

    rebuildHeadingCache();

    const handleKeyboardIntent = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === " "
      ) {
        markUserScrollIntent();
      }
    };

    const handleNativeScroll = () => {
      if (programmaticDomWriteRef.current) {
        programmaticDomWriteRef.current = false;
        return;
      }

      handleReadingScroll();
    };

    const resizeObserver = new ResizeObserver(() => {
      rebuildHeadingCache();
      reconcileLayoutState();
    });
    const articleBody = scrollContainer.querySelector<HTMLElement>("[data-article-body]");

    resizeObserver.observe(scrollContainer);

    if (articleBody !== null) {
      resizeObserver.observe(articleBody);
    }

    scrollContainer.addEventListener("scroll", handleNativeScroll, { passive: true });
    scrollContainer.addEventListener("wheel", markUserScrollIntent, { passive: true });
    scrollContainer.addEventListener("touchstart", markUserScrollIntent, {
      passive: true,
    });
    scrollContainer.addEventListener("pointerdown", markUserScrollIntent, {
      passive: true,
    });
    window.addEventListener("keydown", handleKeyboardIntent);

    return () => {
      resizeObserver.disconnect();
      scrollContainer.removeEventListener("scroll", handleNativeScroll);
      scrollContainer.removeEventListener("wheel", markUserScrollIntent);
      scrollContainer.removeEventListener("touchstart", markUserScrollIntent);
      scrollContainer.removeEventListener("pointerdown", markUserScrollIntent);
      window.removeEventListener("keydown", handleKeyboardIntent);
    };
    // Effect Events are intentionally non-reactive here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, scrollContainerRef]);

  return {
    activeHeadingId,
    restoreNoticeVisible,
    scrollToHeading: handleScrollToHeading,
    scrollToTop: handleScrollToTop,
  };
}
