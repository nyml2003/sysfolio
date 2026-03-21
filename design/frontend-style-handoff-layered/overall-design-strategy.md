# SysFolio Overall Design Strategy

## 文档目的

这份文档用于整合当前 `frontend-style-handoff-layered` 里的多份专题文档，形成一份可以直接给设计和前端共同使用的“整体新设计方案”。

它不是替代所有细节文档，而是提供统一主线：

- 这套新方案到底在解决什么问题
- 当前的整体架构是什么
- 状态、响应式、多端交互、树形导航和 TOC 各自落在哪层
- 前端接入时应先抓哪几个核心约束

## 一、背景与目标

当前方案的出发点，不是做一次视觉重绘，而是先把设计抽象和前端实现抽象对齐。

原有问题主要有三类：

1. 样式抽象和组件抽象混在一起  
`tokens / atomic / molecular` 在表达上不够稳定，容易把 utility、基础组件、业务组件混成一层。

2. 响应式、多端交互和状态没有进入统一架构  
以前更像是在谈静态样式结构，但实际落地时，hover、focus、touch、loading、empty、error 都会反过来影响组件边界。

3. TOC、File Tree 这类关键模式缺少明确共享边界  
看起来都像树，但不清楚该共享哪一层、不该共享哪一层。

因此，这套新方案的目标是：

- 先把职责分层说清楚
- 再把状态和交互纳入这套分层
- 最后把前端接入方式变成可执行的结构，而不是靠局部临时判断

## 二、整体模型

当前推荐的整体模型是：

`6 层架构 × 环境能力矩阵 × View State 分层`

这三部分分别回答不同问题：

1. `6 层架构`
回答“东西应该放在哪一层”。

2. `环境能力矩阵`
回答“不同宽度、不同输入能力下，界面怎么变”。

3. `View State 分层`
回答“idle / loading / ready / empty / error 应该由谁承接”。

一句话：

- 6 层负责纵向职责边界
- 环境能力矩阵负责横向适配
- View State 分层负责动态状态承接

## 三、6 层架构

### 1. `Tokens`

负责：

- 颜色、字号、间距、圆角、阴影、层级、动效、布局宽度等设计变量

重点：

- 不表达组件语义
- 为主题、响应式、状态表达提供稳定基础

### 2. `Utilities`

负责：

- 低层样式能力
- 通用布局、排版、焦点、滚动、过渡能力

重点：

- 不承载业务语义
- 不替代组件结构

### 3. `Primitives`

负责：

- 最基础交互控件
- 最小状态表达原件

典型对象：

- `Button`
- `Input`
- `IconButton`
- `Segmented`
- `TabsNav`
- `Card`
- `Tooltip`
- `Spinner`
- `SkeletonBlock`

重点：

- primitive 主要解决控件级状态
- primitive 不必普遍承担五态
- 但必须提供五态所需的表达原件

### 4. `Patterns`

负责：

- 可复用结构模式
- 内容承载模式
- 大多数 data-bearing 区块的五态承接

典型对象：

- `TreeNav`
- `ContentPane`
- `ReadingPane`
- `ListPane`
- `DetailPane`
- `ContextPanel`

重点：

- 五态的主要承载层是 pattern
- 不是所有最小控件

### 5. `Business`

负责：

- 产品语义
- 业务数据结构
- 状态计算
- 文案和恢复动作

典型对象：

- `TocTree`
- `FileTree`
- `DirectoryContent`
- `DocumentContent`

重点：

- business 负责“算状态”
- 不重复发明 pattern 的基础骨架

### 6. `Component / Page Edge`

负责：

- feature 级或页面级编排
- 状态影响范围
- 状态升级策略
- 页面主任务路径组织

重点：

- 这一层决定哪些局部状态要升级成整页状态
- 不应反向破坏下层契约

## 四、依赖规则

推荐保持单向组装：

`tokens -> utilities -> primitives -> patterns -> business -> component`

补充约束：

- `primitives` 提供状态原件，但不绑定业务流程
- `patterns` 应优先承接 data-bearing 的 view state
- `business` 负责状态计算和产品语义
- `component` 负责状态影响范围和升级策略

## 五、响应式与多端交互

这套方案不按“桌面端 / 移动端”二分，而按环境能力判断：

- 宽度能力：`spacious / medium / compact`
- 指针能力：`fine / coarse`
- hover 能力：`hover / none`
- 键盘可达：`keyboard / limited`

核心原则：

1. 响应式不是机械压缩，而是主任务优先级重排。
2. hover 只能增强理解，不能承担关键反馈。
3. 关键交互必须在无 hover 环境下成立。
4. cursor 是辅助 affordance，不是核心反馈。
5. 基础交互能力从 `primitives` 起定义，再由 `patterns / business` 继承。

对当前 SysFolio 的布局建议是：

- `spacious`
  左栏常驻 + 主内容常驻 + 右栏常驻
- `medium`
  左栏常驻 + 主内容常驻，右栏转可唤起
- `compact`
  单主列，左栏和右栏都转临时层

## 六、View State 分层

这部分是当前方案的重要迭代点。

过去容易把五态理解成“每个页面都要有一套”。
现在更准确的理解是：

- `primitives`
  提供状态原件和控件级状态
- `patterns`
  承担五态
- `business`
  计算状态、注入文案和恢复动作
