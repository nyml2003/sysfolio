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
  getFirstTocHeadingId,
  getReadingActiveHeadingId,
  getTocHeadingElements,
  getTocTargetScrollTop,
  hasScrollableTocContent,
  isTocTargetScrollReached,
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

function clampScrollTop(scrollContainer: HTMLElement, scrollTop: number): number {
  return Math.max(
    0,
    Math.min(scrollTop, scrollContainer.scrollHeight - scrollContainer.clientHeight),
  );
}

export function useArticleReading({
  path,
  document,
  scrollContainerRef,
}: UseArticleReadingOptions): UseArticleReadingResult {
  const repository = useContentRepository();
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [restoreNoticeVisible, setRestoreNoticeVisible] = useState(false);
  const tocStateRef = useRef<TocReadingState>("idle");
  const programmaticTargetIdRef = useRef("");
  const programmaticScrollActiveRef = useRef(false);
  const userScrollIntentAtRef = useRef(0);
  const saveTimeoutIdRef = useRef(0);

  const setTocState = useEffectEvent((nextState: TocReadingState) => {
    tocStateRef.current = nextState;
  });

  const setCurrentHeading = useEffectEvent((headingId: string) => {
    startTransition(() => {
      setActiveHeadingId((currentId) => (currentId === headingId ? currentId : headingId));
    });
  });

  const setRestoreNotice = useEffectEvent((visible: boolean) => {
    startTransition(() => {
      setRestoreNoticeVisible(visible);
    });
  });

  const getHeadings = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    return scrollContainer === null ? [] : getTocHeadingElements(scrollContainer);
  });

  const getHeadingElementById = useEffectEvent((headingId: string) => {
    const headings = getHeadings();

    return headings.find((heading) => heading.dataset.tocId === headingId) ?? null;
  });

  const getFirstHeadingId = useEffectEvent(() => getFirstTocHeadingId(getHeadings()));

  const getReadingHeadingId = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return "";
    }

    return getReadingActiveHeadingId(scrollContainer, getHeadings());
  });

  const markUserScrollIntent = useEffectEvent(() => {
    userScrollIntentAtRef.current = performance.now();
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

    return targetHeading !== null && !isTocTargetScrollReached(scrollContainer, targetHeading);
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

  const resetTocState = useEffectEvent(() => {
    window.clearTimeout(saveTimeoutIdRef.current);
    programmaticTargetIdRef.current = "";
    programmaticScrollActiveRef.current = false;
    userScrollIntentAtRef.current = 0;
    setTocState("idle");
    setRestoreNotice(false);
    setCurrentHeading("");
  });

  const reconcileLayoutState = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    const firstHeadingId = getFirstHeadingId();

    if (firstHeadingId === "") {
      return;
    }

    if (!hasScrollableTocContent(scrollContainer)) {
      programmaticTargetIdRef.current = "";
      programmaticScrollActiveRef.current = false;
      setTocState("short_content");
      setCurrentHeading(firstHeadingId);
      return;
    }

    if (tocStateRef.current === "short_content" || tocStateRef.current === "idle") {
      setTocState("initial");
      setCurrentHeading(firstHeadingId);
      return;
    }

    if (tocStateRef.current === "initial") {
      setCurrentHeading(firstHeadingId);
      return;
    }

    if (tocStateRef.current === "navigating") {
      const targetHeadingId = programmaticTargetIdRef.current || firstHeadingId;
      setCurrentHeading(targetHeadingId);
      return;
    }

    setCurrentHeading(getReadingHeadingId());
  });

  const applyEntryState = useEffectEvent((requestedScrollTop: number) => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    const firstHeadingId = getFirstHeadingId();

    if (firstHeadingId === "") {
      setTocState("idle");
      setCurrentHeading("");
      return;
    }

    if (!hasScrollableTocContent(scrollContainer)) {
      scrollContainer.scrollTo({ top: 0 });
      programmaticTargetIdRef.current = "";
      programmaticScrollActiveRef.current = false;
      setTocState("short_content");
      setCurrentHeading(firstHeadingId);
      return;
    }

    const nextScrollTop = clampScrollTop(scrollContainer, requestedScrollTop);

    if (nextScrollTop > 0) {
      scrollContainer.scrollTo({ top: nextScrollTop });
      programmaticTargetIdRef.current = getReadingHeadingId();
      programmaticScrollActiveRef.current = false;
      setTocState("navigating");
      setCurrentHeading(programmaticTargetIdRef.current);
      return;
    }

    programmaticTargetIdRef.current = "";
    programmaticScrollActiveRef.current = false;
    setTocState("initial");
    setCurrentHeading(firstHeadingId);
  });

  const handleScroll = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    const firstHeadingId = getFirstHeadingId();

    if (firstHeadingId === "") {
      return;
    }

    if (!hasScrollableTocContent(scrollContainer)) {
      if (tocStateRef.current !== "short_content") {
        setTocState("short_content");
      }

      setCurrentHeading(firstHeadingId);
      scheduleReadingProgressSave();
      return;
    }

    if (
      tocStateRef.current === "navigating" &&
      !programmaticScrollActiveRef.current &&
      shouldEnterReadingFromNavigation()
    ) {
      programmaticScrollActiveRef.current = false;
      setTocState("reading");
      setCurrentHeading(getReadingHeadingId());
      scheduleReadingProgressSave();
      return;
    }

    if (programmaticScrollActiveRef.current) {
      const targetHeadingId = programmaticTargetIdRef.current;

      if (targetHeadingId !== "") {
        const targetHeading = getHeadingElementById(targetHeadingId);

        if (
          targetHeading === null ||
          isTocTargetScrollReached(scrollContainer, targetHeading)
        ) {
          programmaticScrollActiveRef.current = false;
        }
      } else {
        programmaticScrollActiveRef.current = false;
      }

      scheduleReadingProgressSave();
      return;
    }

    if (tocStateRef.current === "initial" && shouldEnterReadingFromInitial()) {
      setTocState("reading");
      setCurrentHeading(getReadingHeadingId());
      scheduleReadingProgressSave();
      return;
    }

    if (tocStateRef.current === "reading") {
      setCurrentHeading(getReadingHeadingId());
    }

    scheduleReadingProgressSave();
  });

  const scrollToHeading = useEffectEvent((headingId: string) => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    const heading = getHeadingElementById(headingId);

    if (heading === null) {
      return;
    }

    if (!hasScrollableTocContent(scrollContainer) || tocStateRef.current === "short_content") {
      setTocState("short_content");
      setCurrentHeading(getFirstHeadingId());
      scrollContainer.scrollTo({
        top: getTocTargetScrollTop(scrollContainer, heading),
        behavior: "smooth",
      });
      return;
    }

    programmaticTargetIdRef.current = headingId;
    programmaticScrollActiveRef.current = true;
    setTocState("navigating");
    setCurrentHeading(headingId);
    scrollContainer.scrollTo({
      top: getTocTargetScrollTop(scrollContainer, heading),
      behavior: "smooth",
    });
  });

  const scrollToTop = useEffectEvent(() => {
    const scrollContainer = scrollContainerRef.current;

    if (document === null || scrollContainer === null) {
      return;
    }

    programmaticTargetIdRef.current = getFirstHeadingId();
    programmaticScrollActiveRef.current = hasScrollableTocContent(scrollContainer);
    setTocState(
      hasScrollableTocContent(scrollContainer) ? "navigating" : "short_content",
    );
    setCurrentHeading(programmaticTargetIdRef.current);
    setRestoreNotice(false);
    scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
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

        setRestoreNotice(nextScrollTop > 0);
        applyEntryState(nextScrollTop);
      });
    };

    void restoreReadingProgress();

    return () => {
      cancelled = true;
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

    const resizeObserver = new ResizeObserver(() => {
      reconcileLayoutState();
    });
    const articleBody = scrollContainer.querySelector<HTMLElement>("[data-article-body]");

    resizeObserver.observe(scrollContainer);

    if (articleBody !== null) {
      resizeObserver.observe(articleBody);
    }

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
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
      scrollContainer.removeEventListener("scroll", handleScroll);
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
    scrollToHeading(headingId) {
      scrollToHeading(headingId);
    },
    scrollToTop() {
      scrollToTop();
    },
  };
}
