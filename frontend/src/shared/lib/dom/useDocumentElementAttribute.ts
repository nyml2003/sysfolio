import { useEffect } from "react";

import { isSome } from "@/shared/lib/monads/option";

import { getDocumentElementOption } from "./browser-globals";

function setDocumentElementAttribute(attributeName: string, value: string) {
  const documentElement = getDocumentElementOption();

  if (!isSome(documentElement)) {
    return;
  }

  documentElement.value.setAttribute(attributeName, value);
}

function setDocumentElementLanguage(language: string) {
  const documentElement = getDocumentElementOption();

  if (!isSome(documentElement)) {
    return;
  }

  documentElement.value.lang = language;
}

export function useDocumentElementAttribute(attributeName: string, value: string) {
  useEffect(() => {
    setDocumentElementAttribute(attributeName, value);
  }, [attributeName, value]);
}

export function useDocumentElementLanguage(language: string) {
  useEffect(() => {
    setDocumentElementLanguage(language);
  }, [language]);
}
