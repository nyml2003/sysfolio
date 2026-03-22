export type Err<E> = {
  tag: 'err';
  error: E;
};

export type Ok<T> = {
  tag: 'ok';
  value: T;
};

export type Result<E, T> = Err<E> | Ok<T>;
