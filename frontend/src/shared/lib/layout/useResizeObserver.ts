import { useEffect, useRef } from "react";

import { isSome, type Option } from "@/shared/lib/monads/option";

type UseResizeObserverOptions = {
  getTargets: () => ReadonlyArray<Option<Element>>;
  onResize: () => void;
  dependencyToken: unknown;
  disabled: boolean;
};

function collectObservedTargets(targets: ReadonlyArray<Option<Element>>): Element[] {
  const observedTargets: Element[] = [];

  for (const target of targets) {
    if (!isSome(target) || observedTargets.includes(target.value)) {
      continue;
    }

    observedTargets.push(target.value);
  }

  return observedTargets;
}

function cancelResizeFrame(frameState: { current: number }) {
  window.cancelAnimationFrame(frameState.current);
  frameState.current = 0;
}

export function useResizeObserver({
  getTargets,
  onResize,
  dependencyToken,
  disabled,
}: UseResizeObserverOptions) {
  const getTargetsRef = useRef(getTargets);
  const onResizeRef = useRef(onResize);

  getTargetsRef.current = getTargets;
  onResizeRef.current = onResize;

  useEffect(() => {
    if (disabled) {
      return undefined;
    }

    const frameState = { current: 0 };
    const scheduleResize = () => {
      if (frameState.current !== 0) {
        return;
      }

      frameState.current = window.requestAnimationFrame(() => {
        frameState.current = 0;
        onResizeRef.current();
      });
    };

    const observedTargets = collectObservedTargets(getTargetsRef.current());

    if (typeof ResizeObserver === "undefined") {
      scheduleResize();
      window.addEventListener("resize", scheduleResize);

      return () => {
        window.removeEventListener("resize", scheduleResize);
        cancelResizeFrame(frameState);
      };
    }

    const observer = new ResizeObserver(() => {
      scheduleResize();
    });

    for (const target of observedTargets) {
      observer.observe(target);
    }

    return () => {
      cancelResizeFrame(frameState);

      for (const target of observedTargets) {
        observer.unobserve(target);
      }

      observer.disconnect();
    };
  }, [dependencyToken, disabled]);
}
