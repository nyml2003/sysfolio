import { usePreferences } from "@/shared/store/preferences/PreferencesProvider";

import { getUiCopy } from "./ui-copy";

export function useUiCopy() {
  const { locale } = usePreferences();
  return getUiCopy(locale);
}
