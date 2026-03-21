# SysFolio Frontend Style Handoff Layered

这套目录是对现有 `frontend-style-handoff` 的并行重组版本，用来先验证新的分层语义，不直接覆盖旧目录。

## 目标

- 保留现有视觉方向、token 值和大部分 selector，避免一次性重绘。
- 把当前 `tokens / atomic / molecular` 的混层问题拆开。
- 用更明确的职责层次对齐设计和前端实现。

## 分层

- `tokens.css`
  只放设计变量和主题覆盖。
- `utilities.css`
  对应低层样式能力，承接原 `atomic.css`，不再使用 atomic design 的术语解释。
- `primitives.css`
  放基础控件样式，例如按钮、标签、基础浮层。
- `patterns.css`
  放可复用结构模式，例如 app shell、reading pane、doc header、empty state。
- `business.css`
  放当前产品语义更强的组件和视图，例如 path bar、file tree、home view、directory view、document view。
- `index.css`
  统一定义 layer 顺序和导入关系。
- `responsive-and-multi-input-strategy.md`
  说明这套 6 层架构如何支撑响应式布局和不同输入能力下的交互。
- `toc-activation-strategy.md`
  说明 TOC 在长文阅读中的激活规则，解决滚动到底但目录未到最后一项的问题。
- `toc-file-tree-reuse-boundary.md`
  说明 TOC 与 File Tree 应共享哪一层，不应共享哪一层。
- `tree-navigation-pattern.md`
  定义 TOC 与 File Tree 共享的树形导航模式层，包括结构、状态和交互边界。
- `page-view-state-strategy.md`
  定义页面级组件的 `idle / loading / ready / empty / error` 五态模型，以及页面主状态和局部状态的边界。

## 依赖规则

分层只允许单向向上组装：

`tokens -> utilities -> primitives -> patterns -> business -> component`

具体约束：

- `tokens` 不表达组件语义。
- `utilities` 只表达样式能力，不表达业务概念。
- `primitives` 不绑定业务数据和业务流程。
- `patterns` 可以组合基础控件，但尽量不接业务语义。
- `business` 才承载产品概念、页面视图和高语义结构。

## 当前迁移策略

- 保留 `--sys-*`、`--u-*` 和现有 `.m-*` selector。
- 本轮先做文件拆分和职责归位，不做大规模重命名。
- `molecular.css` 中的内容拆到 `primitives / patterns / business` 三层。

## 与旧目录的关系

- 旧的 `frontend-style-handoff` 继续作为当前基线，不在这一轮删除。
- 这个新目录用于确认分层是否更清晰、前端接入是否更顺。
- 如果团队认可这套结构，再反向替换旧目录。

## 建议接入方式

1. 将这套目录整体放入 `src/shared/ui/styles`
2. 在应用入口引入 `index.css`
3. `Component.module.css` 优先复用 `business / patterns / primitives`
4. 组件差异化部分再保留在局部 module.css 中

## 备注

- 这里仍沿用 `.m-*` 前缀，是为了控制迁移成本。
- 如果后续决定进一步细分前缀，可以在第二轮再做 selector 命名调整。
