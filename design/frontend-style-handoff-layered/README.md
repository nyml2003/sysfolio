# SysFolio Frontend Style Handoff Layered

这套目录是对现有 `frontend-style-handoff` 的并行重组版本，用来先验证新的分层语义，不直接覆盖旧目录。

## 目标

- 保留现有视觉方向、token 值和大部分 selector，避免一次性重绘。
- 把当前 `tokens / atomic / molecular` 的混层问题拆开。
- 用更明确的职责层次对齐设计和前端实现。
- 把 CSS 真实源码收进 `styles/`，避免后续继续在根目录平铺增长。

## 源码结构

- `overall-design-strategy.md`
  当前整体新设计方案的总文档，整合 6 层架构、响应式、多端交互、view state、树形导航和 TOC 规则。
- `primitive-inventory.md`
  基于 Ant Design 的组件总览检查 primitive 覆盖面，但按 SysFolio 的 6 层架构重划边界。
- `visual-refinement-strategy.md`
  把当前视觉侧待设计项推进成可执行的细化方案，覆盖基础控件、状态矩阵、响应式行为、树导航层级、版式密度、深色主题和动效规则。
- `visual-delivery-roadmap.md`
  把视觉细化方案继续拆成前端可执行的交付顺序，明确每一轮改哪些文件、解决什么问题、怎样算完成。
- `primitive-visual-spec.md`
  把 `Phase 1` 继续细化成 primitive 家族视觉规范，直接对应现有类名、尺寸基线、状态表达和验收标准。
- `navigation-state-spec.md`
  把 `Phase 2` 细化成导航状态规范，统一 `TreeNav / TOC / FileTree / PathBar` 的 ownership、交互叠加和信息状态。
- `layout-behavior-spec.md`
  把 `Phase 3` 细化成布局行为规范，统一 `Shell / FileTree / TOC / ContextPanel / PathBar` 在三档宽度下的驻留方式、入口和返回路径。
- `view-density-spec.md`
  把 `Phase 4` 细化成视图密度规范，统一 `Home / Directory / Document` 的版式节奏，以及 `loading / empty / error` 在不同视图中的语气和重量。
- `dark-theme-spec.md`
  把 `Phase 5` 细化成深色主题复核规范，统一 token 优先级、重点复核对象和 dark theme 的验收标准。
- `motion-spec.md`
  把 `Phase 6` 细化成动效规范，统一 feedback、structure、overlay、onboarding 和 reduced motion 的节奏边界。
- `styles/`
  真实源码目录，所有 CSS 维护都应落在这里。
- `styles/tokens.css`
  只放设计变量和主题覆盖。
- `styles/utilities.css`
  对应低层样式能力，承接原 `atomic.css`，不再使用 atomic design 的术语解释。
- `styles/primitives/`
  放基础控件样式，按能力家族拆分，目前包括 `actions / data-entry / navigation / data-display / feedback / overlays`。
- `styles/patterns/`
  放可复用结构模式，例如 `shell / reading / tree-navigation / view-states`。
- `styles/business/`
  放当前产品语义更强的组件和视图，当前拆为 `navigation / explorer / views / onboarding`。
- `styles/component.css`
  预留给 page edge / feature edge 级的编排和状态升级规则。
- `styles/index.css`
  统一定义 layer 顺序和导入关系。
- 根层 `index.css / tokens.css / utilities.css / primitives.css / patterns.css / business.css / component.css`
  现在都只是兼容包装，用来平滑过渡旧引用。
- `responsive-and-multi-input-strategy.md`
  说明这套 6 层架构如何支撑响应式布局和不同输入能力下的交互。
- `toc-activation-strategy.md`
  说明 TOC 在长文阅读中的激活规则，解决滚动到底但目录未到最后一项的问题。
- `tree-navigation-pattern.md`
  定义 TOC 与 File Tree 共享的树形导航模式层，包括结构、状态和交互边界。
- `page-view-state-strategy.md`
  重新定义 `idle / loading / ready / empty / error` 的分层承接方式：`primitives` 提供状态原件，`patterns` 承担五态，`business/page` 负责状态编排。

## 依赖规则

分层只允许单向向上组装：

`tokens -> utilities -> primitives -> patterns -> business -> component`

具体约束：

- `tokens` 不表达组件语义。
- `utilities` 只表达样式能力，不表达业务概念。
- `primitives` 不绑定业务数据和业务流程，但要提供基础交互状态和状态原件。
- `patterns` 可以组合基础控件，并应优先承接 data-bearing 的 view state。
- `business` 才承载产品概念、业务数据、状态计算和高语义结构。
- `component` 负责 feature / page 级组合，以及状态影响范围和升级策略。
- `patterns` 如果需要被 `business` 复用共享骨架，应输出共享契约，而不是直接持有业务 selector。

## 当前迁移策略

- 保留 `--sys-*`、`--u-*` 和现有 `.m-*` selector。
- 本轮先做文件拆分和职责归位，不做大规模重命名。
- `molecular.css` 中的内容拆到 `primitives / patterns / business` 三层，并进一步归到 `styles/` 子目录。
- `primitives` 不按单个组件一文件拆，而按家族拆，避免基础控件变多后目录失控。
- `tokens.css` 只保留纯语义变量，不再保留 `shell / path / file-tree / toc` 这类组件别名 token。

## 与旧目录的关系

- 旧的 `frontend-style-handoff` 继续作为当前基线，不在这一轮删除。
- 这个新目录用于确认分层是否更清晰、前端接入是否更顺。
- 如果团队认可这套结构，再反向替换旧目录。

## 建议接入方式

1. 将这套目录整体放入 `src/shared/ui/styles`
2. 在应用入口优先引入 `styles/index.css`
3. 如果短期内要兼容旧引用，再保留根层 `index.css` 作为过渡入口
4. `Component.module.css` 优先复用 `business / patterns / primitives`
5. 组件差异化部分再保留在局部 module.css 中

## 备注

- 这里仍沿用 `.m-*` 前缀，是为了控制迁移成本。
- 如果后续决定进一步细分前缀，可以在第二轮再做 selector 命名调整。
