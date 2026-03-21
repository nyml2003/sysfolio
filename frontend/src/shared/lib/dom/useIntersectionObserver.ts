import { useEffect, useRef } from "react";

import { isSome, type Option } from "@/shared/lib/monads/option";

type UseIntersectionObserverOptions = {
  root: Option<Element>;
  getTargets: () => ReadonlyArray<Option<Element>>;
  onIntersect: (entries: IntersectionObserverEntry[]) => void;
  rootMargin: string;
  threshold: number | number[];
  disabled: boolean;
  dependencyToken: unknown;
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

export function hasIntersectionObserverSupport(): boolean {
  return typeof IntersectionObserver !== "undefined";
}

export function useIntersectionObserver({
  root,
  getTargets,
  onIntersect,
  rootMargin,
  threshold,
  disabled,
  dependencyToken,
}: UseIntersectionObserverOptions) {
  const getTargetsRef = useRef(getTargets);
  const onIntersectRef = useRef(onIntersect);

  getTargetsRef.current = getTargets;
  onIntersectRef.current = onIntersect;

  useEffect(() => {
    if (disabled || !isSome(root) || !hasIntersectionObserverSupport()) {
      return undefined;
    }

    const observedTargets = collectObservedTargets(getTargetsRef.current());
    const observer = new IntersectionObserver(
      (entries) => {
        onIntersectRef.current(entries);
      },
      {
        root: root.value,
        rootMargin,
        threshold,
      },
    );

    for (const target of observedTargets) {
      observer.observe(target);
    }

    return () => {
      for (const target of observedTargets) {
        observer.unobserve(target);
      }

      observer.disconnect();
    };
  }, [dependencyToken, disabled, root, rootMargin, threshold]);
}
