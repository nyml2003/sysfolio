export type TNone = { tag: 'none' };

export type TSome<T> = { tag: 'some'; value: T };

export type Option<T> = TNone | TSome<T>;
