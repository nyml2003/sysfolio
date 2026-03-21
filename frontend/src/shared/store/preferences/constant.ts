import type { OnboardingState } from "@/entities/content";
import type { AppLocale } from "@/shared/lib/i18n/locale.types";
import type { ThemePreference } from "@/shared/lib/theme/theme.types";

export const DOCUMENT_THEME_ATTRIBUTE_NAME = "data-theme";

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  dismissed: true,
};

export const NEXT_THEME_BY_THEME: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "light",
};

export const NEXT_LOCALE_BY_LOCALE: Record<AppLocale, AppLocale> = {
  "en-US": "zh-CN",
  "zh-CN": "en-US",
};
