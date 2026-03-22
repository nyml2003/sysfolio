import { useEffect } from 'react';

import { isSome } from '@/shared/lib/monads/option';

import { getDocumentElementOption } from './get-document-element-option';

function setDocumentElementAttribute(attributeName: string, value: string) {
  const documentElement = getDocumentElementOption();

  if (!isSome(documentElement)) {
    return;
  }

  documentElement.value.setAttribute(attributeName, value);
}

export function useDocumentElementAttribute(attributeName: string, value: string) {
  useEffect(() => {
    setDocumentElementAttribute(attributeName, value);
  }, [attributeName, value]);
}
