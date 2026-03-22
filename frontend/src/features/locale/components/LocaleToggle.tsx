import { usePreferences } from "@/shared/store/preferences";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
import { Button } from "@/shared/ui/primitives";

import styles from "./LocaleToggle.module.css";

export function LocaleToggle() {
  const { toggleLocale } = usePreferences();
  const copy = useUiCopy();

  return (
    <Button
      aria-label={copy.localeToggle.ariaLabel}
      className={styles.root}
      onClick={toggleLocale}
      tone="ghost"
      type="button"
    >
      {copy.localeToggle.buttonLabel}
    </Button>
  );
}
