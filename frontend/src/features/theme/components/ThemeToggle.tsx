import { getThemeToggleAriaLabel } from "@/shared/lib/i18n/ui-copy";
import { usePreferences } from "@/shared/store/preferences/PreferencesProvider";
import { MoonIcon, SunIcon } from "@/shared/ui/primitives/Icon";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { locale, theme, toggleTheme } = usePreferences();

  return (
    <button
      aria-label={getThemeToggleAriaLabel(locale, theme)}
      className={styles.root}
      onClick={toggleTheme}
      type="button"
    >
      {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </button>
  );
}
