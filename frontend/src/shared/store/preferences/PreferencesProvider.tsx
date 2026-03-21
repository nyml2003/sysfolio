import {
  startTransition,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { OnboardingState } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";
import {
  DEFAULT_LOCALE,
  type AppLocale,
} from "@/shared/lib/i18n/locale.types";
import { some } from "@/shared/lib/monads/option";
import { DEFAULT_THEME, type ThemePreference } from "@/shared/lib/theme/theme.types";
import {
  PreferencesContext,
  type PreferencesContextValue,
} from "./preferences-context";

type PreferencesProviderProps = {
  children: ReactNode;
};

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const repository = useContentRepository();
  const [theme, setTheme] = useState<ThemePreference>(DEFAULT_THEME);
  const [locale, setLocale] = useState<AppLocale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    dismissed: true,
  });

  const hydratePreferences = useEffectEvent(async () => {
    const [themeResource, localeResource, onboardingResource] = await Promise.all([
      repository.getThemePreference(),
      repository.getLocalePreference(),
      repository.getOnboardingState(),
    ]);

    if (themeResource.tag === "ready") {
      startTransition(() => {
        setTheme(themeResource.value);
      });
    }

    if (localeResource.tag === "ready") {
      startTransition(() => {
        setLocale(localeResource.value);
      });
    }

    if (onboardingResource.tag === "ready") {
      startTransition(() => {
        setOnboardingState(onboardingResource.value);
      });
    }

    startTransition(() => {
      setHydrated(true);
    });
  });

  const toggleTheme = useEffectEvent(async () => {
    const nextTheme: ThemePreference = theme === "light" ? "dark" : "light";
    const themeResource = await repository.setThemePreference(nextTheme);

    if (themeResource.tag === "ready") {
      startTransition(() => {
        setTheme(themeResource.value);
      });
    }
  });

  const toggleLocale = useEffectEvent(async () => {
    const nextLocale: AppLocale = locale === "zh-CN" ? "en-US" : "zh-CN";
    const localeResource = await repository.setLocalePreference(nextLocale);

    if (localeResource.tag === "ready") {
      startTransition(() => {
        setLocale(localeResource.value);
      });
    }
  });

  const dismissOnboarding = useEffectEvent(async () => {
    const onboardingResource = await repository.dismissOnboarding();

    if (onboardingResource.tag === "ready") {
      startTransition(() => {
        setOnboardingState(onboardingResource.value);
      });
    }
  });

  useEffect(() => {
    void hydratePreferences();
  }, [hydratePreferences]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      theme,
      locale,
      toggleTheme: () => {
        void toggleTheme();
      },
      toggleLocale: () => {
        void toggleLocale();
      },
      onboardingVisible: hydrated && !onboardingState.dismissed,
      dismissOnboarding: () => {
        void dismissOnboarding();
      },
    }),
    [
      dismissOnboarding,
      hydrated,
      locale,
      onboardingState.dismissed,
      theme,
      toggleLocale,
      toggleTheme,
    ],
  );
  const contextValue = useMemo(() => some(value), [value]);

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
}
