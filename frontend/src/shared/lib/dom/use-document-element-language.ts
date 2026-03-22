import { useEffect } from "react";

import { isSome } from "@/shared/lib/monads/option";

import { getDocumentElementOption } from "./get-document-element-option";

function setDocumentElementLanguage(language: string) {
  const documentElement = getDocumentElementOption();

  if (!isSome(documentElement)) {
    return;
  }

  documentElement.value.lang = language;
}

export function useDocumentElementLanguage(language: string) {
  useEffect(() => {
    setDocumentElementLanguage(language);
  }, [language]);
}
