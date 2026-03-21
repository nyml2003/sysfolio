import { useContext } from "react";

import type { PreferencesContextValue } from "./preferences-context";
import { PreferencesContext } from "./preferences-context";

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);

  if (context === null) {
    throw new Error("PreferencesContext is missing.");
  }

  return context;
}
