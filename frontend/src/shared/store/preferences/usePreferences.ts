import { useContext } from "react";

import { isSome } from "@/shared/lib/monads/option";

import type { PreferencesContextValue } from "./preferences-context";
import { PreferencesContext } from "./preferences-context";

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);

  if (!isSome(context)) {
    throw new Error("PreferencesContext is missing.");
  }

  return context.value;
}
