import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
  type ReactNode,
} from "react";

import type { OnboardingState } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";
import {
  DEFAULT_LOCALE,
  type AppLocale,
} from "@/shared/lib/i18n/locale.types";
import { DEFAULT_THEME, type ThemePreference } from "@/shared/lib/theme/theme.types";

type PreferencesContextValue = {
  theme: ThemePreference;
  toggleTheme: () => void;
  locale: AppLocale;
  toggleLocale: () => void;
  onboardingVisible: boolean;
  dismissOnboarding: () => void;
};

type PreferencesProviderProps = {
  children: ReactNode;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

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

  return (
    <PreferencesContext.Provider
      value={{
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
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (context === null) {
    throw new Error("PreferencesContext is missing.");
  }

  return context;
}
