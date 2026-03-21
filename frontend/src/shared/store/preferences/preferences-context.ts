import { createContext } from "react";

import type { AppLocale } from "@/shared/lib/i18n/locale.types";
import type { ThemePreference } from "@/shared/lib/theme/theme.types";

export type PreferencesContextValue = {
  theme: ThemePreference;
  toggleTheme: () => void;
  locale: AppLocale;
  toggleLocale: () => void;
  onboardingVisible: boolean;
  dismissOnboarding: () => void;
};

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
