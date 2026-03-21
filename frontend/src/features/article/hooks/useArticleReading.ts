import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import type { ArticleDocument, RepositoryError } from "@/entities/content";
import { useArticleDom } from "@/features/article/context/article-dom.context";
import { useContentRepository } from "@/shared/data/repository";
import { detachPromise } from "@/shared/lib/async/detach-promise";
import {
  cancelScheduledAnimationFrame,
  clearScheduledTimeout,
  scheduleAnimationFrame,
  scheduleTimeout,
} from "@/shared/lib/dom/browser-timing";
import { getElementScrollTop, setElementScrollTop } from "@/shared/lib/dom/scroll-element";
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
  document: Option<ArticleDocument>;
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
}: UseArticleReadingOptions): UseArticleReadingResult {
  const { scrollContainer } = useArticleDom();
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
    enabled: isSome(document),
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
    clearScheduledTimeout(saveTimeoutIdRef.current);
    saveTimeoutIdRef.current = 0;
  });

  const clearNavigatingTimeout = useEffectEvent(() => {
    clearScheduledTimeout(navigatingTimeoutIdRef.current);
    navigatingTimeoutIdRef.current = 0;
  });

  const stopUserScrollWatch = useEffectEvent(() => {
    cancelScheduledAnimationFrame(userScrollWatchFrameIdRef.current);
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
    saveTimeoutIdRef.current = scheduleTimeout(() => {
      saveTimeoutIdRef.current = 0;

      if (!isSome(scrollContainer)) {
        return;
      }

      detachPromise(saveReadingProgress(getElementScrollTop(scrollContainer.value)));
    }, TOC_READING_PROGRESS_DEBOUNCE_MS);
  });

  const {
    cancel: cancelSmoothScroll,
    isProgrammaticScrolling,
    scrollTo: smoothScrollTo,
  } = useSmoothScroll({
    durationSeconds: none(),
    onUserInteraction: some(() => {
      if (!isSome(document) || !layout.hasScrollableContent() || !isSome(scrollContainer)) {
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

      lastObservedScrollTopRef.current = getElementScrollTop(scrollContainer.value);
      lastObservedScrollChangeAtRef.current = performance.now();

      if (userScrollWatchFrameIdRef.current !== 0) {
        return;
      }

      const watchUserScroll = () => {
        if (!isSome(scrollContainer)) {
          stopUserScrollWatch();
          return;
        }

        const currentScrollTop = getElementScrollTop(scrollContainer.value);

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

        userScrollWatchFrameIdRef.current = scheduleAnimationFrame(watchUserScroll);
      };

      userScrollWatchFrameIdRef.current = scheduleAnimationFrame(watchUserScroll);
    }),
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
    navigatingTimeoutIdRef.current = scheduleTimeout(() => {
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
      !isSome(document) || tocState !== "reading" || isProgrammaticScrolling,
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
  });

  const applyEntryState = useEffectEvent((requestedScrollTop: number) => {
    if (!isSome(document) || !isSome(scrollContainer)) {
      return;
    }

    const scrollContainerElement = scrollContainer.value;

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();

    if (!isSome(firstHeadingId)) {
      setTocState("idle");
      setCurrentHeadingFromOptionDeferred(none());
      return;
    }

    if (!layout.hasScrollableContent()) {
      setElementScrollTop(scrollContainerElement, 0);
      setTocState("short_content");
      observedActiveHeadingIdRef.current = firstHeadingId;
      setCurrentHeadingDeferred(firstHeadingId.value);
      return;
    }

    if (requestedScrollTop > 0) {
      setElementScrollTop(scrollContainerElement, requestedScrollTop);
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
    if (!isSome(document) || !isSome(scrollContainer)) {
      return;
    }

    const scrollContainerElement = scrollContainer.value;

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();
    const heading = layout.getHeadingById(headingId);

    if (!isSome(firstHeadingId) || !isSome(heading)) {
      return;
    }

    if (!layout.hasScrollableContent() || tocStateRef.current === "short_content") {
      setElementScrollTop(
        scrollContainerElement,
        layout.getHeadingTargetScrollTop(headingId),
      );
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
    if (!isSome(document) || !isSome(scrollContainer)) {
      return;
    }

    const scrollContainerElement = scrollContainer.value;

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();

    if (!isSome(firstHeadingId)) {
      return;
    }

    setRestoreNotice(false);

    if (!layout.hasScrollableContent()) {
      setElementScrollTop(scrollContainerElement, 0);
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
    const abortController = new AbortController();
    const frameState = { current: 0 };

    if (!isSome(document)) {
      resetReadingState();
      return undefined;
    }

    const scheduleApplyEntryState = (requestedScrollTop: number) => {
      frameState.current = scheduleAnimationFrame(() => {
        if (abortController.signal.aborted) {
          return;
        }

        setRestoreNotice(requestedScrollTop > 0);
        applyEntryState(requestedScrollTop);
      });
    };

    const restoreReadingProgress = async () => {
      try {
        const progressResource = await repository.getSavedReadingProgress(path);

        if (abortController.signal.aborted) {
          return;
        }

        if (progressResource.tag === "error") {
          reportRepositoryError("Failed to restore reading progress", progressResource.error);
        }

        const restoredScrollTop =
          progressResource.tag === "ready" &&
          isSome(progressResource.value) &&
          progressResource.value.value.scrollTop > 0
            ? progressResource.value.value.scrollTop
            : 0;

        scheduleApplyEntryState(restoredScrollTop);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        reportUnexpectedError("Unexpected reading progress restore failure", error);
        scheduleApplyEntryState(0);
      }
    };

    detachPromise(restoreReadingProgress());

    return () => {
      abortController.abort();
      cancelScheduledAnimationFrame(frameState.current);
      resetReadingState();
    };
    // Effect Events are intentionally non-reactive here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, path, repository, scrollContainer]);

  return {
    activeHeadingId,
    restoreNoticeVisible,
    scrollToHeading: handleScrollToHeading,
    scrollToTop: handleScrollToTop,
  };
}
