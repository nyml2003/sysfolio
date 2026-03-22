# Archived: SysFolio Visual Refinement Strategy

> 已归档。当前待办请优先阅读 `../design-todo.md`，当前规范请阅读对应 active specs。

# SysFolio Visual Refinement Strategy

## 文档目的

这份文档用于继续推进当前 handoff 里“视觉侧仍待设计的内容”，把原来的待办清单推进成一份可执行的视觉细化方案。

它不替代 6 层架构，也不直接规定工程实现方式。  
它回答的是：

- 现阶段视觉上最主要的问题是什么
- 接下来每一块应该往什么方向收敛
- 前端后续落样式时，哪些判断已经可以视为设计结论

## 当前判断

当前 SysFolio 的视觉问题已经不是“有没有方向”，而是“方向有了，但细化层级还不够稳定”。

主要矛盾现在收敛为五个：

1. primitive 主家族已经补齐，但高级子场景还没完全展开。
2. 状态矩阵已经进入 CSS 契约，但复杂组合态还需要继续收紧。
3. 响应式布局的角色分工已经定下，但还没经过真实前端交互验证。
4. `home / directory / document` 的第一轮密度差已经建立，但还没到最终视觉稿级别。
5. 深色主题虽然有 token 和对象级样式，但阅读舒适度和对比度还没正式校准。

一句话：

`现在需要做的不是再换视觉方向，而是把同一方向下的层级、状态、密度和节奏做实。`

## 一、视觉语言收敛

### 设计判断

当前视觉语言最有价值的部分不是“纸感配色”，而是这种气质背后的稳定感：

- 背景是暖色纸面，不是纯白工作台
- 面板之间靠层级差和边界差区分，不靠重阴影
- 当前项和导航重点用暖色 rail 与轻底色表达，不用冷蓝强撞
- 正文强调阅读节奏，辅助信息尽量退后

这个方向应该继续保留，不建议再切回更冷、更亮、更泛 SaaS 的组件风格。

### 收敛原则

- 主视觉重点来自排版、留白和层级，不来自额外装饰。
- 同一家族组件优先共享边框、圆角、字重和背景逻辑。
- 浮层和卡片可以有层级差，但不应该比正文内容更抢眼。
- 危险态、错误态和高亮态都要可见，但不能把整页气氛打碎。

## 二、Primitive 家族的视觉规范

### 当前结论

`primitives` 应优先统一“家族关系”，而不是先补足所有组件种类。

当前应建立的家族规则如下：

| 家族 | 视觉基线 | 应传达的感受 |
| --- | --- | --- |
| Actions | 边框清晰、填充克制、文本稳重 | 可点击、可信、不过度促销 |
| Data Entry | 表面平整、焦点明确、错误清楚 | 可填写、可校正、可恢复 |
| Navigation | 当前项轻强调、可点击项低噪声 | 可扫描、可定位、可返回 |
| Data Display | 层级轻、内容优先、容器退后 | 信息承载，不喧宾夺主 |
| Feedback | 状态明确、形态节制 | 告知发生了什么，但不制造视觉噪音 |
| Overlays | 表面比底层更聚焦，但不是独立宇宙 | 临时上下文，而不是新的主舞台 |

### 下一批要继续收紧的基础控件

优先级建议如下：

1. `Combobox` 的 async / multi-select / empty-result
2. `Menu` 的 submenu / shortcut / checkable
3. `Dialog / Drawer` 的 destructive confirm / form layout
4. `Table row / dense list row` 的 drag handle 与批量操作态
5. `Empty illustration` 是否需要引入极简插图语言

### 具体设计要求

`Button`

- 主按钮用于单个主动作，不应大面积泛用。
- 次按钮与 ghost 按钮要在结构中承担更多比例。
- danger 不应用鲜艳高饱和红底，优先用边框与浅底表达。

`Input / Select / Combobox`

- 默认态优先做成“平面可写表面”，而不是凸起控件。
- 焦点优先提升边框与 outline，不再叠加额外 glow。
- placeholder 只能做弱提示，不能接近正文对比度。

`Menu / Dropdown`

- 单项高度要比树节点略宽松，避免和 TOC / FileTree 混成一种密度。
- hover 只做轻底色，不要把菜单 hover 做得比选中态更重。

`Dialog / Drawer`

