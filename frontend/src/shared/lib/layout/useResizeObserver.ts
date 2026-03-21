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
    if (disabled || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      onResizeRef.current();
    });
    const observedTargets = Array.from(
      new Set(getTargetsRef.current().filter((target): target is Element => target !== null)),
    );

    for (const target of observedTargets) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, [dependencyToken, disabled]);
}
