import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

import { getWindowOption } from "@/shared/lib/dom/get-window-option";
import {
  getElementClientHeight,
  getElementScrollHeight,
  getElementScrollTop,
  setElementScrollTop,
} from "@/shared/lib/dom/scroll-element";
import { useEventListener } from "@/shared/lib/dom/useEventListener";
import { isSome, none, some, unwrapOr, type Option } from "@/shared/lib/monads/option";

import {
  ARTICLE_SCROLL_KEYBOARD_KEYS,
  ARTICLE_SMOOTH_SCROLL_COMPLETION_EPSILON,
  ARTICLE_SMOOTH_SCROLL_DURATION_SECONDS,
  ARTICLE_SMOOTH_SCROLL_EASE,
} from "../constant";
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

function hasKeyboardKey(event: Event): event is Event & { key: string } {
  return "key" in event && typeof event.key === "string";
}

function isScrollKeyboardKey(key: string): boolean {
  return ARTICLE_SCROLL_KEYBOARD_KEYS.includes(
    key as (typeof ARTICLE_SCROLL_KEYBOARD_KEYS)[number],
  );
}

function clampScrollTop(scrollContainer: HTMLElement, scrollTop: number): number {
  return Math.max(
    0,
    Math.min(scrollTop, getElementScrollHeight(scrollContainer) - getElementClientHeight(scrollContainer)),
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
    scrollTopValue.jump(getElementScrollTop(scrollContainerElement));

    if (
      Math.abs(nextScrollTop - getElementScrollTop(scrollContainerElement)) <=
      ARTICLE_SMOOTH_SCROLL_COMPLETION_EPSILON
    ) {
      setElementScrollTop(scrollContainerElement, nextScrollTop);
      return;
    }

    setIsProgrammaticScrolling(true);
    animationRef.current = some(
      animate(scrollTopValue, nextScrollTop, {
        duration: unwrapOr(durationSeconds, ARTICLE_SMOOTH_SCROLL_DURATION_SECONDS),
        ease: ARTICLE_SMOOTH_SCROLL_EASE,
      }),
    );
  };

  useMotionValueEvent(scrollTopValue, "change", (latest) => {
    if (!isSome(scrollContainer) || !isProgrammaticScrollingRef.current) {
      return;
    }

    setElementScrollTop(scrollContainer.value, clampScrollTop(scrollContainer.value, latest));
  });

  useMotionValueEvent(scrollTopValue, "animationComplete", () => {
    animationRef.current = none();
    setIsProgrammaticScrolling(false);
  });

  useMotionValueEvent(scrollTopValue, "animationCancel", () => {
    animationRef.current = none();
    setIsProgrammaticScrolling(false);
  });

  const notifyUserInteraction = () => {
    if (isSome(onUserInteractionRef.current)) {
      onUserInteractionRef.current.value();
    }

    if (isSome(animationRef.current)) {
      cancel();
    }
  };

  const handleKeyboardInteraction = (event: Event) => {
    if (!hasKeyboardKey(event)) {
      return;
    }

    if (isScrollKeyboardKey(event.key)) {
      notifyUserInteraction();
    }
  };

  useEventListener({
    target: scrollContainer,
    type: "wheel",
    listener: notifyUserInteraction,
    options: { passive: true },
    disabled: !isSome(scrollContainer),
  });

  useEventListener({
    target: scrollContainer,
    type: "touchstart",
    listener: notifyUserInteraction,
    options: { passive: true },
    disabled: !isSome(scrollContainer),
  });

  useEventListener({
    target: getWindowOption(),
    type: "keydown",
    listener: handleKeyboardInteraction,
    options: undefined,
    disabled: false,
  });

  useEffect(() => {
    return () => {
      if (isSome(animationRef.current)) {
        animationRef.current.value.stop();
      }
    };
  }, []);

  return {
    isProgrammaticScrolling,
    scrollTo,
    cancel,
  };
}
