import { usePreferences } from "@/shared/store/preferences";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";

import styles from "./LocaleToggle.module.css";

export function LocaleToggle() {
  const { toggleLocale } = usePreferences();
  const copy = useUiCopy();

  return (
    <button
      aria-label={copy.localeToggle.ariaLabel}
      className={styles.root}
      onClick={toggleLocale}
      type="button"
    >
      {copy.localeToggle.buttonLabel}
    </button>
  );
}
