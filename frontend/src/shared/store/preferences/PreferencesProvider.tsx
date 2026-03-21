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
import { DEFAULT_THEME, type ThemePreference } from "@/shared/lib/theme/theme.types";

type PreferencesContextValue = {
  theme: ThemePreference;
  toggleTheme: () => void;
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
  const [hydrated, setHydrated] = useState(false);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    dismissed: true,
  });

  const hydratePreferences = useEffectEvent(async () => {
    const [themeResource, onboardingResource] = await Promise.all([
      repository.getThemePreference(),
      repository.getOnboardingState(),
    ]);

    if (themeResource.tag === "ready") {
      startTransition(() => {
        setTheme(themeResource.value);
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

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        toggleTheme: () => {
          void toggleTheme();
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
