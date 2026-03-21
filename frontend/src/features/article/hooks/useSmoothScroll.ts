import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

import { isSome, none, some, unwrapOr, type Option } from "@/shared/lib/monads/option";

import { useArticleDom } from "../context/article-dom.context";

type UseSmoothScrollOptions = {
  durationSeconds: Option<number>;
  onUserInteraction: Option<() => void>;
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
  durationSeconds,
  onUserInteraction,
}: UseSmoothScrollOptions): UseSmoothScrollResult {
  const { scrollContainer } = useArticleDom();
  const [isProgrammaticScrolling, setIsProgrammaticScrolling] = useState(false);
  const scrollTopValue = useMotionValue(0);
  const animationRef = useRef<Option<{ stop: () => void }>>(none());
  const onUserInteractionRef = useRef(onUserInteraction);
  const isProgrammaticScrollingRef = useRef(isProgrammaticScrolling);

  onUserInteractionRef.current = onUserInteraction;
  isProgrammaticScrollingRef.current = isProgrammaticScrolling;

  const cancel = () => {
    if (isSome(animationRef.current)) {
      animationRef.current.value.stop();
    }

    animationRef.current = none();
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
    animationRef.current = some(
      animate(scrollTopValue, nextScrollTop, {
        duration: unwrapOr(durationSeconds, DEFAULT_DURATION_SECONDS),
        ease: [0.22, 1, 0.36, 1],
      }),
    );
  };

  useMotionValueEvent(scrollTopValue, "change", (latest) => {
    if (!isSome(scrollContainer) || !isProgrammaticScrollingRef.current) {
      return;
    }

    scrollContainer.value.scrollTop = clampScrollTop(scrollContainer.value, latest);
  });

  useMotionValueEvent(scrollTopValue, "animationComplete", () => {
    animationRef.current = none();
    setIsProgrammaticScrolling(false);
  });

  useMotionValueEvent(scrollTopValue, "animationCancel", () => {
    animationRef.current = none();
    setIsProgrammaticScrolling(false);
  });

  useEffect(() => {
    if (!isSome(scrollContainer)) {
      return undefined;
    }

    const scrollContainerElement = scrollContainer.value;

    const notifyUserInteraction = () => {
      if (isSome(onUserInteractionRef.current)) {
        onUserInteractionRef.current.value();
      }

      if (isSome(animationRef.current)) {
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
  }, [scrollContainer]);

  return {
    isProgrammaticScrolling,
    scrollTo,
    cancel,
  };
}
