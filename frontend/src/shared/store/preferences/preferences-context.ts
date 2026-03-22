import { createContext } from 'react';

import { none, type Option } from '@/shared/lib/monads/option';
import type { AppLocale } from '@/shared/lib/i18n/locale.types';
import type { DensityPreference } from '@/shared/lib/style/style.types';
import type { ThemePreference } from '@/shared/lib/theme/theme.types';

export type PreferencesContextValue = {
  theme: ThemePreference;
  toggleTheme: () => void;
  density: DensityPreference;
  setDensity: (density: DensityPreference) => void;
  locale: AppLocale;
  toggleLocale: () => void;
  onboardingVisible: boolean;
  dismissOnboarding: () => void;
};

export const PreferencesContext = createContext<Option<PreferencesContextValue>>(none());
