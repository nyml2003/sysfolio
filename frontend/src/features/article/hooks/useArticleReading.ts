import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { ArticleDocument } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";

type UseArticleReadingOptions = {
  path: string;
  document: ArticleDocument;
  scrollContainerRef: RefObject<HTMLElement | null>;
  onActiveHeadingChange: (headingId: string) => void;
};

type UseArticleReadingResult = {
  restoreNoticeVisible: boolean;
  scrollToTop: () => void;
};

export function useArticleReading({
  path,
  document,
  scrollContainerRef,
  onActiveHeadingChange,
}: UseArticleReadingOptions): UseArticleReadingResult {
  const repository = useContentRepository();
  const [restoreNoticeVisible, setRestoreNoticeVisible] = useState(false);
  const onActiveHeadingChangeRef = useRef(onActiveHeadingChange);

  useEffect(() => {
    onActiveHeadingChangeRef.current = onActiveHeadingChange;
  }, [onActiveHeadingChange]);

  function syncActiveHeading() {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return;
    }

    const headings = Array.from(
      scrollContainer.querySelectorAll<HTMLElement>("[data-toc-id]"),
    );

    if (headings.length === 0) {
      return;
    }

    let currentHeading = headings[0];

    for (const heading of headings) {
      if (heading.offsetTop - scrollContainer.scrollTop <= 120) {
        currentHeading = heading;
      }
    }
    const headingId = currentHeading.dataset.tocId;

    if (headingId !== undefined) {
      onActiveHeadingChangeRef.current(headingId);
    }
  }

  useEffect(() => {
    let cancelled = false;
    let frameId = 0;

    async function restoreReadingProgress() {
      const scrollContainer = scrollContainerRef.current;

      if (scrollContainer === null) {
        return;
      }

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

        scrollContainer.scrollTo({ top: nextScrollTop });
        startTransition(() => {
          setRestoreNoticeVisible(nextScrollTop > 0);
        });
        syncActiveHeading();
      });
    }

    void restoreReadingProgress();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [document.id, path, repository, scrollContainerRef]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return undefined;
    }

    let timeoutId = 0;

    const handleScroll = () => {
      syncActiveHeading();
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        void repository.saveReadingProgress(path, {
          scrollTop: scrollContainer.scrollTop,
          updatedAt: new Date().toISOString(),
        });
      }, 180);
    };

    handleScroll();
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timeoutId);
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [document.id, path, repository, scrollContainerRef]);

  return {
    restoreNoticeVisible,
    scrollToTop() {
      const scrollContainer = scrollContainerRef.current;

      if (scrollContainer !== null) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      }

      setRestoreNoticeVisible(false);
    },
  };
}
