# SysFolio Navigation State Spec

## 文档目的

这份文档把 `Phase 2` 的“状态矩阵与导航层级统一”继续细化成一份可直接指导样式调整的导航状态规范。

它主要解决的是以下混淆：

- `current` 和 `selected` 经常被做成同一种状态
- `search-match` 太容易抢掉主要导航信号
- `hover` 和 `current` 太接近，导致层级发糊
- `expanded` 只在结构上变化，但视觉提示不稳定
- `TOC / FileTree / PathBar` 三者都像导航，但状态语义不完全相同

## 使用范围

这份规范对应以下文件和对象：

- `styles/patterns/tree-navigation.css`
- `styles/business/navigation.css`
- `styles/business/explorer.css`
- 必要时回调 `styles/primitives/navigation.css`

对应对象：

- `TreeNav`
- `TOC`
- `FileTree`
- `PathBar`

## 一、核心原则

### 1. 先定义“谁拥有当前状态”，再定义视觉

导航状态最容易出问题的原因，不是颜色没选对，而是“多个状态都想当主状态”。

这里先统一一条原则：

`每个导航对象在任一时刻只能有一个主 ownership state。`

ownership state 指：

- `current`
- `selected`
- `default`

`search-match`、`hover`、`focus-visible`、`active-press`、`expanded` 都不是 ownership state。  
它们是附加状态，只能叠加在 ownership state 之上。

### 2. 状态要分成四类

| 类别 | 状态 | 作用 |
| --- | --- | --- |
| Ownership | `default / current / selected` | 定义这个对象“现在是谁” |
| Interaction Overlay | `hover / focus-visible / active-press` | 定义用户此刻如何与它交互 |
| Structural | `expanded / collapsed` | 定义结构开合 |
| Informational | `search-match` | 定义系统命中或局部提示 |

### 3. 信息性状态不能抢 ownership

`search-match` 只能增强命中可发现性，不能变成主状态。  
最稳的做法是：

- 行主状态继续由 `current` 或 `selected` 控制
- `search-match` 主要落在 label 内局部高亮

## 二、统一优先级

### 1. 视觉优先级

推荐统一按以下顺序理解导航权重：

`focus-visible > current > selected > search-match > hover > default`

补充说明：

- `focus-visible`
  是可访问性覆盖层，通常以 outline 出现，不替换 ownership state
- `current`
  是最稳定、最主要的导航信号
- `selected`
  只表示用户主动选中对象，不等于当前位置
- `search-match`
  只表达命中，不表达所属
- `hover`
  只能增强可发现性

### 2. expanded 的位置

`expanded` 不参与主优先级竞争。  
它只影响：

- toggle 箭头
- children 容器的显隐
- 在必要时对行内图标和文字实度做极轻增强

`expanded` 不应被做成接近 `current` 的重量。

## 三、统一视觉变量

不同状态优先用不同变量表达，避免多个状态都堆在背景色上。

| 状态 | 主要变量 | 说明 |
| --- | --- | --- |
| `current` | rail + 轻底色 + 字重提升 | 行主状态 |
| `selected` | 轻底色 + 轻边界增强 | 比 current 轻一级 |
| `search-match` | label 内局部高亮 | 不建议整行主染色 |
| `hover` | 轻背景变化 + 文字变实 | 不触碰 rail |
| `focus-visible` | outline / focus ring | 叠加层，不替代主状态 |
| `active-press` | 背景略深 / 轻按压感 | 比 hover 更短暂 |
| `expanded` | toggle 更实 + 结构展开 | 结构信号，不是主导航信号 |

## 四、对象映射

## 1. TreeNav Pattern

### 允许的共享状态

- `default`
- `hover`
- `focus-visible`
- `active-press`
- `expanded`
- `collapsed`
- `current`

### 不在 pattern 层定义的状态

- `selected`
- `search-match`
- `permission-locked`
- `lazy-loading`

### 共享层的视觉职责

- `current`
  提供统一 rail、轻底色、字重提升
- `hover`
  只做轻背景增强
- `expanded`
  只做 toggle 和层级展开的结构提示
- `focus-visible`
  始终可在 row 或 toggle 上清晰出现

### 共享层的限制

- 不直接表达文件树搜索命中
- 不直接表达 TOC 的阅读定位算法
- 不把 `expanded` 做成接近 `current` 的权重

## 2. TOC

### 主状态定义

TOC 的行主状态只有一个：

- `current`

当前 CSS 类上可继续沿用：

- `.m-toc__item.is-active`
- `.m-toc__row.is-active`

但设计语义上应把它视为 `current`，不是“单独一种 active”。

### TOC 不应有的状态

- 不建议给 TOC 引入 `selected`
- 不建议让 TOC 行承担 `search-match`

原因：

- TOC 表达的是“当前阅读章节”
- 不是“用户选中了一个对象”

### TOC 的状态组合规则

`current + hover`

- 保留 current rail 和 current 底色
- hover 只能轻微提升文字实度或局部底色，不得盖掉 current

`current + focus-visible`

- row 保持 current
- focus ring 作为外层叠加

`expanded + current`

- 如果 TOC 有层级展开，expanded 只增强 toggle
- 不得让箭头权重超过 current row 本身

### TOC 的特殊说明

