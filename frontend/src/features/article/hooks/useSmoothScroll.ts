import { useEffect, useRef, useState, type RefObject } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

type UseSmoothScrollOptions = {
  scrollContainerRef: RefObject<HTMLElement | null>;
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
  scrollContainerRef,
  durationSeconds = DEFAULT_DURATION_SECONDS,
  onUserInteraction,
}: UseSmoothScrollOptions): UseSmoothScrollResult {
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
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return;
    }

    const nextScrollTop = clampScrollTop(scrollContainer, targetScrollTop);

    cancel();
    scrollTopValue.jump(scrollContainer.scrollTop);

    if (Math.abs(nextScrollTop - scrollContainer.scrollTop) <= 1) {
      scrollContainer.scrollTop = nextScrollTop;
      return;
    }

    setIsProgrammaticScrolling(true);
    animationRef.current = animate(scrollTopValue, nextScrollTop, {
      duration: durationSeconds,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  useMotionValueEvent(scrollTopValue, "change", (latest) => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null || !isProgrammaticScrollingRef.current) {
      return;
    }

    scrollContainer.scrollTop = clampScrollTop(scrollContainer, latest);
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
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null) {
      return undefined;
    }

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

    scrollContainer.addEventListener("wheel", notifyUserInteraction, { passive: true });
    scrollContainer.addEventListener("touchstart", notifyUserInteraction, {
      passive: true,
    });
    window.addEventListener("keydown", handleKeyboardInteraction);

    return () => {
      scrollContainer.removeEventListener("wheel", notifyUserInteraction);
      scrollContainer.removeEventListener("touchstart", notifyUserInteraction);
      window.removeEventListener("keydown", handleKeyboardInteraction);
      cancel();
    };
  }, [scrollContainerRef]);

  return {
    isProgrammaticScrolling,
    scrollTo,
    cancel,
  };
}
