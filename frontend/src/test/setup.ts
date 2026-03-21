import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserverMock implements ResizeObserver {
    observe() {}

    unobserve() {}

    disconnect() {}
  }

  window.ResizeObserver = ResizeObserverMock;
}

if (typeof window.IntersectionObserver === "undefined") {
  class IntersectionObserverMock implements IntersectionObserver {
    readonly root = null;

    readonly rootMargin = "0px";

    readonly thresholds = [];

    disconnect() {}

    observe() {}

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    unobserve() {}
  }

  window.IntersectionObserver = IntersectionObserverMock;
}

if (typeof window.requestAnimationFrame === "undefined") {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return window.setTimeout(() => {
      callback(performance.now());
    }, 16);
  };
}

if (typeof window.cancelAnimationFrame === "undefined") {
  window.cancelAnimationFrame = (handle: number) => {
    window.clearTimeout(handle);
  };
}

if (typeof HTMLElement.prototype.scrollTo === "undefined") {
  HTMLElement.prototype.scrollTo = vi.fn();
}
