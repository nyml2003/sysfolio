function noop() {}

export function detachPromise(
  promise: Promise<unknown> | void,
  onError: (error: unknown) => void = noop
) {
  if (promise === undefined) {
    return;
  }

  promise.catch(onError);
}
