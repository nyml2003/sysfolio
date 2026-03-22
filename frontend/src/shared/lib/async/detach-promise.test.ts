import { describe, expect, it, vi } from 'vitest';

import { detachPromise } from './detach-promise';

describe('detachPromise', () => {
  it('no-ops when promise is undefined', () => {
    expect(() => detachPromise(undefined)).not.toThrow();
  });

  it('attaches catch to swallow rejection by default', async () => {
    const p = Promise.reject(new Error('fail'));
    detachPromise(p);
    await new Promise((r) => {
      setTimeout(r, 0);
    });
  });

  it('calls onError when provided', async () => {
    const onError = vi.fn();
    const err = new Error('x');
    detachPromise(Promise.reject(err), onError);
    await new Promise((r) => {
      setTimeout(r, 0);
    });
    expect(onError).toHaveBeenCalledWith(err);
  });
});
