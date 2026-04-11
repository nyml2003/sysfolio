import { createContext, useContext } from 'react';

import { isSome, none, type Option } from '@/shared/lib/monads/option';

import type { ReaderCoreActions, ReaderCoreState } from '../hooks/useReaderCore';

export const ReaderCoreStateContext = createContext<Option<ReaderCoreState>>(none());
export const ReaderCoreActionsContext = createContext<Option<ReaderCoreActions>>(none());

export function useReaderStateContext(): ReaderCoreState {
  const state = useContext(ReaderCoreStateContext);

  if (!isSome(state)) {
    throw new Error('useReaderStateContext must be used inside ReaderProvider.');
  }

  return state.value;
}

export function useReaderActionsContext(): ReaderCoreActions {
  const actions = useContext(ReaderCoreActionsContext);

  if (!isSome(actions)) {
    throw new Error('useReaderActionsContext must be used inside ReaderProvider.');
  }

  return actions.value;
}
