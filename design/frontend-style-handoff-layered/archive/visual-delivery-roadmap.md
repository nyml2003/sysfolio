# Archived: SysFolio Visual Delivery Roadmap

> 已归档。当前推进顺序请优先阅读 `../design-todo.md` 与对应 active specs。

# SysFolio Visual Delivery Roadmap

## 文档目的

这份文档把 [visual-refinement-strategy.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/visual-refinement-strategy.md) 里的视觉细化方向，进一步拆成前端可执行的交付顺序。

它回答的是：

- 应该先改哪一层、哪几个文件
- 每一轮要解决什么问题
- 改到什么程度才算这一轮完成
- 哪些内容不要混在同一轮一起做

## 当前结论

最合理的推进方式不是“按页面一块块修”，而是：

`先稳 primitive 家族，再稳状态语义，再稳布局行为，最后复核 dark theme 和 motion。`

原因很简单：

- primitive 不稳，后面所有 pattern 和 business 都会重复返工
- 状态不稳，导航和列表会持续发糊
- 布局不稳，中小屏策略永远只能靠隐藏兜底
- dark 和 motion 太早做，会建立在不稳定的视觉基线之上

## 总体顺序

| 阶段 | 目标 | 主要文件 |
| --- | --- | --- |
| Phase 1 | Primitive 家族视觉统一 | `styles/primitives/*` |
| Phase 2 | 状态矩阵与导航层级统一 | `styles/primitives/*` + `styles/patterns/tree-navigation.css` + `styles/business/navigation.css` + `styles/business/explorer.css` |
| Phase 3 | Shell 与多端布局行为定稿 | `styles/patterns/shell.css` + `styles/business/navigation.css` + `styles/business/explorer.css` + `styles/business/views.css` |
| Phase 4 | 三类业务视图密度校准 | `styles/patterns/reading.css` + `styles/patterns/view-states.css` + `styles/business/views.css` |
| Phase 5 | Dark Theme 复核 | `styles/tokens.css` + 相关 pattern / business 文件 |
| Phase 6 | Motion 规则收敛 | `styles/tokens.css` + `styles/utilities.css` + 相关 primitives / patterns / business 文件 |

## Phase 1: Primitive 家族视觉统一

### 目标

先把基础组件的家族关系做稳，让前端后续继续补控件时有统一标准，而不是每补一个控件再单独找风格。

详细规范见：

- [primitive-visual-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/primitive-visual-spec.md)

### 范围

- `styles/primitives/actions.css`
- `styles/primitives/data-entry.css`
- `styles/primitives/navigation.css`
- `styles/primitives/data-display.css`
- `styles/primitives/feedback.css`
- `styles/primitives/overlays.css`

### 这一轮要解决的问题

- Button / Input / Navigation controls / Card / Overlay 是否像同一套系统
- 边框、圆角、字重、背景和 hover 逻辑是否统一
- danger / warning / success 这些语义是否开始有稳定方向

### 交付标准

- 同一家族控件的默认态、hover、focus-visible、disabled 规律一致
- 主按钮不再过重，次按钮能承担更多使用比例
- 输入类控件都回到“平面可写表面”逻辑
- Dropdown / Dialog / Drawer 至少有稳定的容器气质，不像三个不同产品

### 这一轮不做的事

- 不碰 FileTree / TOC / PathBar 的业务态细化
- 不碰中小屏结构变化
- 不碰 dark theme 全量重校

## Phase 2: 状态矩阵与导航层级统一

### 目标

把当前最容易混淆的状态彻底拆开，尤其是：

- `current`
- `selected`
- `search-match`
- `hover`
- `expanded`

详细规范见：

- [navigation-state-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/navigation-state-spec.md)
- [interaction-state-matrix.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/interaction-state-matrix.md)

### 范围

- `styles/patterns/tree-navigation.css`
- `styles/business/navigation.css`
- `styles/business/explorer.css`
- 必要时回调 `styles/primitives/navigation.css`

### 这一轮要解决的问题

- TOC、FileTree、PathBar 的状态权重不够清楚
- hover 太像 current
- search match 太容易抢 selected
- expanded 只在结构上变化，视觉提示不够稳定

### 交付标准

- `current / selected / search-match` 能同时存在且不混
- current 始终是最稳定、最优先的导航信号
- hover 只做轻增强，不再和主要状态争抢
- PathBar 当前 segment 与普通 segment 的差异可以在 1 秒内看明白
- `success / warning / destructive / drag / reorder` 的类名契约可以直接给前端复用

### 这一轮不做的事

- 不做真正的拖拽视觉
- 不开始改三栏到单栏的完整交互
- 不把业务视图的版式密度一起混进来

## Phase 3: Shell 与多端布局行为定稿

### 目标

