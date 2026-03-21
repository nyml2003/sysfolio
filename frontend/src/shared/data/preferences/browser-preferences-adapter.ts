import type { OnboardingState, ReadingProgress, RepositoryError } from "@/entities/content";
import { isNone, isSome, none, some } from "@/shared/lib/monads/option";
import type { Option } from "@/shared/lib/monads/option";
import { err, isErr, ok } from "@/shared/lib/monads/result";
import type { Result } from "@/shared/lib/monads/result";
import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from "@/shared/lib/i18n/locale.types";
import { DEFAULT_THEME } from "@/shared/lib/theme/theme.types";
import type { ThemePreference } from "@/shared/lib/theme/theme.types";

const THEME_KEY = "sysfolio.theme";
const LOCALE_KEY = "sysfolio.locale";
const ONBOARDING_KEY = "sysfolio.onboarding";
const READING_PROGRESS_KEY = "sysfolio.reading-progress";

type PreferencesAdapter = {
  getThemePreference(): Result<RepositoryError, ThemePreference>;
  setThemePreference(theme: ThemePreference): Result<RepositoryError, ThemePreference>;
  getLocalePreference(): Result<RepositoryError, AppLocale>;
  setLocalePreference(locale: AppLocale): Result<RepositoryError, AppLocale>;
  getOnboardingState(): Result<RepositoryError, OnboardingState>;
  dismissOnboarding(): Result<RepositoryError, OnboardingState>;
  getSavedReadingProgress(path: string): Result<RepositoryError, Option<ReadingProgress>>;
  saveReadingProgress(
    path: string,
    progress: ReadingProgress,
  ): Result<RepositoryError, ReadingProgress>;
};

function storageError(message: string): RepositoryError {
  return { code: "storage_error", message };
}

function hasWindowStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorage(key: string): Result<RepositoryError, Option<string>> {
  if (!hasWindowStorage()) {
    return ok(none());
  }

  try {
    const raw = window.localStorage.getItem(key);

    return raw === null ? ok(none()) : ok(some(raw));
  } catch (error) {
    return err(storageError(`Failed to read ${key}: ${String(error)}`));
  }
}

function writeStorage(key: string, value: string): Result<RepositoryError, string> {
  if (!hasWindowStorage()) {
    return ok(value);
  }

  try {
    window.localStorage.setItem(key, value);
    return ok(value);
  } catch (error) {
    return err(storageError(`Failed to write ${key}: ${String(error)}`));
  }
}

function parseTheme(raw: string): ThemePreference {
  return raw === "dark" ? "dark" : DEFAULT_THEME;
}

function parseLocale(raw: string): AppLocale {
  return isAppLocale(raw) ? raw : DEFAULT_LOCALE;
}

function isReadingProgress(raw: unknown): raw is ReadingProgress {
  if (typeof raw !== "object" || raw === null) {
    return false;
  }

  const candidate = raw as Record<string, unknown>;

  return (
    typeof candidate.scrollTop === "number" &&
    Number.isFinite(candidate.scrollTop) &&
    typeof candidate.updatedAt === "string"
  );
}

function parseProgressMap(raw: string): Result<RepositoryError, Record<string, ReadingProgress>> {
  try {
    const parsed = JSON.parse(raw) as unknown;

    if (typeof parsed !== "object" || parsed === null) {
      return ok({});
    }

    const entries = Object.entries(parsed);
    const progressMap: Record<string, ReadingProgress> = {};

    for (const [key, value] of entries) {
      if (isReadingProgress(value)) {
        progressMap[key] = value;
      }
    }

    return ok(progressMap);
  } catch (error) {
    return err(storageError(`Failed to parse reading progress: ${String(error)}`));
  }
}

export function createBrowserPreferencesAdapter(): PreferencesAdapter {
  return {
    getThemePreference() {
      const storedThemeResult = readStorage(THEME_KEY);

      if (isErr(storedThemeResult)) {
        return storedThemeResult;
      }

      return isSome(storedThemeResult.value)
        ? ok(parseTheme(storedThemeResult.value.value))
        : ok(DEFAULT_THEME);
    },
    setThemePreference(theme) {
      const writeResult = writeStorage(THEME_KEY, theme);

      return isErr(writeResult) ? writeResult : ok(theme);
    },
    getLocalePreference() {
      const storedLocaleResult = readStorage(LOCALE_KEY);

      if (isErr(storedLocaleResult)) {
        return storedLocaleResult;
      }

      return isSome(storedLocaleResult.value)
        ? ok(parseLocale(storedLocaleResult.value.value))
        : ok(DEFAULT_LOCALE);
    },
    setLocalePreference(locale) {
      const writeResult = writeStorage(LOCALE_KEY, locale);

      return isErr(writeResult) ? writeResult : ok(locale);
    },
    getOnboardingState() {
      const storedStateResult = readStorage(ONBOARDING_KEY);

      if (isErr(storedStateResult)) {
        return storedStateResult;
      }

      return ok({
        dismissed:
          isSome(storedStateResult.value) &&
          storedStateResult.value.value === "dismissed",
      });
    },
    dismissOnboarding() {
      const writeResult = writeStorage(ONBOARDING_KEY, "dismissed");

      return isErr(writeResult)
        ? writeResult
        : ok({ dismissed: true });
    },
    getSavedReadingProgress(path) {
      const storedProgressResult = readStorage(READING_PROGRESS_KEY);

      if (isErr(storedProgressResult)) {
        return storedProgressResult;
      }

      if (isNone(storedProgressResult.value)) {
        return ok(none());
      }

      const parsedProgressResult = parseProgressMap(storedProgressResult.value.value);

      if (isErr(parsedProgressResult)) {
        return parsedProgressResult;
      }

      const entry = parsedProgressResult.value[path];

      return entry === undefined ? ok(none()) : ok(some(entry));
    },
    saveReadingProgress(path, progress) {
      const storedProgressResult = readStorage(READING_PROGRESS_KEY);

      if (isErr(storedProgressResult)) {
        return storedProgressResult;
      }

      const progressMapResult =
        isSome(storedProgressResult.value)
          ? parseProgressMap(storedProgressResult.value.value)
          : ok<Record<string, ReadingProgress>>({});

      if (isErr(progressMapResult)) {
        return progressMapResult;
      }

      const nextProgressMap = {
        ...progressMapResult.value,
        [path]: progress,
      };

      const writeResult = writeStorage(
        READING_PROGRESS_KEY,
        JSON.stringify(nextProgressMap),
      );

      return isErr(writeResult) ? writeResult : ok(progress);
    },
  };
}
