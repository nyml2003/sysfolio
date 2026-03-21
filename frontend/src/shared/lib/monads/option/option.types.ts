export type None = { tag: "none" };

export type Some<T> = {
  tag: "some";
  value: T;
};

export type Option<T> = None | Some<T>;
