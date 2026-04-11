import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { readyState } from '@/shared/lib/resource/resource-state';

import { useResourceQuery } from './useResourceQuery';

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((nextResolve) => {
    resolve = nextResolve;
  });

  return {
    promise,
    resolve,
  };
}

function UseResourceQueryHarness({
  queryName,
  load,
}: {
  queryName: string;
  load: () => Promise<ReturnType<typeof readyState<string, string>>>;
}) {
  const query = useResourceQuery({
    queryKey: ['test-query', queryName],
    load,
  });

  return (
    <div>
      <div data-testid="query-key">{query.requestKey}</div>
      <div data-testid="request-version">{query.requestVersion}</div>
      <div data-testid="status">{query.status}</div>
      <div data-testid="data">{query.data.tag === 'some' ? query.data.value : ''}</div>
      <div data-testid="error">{query.error.tag === 'some' ? query.error.value : ''}</div>
      <button onClick={query.reload} type="button">
        Reload
      </button>
    </div>
  );
}

describe('useResourceQuery', () => {
  it('discards stale results and keeps the latest request state', async () => {
    const firstResponse = createDeferred<ReturnType<typeof readyState<string, string>>>();
    const secondResponse = createDeferred<ReturnType<typeof readyState<string, string>>>();
    let callCount = 0;

    const { rerender } = render(
      <UseResourceQueryHarness
        load={() => {
          callCount += 1;
          return callCount === 1 ? firstResponse.promise : secondResponse.promise;
        }}
        queryName="first"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('loading');
      expect(screen.getByTestId('request-version').textContent).toBe('1');
      expect(screen.getByTestId('query-key').textContent).toBe('["test-query","first"]');
    });

    rerender(<UseResourceQueryHarness load={() => secondResponse.promise} queryName="second" />);

    await waitFor(() => {
      expect(screen.getByTestId('request-version').textContent).toBe('2');
      expect(screen.getByTestId('query-key').textContent).toBe('["test-query","second"]');
    });

    await act(async () => {
      secondResponse.resolve(readyState('second result'));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('data').textContent).toBe('second result');
      expect(screen.getByTestId('status').textContent).toBe('ready');
    });

    await act(async () => {
      firstResponse.resolve(readyState('first result'));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('data').textContent).toBe('second result');
    });
  });

  it('restarts the query when reload is requested', async () => {
    const responses = [
      Promise.resolve(readyState<string, string>('first result')),
      Promise.resolve(readyState<string, string>('reloaded result')),
    ];
    let callCount = 0;

    render(
      <UseResourceQueryHarness
        load={() => {
          const nextResponse = responses[callCount] ?? Promise.resolve(readyState('fallback'));
          callCount += 1;
          return nextResponse;
        }}
        queryName="reloadable"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('data').textContent).toBe('first result');
    });

    await act(async () => {
      screen.getByRole('button', { name: 'Reload' }).click();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('data').textContent).toBe('reloaded result');
      expect(screen.getByTestId('request-version').textContent).toBe('2');
    });
  });
});
