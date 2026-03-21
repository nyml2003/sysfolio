# SysFolio Responsive And Multi-Input Strategy

## 文档目的

这份文档用于补足 `frontend-style-handoff-layered` 的横向适配规则。

`tokens -> utilities -> primitives -> patterns -> business -> component`

这 6 层定义的是职责分层，但它们本身不能自动回答以下问题：

- 页面在不同尺寸下如何重排
- 同一组件在桌面端和触屏端如何交互
- hover、focus、tap、cursor、keyboard、motion 应该落到哪一层

因此，本方案采用：

`6 层架构 × 环境能力矩阵`

也就是用纵向职责分层管理复用边界，再用横向能力矩阵管理响应式布局和多端交互。

## 核心原则

1. 不按“PC / Mobile”设计，按“环境能力”设计。
2. 响应式不是简单压缩，而是信息优先级和任务路径的重排。
3. hover 只能增强理解，不能承担关键反馈。
4. 所有关键操作都必须在无 hover 环境下成立。
5. 基础交互能力从 `primitives` 起定义，再由 `patterns` 和 `business` 继承。
6. 页面级适配优先调整结构和流程，不优先堆更多局部样式例外。

## 一、6 层架构如何承接响应式和多端交互

### 1. Tokens

职责：

- 定义宽度、密度、最小点击区域、动效时长、层级、阅读宽度等基础变量
- 定义浅色 / 深色主题
- 为后续媒体查询和能力判断提供稳定基础

适合放入这一层的内容：

- 布局宽度 token
- rail 宽度 token
- 阅读宽度 token
- 最小触达尺寸 token
- 动效时长 token
- 对比度、主题、语义色 token

不适合放入这一层的内容：

- 组件专属交互逻辑
- 页面级布局分支

### 2. Utilities

职责：

- 提供基础样式能力
- 提供跨端通用的低层交互辅助能力

适合放入这一层的内容：

- 布局工具
- 排版工具
- 焦点样式 mixin
- 基础 transition mixin
- 通用滚动、截断、最小尺寸等工具

不适合放入这一层的内容：

- `file-tree-hover`
- `path-bar-current`
- 任何业务语义化状态

### 3. Primitives

职责：

- 定义基础控件在不同输入能力下的默认行为
- 统一 hover、focus、disabled、loading、cursor、tap target 的底线规则

适合放入这一层的内容：

- `Button` 在 fine pointer 下的 hover 反馈
- `Input` 的 focus-visible 和文本光标
- `IconButton` 的最小点击区域
- `MenuItem` 的 active / selected / disabled 规则

原则：

- 这里定义“基础交互默认值”
- 不直接绑定业务对象

### 4. Patterns

职责：

- 定义结构模式在不同尺寸和不同输入能力下的变形方式

适合放入这一层的内容：

- `SidebarNav` 桌面端常驻，紧凑环境下变抽屉
- `Toolbar` 在窄屏下折叠
- `SearchBar` 在紧凑环境下变全屏搜索层
- `ReadingPane` 在窄屏下调密度和内边距

原则：

- pattern 层处理“结构怎么变”
- 不优先处理具体业务流程

### 5. Business

职责：

- 定义业务组件在当前产品语义下的布局和交互适配

适合放入这一层的内容：

- 文件树如何在当前 SysFolio 中变成移动端导航层
- 地址栏如何在触屏环境下降低输入阻力
- 右侧 context panel 如何在小屏下转为底部 sheet 或二级页

原则：

- 这里开始允许业务流程和业务语义影响交互
- 但不重复发明基础交互规则

### 6. Component / Page

职责：

- 组织页面级信息优先级和任务路径
- 决定哪些模块常驻、折叠、延后或改入口

适合放入这一层的内容：

- 三栏布局在窄屏下改为单主列 + 抽屉入口
- 次要信息从首屏移到二级层
- 熟练用户和新手用户的默认入口差异

原则：

- 页面层优先解决“任务如何继续”
- 不在页面层重新定义 button/input 的交互底线

## 二、环境能力矩阵

本方案默认至少覆盖以下四类环境能力，而不是只写“桌面端 / 移动端”：

| 维度 | 能力类型 | 设计含义 |
| --- | --- | --- |
| 宽度 | spacious / medium / compact | 决定布局重排和信息密度 |
| 指针精度 | fine / coarse | 决定 hover、点击区域、拖拽可行性 |
| hover 能力 | hover / none | 决定是否可以使用悬停增强反馈 |
| 键盘可达 | keyboard / limited | 决定 focus-visible、快捷键和顺序导航的重要性 |

推荐把“环境能力”理解为两个层面：

1. 空间能力
- 当前容器或视口是否足够承载三栏、双栏或长工具条

2. 输入能力
- 当前环境是否支持 hover
- 是否以 coarse pointer 为主
- 是否需要显式 focus 和更大触达尺寸

## 三、布局策略

### 1. 响应式布局不是缩放，而是重排

布局变化时，优先问这三个问题：

1. 当前尺寸下，主任务是什么
2. 哪些模块必须常驻
3. 哪些模块可以延后、折叠或二级进入

### 2. SysFolio 当前推荐布局分级

这不是最终 breakpoint 定稿，而是当前设计策略。

| 空间级别 | 当前建议 | 布局策略 |
| --- | --- | --- |
| `spacious` | 约等于当前宽桌面 | 左栏常驻 + 主内容常驻 + 右栏常驻 |
| `medium` | 约等于当前中等宽度 | 左栏常驻 + 主内容常驻，右栏转可唤起 |
| `compact` | 约等于当前小屏或窄容器 | 单主列，左栏和右栏都转临时层 |

