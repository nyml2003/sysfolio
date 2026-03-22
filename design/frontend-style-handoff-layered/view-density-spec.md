# SysFolio View Density Spec

## 文档目的

这份文档把 `Phase 4` 的“三类业务视图密度校准”继续细化成可直接指导版式和 view state 调整的规范。

它主要解决两个问题：

1. `home / directory / document` 三类视图虽然已经拉开第一轮差异，但还需要继续稳固主任务节奏
2. `loading / empty / error` 已经进入视图语义分层，但还需要继续校准重量与语气

## 使用范围

这份规范对应以下文件和对象：

- `styles/patterns/reading.css`
- `styles/patterns/view-states.css`
- `styles/business/views.css`

对应对象：

- `HomeView`
- `DirectoryView`
- `DocumentView`
- `IdleState`
- `ReadyState`
- `LoadingState`
- `EmptyState`
- `ErrorState`

## 当前落地契约

当前 `patterns/view-states.css` 已经提供：

- `.m-idle-state`
- `.m-ready-state`
- `.m-loading-state`
- `.m-empty-state`
- `.m-error-state`

并通过以下视图变体类区分语气：

- `.is-home`
- `.is-directory`
- `.is-document`

## 一、核心原则

### 1. 视图密度服务任务，不服务整齐

三类主视图不应该为了“系统统一”而共享同一种节奏。  
真正要统一的是：

- 家族逻辑
- 排版层级方法
- 组件语气

真正应该区分的是：

- 首屏关注点
- 阅读与扫描比例
- 条目密度
- 状态容器重量

### 2. View state 不能脱离主视图语义

`loading / empty / error` 不是通用弹窗盒子。  
它们应跟着当前主视图一起变化。

更准确地说：

- `HomeView.empty`
  应像“入口为空”
- `DirectoryView.empty`
  应像“列表为空”
- `DocumentView.empty`
  应像“正文缺失”

如果三者都长成同一种默认空白卡片，用户会失去场景感。

### 3. 密度差异主要靠节奏，不靠花样

不建议用更多装饰来制造“页面不同”。  
更稳的方法是调：

- 段间距
- 标题与摘要距离
- 条目内聚程度
- 容器边界重量
- 内容与辅助信息的距离

## 二、三类视图的密度目标

| 视图 | 密度目标 | 关键词 | 首屏感觉 |
| --- | --- | --- | --- |
| `HomeView` | 最疏 | 导览、进入、分类、欢迎感 | 先看方向，再选入口 |
| `DirectoryView` | 中等 | 扫描、比较、过滤、进入 | 先扫列表，再决定进入 |
| `DocumentView` | 最稳 | 阅读、定位、连续理解 | 先沉浸阅读，再参考辅助信息 |

## 三、HomeView 规范

## 1. 任务定位

Home 不是列表页，也不是正文页。  
它更像：

- 入口页
- 分类页
- 总览页

因此它的节奏应该更开一些。

## 2. 版式要求

### Hero

- `eyebrow -> title -> summary` 的间距可以比目录页更开
- title 和 summary 之间要有明显呼吸感
- summary 更像导览说明，不像正文段落

### Section

- section 与 section 之间应明显分组
- section title 更像分区标签，不像正文小标题

### Entry List

- Home 中的 entry 不应做得过密
- 更适合让每个入口有清晰留白，减少“目录堆叠感”

## 3. Entry 设计要求

`m-home-view__entry`

- 更接近“入口卡片”或“导览条目”
- 允许比 directory entry 稍微更开
- summary 可以稍微宽松一些，强调去哪里而不是列出所有细节

### 不建议

- 不要把 Home 的 entry 做成高密度目录列表
- 不要让 hero 和 section 切分得像后台表单页
- 不要让首页像文档页加几个卡片

## 4. Home 的 view state

`loading`

- 应更像入口骨架，而不是正文骨架
- skeleton 可以更强调 section 结构和入口块位

`empty`

- 表达“当前没有可进入内容”或“当前分类为空”
- 语气应温和，不像错误恢复页

`error`

- 表达“入口加载失败”
- 应给用户一个明确的回退或重试动作
- 但不需要像 document error 那样抢占全部阅读空间

## 四、DirectoryView 规范

## 1. 任务定位

Directory 主要解决：

- 扫描
- 比较
- 进入
- 在列表中寻找下一步

因此它应该是三者中最“信息工作流”的视图。

## 2. 版式要求

### Header

- `eyebrow -> title -> summary -> meta` 要内聚
- 不应像首页 hero 那样过于松
- 也不应像文档标题区那样强调沉浸阅读

### List

- 列表项之间应有稳定节奏
- 列表主体更重要，背景容器只做辅助

## 3. Entry 设计要求

`m-directory-entry`

- 应比 `m-home-view__entry` 更利于纵向快速扫描
- title / meta / summary 的距离应更紧凑
- hover 应清楚但轻，不要把整个条目做成重卡片浮起

### 具体建议

- title 和 meta 的距离要更小
- summary 应短而准，不适合占很高块
- icon、title、meta、summary 构成一个内聚信息块

### 不建议

- 不要让 directory entry 过厚，变成营销卡片
- 不要把 directory 列表做成像首页一样大块入口
- 不要把 summary 写成正文段落节奏

