import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { clsx } from "clsx";

import {
  fromNullable,
  isSome,
  none,
  some,
  unwrapOr,
  type Option,
} from "@/shared/lib/monads/option";
import {
  DEFAULT_MOTION_MODE,
  type DensityPreference,
  type LayoutMode,
  type MotionMode,
  type ResolvedStyleContextValue,
} from "@/shared/lib/style/style.types";
import type { ThemePreference } from "@/shared/lib/theme/theme.types";
import { useResizeObserver } from "@/shared/lib/layout/useResizeObserver";
import { usePreferences } from "@/shared/store/preferences";

import {
  INITIAL_LAYOUT_MODE,
  STYLE_LAYOUT_MODE_CLASS_NAMES,
  STYLE_SCOPE_CLASS_NAME,
} from "./style.constants";
import { StyleContext } from "./style-context";
import { resolveLayoutModeFromWidth, resolveMotionMode } from "./style.utils";

type StyleProviderProps = {
  children: ReactNode;
  theme: Option<ThemePreference>;
  density: Option<DensityPreference>;
  layoutMode: Option<LayoutMode>;
  motion: Option<MotionMode>;
  className: Option<string>;
};

function toStableScopeOption(
  currentNode: Option<HTMLDivElement>,
  nextNode: HTMLDivElement | null,
): Option<HTMLDivElement> {
  const nextOption = fromNullable(nextNode);

  if (!isSome(nextOption)) {
    return isSome(currentNode) ? none() : currentNode;
  }

  if (isSome(currentNode) && currentNode.value === nextOption.value) {
    return currentNode;
  }

  return nextOption;
}

export function StyleProvider({
  children,
  theme = none(),
  density = none(),
  layoutMode = none(),
  motion = none(),
  className = none(),
}: StyleProviderProps) {
  const preferences = usePreferences();
  const [scopeElement, setScopeElement] = useState<Option<HTMLDivElement>>(none());
  const [resolvedLayoutMode, setResolvedLayoutMode] =
    useState<LayoutMode>(INITIAL_LAYOUT_MODE);
  const [resolvedMotionMode, setResolvedMotionMode] =
    useState<MotionMode>(DEFAULT_MOTION_MODE);
  const registerScopeElement = useCallback((node: HTMLDivElement | null) => {
    setScopeElement((currentNode) => toStableScopeOption(currentNode, node));
  }, []);
  const resolvedTheme = unwrapOr(theme, preferences.theme);
  const resolvedDensity = unwrapOr(density, preferences.density);

  const syncResolvedLayoutMode = useEffectEvent(() => {
    if (isSome(layoutMode)) {
      setResolvedLayoutMode((currentMode) =>
        currentMode === layoutMode.value ? currentMode : layoutMode.value,
      );
      return;
    }

    const measuredWidth = isSome(scopeElement)
      ? scopeElement.value.clientWidth
      : window.innerWidth;
    const nextLayoutMode = resolveLayoutModeFromWidth(measuredWidth);

    setResolvedLayoutMode((currentMode) =>
      currentMode === nextLayoutMode ? currentMode : nextLayoutMode,
    );
  });

  useResizeObserver({
    getTargets: () => [scopeElement],
    onResize: () => {
      syncResolvedLayoutMode();
    },
    dependencyToken: isSome(scopeElement) ? scopeElement.value : "scope-missing",
    disabled: isSome(layoutMode),
  });

  useEffect(() => {
    syncResolvedLayoutMode();
  }, [layoutMode, scopeElement, syncResolvedLayoutMode]);

  useEffect(() => {
    if (isSome(motion)) {
      setResolvedMotionMode((currentMode) =>
        currentMode === motion.value ? currentMode : motion.value,
      );
      return undefined;
    }

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setResolvedMotionMode(DEFAULT_MOTION_MODE);
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionMode = () => {
      const nextMotionMode = resolveMotionMode(mediaQuery.matches);

      setResolvedMotionMode((currentMode) =>
        currentMode === nextMotionMode ? currentMode : nextMotionMode,
      );
    };

    applyMotionMode();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", applyMotionMode);

      return () => {
        mediaQuery.removeEventListener("change", applyMotionMode);
      };
    }

    mediaQuery.addListener(applyMotionMode);

    return () => {
      mediaQuery.removeListener(applyMotionMode);
    };
  }, [motion]);

  const value = useMemo<ResolvedStyleContextValue>(
    () => ({
      theme: resolvedTheme,
      density: resolvedDensity,
      layoutMode: resolvedLayoutMode,
      motion: resolvedMotionMode,
    }),
    [resolvedDensity, resolvedLayoutMode, resolvedMotionMode, resolvedTheme],
  );
  const contextValue = useMemo(() => some(value), [value]);

  return (
    <StyleContext.Provider value={contextValue}>
      <div
        className={clsx(
          STYLE_SCOPE_CLASS_NAME,
          unwrapOr(className, ""),
          `sf-theme-${resolvedTheme}`,
          `sf-density-${resolvedDensity}`,
          STYLE_LAYOUT_MODE_CLASS_NAMES[resolvedLayoutMode],
          `sf-motion-${resolvedMotionMode}`,
        )}
        ref={registerScopeElement}
      >
        {children}
      </div>
    </StyleContext.Provider>
  );
}
