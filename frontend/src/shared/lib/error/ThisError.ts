import type { Option } from '../monads/option/option.types';

type ErrorFormatter<Kind extends string> = (err: { kind: Kind; cause: Option<Error> }) => string;

export class ThisError<E extends string> extends Error {
  public readonly kind: E;
  public readonly cause: Option<Error>;

  constructor(kind: E, message: string, cause: Option<Error>) {
    super(message);
    this.kind = kind;
    this.cause = cause;
    // 动态设置 name，结合 kind 提高辨识度
    this.name = `ThisError<${kind}>`;
    // 兼容不同环境的堆栈捕获
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ThisError);
    }
  }

  static from<E extends string>(
    kind: E,
    formatter: ErrorFormatter<E>,
    cause: Option<Error>
  ): ThisError<E> {
    // 防护：确保格式化函数返回字符串
    const message = formatter({ kind, cause }) || `Unknown error (kind: ${kind})`;
    return new this(kind, message, cause);
  }
}

export type ErrorDef<Kind extends string = string> = Readonly<
  Record<Kind, string | ErrorFormatter<Kind>>
>;

export function createErrorType<E extends ErrorDef<keyof E & string>>(errorDefs: E) {
  type ErrorKind = keyof E & string;

  return {
    new: (kind: ErrorKind, cause: Option<Error>): ThisError<ErrorKind> => {
      const def = errorDefs[kind];
      if (!def) {
        return new ThisError(kind, `Undefined error definition for kind: ${kind}`, cause);
      }

      if (typeof def === 'string') {
        return new ThisError(kind, def, cause);
      }

      return ThisError.from(kind, def, cause);
    },

    is: (err: unknown): err is ThisError<ErrorKind> => {
      return (
        err instanceof ThisError &&
        typeof err.kind === 'string' &&
        err.kind in errorDefs &&
        err.name.startsWith('ThisError<')
      );
    },
    Kind: Object.freeze(Object.keys(errorDefs)) as ReadonlyArray<ErrorKind>,
  };
}