把当前“宽度不够就隐藏”的工程策略，升级成正式的布局行为方案。

详细规范见：

- [layout-behavior-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/layout-behavior-spec.md)

### 范围

- `styles/patterns/shell.css`
- `styles/business/navigation.css`
- `styles/business/explorer.css`
- `styles/business/views.css`

### 这一轮要解决的问题

- 右栏在中屏到底是消失、折叠还是可唤起
- 左栏在 compact 环境是抽屉、全屏导航还是独立页
- 移动端 PathBar 要保留哪些信息
- coarse pointer 环境下树节点和箭头的 hit area 是否够稳定

### 交付标准

- `>= 1280px`、`960px - 1279px`、`< 960px` 三档行为明确
- 中屏右栏不再只是 `display: none`
- compact 环境的导航入口清晰，不靠用户猜
- TOC / FileTree 在 coarse pointer 下不依赖 hover 也能完整使用

### 这一轮不做的事

- 不做 dark theme 复核
- 不细调文档页排版节奏
- 不扩大到所有页面转场动画

## Phase 4: 三类业务视图密度校准

### 目标

让 `home / directory / document` 三类视图各自有稳定节奏，不再像同一个通用容器套了不同内容。

详细规范见：

- [view-density-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/view-density-spec.md)

### 范围

- `styles/patterns/reading.css`
- `styles/patterns/view-states.css`
- `styles/business/views.css`

### 这一轮要解决的问题

- Home 不够像入口页
- Directory 条目过于卡片化或过于松散
- Document 的辅助信息和正文阅读节奏还没完全拉开
- Loading / Empty / Error 在不同视图中的密度不一致

### 交付标准

- Home 的视觉重点是导览，不是列表堆叠
- Directory 更利于扫描、比较和进入
- Document 的标题、摘要、正文、代码块、引用块节奏稳定
- `idle / ready / loading / empty / error` 在三类视图中都能保持结构感，不塌

### 这一轮不做的事

- 不继续扩 primitive 新组件
- 不动导航状态语义
- 不做 dark theme 颜色重配

## Phase 5: Dark Theme 复核

### 目标

不是“补一个 dark 版本”，而是正式验证阅读舒适度、层级和语义色在 dark 下是否成立。

详细规范见：

- [dark-theme-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/dark-theme-spec.md)

### 范围

- `styles/tokens.css`
- 涉及代码块、正文、导航 current 态、inline notice 的相关样式

### 重点检查对象

- Document 正文
- Code block
- Inline code
- TOC current
- FileTree selected
- PathBar current
- Inline notice

### 交付标准

- 正文阅读不刺眼
- muted text 仍可读
- 暖色语义在 dark 下仍然成立
- success / warning / danger 不像控制台状态灯

### 这一轮不做的事

- 不引入新视觉方向
- 不顺手改布局
- 不用 dark 主题去掩盖层级问题

## Phase 6: Motion 规则收敛

### 目标

让系统里的动效从“零散过渡”变成“有主次、有因果关系的节奏规则”。

详细规范见：

- [motion-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/motion-spec.md)

### 范围

- `styles/tokens.css`
- `styles/utilities.css`
- 需要动效的 primitives / patterns / business 文件

### 这一轮要解决的问题

- 哪些动效应保留，哪些应减弱，哪些应去掉
- Tree 展开、面板显隐、浮层进入是否有统一重量
- reduced motion 是否真正可用

### 交付标准

- hover / focus 只保留轻过渡
- 结构型切换动效比局部控件稍重，但不过头
- 列表项不做无意义逐个浮起
- reduced motion 下保留状态变化，不保留位移负担

### 这一轮不做的事

- 不再重配颜色
- 不再大改版式
- 不让动效反过来驱动组件结构

## 推荐验收方式

每一轮都按同一套方式验收：

1. 先看同层是否一致
2. 再看跨层是否冲突
3. 再看 desktop / medium / compact 三档是否都成立
4. 再看 fine pointer / coarse pointer 是否都可用
5. 最后看 light / dark 是否都不破坏主任务

## 推荐的文件改动边界

为了避免每轮都把所有样式卷进去，建议严格控制改动边界：

- Phase 1 不出 `styles/primitives/`
- Phase 2 主要改 `tree-navigation + business navigation/explorer`
- Phase 3 主要改 `shell + business layout`
- Phase 4 主要改 `reading + view states + views`
- Phase 5 以 `tokens` 为起点，最少量回调具体组件
- Phase 6 以 `tokens / utilities` 为起点，最少量回调具体组件

## 当前结论

如果后面要正式开始改 CSS，最稳的顺序不是从页面切，而是：

`Phase 1 primitives -> Phase 2 states -> Phase 3 layout -> Phase 4 density -> Phase 5 dark -> Phase 6 motion`

这样可以把返工率压到最低。
