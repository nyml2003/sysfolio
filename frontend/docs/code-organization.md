# Code Organization

## Core Rules

- TSX 只做结构渲染和事件绑定。
- hooks 负责视图层状态编排与 effect 生命周期。
- `model.ts` 放纯 TS 算法、selectors、转换逻辑。
- `types.ts` 放 feature 内部类型。
- `shared/lib` 与 `entities` 不依赖 TSX。
- 任何新增未约定的 class、抽象或共享能力，先报备再落代码。
- 复杂 feature 状态优先拆成动态 Provider Context，而不是直接升级为全局 store。
- 默认不用 `let`，优先只用 `const`。
- 复杂流程不堆在一个函数里，优先拆成多个命名清晰的小函数。
- 不允许写 `void + expression`。
- 需要触发异步副作用时，使用显式命名 helper 包装，并明确错误处理或忽略策略。
- 业务代码和业务 hooks 不直接访问 DOM API。
- `document` / `window` / 事件监听 / observer / 滚动读写统一走 `shared/lib/dom` 或 `shared/lib/layout` 适配层。
- 业务代码不散落字面量。
- 业务阈值、默认值、文案 key、路由片段、交互配置统一收口到 `constant.ts`。
- 类型判别值、协议固定值、框架要求的最小字面量和测试 fixture，不强制抽到 `constant.ts`。

## File Pattern

- `Component.tsx`
- `Component.module.css`
- `useComponent.ts`
- `component.model.ts`
- `component.types.ts`
- `constant.ts`
- `FeatureContext.tsx` 仅在该 feature 存在复杂共享状态时引入

## Import Direction

- `app -> features -> entities/shared`
- `features` 可以依赖 `entities` 与 `shared`
- `shared` 不能依赖 `features`

## Option Rule

- 全仓不用 `null` 和 `undefined` 表达业务可选值。
- 业务可选值统一使用 `Option<T>`。
- 不允许把浏览器 API 或网络 API 原生空值直接传播到业务层。
- 所有边界空值都必须先在 adapter 层归一化。

## Option / Result Foundation

- `Option<T>` 和 `Result<E, T>` 都应落在 `shared` 基础工具层。
- 两者都必须是纯数据表示，并配套 helper 使用。
- 处理 `Option/Result` 时优先使用 helper，不手写散乱判定。
- `Result<E, T>` 不向前端业务层扩散，只用于工具方法和边界适配层。

## Enum Rule

- 枚举允许，但推荐使用字符串常量或字面量联合来保持运行时数据简单。
- 不引入复杂 class 形式的领域对象。
