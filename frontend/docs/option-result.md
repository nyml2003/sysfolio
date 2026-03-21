# Option And Result

## Purpose

- `Option<T>` 和 `Result<E, T>` 都是项目内 `shared` 基础工具类型。
- 两者都必须是纯数据表示，不依赖 class 实例。
- 两者都必须配套 helper 使用，不鼓励手写分支和结构判定。

## Location

- 落点路径固定为：
  - `shared/lib/monads/option/*`
  - `shared/lib/monads/result/*`
- 组织方式固定为 `shared/lib/monads` 下两个子目录，而不是散落在多个 shared 工具目录里。
- 每个子目录内允许多个文件，但职责要清晰拆分：
  - `*.types.ts`
  - `*.helpers.ts`
  - `*.test.ts`
  - 如有需要再补 `*.fixtures.ts`

## Runtime Shape

### `Option<T>`

- `Option<T>` 的运行时形状固定为：
  - `None = { tag: "none" }`
  - `Some<T> = { tag: "some"; value: T }`
- `Option<T> = None | Some<T>`
- `Option<T>` 可以进入业务层、store、props、context、repository 返回值。

### `Result<E, T>`

- `Result<E, T>` 的运行时形状固定为：
  - `Err<E> = { tag: "err"; error: E }`
  - `Ok<T> = { tag: "ok"; value: T }`
- `Result<E, T> = Err<E> | Ok<T>`
- `Result<E, T>` 是 shared 基础工具，但不进入前端业务状态。

## Helper Names

### Option Helpers

- 构造：
  - `none()`
  - `some(value)`
- 判断：
  - `isNone(option)`
  - `isSome(option)`
- 转换：
  - `map(option, mapper)`
  - `flatMap(option, mapper)`
  - `match(option, onNone, onSome)`
  - `unwrapOr(option, fallback)`
  - `orElse(option, fallbackOption)`
- 边界归一化：
  - `fromNullable(raw)`
  - `fromFalsy` 不提供，避免语义过宽

### Result Helpers

- 构造：
  - `ok(value)`
  - `err(error)`
- 判断：
  - `isOk(result)`
  - `isErr(result)`
- 转换：
  - `map(result, mapper)`
  - `mapErr(result, mapper)`
  - `andThen(result, mapper)`
  - `match(result, onErr, onOk)`
  - `unwrapOr(result, fallback)`
- 边界辅助：
  - `fromThrowable(fn)`
- `tryCatch(fn, mapError)`

## Usage Rule

- 处理 `Option/Result` 时必须优先通过 helper。
- 不直接在业务代码中手写：
  - `option.tag === "some"` 这类散乱分支
  - `result.tag === "ok"` 这类散乱分支
- 特殊情况下允许做底层类型守卫，但需要留在 `shared/lib/monads` 内。

## Layer Rule

### `Option<T>` Allowed Layers

- `shared/lib`
- `shared/data`
- `entities`
- `shared/store`
- `features`
- props / context / selectors / model

### `Result<E, T>` Allowed Layers

- `shared/lib`
- `shared/data`
- 边界适配层：
  - 网络
  - native 桥
  - 浏览器 API
  - storage
  - URL / query / hash 解析

### `Result<E, T>` Forbidden Layers

- 业务 store 状态
- 业务 props
- renderer 状态
- 业务 context
- 页面资源状态联合

进入业务层前，`Result<E, T>` 必须先转换成：

- `Option<T>`
- 显式资源状态
- 或已归一化的成功数据

## Serialization Rule

- 两者都必须可直接 JSON 序列化。
- 不允许通过 class 实例、原型方法或自定义序列化协议表示。

### Option Serialization

- `none()` 序列化为：

```json
{ "tag": "none" }
```

- `some("x")` 序列化为：

```json
{ "tag": "some", "value": "x" }
```

### Result Serialization

- `ok(value)` 序列化为：

```json
{ "tag": "ok", "value": {} }
```

- `err(error)` 序列化为：

```json
{ "tag": "err", "error": {} }
```

## External Boundary Rule

- 外部传输协议不强制直接暴露 `Option/Result`。
- 允许 adapter 把外部原始 payload 转换成 `Option/Result`。
- 如果需要把 `Option/Result` 写入 storage、测试快照或 mock fixture，必须使用上面的纯数据形状。

## Why This Shape

- `tag` 判定直观，适合 helper 和 pattern match 风格处理。
- 纯对象结构满足“内部数据不用复杂 class”的约束。
- 可以安全跨 repository、store、context、测试 fixture 和 JSON 快照使用。
