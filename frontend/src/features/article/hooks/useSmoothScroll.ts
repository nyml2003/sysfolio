import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

import { isSome } from "@/shared/lib/monads/option";

import { useArticleDom } from "../context/article-dom.context";

type UseSmoothScrollOptions = {
  durationSeconds?: number;
  onUserInteraction?: () => void;
};

type UseSmoothScrollResult = {
  isProgrammaticScrolling: boolean;
  scrollTo: (scrollTop: number) => void;
  cancel: () => void;
};

const DEFAULT_DURATION_SECONDS = 0.38;

function clampScrollTop(scrollContainer: HTMLElement, scrollTop: number): number {
  return Math.max(
    0,
    Math.min(scrollTop, scrollContainer.scrollHeight - scrollContainer.clientHeight),
  );
}

export function useSmoothScroll({
  durationSeconds = DEFAULT_DURATION_SECONDS,
  onUserInteraction,
}: UseSmoothScrollOptions): UseSmoothScrollResult {
  const { scrollContainer } = useArticleDom();
  const scrollContainerDependency = isSome(scrollContainer) ? scrollContainer.value : false;
  const [isProgrammaticScrolling, setIsProgrammaticScrolling] = useState(false);
  const scrollTopValue = useMotionValue(0);
  const animationRef = useRef<{ stop: () => void } | null>(null);
  const onUserInteractionRef = useRef(onUserInteraction);
  const isProgrammaticScrollingRef = useRef(isProgrammaticScrolling);

  onUserInteractionRef.current = onUserInteraction;
  isProgrammaticScrollingRef.current = isProgrammaticScrolling;

  const cancel = () => {
    animationRef.current?.stop();
    animationRef.current = null;
    setIsProgrammaticScrolling(false);
  };

  const scrollTo = (targetScrollTop: number) => {
    if (!isSome(scrollContainer)) {
      return;
    }

    const scrollContainerElement = scrollContainer.value;
    const nextScrollTop = clampScrollTop(scrollContainerElement, targetScrollTop);

    cancel();
    scrollTopValue.jump(scrollContainerElement.scrollTop);

    if (Math.abs(nextScrollTop - scrollContainerElement.scrollTop) <= 1) {
      scrollContainerElement.scrollTop = nextScrollTop;
      return;
    }

    setIsProgrammaticScrolling(true);
    animationRef.current = animate(scrollTopValue, nextScrollTop, {
      duration: durationSeconds,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  useMotionValueEvent(scrollTopValue, "change", (latest) => {
    if (!isSome(scrollContainer) || !isProgrammaticScrollingRef.current) {
      return;
    }

    scrollContainer.value.scrollTop = clampScrollTop(scrollContainer.value, latest);
  });

  useMotionValueEvent(scrollTopValue, "animationComplete", () => {
    animationRef.current = null;
    setIsProgrammaticScrolling(false);
  });

  useMotionValueEvent(scrollTopValue, "animationCancel", () => {
    animationRef.current = null;
    setIsProgrammaticScrolling(false);
  });

  useEffect(() => {
    if (scrollContainerDependency === false) {
      return undefined;
    }

    const scrollContainerElement = scrollContainerDependency;

    const notifyUserInteraction = () => {
      onUserInteractionRef.current?.();

      if (animationRef.current !== null) {
        cancel();
      }
    };

    const handleKeyboardInteraction = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === " "
      ) {
        notifyUserInteraction();
      }
    };

    scrollContainerElement.addEventListener("wheel", notifyUserInteraction, { passive: true });
    scrollContainerElement.addEventListener("touchstart", notifyUserInteraction, {
      passive: true,
    });
    window.addEventListener("keydown", handleKeyboardInteraction);

    return () => {
      scrollContainerElement.removeEventListener("wheel", notifyUserInteraction);
      scrollContainerElement.removeEventListener("touchstart", notifyUserInteraction);
      window.removeEventListener("keydown", handleKeyboardInteraction);
      cancel();
    };
  }, [scrollContainerDependency]);

  return {
    isProgrammaticScrolling,
    scrollTo,
    cancel,
  };
}
