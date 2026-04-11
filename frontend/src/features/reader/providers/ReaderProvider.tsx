import { useMemo, type ReactNode } from 'react';

import { some } from '@/shared/lib/monads/option';

import { ReaderCoreActionsContext, ReaderCoreStateContext } from '../context/reader-core.context';
import { useReaderCore } from '../hooks/useReaderCore';

type ReaderProviderProps = {
  children: ReactNode;
  currentPath: string;
};

export function ReaderProvider({ children, currentPath }: ReaderProviderProps) {
  const { actions, state } = useReaderCore(currentPath);
  const stateValue = useMemo(() => some(state), [state]);
  const actionsValue = useMemo(() => some(actions), [actions]);

  return (
    <ReaderCoreActionsContext.Provider value={actionsValue}>
      <ReaderCoreStateContext.Provider value={stateValue}>
        {children}
      </ReaderCoreStateContext.Provider>
    </ReaderCoreActionsContext.Provider>
  );
}
