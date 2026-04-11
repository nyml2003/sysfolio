import { useReaderStateContext } from '../context/reader-core.context';
import type { ReaderCoreState } from './useReaderCore';

export function useReaderSelector<T>(selector: (state: ReaderCoreState) => T): T {
  return selector(useReaderStateContext());
}
