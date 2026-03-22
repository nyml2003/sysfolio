import { useContext } from 'react';

import { isSome } from '@/shared/lib/monads/option';

import { StyleContext } from './style-context';

export function useStyleContext() {
  const context = useContext(StyleContext);

  if (!isSome(context)) {
    throw new Error('StyleContext is missing.');
  }

  return context.value;
}