### 3. SysFolio 各区域的适配原则

`Shell`

- `spacious`：三栏结构成立
- `medium`：保留左栏，右栏退出主栅格
- `compact`：主内容单列，导航和上下文信息改为临时层

`File Tree`

- `spacious`：左栏常驻
- `medium`：仍可常驻，但需要控制搜索和节点密度
- `compact`：变抽屉、全屏导航层或独立导航页

`Path Bar`

- `spacious`：显示完整路径和工具区
- `medium`：允许路径压缩、省略次级段
- `compact`：保留当前位置和主要返回路径，不强求完整面包屑

`Context Panel`

- `spacious`：右栏常驻
- `medium`：允许折叠成显隐面板
- `compact`：转底部 sheet、tab 面板或二级详情页

`Document View`

- 任何尺寸下都要保住阅读主列的连续性
- 紧凑环境下优先减少两侧噪音，而不是硬缩正文 measure

## 四、多端交互策略

### 1. Hover

规则：

- hover 只用于增强可发现性
- 不能把关键状态仅放在 hover 上
- 触屏环境默认无 hover 依赖

适用场景：

- 提示可点击
- 增强列表项、按钮、导航项的可操作感
- 显示轻量附加信息

不适用场景：

- 仅在 hover 时显示唯一操作入口
- 仅在 hover 时暴露关键状态差异

### 2. Cursor

规则：

- cursor 是桌面端辅助 affordance，不是核心反馈
- 默认优先使用系统 cursor 类型，不设计自定义鼠标图案
- coarse pointer 环境不依赖 cursor

建议：

- 可点击：`pointer`
- 文本输入：`text`
- 禁用：谨慎使用 `not-allowed`
- 拖拽：只有交互真的支持拖拽时才使用对应 cursor

cursor 的默认规则应从 `primitives` 开始定义，不应在 `pages` 层到处散写。

### 3. Focus / Keyboard

规则：

- 所有关键交互元素必须支持 `focus-visible`
- 焦点样式不能只靠颜色细微变化
- 键盘用户必须能理解当前位置、当前项和下一步可操作对象

优先级：

- 导航项
- 按钮
- 输入框
- 列表项
- 浮层和抽屉的焦点陷阱与关闭路径

### 4. Tap / Touch

规则：

- coarse pointer 环境默认放大点击区域
- 不依赖 hover 解释状态
- 触屏下优先减少误触和跨区切换成本

建议：

- 图标按钮满足最小触达尺寸
- 列表项、树节点、工具项留出稳定点击边界
- 面板显隐优先使用可预期的全屏层、底部层或抽屉

### 5. Motion

规则：

- 动效先回答“帮助了什么”
- 不用动效掩盖布局问题
- 支持 reduced motion 的降级路径

在当前 SysFolio 中，动效优先服务：

- 面板显隐
- 树节点展开
- 页面内层级切换
- onboarding 提示进入退出

## 五、交互能力在 6 层中的落位

| 能力 | 主要起始层 | 继承层 | 说明 |
| --- | --- | --- | --- |
| cursor | `primitives` | `patterns` / `business` | 基础控件先定义，业务层只做少量特例 |
| hover | `primitives` | `patterns` / `business` | 不能承担唯一反馈 |
| focus-visible | `utilities` + `primitives` | 全层继承 | 焦点规则要统一 |
| tap target | `tokens` + `primitives` | `patterns` / `business` | 最小尺寸从底层约束 |
| responsive spacing | `tokens` | `patterns` / `business` | 页面不直接发明新密度体系 |
| layout reflow | `patterns` + `pages` | `business` | 结构重排优先在 pattern/page 决定 |
| reduced motion | `tokens` + `utilities` | 全层继承 | 动效策略横切全体系 |

## 六、针对 SysFolio 的当前建议

### 1. 文件树

- 桌面端保留 hover、selected、search match 三种明确层级
- 触屏端减少 hover 依赖，强化 selected 和 active
- 紧凑环境下不要把树节点层级缩得过深，优先控制缩进和点击区域

### 2. 路径栏

- 桌面端可用 hover、cursor 增强段落可点击性
- 小屏下优先保住“当前位置 + 返回路径”，不是保住完整路径字符串

### 3. 右侧上下文面板

- 宽屏常驻
- 中屏可折叠
- 小屏不建议硬保留第三栏，应转临时层

### 4. 文档阅读区

- 优先守住阅读节奏和 measure
- 小屏时减少外层干扰，不优先压缩正文行长到过窄

### 5. Onboarding

- 桌面端可以保留 hover 辅助理解
- 触屏端必须让提示点和弹层在 tap 下完整成立
- 若动效较强，需要提供 reduced motion 降级

## 七、给前端的实现约束

1. 不要把响应式理解成 `@media` 下机械改宽度。
2. 不要把 hover 作为唯一可发现性入口。
3. 不要把 cursor 规则散落在业务页面里。
4. 不要在 `utilities` 层引入业务语义。
5. pattern 的变形应尽量稳定，不要每个业务组件各写一套。
6. 页面级适配优先通过结构重排解决，不优先堆局部补丁。

## 八、当前仍待补充的设计项

1. 语义化 breakpoint 命名和 token 化方案
2. 基础控件完整状态矩阵
3. 小屏导航层和右侧面板的具体交互原型
4. reduced motion 的明确降级规则
5. 深色主题下各状态的对比度复核

## 当前结论

这套 6 层架构可以支撑响应式布局和多端交互，但前提是：

- 用它管理职责边界
- 再额外定义环境能力矩阵
- 并把 hover、cursor、focus、tap、motion 视为横切全体系的交互能力，而不是某一层自己的私有问题
