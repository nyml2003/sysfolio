export type { Err, Ok, Result } from "./result.types";
export {
  andThen,
  err,
  fromThrowable,
  isErr,
  isOk,
  map,
  mapErr,
  match,
  ok,
  tryCatch,
  unwrapOr,
} from "./result.helpers";
