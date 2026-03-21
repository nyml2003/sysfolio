import { usePreferences } from "@/shared/store/preferences/PreferencesProvider";
import { MoonIcon, SunIcon } from "@/shared/ui/primitives/Icon";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = usePreferences();

  return (
    <button
      aria-label={theme === "light" ? "切换到深色主题" : "切换到浅色主题"}
      className={styles.root}
      onClick={toggleTheme}
      type="button"
    >
      {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </button>
  );
}
