import { getThemeToggleAriaLabel } from '@/shared/lib/i18n/ui-copy';
import { usePreferences } from '@/shared/store/preferences';
import { MoonIcon, SunIcon } from '@/shared/ui/primitives/Icon';
import { ButtonGhostMd } from '@/shared/ui/primitives';

import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { locale, theme, toggleTheme } = usePreferences();

  return (
    <ButtonGhostMd
      aria-label={getThemeToggleAriaLabel(locale, theme)}
      className={styles.root}
      onClick={toggleTheme}
    >
      {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </ButtonGhostMd>
  );
}
