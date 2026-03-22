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

`6 层架构 x 环境能力矩阵 x preference system x view-state 分层`

四部分分别解决不同问题：

| 维度 | 负责回答的问题 | 当前结论 |
| --- | --- | --- |
| `6 layers` | 东西应该放在哪一层 | `tokens -> utilities -> primitives -> patterns -> business -> component` |
| `capability matrix` | 不同宽度、输入能力下怎样变化 | 按 `spacious / medium / compact` 与 `fine / coarse / hover / keyboard` 组织 |
| `preference system` | 哪些东西是用户长期偏好，怎样覆盖默认值 | 主题、密度、动效、左右栏/TOC/ContextPanel 的持久偏好单独建模 |
| `view-state layering` | `idle / loading / ready / empty / error` 由谁承接 | `primitives` 提供状态原件，`patterns` 承担五态，`business / component` 负责编排 |

一句话：

- `layers` 管职责边界
- `capability matrix` 管响应式和多端交互
- `preference system` 管用户长期偏好
- `view-state layering` 管动态状态承接

## 6 层架构

| 层级 | 职责 | 不负责 |
| --- | --- | --- |
| `Tokens` | 颜色、字体、间距、阴影、层级、动效、布局宽度等变量 | 组件语义、业务流程 |
| `Utilities` | 排版、布局、focus、scroll、transition 等低层能力 | 业务命名、产品状态 |
| `Primitives` | Button、Link、Label、Input、SearchInput、Menu、ListItem、MessageBar、DialogContent、TableRow 等基础控件与状态原件 | 业务数据结构、页面级五态 |
| `Patterns` | TreeNav、ReadingPane、Shell、ViewStates 等可复用结构模式 | 产品语义、具体业务计算 |
| `Business` | TOC、FileTree、PathBar、三类主视图等产品语义组件 | 重复定义基础交互或共享骨架 |
| `Component` | feature/page 级编排、状态升级范围、页面任务路径 | 反向破坏下层契约 |

当前 primitive 盘面已不只包含“按钮和输入框”，也覆盖：

- 文本与语义原件：`Text / Label / Link / CodeInline / Kbd`
- 工具与动作原件：`Toolbar / SplitButton`
- 常见专项输入：`SearchInput / NumberInput / DateInput / Slider / FileTrigger`
- 通用信息行：`List / ListItem / KeyValue / Token`
- 通用反馈面：`InlineNotice / MessageBar / Banner / Toast`

这些对象必须保持非业务语义，供 `patterns / business` 继续组合。

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

## Preference System

这里的 preference 指“用户主动选择、可跨会话保留、默认应被尊重”的长期偏好。  
它不是：

- 设备环境能力
- 页面瞬时 UI 状态
- 数据加载状态

### 当前核心偏好集合

| 偏好 | 建议值 | 作用范围 |
| --- | --- | --- |
| `themeMode` | `system / light / dark` | 全局外观 |
| `uiDensity` | `comfortable / compact` | 全局 UI 密度，影响导航、列表、面板与部分阅读前奏 |
| `motionMode` | `system / full / reduced` | 全局动效强度 |
| `leftRailPref` | `auto / pinned / closed` | 左栏默认行为 |
| `tocPref` | `auto / open / closed` | 文档 TOC 的默认驻留方式 |
| `contextPanelPref` | `auto / open / closed` | 右侧上下文区的默认驻留方式 |

### Preference 与其他系统的边界

- `capability matrix`
  决定当前设备“能不能这样做”
- `preference system`
  决定在“能做”的前提下，用户“更想怎么用”
- `view-state layering`
  决定此刻内容“正在发生什么”

例如：

- `compact` 下即使用户偏好左栏常驻，也必须退化成临时层。
- 用户选择 `dark` 可以覆盖系统浅色主题，但不能让 dark theme 违反可读性约束。
- 用户选择 `reduced` 会压低动效；OS 已要求 reduced motion 时，产品不应反向放大动画。

### Preference 优先级

推荐按以下顺序理解最终生效值：

`a11y / OS 硬约束 > 环境能力 > 用户显式偏好 > workspace / account 默认值 > 产品默认值`

### 在 6 层中的落位

| 层级 | 与 preference 的关系 |
| --- | --- |
| `Tokens` | 提供 theme、density、motion 的变量别名与切换入口 |
| `Utilities` | 提供基于 preference 的基础选择器与 helper |
| `Primitives` | 消费 theme/density/motion，不直接读写 preference 存储 |
| `Patterns` | 根据 preference 决定通用结构的默认展开/收起方式 |
| `Business` | 决定哪些 preference 对 TOC / FileTree / ContextPanel 真正有意义 |
| `Component` | 负责读取、合并、持久化 preference，并产出最终 resolved mode |

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
7. preference 必须和 capability、view state 分开建模，不要把持久偏好写成瞬时类名状态。

## Archive 说明

已经被吸收到当前主结构、但仍需保留历史上下文的文档，会迁入 [archive/README.md](archive/README.md) 所描述的归档目录。  
归档文档只保留历史与推导价值，不再作为当前主规范入口。
