# Code Organization

> **本文档**：TSX/hooks 分工、**单文件职责（一主抽象 + 未导出辅助）**、**UI 库与原生 HTML**、文件命名、import 方向、`constant` 与 UI 文案分工。  
> **相关**：[文档索引](./README.md) · [架构分层](./architecture.md) · [样式体系](./styling-system.md) · [国际化](./i18n.md) · [`Option`](./option-result.md)

## 单文件职责

### 一文件一主抽象（推荐默认）

- **粒度**：每个实现文件（`.ts` / `.tsx`）**默认只承载一个「主导出」**，且为下列之一：
  - **一个**顶层导出的 **函数**（含纯函数、repository 工厂等），或
  - **一个**顶层导出的 **class**，或
  - **一个**顶层导出的 **hook**（`useXxx`），或
  - **一个**顶层导出的 **React 组件**（与默认导出/同名导出二选一，团队统一即可）。
- **附属实现**：允许在同一文件内声明 **不导出** 的函数、小常量、类型守卫，仅服务于上述主抽象；**不**在同一文件再导出第二个平级的「公共函数 / 组件 / hook」。
- **命名**：文件名与主导出一致或强相关（如 `useFileTree.ts` 只导出 `useFileTree`，`build-fallback-breadcrumbs.ts` 只导出 `buildFallbackBreadcrumbs`；具体命名风格与现有目录对齐即可）。

### 与「一件事」的关系

- **一个文件只干一件事**：在「一主抽象」之上，主题仍须单一（不把无关领域、无关 feature 拼进同一文件）。
- **典型拆分**：
  - 视图：主组件一个文件；复杂逻辑放到 **单独** 的 `use*.ts` 或 **每函数一文件** 的 `*.model.ts` / `*.ts`。
  - 常量：同主题的 `constant.ts` 可含**多个导出的常量名**，但**不写业务逻辑**；长段用户可见文案不放此文件。
  - 文案：见 **`i18n.md`**；大表视为「一个配置单元」（见下**例外**）。
  - 类型：`*.types.ts` 可只含类型，不夹带运行时代码。

### 允许的例外（须克制）

- **`index.ts`**：只做 re-export，不写实现。
- **成套基础工具**：`shared/lib/monads/option`、`…/result` 等已按**一函数一文件**落地；**新增** helper 时仍优先 **新文件**，避免在单文件堆叠多个并列导出。
- **i18n / design token 大表**：`ui-copy`、`Record<Locale, …>` 等视为**单一数据源文件**，不按「每字符串一文件」拆。
- **测试**：`*.test.ts` 内允许多个 `it`。
- **存量代码**：未拆分前不强制阻断合并；**新代码**按本节约束执行。

### 仍与「一主抽象」有差距的存量（盘点）

以下用 `scripts/list-multi-export.mjs`（统计以 `export ` 开头的行数 **> 1**，且不含 `*.test.*`）做辅助盘点；**行数多不等于必须拆**，需结合豁免项判断。

**不纳入「问题清单」**（按约定可保持多导出）：

- 各处的 **`constant.ts` / `*.constants.ts`**：多常量名为常态，**不**按「一文件一导出」拆（见上「常量」小节）。
- **`index.ts`**：仅 re-export 的 barrel。
- **i18n / mock 大表**：如 `shared/lib/i18n/ui-copy.ts`、`site/overview/overview-copy.ts`、`shared/data/mock/overview-library.ts`、`shared/data/mock/content.en.ts` 等（见上「例外」）。
- **`*.types.ts`**：纯类型聚合（见上「类型」）；体量特别大时是否再拆由团队单独定策略。

**仍待对齐或需策略取舍的实现文件**（新代码尽量别再堆并列导出）：

| 区域 | 文件 | 说明 |
| --- | --- | --- |
| 实体 | `entities/content/content.types.ts` | 类型导出集中、体量最大；是否按子域拆文件需单独决策。 |
| UI | `shared/ui/primitives/Icon.tsx` | 多图标/子组件同文件导出。 |
| Article | `features/article/context/article-dom.context.ts` | Context / Provider 等多导出。 |
| Site | `site/overview/components/OverviewPages.tsx`、`OverviewPanels.tsx` | 多组件/多导出同文件。 |
| Store | `shared/store/preferences/preferences-context.ts` | 多导出（类型 + Context 等）。 |

