# SysFolio Frontend Style Handoff Layered Changelog

## 2026-03-22

### Layered Style Architecture

- 建立 `frontend-style-handoff-layered` 目录，作为并行验证的新 handoff 结构。
- 将真实样式源码收拢到 `styles/`，明确分为 `tokens / utilities / primitives / patterns / business / component` 六层。
- 保留根目录 `index.css / tokens.css / utilities.css / primitives.css / patterns.css / business.css / component.css` 作为兼容包装入口。
- 将 primitive 样式按家族拆分到 `styles/primitives/`，将结构模式收拢到 `styles/patterns/`，将产品语义组件收拢到 `styles/business/`。

### Design Spec Expansion

- 新增 `primitive-visual-spec.md`，明确 primitive 家族视觉基线。
- 新增 `interaction-state-matrix.md`，统一状态分层、优先级和类名契约。
- 新增 `navigation-state-spec.md`，统一 `TOC / FileTree / PathBar` 的 ownership 规则与 TOC 激活逻辑。
- 新增 `layout-behavior-spec.md`，明确 `spacious / medium / compact` 三档布局与左右栏行为。
- 新增 `view-density-spec.md`，明确 `Home / Directory / Document` 的密度与状态容器语气。
- 新增 `dark-theme-spec.md` 和 `motion-spec.md`，分别承接深色主题与动效规范。

### Doc Structure Consolidation

- 新增 `design-overview.md` 作为整体设计模型总览。
- 新增 `design-todo.md` 作为唯一主待办入口。
- 新增 `primitive-component-catalog.md`，统一 primitive 组件目录、slot、变体、状态与缺口。
- 将 `README.md` 重写为当前 active docs 的入口页。
- 新增 `archive/README.md`，用于承接已被当前结构吸收的历史专题文档。
- 将 active specs 统一补充 `Remaining TODO` 段落，避免待办散落在独立路线或过程文档中。
