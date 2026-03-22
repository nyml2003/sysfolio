import { getThemeToggleAriaLabel } from "@/shared/lib/i18n/ui-copy";
import { usePreferences } from "@/shared/store/preferences";
import { MoonIcon, SunIcon } from "@/shared/ui/primitives/Icon";
import { Button } from "@/shared/ui/primitives";

import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { locale, theme, toggleTheme } = usePreferences();

  return (
    <Button
      aria-label={getThemeToggleAriaLabel(locale, theme)}
      className={styles.root}
      onClick={toggleTheme}
      tone="ghost"
      type="button"
    >
      {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </Button>
  );
}
