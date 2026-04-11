import type { Option } from '@/shared/lib/monads/option';
import type { ResourceState } from '@/shared/lib/resource/resource-state';

export type ResourceQuery<T, E> = {
  status: ResourceState<T, E>['tag'];
  data: Option<T>;
  error: Option<E>;
  resource: ResourceState<T, E>;
  requestKey: string;
  requestVersion: number;
  reload: () => void;
  retry: () => void;
};