- 标题区、正文区、操作区要清晰分段。
- Dialog 更适合确认与轻编辑，Drawer 更适合上下文浏览与渐进任务。
- 移动端优先 `bottom sheet / full-height sheet`，不要机械沿用桌面侧滑抽屉。

## 三、交互状态矩阵

### 当前问题

第一版状态矩阵已经落到 CSS，但产品级 handoff 还需要继续明确“复杂叠加态到底靠什么变量表达”。

现在要继续收紧的重点是：

- `selected + search-match`
- `current + hover`
- `drag-target + reorder-guide`
- `warning / destructive` 在 overlay 和 data row 里的重量边界

### 建议统一的状态变量

| 状态 | 主要变量 | 不建议依赖 |
| --- | --- | --- |
| default | 中性背景、默认边框、次级文字 | 阴影 |
| hover | 轻背景抬升、文字变实 | 粗暴变色 |
| focus-visible | outline / focus ring | 单独只改边框色 |
| active-press | 背景加深、轻微下压 | 重动画 |
| current | 暖色 rail、轻底色、字重提升 | 饱和底色整块铺满 |
| selected | 容器底色略升、边界更明确 | 和 current 完全同态 |
| search-match | 局部高亮、文本对比提升 | 整行抢色 |
| disabled | 降低对比与交互 affordance | 只改 cursor |
| loading | 保持结构、降低可操作性 | 清空内容只剩 spinner |
| success | 用作结果确认与轻反馈 | 大面积绿色铺底 |
| warning | 主要用于风险提醒和确认前提示 | 高饱和黄色大块填充 |
| destructive | 主要强调动作风险 | 在非风险动作中滥用红色 |
| drag-target | 外框与容器底色提示承接位置 | 强闪烁 |

### 关键区分

`current` 和 `selected` 不能再视为同一个状态。

建议这样拆：

- `current`
  表示“你现在所在的位置”
- `selected`
  表示“你主动选中的对象”
- `search-match`
  表示“系统帮你命中的结果”

这三个状态可以共存，但视觉权重要有顺序：

`current > selected > search-match`

## 四、响应式布局与不同端交互

### 设计判断

当前三档布局契约已经明确为：

- `spacious >= 1280px`
- `medium 960px - 1279px`
- `compact < 960px`

并且已经不是“直接隐藏”，而是常驻层与临时层重排。

接下来真正需要继续验证的是：

- 不同宽度下谁是主任务
- 左右栏是常驻、临时层，还是上下文弹出
- fine pointer 和 coarse pointer 下的交互入口是否一致

### 建议的三档布局

| 环境 | 建议布局 | 右栏策略 | 左栏策略 |
| --- | --- | --- | --- |
| Spacious `>= 1280px` | 三栏 | 常驻 | 常驻 |
| Medium `960px - 1279px` | 两栏主布局 | 临时侧板，可唤起 | 常驻 |
| Compact `< 960px` | 单栏主布局 | 底部 sheet 或全屏层 | 抽屉式导航或独立入口 |

### 交互规则

- fine pointer 环境允许 hover 增强，但关键反馈必须在无 hover 时仍然成立。
- coarse pointer 环境要优先增大 hit area，而不是只增大图标。
- 展开箭头、折叠箭头这类 affordance 在移动端必须有足够独立点击区。
- `cursor` 只作为辅助反馈，不能承担状态判断。

### 当前建议

- 桌面端右栏更适合做 context panel 或 secondary navigation。
- 中屏右栏应变成可唤起层，而不是直接消失。
- 移动端如果 TOC 和 FileTree 都存在，优先保证“当前阅读/浏览任务”，次要导航用临时层承接。

## 五、Tree Navigation 与 Path Bar 的视觉层级

### 当前问题

现在 TOC、FileTree、PathBar 的视觉关系已经比之前稳，但还存在两个风险：

1. 当前项和可点击项之间差距不够大。
2. 搜索命中、选中、当前位置三种信号还可能互相抢。

### 设计结论

`TreeNav`

- 当前项保留暖色 rail + 轻底色 + 字重提升。
- hover 只做轻背景变化，不碰 rail。
- search match 只高亮文本局部，不直接改整行主状态。
- expanded 的箭头可以更实一些，但不应接近当前项权重。

`PathBar`