已按「一主抽象」拆过一轮的模块（实现已一文件一主导出；目录内 **`index.ts` 仍为 re-export barrel**）：`shared/lib/dom`（`get-window-option`、定时/帧、`scroll-element/*`、`has-intersection-observer-support`、`use-document-element-*`、`useIntersectionObserver`）、`features/article/model/toc-activation/*`、`shared/ui/foundation` 的 `resolve-*-mode`、`shared/ui/primitives` 的 `button.types` / `segmented-control.types` 与对应组件文件。

> **提示**：再次全量盘点可执行：`node scripts/list-multi-export.mjs`（工作目录为 `frontend/`）。

### 反例

- 同一文件 `export function foo` 又 `export function bar`（二者非主从、非上述例外）。
- 在单个 `.tsx` 里堆长串业务规则 + 多套并列组件并全部导出。
- 在 `constant.ts` 里维护整页中英文段落（应走 i18n copy）。

## Core Rules

- TSX 只做结构渲染和事件绑定。
- hooks 负责视图层状态编排与 effect 生命周期。
- `model.ts` 放纯 TS 算法；**多个无耦合的算法优先分文件**，每文件一个导出（见上「一主抽象」）。
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
- **常量与文案分工**：
  - **业务阈值、默认值、路由片段、交互配置、稳定 id** 等，按 feature 或 `shared` 维度收口到 **`constant.ts`**（或同职责的命名文件），避免在多处分叉。
  - **用户可见文案**（多语言）、**locale 类型**、**接入方式**（`useUiCopy`、场景 `useXxxCopy`、`document` 语言同步等）一律按 **`i18n.md`** 执行；**不**与「魔法数字、路由 path」混在同一常量文件里，除非该文件只负责 re-export 分组导出。
- 类型判别值、协议固定值、框架要求的最小字面量和测试 fixture，不强制抽到 `constant.ts`。

## UI 库与原生 HTML

- **原则**：除 **`shared/ui`** 内部实现组件外，**`app` / `features` / `site` 中的业务 TSX 不直接使用浏览器原生交互/表单类标签**（如 `button`、`input`、`select`、`textarea` 以及用于表单联动的 `label` 等）搭建产品界面；应使用 `shared/ui` 已提供的 **primitives**、**layout**、**patterns**（如 `Button`、`Field`、`Stack` 等）。
- **原生标签允许出现的位置**：
  - **`shared/ui`**：封装 primitives、布局容器时，在组件内部使用原生标签并配套 CSS Modules / tokens。
  - **`shared/lib/dom`** 等与浏览器 API 打交道的适配层：按需使用，不承载产品级 UI 拼装。
- **布局与容器**：业务层优先使用 `shared/ui/layout`（如 `Stack`、`Grid`、`Inline`、`Surface`），避免随手堆裸 `div` + 无约定 class；若确有例外，须报备（与 `styling-system.md` 审批规则一致）。
- **内容语义标签**：由正文/Markdown 渲染产出的 `article`、`h1`–`h6`、`p` 等，可在内容渲染专用组件内使用，但仍应优先走统一阅读区样式与约定，不在业务壳层随意新开一套原生结构。
- **存量与迁移**：现有代码若仍含裸原生控件，新改动应逐步替换为 UI 库组件，不在同一文件里扩大裸标签使用面。

## File Pattern

- `Component.tsx` — 通常 **一个文件一个导出组件**；局部子组件可不导出、写在同文件。
- `Component.module.css`
- `useComponent.ts` — **一个 hook 一个文件**（单导出 `useComponent`）。
- `build-foo.ts` / `foo.model.ts` — **一个纯函数一个文件**（或经报备的成套 model）。
- `component.types.ts`
- `constant.ts` — 同主题多个常量名，无逻辑。
- `FeatureContext.tsx` 仅在该 feature 存在复杂共享状态时引入

## Import Direction

- `app` / `site` -> `features` -> `entities` / `shared`
- `features` 可以依赖 `entities` 与 `shared`
- `shared` 不能依赖 `features`
- `site` 与 `app` 同级，可依赖 `features`；**禁止** `features` 或 `shared` 依赖 `site`（避免文档站实现倒灌主业务）。

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
