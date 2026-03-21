import {
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
  type RefObject,
} from "react";

import type { ArticleDocument } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";

type UseArticleReadingOptions = {
  path: string;
  document: ArticleDocument;
  scrollContainerRef: RefObject<HTMLElement>;
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

  const syncActiveHeading = useEffectEvent(() => {
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
      onActiveHeadingChange(headingId);
    }
  });

  const restoreReadingProgress = useEffectEvent(async () => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return;
    }

    const progressResource = await repository.getSavedReadingProgress(path);

    if (
      progressResource.tag === "ready" &&
      progressResource.value.tag === "some" &&
      progressResource.value.value.scrollTop > 0
    ) {
      const nextScrollTop = progressResource.value.value.scrollTop;

      window.requestAnimationFrame(() => {
        scrollContainer.scrollTo({ top: nextScrollTop });
        startTransition(() => {
          setRestoreNoticeVisible(true);
        });
        syncActiveHeading();
      });

      return;
    }

    scrollContainer.scrollTo({ top: 0 });
    startTransition(() => {
      setRestoreNoticeVisible(false);
    });
    syncActiveHeading();
  });

  const persistReadingProgress = useEffectEvent(async () => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return;
    }

    await repository.saveReadingProgress(path, {
      scrollTop: scrollContainer.scrollTop,
      updatedAt: new Date().toISOString(),
    });
  });

  useEffect(() => {
    void restoreReadingProgress();
  }, [document.id, path, restoreReadingProgress]);

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
        void persistReadingProgress();
      }, 180);
    };

    handleScroll();
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timeoutId);
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [document.id, path, persistReadingProgress, scrollContainerRef, syncActiveHeading]);

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
