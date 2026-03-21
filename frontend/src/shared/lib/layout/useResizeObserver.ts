import { useEffect, useRef } from "react";

type UseResizeObserverOptions = {
  getTargets: () => ReadonlyArray<Element | null>;
  onResize: () => void;
  dependencyToken?: unknown;
  disabled?: boolean;
};

export function useResizeObserver({
  getTargets,
  onResize,
  dependencyToken,
  disabled = false,
}: UseResizeObserverOptions) {
  const getTargetsRef = useRef(getTargets);
  const onResizeRef = useRef(onResize);

  getTargetsRef.current = getTargets;
  onResizeRef.current = onResize;

  useEffect(() => {
    if (disabled) {
      return undefined;
    }

    let frameId = 0;
    const scheduleResize = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        onResizeRef.current();
      });
    };

    const observedTargets = Array.from(
      new Set(getTargetsRef.current().filter((target): target is Element => target !== null)),
    );

    if (typeof ResizeObserver === "undefined") {
      scheduleResize();
      window.addEventListener("resize", scheduleResize);

      return () => {
        window.removeEventListener("resize", scheduleResize);
        window.cancelAnimationFrame(frameId);
      };
    }

    const observer = new ResizeObserver(() => {
      scheduleResize();
    });

    for (const target of observedTargets) {
      observer.observe(target);
    }

    return () => {
      window.cancelAnimationFrame(frameId);

      for (const target of observedTargets) {
        observer.unobserve(target);
      }

      observer.disconnect();
    };
  }, [dependencyToken, disabled]);
}
