# SysFolio Frontend Style Handoff Layered

## 文档定位

这是 `frontend-style-handoff-layered` 的入口页。  
当前目录用于沉淀新的分层样式 handoff 方案，并作为 `styles/` 源码与设计规范的主入口。

## 阅读顺序

建议按这个顺序阅读：

1. [design-overview.md](design-overview.md)
2. [design-todo.md](design-todo.md)
3. [primitive-visual-spec.md](primitive-visual-spec.md)
4. [primitive-component-catalog.md](primitive-component-catalog.md)
5. [interaction-state-matrix.md](interaction-state-matrix.md)
6. [navigation-state-spec.md](navigation-state-spec.md)
7. [layout-behavior-spec.md](layout-behavior-spec.md)
8. [view-density-spec.md](view-density-spec.md)
9. [dark-theme-spec.md](dark-theme-spec.md)
10. [motion-spec.md](motion-spec.md)

## Active Docs

| 文档 | 作用 |
| --- | --- |
| `design-overview.md` | 整体设计模型、6 层架构、能力矩阵与接入约束 |
| `design-todo.md` | 当前待办、优先级与维护规则 |
| `primitive-visual-spec.md` | primitive 家族视觉基线 |
| `primitive-component-catalog.md` | primitive 组件目录、变体、状态与缺口 |
| `interaction-state-matrix.md` | 状态矩阵、优先级与分层责任 |
| `navigation-state-spec.md` | TOC / FileTree / PathBar 的状态与 TOC 激活规则 |
| `layout-behavior-spec.md` | 三档布局、左右栏与多端交互行为 |
| `view-density-spec.md` | `home / directory / document` 的密度与 view-state 语气 |
| `dark-theme-spec.md` | dark theme 复核规则 |
| `motion-spec.md` | 动效等级与 reduced motion 规则 |
| `CHANGELOG.md` | 已完成变更记录 |

## Research Reports

以下文档用于承接阶段性调研结论，帮助补充 active specs，但不作为新的主规范入口：

| 文档 | 作用 |
| --- | --- |
| `preference-system-research-report.md` | preference system 的业界实践、能力缺口与后续补充建议 |
| `ui-ux-system-gap-research-report.md` | preference 之外的系统级 UI UX 缺口调研与优先级判断 |

## 样式源码

真实源码位于 `styles/`：

- `styles/tokens.css`
- `styles/utilities.css`
- `styles/primitives/*`
- `styles/patterns/*`
- `styles/business/*`
- `styles/component.css`
- `styles/index.css`

根目录中的 `index.css / tokens.css / utilities.css / primitives.css / patterns.css / business.css / component.css` 当前仅保留兼容包装角色。

## Archive

已被当前主结构吸收的旧专题文档会移动到 [archive/README.md](archive/README.md) 对应的归档目录中。  
归档文档保留历史推导价值，但不再作为主规范入口。
