# SysFolio Design Overview

## 文档目的

这份文档是 `frontend-style-handoff-layered` 的主总览。

它只负责回答三件事：

- 这套 handoff 目前的整体设计模型是什么
- 活跃文档分别解决什么问题
- 前端接入时需要先守住哪些总约束

它不承担阶段性过程记录，也不直接承载待办列表。  
进行中的设计缺口统一维护在 [design-todo.md](design-todo.md)。

## 整体模型

当前方案用一个组合模型来组织设计与前端实现：

`6 层架构 x 环境能力矩阵 x view-state 分层`

三部分分别解决不同问题：

| 维度 | 负责回答的问题 | 当前结论 |
| --- | --- | --- |
| `6 layers` | 东西应该放在哪一层 | `tokens -> utilities -> primitives -> patterns -> business -> component` |
| `capability matrix` | 不同宽度、输入能力下怎样变化 | 按 `spacious / medium / compact` 与 `fine / coarse / hover / keyboard` 组织 |
| `view-state layering` | `idle / loading / ready / empty / error` 由谁承接 | `primitives` 提供状态原件，`patterns` 承担五态，`business / component` 负责编排 |

一句话：

- `layers` 管职责边界
- `capability matrix` 管响应式和多端交互
- `view-state layering` 管动态状态承接

## 6 层架构

| 层级 | 职责 | 不负责 |
| --- | --- | --- |
| `Tokens` | 颜色、字体、间距、阴影、层级、动效、布局宽度等变量 | 组件语义、业务流程 |
| `Utilities` | 排版、布局、focus、scroll、transition 等低层能力 | 业务命名、产品状态 |
| `Primitives` | Button、Input、Menu、DialogContent、TableRow 等基础控件与状态原件 | 业务数据结构、页面级五态 |
| `Patterns` | TreeNav、ReadingPane、Shell、ViewStates 等可复用结构模式 | 产品语义、具体业务计算 |
| `Business` | TOC、FileTree、PathBar、三类主视图等产品语义组件 | 重复定义基础交互或共享骨架 |
| `Component` | feature/page 级编排、状态升级范围、页面任务路径 | 反向破坏下层契约 |

## 环境能力矩阵

这套方案不按“PC / Mobile”二分，而按环境能力收口：

- 宽度能力：`spacious / medium / compact`
- 指针能力：`fine / coarse`
- hover 能力：`hover / none`
- 键盘能力：`keyboard / limited`

当前布局结论：

| 档位 | 布局行为 |
| --- | --- |
| `spacious` | 左栏常驻，主内容常驻，右栏常驻 |
| `medium` | 左栏常驻，主内容常驻，右栏改可唤起层 |
| `compact` | 单主列，左右辅助区都转临时层 |

## View-State 分层

五态主流程保持：

`idle -> loading -> ready | empty | error`

当前分工：

- `Primitives`：提供 `Spinner / Skeleton / InlineNotice / loading button` 等状态原件
- `Patterns`：承接 data-bearing 区块的五态
- `Business`：计算状态，注入文案与恢复动作
- `Component`：决定局部状态是否升级成更高层阻塞状态

## 活跃文档

当前活跃文档只保留以下集合：

| 文档 | 角色 |
| --- | --- |
| [README.md](README.md) | 目录入口与阅读顺序 |
| [design-overview.md](design-overview.md) | 整体模型与总约束 |
| [design-todo.md](design-todo.md) | 当前设计待办与推进顺序 |
| [primitive-visual-spec.md](primitive-visual-spec.md) | primitive 视觉基线与家族规则 |
| [primitive-component-catalog.md](primitive-component-catalog.md) | primitive 组件合同、变体、状态与缺口 |
| [interaction-state-matrix.md](interaction-state-matrix.md) | 状态矩阵、优先级与分层 |
| [navigation-state-spec.md](navigation-state-spec.md) | TOC / FileTree / PathBar 导航状态与 TOC 激活规则 |
| [layout-behavior-spec.md](layout-behavior-spec.md) | 三档布局、左右栏、PathBar 入口与多端行为 |
| [view-density-spec.md](view-density-spec.md) | `home / directory / document` 的密度与 view-state 语气 |
| [dark-theme-spec.md](dark-theme-spec.md) | 深色主题复核规则 |
| [motion-spec.md](motion-spec.md) | 动效节奏与 reduced motion 约束 |
| [CHANGELOG.md](CHANGELOG.md) | 已完成变更记录 |

## 源码结构

当前样式源码位于 `styles/`：

- `styles/tokens.css`
- `styles/utilities.css`
- `styles/primitives/*`
- `styles/patterns/*`
- `styles/business/*`
- `styles/component.css`
- `styles/index.css`

根目录中的 `index.css / tokens.css / utilities.css / primitives.css / patterns.css / business.css / component.css` 仍保留兼容包装角色，用于平滑过渡旧引用。

## 接入约束

前端接入时先守住以下规则：

1. 只允许按 `tokens -> utilities -> primitives -> patterns -> business -> component` 单向组装。
2. 不把业务语义塞回 `utilities` 或 `primitives`。
3. data-bearing `patterns` 必须预先考虑五态。
4. hover 只能增强理解，不能承担关键反馈。
5. 小屏适配优先重排任务路径，不优先 `display: none`。
6. `TOC` 与 `FileTree` 共享 `TreeNav pattern`，但不合并成同一个业务组件。

## Archive 说明

已经被吸收到当前主结构、但仍需保留历史上下文的文档，会迁入 [archive/README.md](archive/README.md) 所描述的归档目录。  
归档文档只保留历史与推导价值，不再作为当前主规范入口。
