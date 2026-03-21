import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { ArticleDocument, RepositoryError } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";
import { isSome, none, some, unwrapOr, type Option } from "@/shared/lib/monads/option";

import {
  TOC_ACTIVATION_LINE_RATIO,
  TOC_NAVIGATING_TIMEOUT_MS,
  TOC_READING_PROGRESS_DEBOUNCE_MS,
  TOC_USER_SCROLL_IDLE_MS,
  type TocReadingState,
} from "../model/toc-activation";
import { useHeadingActivationObserver } from "./useHeadingActivationObserver";
import { useHeadingLayout } from "./useHeadingLayout";
import { useSmoothScroll } from "./useSmoothScroll";

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

export function useArticleReading({
  path,
  document,
  scrollContainerRef,
}: UseArticleReadingOptions): UseArticleReadingResult {
  const repository = useContentRepository();
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [restoreNoticeVisible, setRestoreNoticeVisible] = useState(false);
  const [tocState, setTocStateState] = useState<TocReadingState>("idle");
  const tocStateRef = useRef<TocReadingState>("idle");
  const observedActiveHeadingIdRef = useRef<Option<string>>(none());
  const bottomVisibleRef = useRef(false);
  const saveTimeoutIdRef = useRef(0);
  const navigatingTimeoutIdRef = useRef(0);
  const userScrollWatchFrameIdRef = useRef(0);
  const lastObservedScrollTopRef = useRef(0);
  const lastObservedScrollChangeAtRef = useRef(0);

  const layout = useHeadingLayout({
    enabled: document !== null,
    scrollContainerRef,
  });

  const setTocState = useEffectEvent((nextState: TocReadingState) => {
    tocStateRef.current = nextState;
    setTocStateState((currentState) => (currentState === nextState ? currentState : nextState));
  });

  const setCurrentHeadingImmediate = useEffectEvent((headingId: string) => {
    setActiveHeadingId((currentId) => (currentId === headingId ? currentId : headingId));
  });

  const setCurrentHeadingFromOptionImmediate = useEffectEvent((headingId: Option<string>) => {
    setCurrentHeadingImmediate(unwrapOr(headingId, ""));
  });

  const setCurrentHeadingDeferred = useEffectEvent((headingId: string) => {
    startTransition(() => {
      setActiveHeadingId((currentId) => (currentId === headingId ? currentId : headingId));
    });
  });

  const setCurrentHeadingFromOptionDeferred = useEffectEvent((headingId: Option<string>) => {
    setCurrentHeadingDeferred(unwrapOr(headingId, ""));
  });

  const setRestoreNotice = useEffectEvent((visible: boolean) => {
    startTransition(() => {
      setRestoreNoticeVisible(visible);
    });
  });

  const reportRepositoryError = useEffectEvent((context: string, error: RepositoryError) => {
    console.error(`[article-reading] ${context}: ${error.code} - ${error.message}`);
  });

  const reportUnexpectedError = useEffectEvent((context: string, error: unknown) => {
    console.error(`[article-reading] ${context}.`, error);
  });

  const clearSaveTimeout = useEffectEvent(() => {
    window.clearTimeout(saveTimeoutIdRef.current);
    saveTimeoutIdRef.current = 0;
  });

  const clearNavigatingTimeout = useEffectEvent(() => {
    window.clearTimeout(navigatingTimeoutIdRef.current);
    navigatingTimeoutIdRef.current = 0;
  });

  const stopUserScrollWatch = useEffectEvent(() => {
    window.cancelAnimationFrame(userScrollWatchFrameIdRef.current);
    userScrollWatchFrameIdRef.current = 0;
  });

  const clearPendingWork = useEffectEvent(() => {
    clearSaveTimeout();
    clearNavigatingTimeout();
    stopUserScrollWatch();
  });

  const getResolvedHeadingId = useEffectEvent((): Option<string> => {
    if (isSome(observedActiveHeadingIdRef.current)) {
      return observedActiveHeadingIdRef.current;
    }

    const currentHeadingId = layout.getHeadingIdForCurrentScrollPosition();

    return isSome(currentHeadingId) ? currentHeadingId : layout.getFirstHeadingId();
  });

  const saveReadingProgress = useEffectEvent(async (scrollTop: number) => {
    try {
      const result = await repository.saveReadingProgress(path, {
        scrollTop,
        updatedAt: new Date().toISOString(),
      });

      if (result.tag === "error") {
        reportRepositoryError("Failed to save reading progress", result.error);
      }
    } catch (error) {
      reportUnexpectedError("Unexpected reading progress save failure", error);
    }
  });

  const scheduleReadingProgressSave = useEffectEvent(() => {
    clearSaveTimeout();
    saveTimeoutIdRef.current = window.setTimeout(() => {
      saveTimeoutIdRef.current = 0;

      const stableScrollContainer = scrollContainerRef.current;

      if (stableScrollContainer === null) {
        return;
      }

      void saveReadingProgress(stableScrollContainer.scrollTop);
    }, TOC_READING_PROGRESS_DEBOUNCE_MS);
  });

  const {
    cancel: cancelSmoothScroll,
    isProgrammaticScrolling,
    scrollTo: smoothScrollTo,
  } = useSmoothScroll({
    onUserInteraction: () => {
      if (document === null || !layout.hasScrollableContent()) {
        return;
      }

      clearSaveTimeout();
      clearNavigatingTimeout();

      if (
        tocStateRef.current === "initial" ||
        tocStateRef.current === "navigating"
      ) {
        setTocState("reading");
        setCurrentHeadingFromOptionImmediate(getResolvedHeadingId());
      }

      const scrollContainer = scrollContainerRef.current;

      if (scrollContainer === null) {
        return;
      }

      lastObservedScrollTopRef.current = scrollContainer.scrollTop;
      lastObservedScrollChangeAtRef.current = performance.now();

      if (userScrollWatchFrameIdRef.current !== 0) {
        return;
      }

      const watchUserScroll = () => {
        const nextScrollContainer = scrollContainerRef.current;

        if (nextScrollContainer === null) {
          stopUserScrollWatch();
          return;
        }

        const currentScrollTop = nextScrollContainer.scrollTop;

        if (Math.abs(currentScrollTop - lastObservedScrollTopRef.current) > 0.5) {
          lastObservedScrollTopRef.current = currentScrollTop;
          lastObservedScrollChangeAtRef.current = performance.now();

          if (
            tocStateRef.current === "initial" ||
            tocStateRef.current === "navigating"
          ) {
            setTocState("reading");
            setCurrentHeadingFromOptionImmediate(getResolvedHeadingId());
          }
        }

        if (performance.now() - lastObservedScrollChangeAtRef.current >= TOC_USER_SCROLL_IDLE_MS) {
          stopUserScrollWatch();
          scheduleReadingProgressSave();
          return;
        }

        userScrollWatchFrameIdRef.current = window.requestAnimationFrame(watchUserScroll);
      };

      userScrollWatchFrameIdRef.current = window.requestAnimationFrame(watchUserScroll);
    },
    scrollContainerRef,
  });

  const syncReadingHeading = useEffectEvent(() => {
    const lastHeadingId = layout.getLastHeadingId();

    if (bottomVisibleRef.current && isSome(lastHeadingId)) {
      setCurrentHeadingImmediate(lastHeadingId.value);
      return;
    }

    setCurrentHeadingFromOptionImmediate(getResolvedHeadingId());
  });

  const scheduleNavigatingTimeout = useEffectEvent(() => {
    clearNavigatingTimeout();
    navigatingTimeoutIdRef.current = window.setTimeout(() => {
      navigatingTimeoutIdRef.current = 0;

      if (tocStateRef.current !== "navigating") {
        return;
      }

      cancelSmoothScroll();
      setTocState("reading");
      syncReadingHeading();
    }, TOC_NAVIGATING_TIMEOUT_MS);
  });

  const enterNavigatingState = useEffectEvent((headingId: string) => {
    setTocState("navigating");
    setCurrentHeadingDeferred(headingId);
    scheduleNavigatingTimeout();
  });

  const resetReadingState = useEffectEvent(() => {
    clearPendingWork();
    cancelSmoothScroll();
    observedActiveHeadingIdRef.current = none();
    bottomVisibleRef.current = false;
    setTocState("idle");
    setRestoreNotice(false);
    setCurrentHeadingFromOptionDeferred(none());
  });

  useHeadingActivationObserver({
    activationLineRatio: TOC_ACTIVATION_LINE_RATIO,
    disabled:
      document === null || tocState !== "reading" || isProgrammaticScrolling,
    getBottomSentinel: () => layout.getBottomSentinel(),
    getHeadings: () => layout.getHeadingMetrics().map((metric) => metric.element),
    layoutVersion: layout.layoutVersion,
    onActiveHeadingChange: (headingId) => {
      observedActiveHeadingIdRef.current = some(headingId);

      if (tocStateRef.current !== "reading" || bottomVisibleRef.current) {
        return;
      }

      setCurrentHeadingImmediate(headingId);
    },
    onBottomVisibilityChange: (visible) => {
      bottomVisibleRef.current = visible;

      if (tocStateRef.current !== "reading") {
        return;
      }

      if (visible) {
        const lastHeadingId = layout.getLastHeadingId();

        if (isSome(lastHeadingId)) {
          setCurrentHeadingImmediate(lastHeadingId.value);
        }

        return;
      }

      syncReadingHeading();
    },
    scrollContainerRef,
  });

  const applyEntryState = useEffectEvent((requestedScrollTop: number) => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();

    if (!isSome(firstHeadingId)) {
      setTocState("idle");
      setCurrentHeadingFromOptionDeferred(none());
      return;
    }

    if (!layout.hasScrollableContent()) {
      scrollContainer.scrollTop = 0;
      setTocState("short_content");
      observedActiveHeadingIdRef.current = firstHeadingId;
      setCurrentHeadingDeferred(firstHeadingId.value);
      return;
    }

    if (requestedScrollTop > 0) {
      scrollContainer.scrollTop = requestedScrollTop;
      const restoredHeadingId = layout.getHeadingIdForCurrentScrollPosition();
      observedActiveHeadingIdRef.current = restoredHeadingId;
      enterNavigatingState(unwrapOr(restoredHeadingId, firstHeadingId.value));
      return;
    }

    observedActiveHeadingIdRef.current = firstHeadingId;
    setTocState("initial");
    setCurrentHeadingDeferred(firstHeadingId.value);
  });

  const handleScrollToHeading = useEffectEvent((headingId: string) => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();
    const heading = layout.getHeadingById(headingId);

    if (!isSome(firstHeadingId) || heading === null) {
      return;
    }

    if (!layout.hasScrollableContent() || tocStateRef.current === "short_content") {
      scrollContainer.scrollTop = layout.getHeadingTargetScrollTop(headingId);
      setTocState("short_content");
      observedActiveHeadingIdRef.current = firstHeadingId;
      setCurrentHeadingDeferred(firstHeadingId.value);
      return;
    }

    observedActiveHeadingIdRef.current = none();
    bottomVisibleRef.current = false;
    enterNavigatingState(headingId);
    smoothScrollTo(layout.getHeadingTargetScrollTop(headingId));
  });

  const handleScrollToTop = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();

    if (!isSome(firstHeadingId)) {
      return;
    }

    setRestoreNotice(false);

    if (!layout.hasScrollableContent()) {
      scrollContainer.scrollTop = 0;
      setTocState("short_content");
      observedActiveHeadingIdRef.current = firstHeadingId;
      setCurrentHeadingDeferred(firstHeadingId.value);
      return;
    }

    observedActiveHeadingIdRef.current = none();
    bottomVisibleRef.current = false;
    enterNavigatingState(firstHeadingId.value);
    smoothScrollTo(0);
  });

  useEffect(() => {
    let cancelled = false;
    let frameId = 0;

    if (document === null) {
      resetReadingState();
      return undefined;
    }

    const restoreReadingProgress = async () => {
      try {
        const progressResource = await repository.getSavedReadingProgress(path);

        if (cancelled) {
          return;
        }

        let restoredScrollTop = 0;

        if (progressResource.tag === "error") {
          reportRepositoryError("Failed to restore reading progress", progressResource.error);
        } else if (
          progressResource.tag === "ready" &&
          progressResource.value.tag === "some" &&
          progressResource.value.value.scrollTop > 0
        ) {
          restoredScrollTop = progressResource.value.value.scrollTop;
        }

        frameId = window.requestAnimationFrame(() => {
          if (cancelled) {
            return;
          }

          setRestoreNotice(restoredScrollTop > 0);
          applyEntryState(restoredScrollTop);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        reportUnexpectedError("Unexpected reading progress restore failure", error);
        frameId = window.requestAnimationFrame(() => {
          if (cancelled) {
            return;
          }

          setRestoreNotice(false);
          applyEntryState(0);
        });
      }
    };

    void restoreReadingProgress();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      resetReadingState();
    };
    // Effect Events are intentionally non-reactive here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, path, repository]);

  return {
    activeHeadingId,
    restoreNoticeVisible,
    scrollToHeading: handleScrollToHeading,
    scrollToTop: handleScrollToTop,
  };
}
