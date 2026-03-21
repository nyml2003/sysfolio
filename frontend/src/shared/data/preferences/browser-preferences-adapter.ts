import type { OnboardingState, ReadingProgress, RepositoryError } from "@/entities/content";
import { none, some } from "@/shared/lib/monads/option";
import type { Option } from "@/shared/lib/monads/option";
import { err, ok } from "@/shared/lib/monads/result";
import type { Result } from "@/shared/lib/monads/result";
import { DEFAULT_THEME } from "@/shared/lib/theme/theme.types";
import type { ThemePreference } from "@/shared/lib/theme/theme.types";

const THEME_KEY = "sysfolio.theme";
const ONBOARDING_KEY = "sysfolio.onboarding";
const READING_PROGRESS_KEY = "sysfolio.reading-progress";

type PreferencesAdapter = {
  getThemePreference(): Result<RepositoryError, ThemePreference>;
  setThemePreference(theme: ThemePreference): Result<RepositoryError, ThemePreference>;
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

      if (storedThemeResult.tag === "err") {
        return storedThemeResult;
      }

      return storedThemeResult.value.tag === "some"
        ? ok(parseTheme(storedThemeResult.value.value))
        : ok(DEFAULT_THEME);
    },
    setThemePreference(theme) {
      const writeResult = writeStorage(THEME_KEY, theme);

      return writeResult.tag === "err" ? writeResult : ok(theme);
    },
    getOnboardingState() {
      const storedStateResult = readStorage(ONBOARDING_KEY);

      if (storedStateResult.tag === "err") {
        return storedStateResult;
      }

      return ok({
        dismissed:
          storedStateResult.value.tag === "some" &&
          storedStateResult.value.value === "dismissed",
      });
    },
    dismissOnboarding() {
      const writeResult = writeStorage(ONBOARDING_KEY, "dismissed");

      return writeResult.tag === "err"
        ? writeResult
        : ok({ dismissed: true });
    },
    getSavedReadingProgress(path) {
      const storedProgressResult = readStorage(READING_PROGRESS_KEY);

      if (storedProgressResult.tag === "err") {
        return storedProgressResult;
      }

      if (storedProgressResult.value.tag === "none") {
        return ok(none());
      }

      const parsedProgressResult = parseProgressMap(storedProgressResult.value.value);

      if (parsedProgressResult.tag === "err") {
        return parsedProgressResult;
      }

      const entry = parsedProgressResult.value[path];

      return entry === undefined ? ok(none()) : ok(some(entry));
    },
    saveReadingProgress(path, progress) {
      const storedProgressResult = readStorage(READING_PROGRESS_KEY);

      if (storedProgressResult.tag === "err") {
        return storedProgressResult;
      }

      const progressMapResult =
        storedProgressResult.value.tag === "some"
          ? parseProgressMap(storedProgressResult.value.value)
          : ok<Record<string, ReadingProgress>>({});

      if (progressMapResult.tag === "err") {
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

      return writeResult.tag === "err" ? writeResult : ok(progress);
    },
  };
}