哪一项成为 `current`，由 [toc-activation-strategy.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/toc-activation-strategy.md) 决定。  
这份文档只定义它一旦成为 `current`，视觉应该如何表达。

## 3. FileTree

### 需要明确拆开的状态

FileTree 至少需要拆出：

- `current`
  当前上下文对应的节点，例如当前正在看的文档或所在目录
- `selected`
  用户当前主动选中的节点
- `search-match`
  搜索命中的节点或文本片段
- `expanded`
  目录展开状态

### 当前设计判断

当前 CSS 里 `.m-file-node.is-selected` 承担了过多语义。  
Phase 2 最重要的任务之一，就是把 `current` 和 `selected` 在语义上拆开。

也就是说：

- 后续应允许 `FileTree` 同时存在 `.is-current` 和 `.is-selected`
- 但两者不能继续被做成同一种视觉态

### FileTree 状态规则

`current`

- 是最主要的行状态
- 使用 rail + 轻底色 + 字重提升
- 表达“你现在在这里”

`selected`

- 比 current 轻一级
- 建议用轻底色或轻边界增强
- 表达“你选中了它，但不一定在这里”

`search-match`

- 主体应落在 `.m-file-node__hit`
- 行级最多做极轻辅助提示
- 不得压过 current 或 selected

`expanded`

- 优先作用于 toggle
- 可让目录行的图标和文本略实
- 不得接近 current 行的重量

### FileTree 状态组合规则

`current + selected`

- 同一行同时是 current 和 selected 时
- 视觉上以 `current` 为主
- 不额外叠第二条主信号

也就是说：

- 不再叠第二条 rail
- 不再叠第二种主背景
- 可以保留极轻的 selected 辅助边界或文本实度，但不是必须

`selected + search-match`

- 行主状态仍为 selected
- 命中仅高亮 label 局部文本

`current + search-match`

- 行主状态仍为 current
- 命中仍只高亮 label 局部文本

`hover + current`

- hover 不能抢 current
- row 只做最轻的增强，或直接维持 current 不变

### FileTree 的最终权重

推荐理解为：

`current row > selected row > search hit > hover row`

## 4. PathBar

### 主状态定义

PathBar 的状态更简单：

- 当前段落是 `current`
- 祖先可点击段是 `default` 或 `hover`

不建议引入 `selected`。

### PathBar 规则

`current segment`

- 文字更实
- 字重更稳定
- 不参与 hover 提升
- 不表现成可点击祖先项

`ancestor segment`

- 默认更轻
- hover 时可以提升文字实度
- 如可点击，应保留 pointer affordance

`separator`

- 永远低于 segment 本身
- 只承担结构连接，不承担状态变化

### 不建议

- 不要把 current segment 做成按钮或 tag
- 不要让祖先 hover 的视觉重量超过 current

## 五、交互状态叠加规则

## 1. Hover

hover 只能做三件事：

- 轻背景变化
- 文字变实
- 让 toggle / icon 更可见

hover 不该做的事：

- 生成新的 ownership 感
- 盖掉 current 的 rail
- 让普通项看起来比 current 更强

## 2. Focus-visible

focus-visible 必须始终可见，但不抢 ownership。

推荐：

- row 或 segment 外层出现清晰 outline
- current / selected / search-match 仍保留各自主状态

## 3. Active-press

active-press 只在交互瞬间生效：

- 背景略深
- 文本略实
- 如有必要，轻微按压感

不要：

- 把 active-press 做成长期状态
- 用重动画制造重量

## 4. Expanded

expanded 优先作用在 toggle。

推荐表达：

- 箭头旋转或更实
- children 显示
- 行本身最多轻微增强

不推荐：

- expanded 行直接变成 current 权重

## 六、与已有文档的关系

- [tree-navigation-pattern.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/tree-navigation-pattern.md)
  定义共享树结构、共享状态边界和交互边界
- [toc-activation-strategy.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/toc-activation-strategy.md)
  定义 TOC 当前项的状态机和 ownership 来源
- [visual-refinement-strategy.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/visual-refinement-strategy.md)
  定义 current / selected / search-match 的总体视觉方向
- 这份文档
  负责把这些方向压成可执行的导航状态规范

## 七、Phase 2 推荐实施边界

这一轮建议只做以下几类事情：

1. 把 `current / selected / search-match` 的语义正式拆开
2. 收紧 TOC、FileTree、PathBar 的 hover 逻辑
3. 明确 expanded 只属于结构提示，不属于主状态
4. 保证 focus-visible 是统一叠加层

这一轮不建议混入：

- 复杂拖拽视觉
- 页面级布局改造
- dark theme 重校
- motion 的完整收敛

## 八、Phase 2 验收清单

Phase 2 完成时，至少应满足：

- TOC、FileTree、PathBar 的主状态语义都能一句话说清
- `current / selected / search-match` 不再混成一种视觉态
- hover 不再抢主状态
- expanded 的视觉重量稳定低于 current
- focus-visible 能叠加在 current 和 selected 上，不互相覆盖
- FileTree 中“当前节点”和“当前选中节点”即使不是同一个，也能同时被用户理解

## 当前结论

`Phase 2` 的核心不是“再加更多状态”，而是：

`把 ownership state、interaction overlay 和 informational state 彻底拆开。`
