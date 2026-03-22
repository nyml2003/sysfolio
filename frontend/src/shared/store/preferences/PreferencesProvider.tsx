import {
  startTransition,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { OnboardingState } from '@/entities/content';
import { useContentRepository } from '@/shared/data/repository';
import { detachPromise } from '@/shared/lib/async/detach-promise';
import { useDocumentElementLanguage } from '@/shared/lib/dom/use-document-element-language';
import { DEFAULT_LOCALE, type AppLocale } from '@/shared/lib/i18n/locale.types';
import { some } from '@/shared/lib/monads/option';
import { DEFAULT_DENSITY, type DensityPreference } from '@/shared/lib/style/style.types';
import { DEFAULT_THEME, type ThemePreference } from '@/shared/lib/theme/theme.types';
import { INITIAL_ONBOARDING_STATE, NEXT_LOCALE_BY_LOCALE, NEXT_THEME_BY_THEME } from './constant';
import { PreferencesContext, type PreferencesContextValue } from './preferences-context';

type PreferencesProviderProps = {
  children: ReactNode;
};

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const repository = useContentRepository();
  const [theme, setTheme] = useState<ThemePreference>(DEFAULT_THEME);
  const [density, setDensity] = useState<DensityPreference>(DEFAULT_DENSITY);
  const [locale, setLocale] = useState<AppLocale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(INITIAL_ONBOARDING_STATE);

  const hydratePreferences = useEffectEvent(async () => {
    const [themeResource, densityResource, localeResource, onboardingResource] = await Promise.all([
      repository.getThemePreference(),
      repository.getDensityPreference(),
      repository.getLocalePreference(),
      repository.getOnboardingState(),
    ]);

    if (themeResource.tag === 'ready') {
      startTransition(() => {
        setTheme(themeResource.value);
      });
    }

    if (densityResource.tag === 'ready') {
      startTransition(() => {
        setDensity(densityResource.value);
      });
    }

    if (localeResource.tag === 'ready') {
      startTransition(() => {
        setLocale(localeResource.value);
      });
    }

    if (onboardingResource.tag === 'ready') {
      startTransition(() => {
        setOnboardingState(onboardingResource.value);
      });
    }

    startTransition(() => {
      setHydrated(true);
    });
  });

  const toggleTheme = useEffectEvent(async () => {
    const nextTheme: ThemePreference = NEXT_THEME_BY_THEME[theme];
    const themeResource = await repository.setThemePreference(nextTheme);

    if (themeResource.tag === 'ready') {
      startTransition(() => {
        setTheme(themeResource.value);
      });
    }
  });

  const updateDensity = useEffectEvent(async (nextDensity: DensityPreference) => {
    const densityResource = await repository.setDensityPreference(nextDensity);

    if (densityResource.tag === 'ready') {
      startTransition(() => {
        setDensity(densityResource.value);
      });
    }
  });

  const toggleLocale = useEffectEvent(async () => {
    const nextLocale: AppLocale = NEXT_LOCALE_BY_LOCALE[locale];
    const localeResource = await repository.setLocalePreference(nextLocale);

    if (localeResource.tag === 'ready') {
      startTransition(() => {
        setLocale(localeResource.value);
      });
    }
  });

  const dismissOnboarding = useEffectEvent(async () => {
    const onboardingResource = await repository.dismissOnboarding();

    if (onboardingResource.tag === 'ready') {
      startTransition(() => {
        setOnboardingState(onboardingResource.value);
      });
    }
  });

  useEffect(() => {
    detachPromise(hydratePreferences());
  }, [hydratePreferences]);

  useDocumentElementLanguage(locale);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      theme,
      locale,
      density,
      toggleTheme: () => {
        detachPromise(toggleTheme());
      },
      setDensity: (nextDensity) => {
        detachPromise(updateDensity(nextDensity));
      },
      toggleLocale: () => {
        detachPromise(toggleLocale());
      },
      onboardingVisible: hydrated && !onboardingState.dismissed,
      dismissOnboarding: () => {
        detachPromise(dismissOnboarding());
      },
    }),
    [
      dismissOnboarding,
      density,
      hydrated,
      locale,
      onboardingState.dismissed,
      theme,
      updateDensity,
      toggleLocale,
      toggleTheme,
    ]
  );
  const contextValue = useMemo(() => some(value), [value]);

  return <PreferencesContext.Provider value={contextValue}>{children}</PreferencesContext.Provider>;
}