## 4. Directory 的 view state

`loading`

- 更像列表骨架
- 优先保留若干条列表行结构，而不是单一大 skeleton

`empty`

- 表达“当前目录为空”或“当前筛选条件下无结果”
- 最好给出下一步，例如返回、清空筛选或创建内容

`error`

- 表达“当前列表无法加载”
- 应优先提供重试与返回路径
- 重量高于 home empty，但仍低于文档阅读错误

## 五、DocumentView 规范

## 1. 任务定位

Document 的唯一主任务是：

- 连续阅读
- 理解结构
- 定位章节

因此它不应共享首页或目录页的节奏。

## 2. 版式要求

### Header

- `eyebrow / title / meta / summary` 是阅读前奏，不是列表说明
- title 需要稳定主权重
- summary 是阅读引导，不应过长，也不应太贴近正文第一段

### Body

- 正文段落节奏优先
- heading 与 paragraph 的间距应服务章节切换
- code、quote、list 都要服从阅读节奏，而不是独立抢戏

### Auxiliary Info

- 辅助信息要退到阅读边缘
- 不要在正文列里不断插入强容器打断阅读

## 3. Document 的 view state

`loading`

- 必须更像正文骨架，而不是列表骨架
- skeleton 应保留：
  - 标题位
  - 摘要位
  - 若干段正文位
  - 代码块位或二级标题位

`empty`

- 表达“正文不存在”或“当前文档没有可读内容”
- 应更克制、更静，不像目录空列表提示

`error`

- 是三类视图里最需要被认真设计的错误状态
- 既要明确失败，也不能把阅读环境打碎得过于剧烈
- 最好给出：
  - 重试
  - 返回上一级
  - 查看目录或其他可读项

## 六、View State 容器的密度差异

## 1. LoadingState

### 共通原则

- loading 要保留结构感
- 不要只剩 spinner

### 三类视图差异

`Home loading`

- section skeleton + entry block skeleton
- 视觉更开

`Directory loading`

- list row skeleton
- 更强调重复行节奏

`Document loading`

- title / summary / paragraph skeleton
- 更强调阅读结构

## 2. EmptyState

### 共通原则

- 不能只是一块空容器
- 必须解释“为什么这里为空”和“下一步能做什么”

### 三类视图差异

`Home empty`

- 更像“当前入口为空”
- 语气轻

`Directory empty`

- 更像“当前列表没有内容”
- 给出过滤、返回或创建动作

`Document empty`

- 更像“当前正文缺失”
- 语气应更静，不做太多导流噪声

## 3. ErrorState

### 共通原则

- 错误态必须可恢复
- 但不应永远比主内容更抢眼

### 三类视图差异

`Home error`

- 说明入口加载失败
- 给重试或回首页动作

`Directory error`

- 说明列表加载失败
- 给重试与返回动作

`Document error`

- 说明阅读对象不可用
- 给重试、返回目录、回上一级的明确路径

## 七、当前 CSS 文件的调整重点

## 1. `styles/business/views.css`

这一轮主要应该调：

- `m-home-view` 与 `m-directory-view` 的整体 gap
- `m-home-view__hero` 的呼吸感
- `m-home-view__entry` 与 `m-directory-entry` 的内聚差异
- title / meta / summary 的距离层级

## 2. `styles/patterns/reading.css`

这一轮主要应该调：

- `m-doc-header` 的前奏节奏
- `m-article-body` 的段落与标题距离
- 代码块、引用块与正文的插入节奏

## 3. `styles/patterns/view-states.css`

这一轮主要应该调：

- `loading / empty / error` 的容器重量
- 在三类视图中的适配方式
- 是否需要更轻或更重的状态容器变体

## 八、Phase 4 推荐实施边界

这一轮建议只做以下几类事情：

1. 拉开 `home / directory / document` 三类视图的节奏差
2. 让 `entry` 类组件在 home 和 directory 中真正产生不同气质
3. 让 `loading / empty / error` 跟随视图语义变化
4. 保住 document 的阅读主线，不把它做回 dashboard

这一轮不建议混入：

- dark theme 重校
- motion 节奏统一
- 布局入口行为回改
- primitive 家族再扩新组件

## 九、Phase 4 验收清单

Phase 4 完成时，至少应满足：

- Home 首屏一眼更像导览，不像列表页
- Directory 列表一眼更像可扫描工作流，不像首页入口块
- Document 一眼更像阅读页，不像 dashboard 或列表详情
- `loading / empty / error` 在三类视图中都能看出所属场景
- 状态容器不会因为统一而失去场景语气
- document 的阅读节奏没有被状态容器或卡片边界打断

## 当前结论

`Phase 4` 的核心不是“把三个页面做得更不一样”，而是：

`让每个主视图都围绕自己的主任务建立稳定节奏。`

## Remaining TODO

1. 再校准 `Home / Directory / Document` 在真实内容长度下的密度差，尤其是中屏与小屏。
2. 继续补齐 `loading / empty / error` 在三类主视图中的语气、动作区和容器重量差异。
3. 后续业务内容模块接入时，需要按这份文档补 `footer / comments / recommendations` 的密度与状态容器规则。