- 当前段落要比普通 segment 有更高文字实度和更稳定的字重。
- 分隔符永远低于 segment 本身，不应抢节奏。
- hover 只提升当前可点击段，不动 current segment。

### 箭头与展开控件

之前提到的箭头 hover 调整，这里结论是：

- 箭头样式变化应纳入交互能力矩阵，而不是当成单独平台 hack。
- fine pointer 环境：
  箭头可通过颜色、底色和旋转建立 hover / expanded 感知。
- coarse pointer 环境：
  箭头优先扩大点击区和按压反馈，不依赖 hover 变化。
- 不同操作系统的 cursor 差异不应影响主要状态设计。

## 六、业务视图的版式密度

### 设计判断

当前三个主视图不应继续共享同一种节奏。

建议分成三种密度：

| 视图 | 密度目标 | 重点 |
| --- | --- | --- |
| Home | 最疏 | 导览、进入、分类感 |
| Directory | 中等 | 扫描、比较、过滤 |
| Document | 最稳 | 阅读、定位、连续理解 |

### 具体建议

`Home`

- 标题和摘要可以更开，强化“入口页”气质。
- 卡片或条目之间的间距允许更大，减少目录列表感。

`Directory`

- 条目标题、meta、摘要之间的内聚要更强。
- 不要把每个 entry 做成重卡片，更适合轻容器 + 明确 hover。

`Document`

- 继续把重心放在标题、摘要、正文、代码块、引用块的阅读节奏。
- 辅助信息要退到视线边缘，不要让文档页看起来像 dashboard。

## 七、深色主题复核

### 当前问题

dark token 已存在，但当前风险不是“有没有 dark mode”，而是：

- 长文阅读对比是否舒适
- 暖色语义在 dark 下是否还保留
- 强调态是否变得发亮刺眼

### 复核规则

- 正文与背景对比优先保证阅读舒适，不追求极亮白字。
- muted text 仍需足够可读，不能为了层级把它压到接近失明。
- current rail、search highlight、inline code、quote border 要维持原语义，不应在 dark 下全变成蓝灰。
- 错误、成功、warning 在 dark 下优先控制饱和度，避免像状态灯。

### 建议重点检查对象

- `Document` 正文段落
- `Code block`
- `Inline code`
- `TOC current`
- `FileTree selected`
- `PathBar current`
- `Inline notice`

## 八、动效规则

### 设计原则

动效存在的目的不是“更像产品”，而是帮助用户理解结构变化和因果关系。

### 建议保留的动效

| 场景 | 建议表现 | 时长 |
| --- | --- | --- |
| 按钮、字段 hover / focus | 颜色与边框轻过渡 | `120ms - 160ms` |
| Tree 节点展开 | 高度/opacity 轻过渡 | `140ms - 180ms` |
| Panel 显隐 | 轻滑入 + opacity | `180ms - 220ms` |
| Dialog / Drawer | 容器进场略重于按钮状态 | `200ms - 240ms` |
| Onboarding hint | 点位先出现，气泡后出现 | `180ms + 120ms stagger` |

### 建议取消或减弱的动效

- 不要让每个列表项都做独立浮起动画。
- 不要在长文滚动阅读中持续给辅助元素做漂移动画。
- 不要通过强 easing 掩盖层级不清晰的问题。

### Reduced Motion

- 所有结构性动效都应提供 reduced motion 降级。
- 降级后保留状态变化，不保留位移动画。

## 九、建议的推进顺序

为了避免继续“同时推进很多点，但都不落地”，建议按这个顺序继续：

1. 先补 `primitive` 家族视觉规范
2. 再补完整状态矩阵
3. 再定中屏与小屏的左右栏行为
4. 再校准 `TreeNav / PathBar` 的层级差
5. 再做三类业务视图的密度微调
6. 最后做 dark theme 和 motion 的统一复核

## 剩余风险

- 如果没有把 `current / selected / search-match` 三种状态分开，后续导航系统会继续发糊。
- 如果中屏布局不正式定义，前端会继续用隐藏策略代替交互策略。
- 如果 dark theme 不单独复核，阅读场景会先出问题，而不是 dashboard 类场景。
- 如果 motion 继续停留在 token 级，后续各个页面会各自动。

## 当前结论

下一阶段最合理的目标不是“继续加新组件”，而是：

`把现有视觉方向里的家族关系、状态语义、响应式行为、阅读密度和动效节奏彻底定稳。`
