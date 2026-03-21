import { usePreferences } from "@/shared/store/preferences";

import { getUiCopy } from "./ui-copy";

export function useUiCopy() {
  const { locale } = usePreferences();
  return getUiCopy(locale);
}
