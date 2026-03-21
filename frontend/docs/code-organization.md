# Code Organization

## Core Rules

- TSX 只做结构渲染和事件绑定。
- hooks 负责视图层状态编排与 effect 生命周期。
- `model.ts` 放纯 TS 算法、selectors、转换逻辑。
- `types.ts` 放 feature 内部类型。
- `shared/lib` 与 `entities` 不依赖 TSX。
- 任何新增未约定的 class、抽象或共享能力，先报备再落代码。
- 复杂 feature 状态优先拆成动态 Provider Context，而不是直接升级为全局 store。

## File Pattern

- `Component.tsx`
- `Component.module.css`
- `useComponent.ts`
- `component.model.ts`
- `component.types.ts`
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

## Enum Rule

- 枚举允许，但推荐使用字符串常量或字面量联合来保持运行时数据简单。
- 不引入复杂 class 形式的领域对象。
