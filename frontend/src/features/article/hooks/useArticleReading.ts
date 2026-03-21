import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { ArticleDocument } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";

import {
  TOC_ACTIVATION_LINE_RATIO,
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

const READING_PROGRESS_DEBOUNCE_MS = 180;
const USER_SCROLL_IDLE_MS = 140;
const NAVIGATING_TIMEOUT_MS = 2_000;

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
  const observedActiveHeadingIdRef = useRef("");
  const bottomVisibleRef = useRef(false);
  const programmaticTargetIdRef = useRef("");
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

  const {
    cancel: cancelSmoothScroll,
    isProgrammaticScrolling,
    scrollTo: smoothScrollTo,
  } = useSmoothScroll({
    onUserInteraction: () => {
      if (document === null || !layout.hasScrollableContent()) {
        return;
      }

      clearNavigatingTimeout();

      if (
        tocStateRef.current === "initial" ||
        tocStateRef.current === "navigating"
      ) {
        setTocState("reading");
        setCurrentHeadingImmediate(
          observedActiveHeadingIdRef.current ||
            layout.getHeadingIdForCurrentScrollPosition() ||
            layout.getFirstHeadingId(),
        );
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
            setCurrentHeadingImmediate(
              observedActiveHeadingIdRef.current ||
                layout.getHeadingIdForCurrentScrollPosition() ||
                layout.getFirstHeadingId(),
            );
          }
        }

        if (performance.now() - lastObservedScrollChangeAtRef.current >= USER_SCROLL_IDLE_MS) {
          stopUserScrollWatch();
          clearSaveTimeout();
          saveTimeoutIdRef.current = window.setTimeout(() => {
            const stableScrollContainer = scrollContainerRef.current;

            if (stableScrollContainer === null) {
              return;
            }

            void repository.saveReadingProgress(path, {
              scrollTop: stableScrollContainer.scrollTop,
              updatedAt: new Date().toISOString(),
            });
          }, READING_PROGRESS_DEBOUNCE_MS);
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

    if (bottomVisibleRef.current && lastHeadingId !== "") {
      setCurrentHeadingImmediate(lastHeadingId);
      return;
    }

    const observedHeadingId = observedActiveHeadingIdRef.current;

    if (observedHeadingId !== "") {
      setCurrentHeadingImmediate(observedHeadingId);
      return;
    }

    setCurrentHeadingImmediate(
      layout.getHeadingIdForCurrentScrollPosition() || layout.getFirstHeadingId(),
    );
  });

  const scheduleNavigatingTimeout = useEffectEvent(() => {
    clearNavigatingTimeout();
    navigatingTimeoutIdRef.current = window.setTimeout(() => {
      if (tocStateRef.current !== "navigating") {
        return;
      }

      cancelSmoothScroll();
      setTocState("reading");
      syncReadingHeading();
    }, NAVIGATING_TIMEOUT_MS);
  });

  const enterNavigatingState = useEffectEvent((headingId: string) => {
    programmaticTargetIdRef.current = headingId;
    setTocState("navigating");
    setCurrentHeadingDeferred(headingId);
    scheduleNavigatingTimeout();
  });

  const resetReadingState = useEffectEvent(() => {
    clearSaveTimeout();
    clearNavigatingTimeout();
    stopUserScrollWatch();
    cancelSmoothScroll();
    observedActiveHeadingIdRef.current = "";
    bottomVisibleRef.current = false;
    programmaticTargetIdRef.current = "";
    setTocState("idle");
    setRestoreNotice(false);
    setCurrentHeadingDeferred("");
  });

  useHeadingActivationObserver({
    activationLineRatio: TOC_ACTIVATION_LINE_RATIO,
    disabled:
      document === null || tocState !== "reading" || isProgrammaticScrolling,
    getBottomSentinel: () => layout.getBottomSentinel(),
    getHeadings: () => layout.getHeadingMetrics().map((metric) => metric.element),
    layoutVersion: layout.layoutVersion,
    onActiveHeadingChange: (headingId) => {
      observedActiveHeadingIdRef.current = headingId;

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

        if (lastHeadingId !== "") {
          setCurrentHeadingImmediate(lastHeadingId);
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

    if (firstHeadingId === "") {
      setTocState("idle");
      setCurrentHeadingDeferred("");
      return;
    }

    if (!layout.hasScrollableContent()) {
      scrollContainer.scrollTop = 0;
      programmaticTargetIdRef.current = "";
      setTocState("short_content");
      setCurrentHeadingDeferred(firstHeadingId);
      return;
    }

    if (requestedScrollTop > 0) {
      scrollContainer.scrollTop = requestedScrollTop;
      const restoredHeadingId =
        layout.getHeadingIdForCurrentScrollPosition() || firstHeadingId;

      observedActiveHeadingIdRef.current = restoredHeadingId;
      enterNavigatingState(restoredHeadingId);
      return;
    }

    programmaticTargetIdRef.current = "";
    setTocState("initial");
    setCurrentHeadingDeferred(firstHeadingId);
  });

  const handleScrollToHeading = useEffectEvent((headingId: string) => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();
    const heading = layout.getHeadingById(headingId);

    if (firstHeadingId === "" || heading === null) {
      return;
    }

    if (!layout.hasScrollableContent() || tocStateRef.current === "short_content") {
      scrollContainer.scrollTop = layout.getHeadingTargetScrollTop(headingId);
      setTocState("short_content");
      setCurrentHeadingDeferred(firstHeadingId);
      return;
    }

    observedActiveHeadingIdRef.current = "";
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

    if (firstHeadingId === "") {
      return;
    }

    setRestoreNotice(false);

    if (!layout.hasScrollableContent()) {
      scrollContainer.scrollTop = 0;
      setTocState("short_content");
      setCurrentHeadingDeferred(firstHeadingId);
      return;
    }

    observedActiveHeadingIdRef.current = "";
    bottomVisibleRef.current = false;
    enterNavigatingState(firstHeadingId);
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
      const progressResource = await repository.getSavedReadingProgress(path);

      if (cancelled) {
        return;
      }

      const restoredScrollTop =
        progressResource.tag === "ready" &&
        progressResource.value.tag === "some" &&
        progressResource.value.value.scrollTop > 0
          ? progressResource.value.value.scrollTop
          : 0;

      frameId = window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        setRestoreNotice(restoredScrollTop > 0);
        applyEntryState(restoredScrollTop);
      });
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
