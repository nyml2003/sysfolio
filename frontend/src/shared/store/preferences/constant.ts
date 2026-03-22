import type { OnboardingState } from "@/entities/content";
import type { AppLocale } from "@/shared/lib/i18n/locale.types";
import {
  DEFAULT_DENSITY,
  DENSITY_PREFERENCES,
  type DensityPreference,
} from "@/shared/lib/style/style.types";
import type { ThemePreference } from "@/shared/lib/theme/theme.types";

export const DOCUMENT_THEME_ATTRIBUTE_NAME = "data-theme";
export const DOCUMENT_DENSITY_ATTRIBUTE_NAME = "data-density";

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  dismissed: true,
};

export const NEXT_THEME_BY_THEME: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "light",
};

export const DEFAULT_DENSITY_PREFERENCE = DEFAULT_DENSITY;

export const NEXT_DENSITY_BY_DENSITY: Record<DensityPreference, DensityPreference> = {
  comfortable: "medium",
  medium: "compact",
  compact: "comfortable",
};

export const DENSITY_PREFERENCE_OPTIONS = DENSITY_PREFERENCES;

export const NEXT_LOCALE_BY_LOCALE: Record<AppLocale, AppLocale> = {
  "en-US": "zh-CN",
  "zh-CN": "en-US",
};