- `component / page edge`
  决定状态是局部的还是整页阻塞的

推荐五态主流程：

`idle -> loading -> ready | empty | error`

但它的主要承接对象是 data-bearing patterns，例如：

- `TreeNav`
- `ContentPane`
- `ReadingPane`
- `ListPane`
- `ContextPanel`

而不是：

- 单个按钮
- 单个输入框
- 单个 tag

状态升级原则：

1. 先在最小合理范围内表达状态
2. 只有主任务被阻断时，才升级到更高层
3. 外层已 `ready` 时，局部刷新不要轻易把整页打回 `loading`

## 七、树形导航模式

`TOC` 和 `File Tree` 的关系，是这套方案里的关键模式判断。

结论是：

- 它们适合共享一套 `Tree Navigation Pattern`
- 但不适合复用成同一个业务组件

共享层建议沉到 `patterns`：

- `TreeNav`
- `TreeNavItem`
- `TreeNavRow`
- `TreeNavToggle`
- `TreeNavLabel`
- `TreeNavChildren`

共享内容包括：

- 树结构骨架
- 缩进规则
- toggle 位置
- 行高、点击区、hover、focus-visible
- 当前项左侧指示
- 键盘方向导航模型

不共享的内容包括：

- `TOC` 的滚动状态机
- `File Tree` 的 selected / expanded / search match 规则
- 文件类型、权限、菜单、拖拽、懒加载

所以整体关系是：

- `patterns`
  `Tree Navigation Pattern`
- `business`
  `TocTree` 和 `FileTree`

## 八、TOC 的特殊规则

`TOC` 不是纯静态树，它还带一个阅读定位状态机。

核心判断：

`TOC active 不是纯 scrollspy，而是一个由轻量状态机调度的 scrollspy`

当前推荐状态机包括：

- `initial`
- `short_content`
- `navigating`
- `reading`
- `reading + natural bottom fallback`

关键优先级是：

- 初始态 / 短内容态优先于滚动态
- 点击导航态优先于到底兜底
- 到底兜底只在自然阅读滚动中生效

推荐的 TOC 规则组合是：

`激活线 + 到底兜底 + 正文底部留白`

这保证了：

- 首屏不会乱跳到第二项
- 点击倒数几项不会被最后一项抢高亮
- 滚到底时不会还停在倒数第二项

## 九、当前 CSS handoff 结构

当前 handoff 目录保留旧视觉方向，但真实源码已经转到 `styles/`：

- [styles/index.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/styles/index.css)
- [styles/tokens.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/styles/tokens.css)
- [styles/utilities.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/styles/utilities.css)
- [styles/primitives/index.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/styles/primitives/index.css)
- [styles/patterns/index.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/styles/patterns/index.css)
- [styles/business/index.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/styles/business/index.css)
- [styles/component.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/styles/component.css)
- [primitive-inventory.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/primitive-inventory.md)

根层的 [index.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/index.css)、[tokens.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/tokens.css)、[utilities.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/utilities.css)、[primitives.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/primitives.css)、[patterns.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/patterns.css)、[business.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/business.css)、[component.css](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/component.css) 现在都只是兼容包装。

当前目标不是一次性重命名全部 selector，而是：

- 先把职责归位
- 再让前端按新的 layer 关系接入
- 最后再决定要不要做第二轮命名收敛

## 十、前端接入建议

前端接入时，建议按这条顺序理解：

1. 先看 6 层架构  
明确每个对象应落在哪层。

2. 再看响应式和多端交互规则  
避免把 hover、touch、keyboard 当成局部补丁。

3. 再看 view state 分层  
明确五态主要属于 data-bearing patterns。

4. 再看树形导航和 TOC 文档  
明确 `TOC`、`File Tree` 和共享树模式之间的关系。

接入时的最低约束：

- 不要把业务语义塞进 `utilities`
- 不要让 `primitives` 直接绑定业务数据结构
- 要求 data-bearing patterns 预先考虑五态
- 让 business 层负责状态计算和文案动作
- 让 component / page edge 负责状态影响范围和升级策略

## 十一、当前仍未定稿的部分

这套方案已经足够给前端开始讨论和接入样式架构，但还不是视觉终稿。

当前仍需继续设计的重点有：

- 基础控件视觉规范还不完整
- 交互状态矩阵还没完全收齐
- 小屏导航层和右侧面板的具体交互还没定稿
- 深色主题对比度还没做完整复核
- 动效规则已有专项规范，但还没正式回写到 CSS

这些内容的下一轮细化，已经单独整理到：

- [visual-refinement-strategy.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/visual-refinement-strategy.md)
- [visual-delivery-roadmap.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/visual-delivery-roadmap.md)
- [navigation-state-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/navigation-state-spec.md)
- [layout-behavior-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/layout-behavior-spec.md)
- [view-density-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/view-density-spec.md)
- [dark-theme-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/dark-theme-spec.md)
- [motion-spec.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/motion-spec.md)

## 十二、当前方案的最终表达

这套新的整体设计方案可以压成一句话：

`用 6 层架构管理职责边界，用环境能力矩阵管理响应式与多端交互，用 View State 分层管理动态状态，再用 Tree Navigation Pattern 和 TOC 状态机解决当前最关键的结构型组件问题。`

如果再压短一点，就是：

`先分层，再管状态，再统一关键模式。`
